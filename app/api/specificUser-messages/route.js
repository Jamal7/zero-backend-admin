import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB'; // Adjust the path as necessary
import Message from '../../lib/mongo/schema/messageSchema'; // Assuming you have a Message schema

export async function GET(request) {
    await connectDb();

    try {
        // Extract the query parameters
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const otherUserId = searchParams.get('otherUserId'); // Extract the other user's ID

        if (!userId || !otherUserId) {
            return NextResponse.json({ error: 'User ID and Other User ID are required.' }, { status: 400 });
        }

        // Find messages between the logged-in user and the other user
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 }); // Sort messages by createdAt

        return NextResponse.json({ messages }, { status: 200 });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
