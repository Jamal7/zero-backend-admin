import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB';
import User from '../../lib/mongo/schema/userSchema';

export async function POST(request) {
    try {
        await connectDb();

        const { email, subscription, isPaid } = await request.json();
        console.log("Update Sub Request:", { email, subscription, isPaid });

        if (!email) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        // Update fields
        if (subscription !== undefined) {
            console.log("Updating subscription to:", subscription);
            user.subscription = subscription;
            // Force mark modified if it's a mixed type or nested
            user.markModified('subscription');
        }
        if (isPaid !== undefined) user.isPaid = isPaid;

        await user.save();
        console.log("User saved with subscription:", user.subscription);

        return NextResponse.json({ message: 'Subscription updated successfully', user }, { status: 200 });
    } catch (error) {
        console.error('Error updating subscription:', error);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
