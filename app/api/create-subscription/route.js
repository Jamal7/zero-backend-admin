import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { email, paymentMethodId } = await req.json();
        console.log("Create Sub Request:", { email, paymentMethodId });

        // 1. Retrieve Payment Method details first to check for existing customer
        let customerId;
        if (paymentMethodId) {
            const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
            if (paymentMethod.customer) {
                console.log("Payment Method already attached to customer:", paymentMethod.customer);
                customerId = paymentMethod.customer;
            }
        }

        // 2. If no customer found on PM, create a new one (or use existing logic)
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: email,
            });
            customerId = customer.id;
            console.log("New Customer Created:", customerId);

            // Attach PM if provided
            if (paymentMethodId) {
                try {
                    await stripe.paymentMethods.attach(paymentMethodId, {
                        customer: customerId,
                    });
                    console.log("Payment Method Attached");
                } catch (pmError) {
                    // Ignore if already attached (though unlikely given logic above)
                    if (pmError.code !== 'resource_already_exists') {
                        throw pmError;
                    }
                }
            }
        }

        // 3. Update Default PM logic
        if (paymentMethodId && customerId) {
            await stripe.customers.update(customerId, {
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });
        }


        // 3. Create Product and Price (Clean state)
        const product = await stripe.products.create({
            name: 'Zero Monthly Subscription ' + Date.now(),
        });
        const price = await stripe.prices.create({
            unit_amount: 1500,
            currency: 'usd',
            recurring: { interval: 'month' },
            product: product.id,
        });
        const priceId = price.id;

        // 4. Create the Subscription
        console.log("Creating Subscription...");
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            payment_behavior: 'allow_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
        });
        console.log("Subscription Created:", subscription.id, subscription.status);

        // Check invoice PI details specifically
        const latestInvoice = subscription.latest_invoice;
        console.log("Latest Invoice PI:", latestInvoice?.payment_intent);

        // 5. Handle Response
        if (subscription.status === 'active') {
            // Save subscriptionId to user manually or rely on webhook/frontend update
            // Ideally we save it here to be safe
            // NOTE: The separate update-user-subscription route usually handles this, but saving it here on user object if we had access would be good. 
            // However, this route doesn't query User model directly. 
            // Logic in upgrade.tsx calls update-user-subscription after success.
            // WE SHOULD UPDATE upgrade.tsx to send subscriptionId!

            return NextResponse.json({
                subscriptionId: subscription.id,
                status: 'active'
            });
        }

        // If incomplete (e.g. requires 3DS or just created as incomplete), return secret
        let clientSecret = subscription.latest_invoice?.payment_intent?.client_secret;

        if (!clientSecret && subscription.latest_invoice) {
            const invoiceId = typeof subscription.latest_invoice === 'string'
                ? subscription.latest_invoice
                : subscription.latest_invoice.id;

            const invoice = await stripe.invoices.retrieve(invoiceId, {
                expand: ['payment_intent'],
            });

            // If the invoice is in draft, finalize it to generate a payment intent
            if (invoice.status === 'draft') {
                await stripe.invoices.finalizeInvoice(invoiceId);
                const finalizedInvoice = await stripe.invoices.retrieve(invoiceId, {
                    expand: ['payment_intent'],
                });
                clientSecret = finalizedInvoice.payment_intent?.client_secret;
            } else {
                clientSecret = invoice.payment_intent?.client_secret;
            }
        }

        return NextResponse.json({
            subscriptionId: subscription.id,
            clientSecret: clientSecret,
            status: subscription.status
        });

    } catch (error) {
        console.error('Stripe Subscription Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
