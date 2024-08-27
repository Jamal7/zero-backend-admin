import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB'; // Adjust the path as necessary
import Message from '../../lib/mongo/schema/messageSchema'; // Assuming you have a Message schema

export async function GET(request) {
    await connectDb();

    try {
        // Assuming the userId is passed as a query parameter
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
        }

        // Find messages where the current user is either the sender or the receiver
        const messages = await Message.find({
            jobId: jobId,
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        }).sort({ createdAt: 1 }); // Sorting messages by createdAt

        return NextResponse.json({ messages }, { status: 200 });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
