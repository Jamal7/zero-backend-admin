import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectDb } from '../../lib/mongo/conectDB';
import User from '../../lib/mongo/schema/userSchema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    await connectDb();

    try {
        const { email, paymentMethodId } = await req.json();
        console.log("Save Payment Method Request:", { email, paymentMethodId });

        if (!email || !paymentMethodId) {
            return NextResponse.json({ error: "Email and Payment Method ID are required" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 1. Create or Retrieve Stripe Customer
        let customerId = user.stripeCustomerId; // Assuming we might store checks, or just find by email

        if (!customerId) {
            // Check if customer exists in Stripe by email
            const existingCustomers = await stripe.customers.list({ email: email, limit: 1 });
            if (existingCustomers.data.length > 0) {
                customerId = existingCustomers.data[0].id;
            } else {
                const customer = await stripe.customers.create({ email: email });
                customerId = customer.id;
            }

            // Should verify if we need to save this customerId to user model for future reference
            // For now, attaching PM is primary goal
        }

        // 2. Attach Payment Method to Customer
        try {
            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: customerId,
            });
        } catch (error) {
            // If already attached, ignore error, else throw
            if (error.code !== 'resource_already_exists') {
                // Sometimes it might belong to another customer, which is an error
                console.error("Stripe Attach Error:", error);
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }

        // 3. Retrieve Payment Method Details
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

        // 4. Save to Database
        const newPaymentMethod = {
            id: paymentMethod.id,
            brand: paymentMethod.card.brand,
            last4: paymentMethod.card.last4,
            expiryMonth: paymentMethod.card.exp_month.toString(),
            expiryYear: paymentMethod.card.exp_year.toString(),
            isDefault: user.paymentMethods.length === 0 // Make default if it's the first one
        };

        user.paymentMethods.push(newPaymentMethod);
        await user.save();

        return NextResponse.json({
            message: "Payment method saved successfully",
            paymentMethods: user.paymentMethods
        });

    } catch (error) {
        console.error("Save Payment Method Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
