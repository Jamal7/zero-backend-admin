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

        // Find all messages where the logged-in user is the receiver
        const receivedMessages = await Message.find({ receiverId: userId }).select('senderId receiverId');
        
        // Find all messages where the logged-in user is the sender
        const sentMessages = await Message.find({ senderId: userId }).select('receiverId senderId');

        // Extract unique senderIds and receiverIds
        const senderIds = receivedMessages.map(message => message.senderId.toString());
        const receiverIds = sentMessages.map(message => message.receiverId.toString());

        // Combine senderIds and receiverIds, and remove duplicates
        const contactIds = [...new Set([...senderIds, ...receiverIds])];

        // Find user details for each contactId
        const contacts = await User.find({ _id: { $in: contactIds } }).select('email userName'); // Modify as needed to include relevant user fields

        return NextResponse.json({ contacts }, { status: 200 });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';