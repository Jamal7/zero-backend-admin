import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB'; // Adjust the path as necessary
import Message from '../../lib/mongo/schema/messageSchema'; // Assuming you have a Message schema
import User from '@/app/lib/mongo/schema/userSchema';
export async function GET(request) {
    await connectDb();

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId'); // Get the logged-in user's ID from the query parameters

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
        }

        // Find all messages where the logged-in user is either the sender or the receiver
        const messages = await Message.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        }).populate('senderId receiverId', 'userName email imageUrl'); // Populate user details

        if (!messages.length) {
            return NextResponse.json({ messages: [] }, { status: 200 });
        }

        return NextResponse.json({ messages }, { status: 200 });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';