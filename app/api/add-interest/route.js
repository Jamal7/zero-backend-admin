import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB'; // Adjust the path as necessary
import User from '../../lib/mongo/schema/userSchema';

export async function POST(request) {
    await connectDb();

    try {
        const { userId, interestKeywords } = await request.json();

        // Validate input
        if (!userId || !Array.isArray(interestKeywords) || interestKeywords.length === 0) {
            return NextResponse.json({ error: 'User ID and interest keywords are required.' }, { status: 400 });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        // Add the interest keywords to the user's profile
        user.interestKeywords.push(...interestKeywords);

        // Save the updated user document
        await user.save();

        return NextResponse.json({ message: 'Interests added successfully.', user }, { status: 200 });
    } catch (error) {
        console.error('Error adding interests:', error);
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
