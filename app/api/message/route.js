import { NextResponse } from 'next/server';
import { connectDb } from '../../lib/mongo/conectDB'; // Adjust the path as necessary
import Message from '../../lib/mongo/schema/messageSchema'; // Assuming you have a Message schema
import User from '@/app/lib/mongo/schema/userSchema';
import { Expo } from 'expo-server-sdk';

export async function POST(request) {
    await connectDb();

    try {
        const { senderId, receiverId, jobId, text, replyTo } = await request.json(); // Add replyTo to the destructuring

        // Validate input
        if (!senderId || !receiverId || !text) {
            return NextResponse.json({ error: 'Sender ID, receiver ID, and text are required.' }, { status: 400 });
        }

        // Create a new message or reply
        const newMessage = new Message({
            senderId,
            receiverId,
            jobId, // Include jobId when creating the message
            text,
            replyTo: replyTo || null, // Include replyTo if it's provided
            createdAt: new Date()
        });

        // Save the message or reply to the database
        await newMessage.save();

        // --- Push Notification Logic ---
        try {
            // 1. Fetch Sender (to get name) and Receiver (to get pushToken)
            const sender = await User.findById(senderId).select('userName');
            const receiver = await User.findById(receiverId).select('pushToken');

            if (receiver && receiver.pushToken && Expo.isExpoPushToken(receiver.pushToken)) {
                const expo = new Expo();
                const senderName = sender ? sender.userName : 'Someone';

                // 2. Construct the notification
                const messages = [];
                messages.push({
                    to: receiver.pushToken,
                    sound: 'default',
                    title: `New message from ${senderName}`,
                    body: text.length > 50 ? text.substring(0, 50) + '...' : text,
                    data: {
                        contactId: senderId,
                        userName: senderName,
                        jobId: jobId // Pass jobId for navigation context
                    },
                });

                // 3. Send the notification
                // We don't await the result to avoid blocking the response, but we catch errors.
                // For production, you might want to use a ticket chunking strategy as per Expo docs.
                const chunks = expo.chunkPushNotifications(messages);
                for (let chunk of chunks) {
                    try {
                        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                        console.log('Push notification sent:', ticketChunk);
                    } catch (error) {
                        console.error('Error sending push notification chunk:', error);
                    }
                }
            } else {
                console.log('Receiver has no valid push token or is not found.');
            }
        } catch (notificationError) {
            console.error('Error in push notification logic:', notificationError);
            // Don't fail the request just because notification failed
        }

        return NextResponse.json({ message: 'Message sent successfully.', newMessage }, { status: 201 });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
    }
}

export async function GET(request) {
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
