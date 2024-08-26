    import { NextResponse } from 'next/server';
    import { connectDb } from '../../lib/mongo/conectDB'; // Adjust the path as necessary
    import Message from '../../lib/mongo/schema/messageSchema'; // Assuming you have a Message schema

    export async function POST(request) {
        await connectDb();

        try {
            const { senderId, receiverId, text } = await request.json();

            // Validate input
            if (!senderId || !receiverId || !text) {
                return NextResponse.json({ error: 'Sender ID, receiver ID, and text are required.' }, { status: 400 });
            }

            // Create a new message
            const newMessage = new Message({
                senderId,
                receiverId,
                text,
                createdAt: new Date()
            });

            // Save the message to the database
            await newMessage.save();

            return NextResponse.json({ message: 'Message sent successfully.', newMessage }, { status: 201 });
        } catch (error) {
            console.error('Error sending message:', error);
            return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
        }
    }

    export async function GET() {
        await connectDb();

        try {
            // Fetch all messages (you can modify this to fetch messages between specific users)
            const messages = await Message.find().sort({ createdAt: 1 });

            return NextResponse.json({ messages }, { status: 200 });
        } catch (error) {
            console.error('Error fetching messages:', error);
            return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
        }
    }

    export const dynamic = 'force-dynamic';
