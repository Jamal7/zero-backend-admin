import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { amount, email } = await req.json();

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount || 500, // Default to 500 if not provided
            currency: 'usd',
            receipt_email: email,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('FULL Stripe Payment Intent Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
