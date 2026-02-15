import { NextResponse } from 'next/server';
import { connectDb } from '@/app/lib/mongo/conectDB';
import User from '@/app/lib/mongo/schema/userSchema';

export async function POST(request) {
    await connectDb();

    try {
        const { userId, pushToken } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { pushToken: pushToken },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Push token registered successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error registering push token:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
