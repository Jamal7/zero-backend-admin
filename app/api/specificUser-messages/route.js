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

        const jobId = searchParams.get('jobId');

        // Construct the query
        const query = {
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        };

        // If jobId is provided and not empty/undefined, add it to the query
        if (jobId && jobId !== 'undefined' && jobId !== 'null') {
            query.jobId = jobId;
        } else {
            // If no jobId, look for messages with no jobId or null jobId
            query.jobId = null;
        }

        const messages = await Message.find(query).sort({ createdAt: 1 });

        return NextResponse.json({ messages }, { status: 200 });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
