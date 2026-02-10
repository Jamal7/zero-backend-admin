import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import User from '../../lib/mongo/schema/userSchema';
import Stripe from 'stripe';

const stripe = () => new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        await connectDb();
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        if (!user.subscription || !user.subscription.isActive) {
            return NextResponse.json({ message: 'No active subscription to cancel.' }, { status: 400 });
        }

        let subscriptionId = user.subscription.subscriptionId;

        // If subscriptionId is missing in DB, try to find it via Stripe
        if (!subscriptionId) {
            console.log("SubscriptionId missing in DB, fetching from Stripe...");
            try {
                const customers = await stripe().customers.list({ email: user.email, limit: 1 });
                if (customers.data.length > 0) {
                    const customerId = customers.data[0].id;
                    const subscriptions = await stripe().subscriptions.list({
                        customer: customerId,
                        status: 'active',
                        limit: 1
                    });
                    if (subscriptions.data.length > 0) {
                        subscriptionId = subscriptions.data[0].id;
                        console.log("Found active subscription:", subscriptionId);
                    }
                }
            } catch (stripeError) {
                console.error("Error fetching subscription from Stripe:", stripeError);
            }
        }

        if (subscriptionId) {
            try {
                await stripe().subscriptions.cancel(subscriptionId);
                console.log("Stripe subscription cancelled:", subscriptionId);
            } catch (stripeError) {
                console.error("Error cancelling Stripe subscription:", stripeError);
                // Return error but maybe we still want to update local state if it was already cancelled?
                // For now, assume if Stripe fails, we stop.
                return NextResponse.json({ error: 'Failed to cancel Stripe subscription.' }, { status: 500 });
            }
        } else {
            console.warn("No active Stripe subscription found to cancel, but user was marked active. Deactivating local state only.");
        }

        // Update User DB
        user.subscription = {
            isActive: false,
            plan: null,
            startDate: null,
            expiresAt: null, // Or keep expiresAt if we want to show "Active until..." but simplifying to immediate cancel for now
            subscriptionId: null
        };
        // Explicitly mark modified if needed (though replacing object usually works)
        user.markModified('subscription');

        await user.save();

        return NextResponse.json({ message: 'Subscription cancelled successfully.', user }, { status: 200 });

    } catch (error) {
        console.error('Error cancelling subscription:', error);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}
