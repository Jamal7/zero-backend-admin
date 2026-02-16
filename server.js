const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { existsSync, createReadStream } = require('fs');
const { join, extname, resolve } = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// MongoDB connection
const mongoose = require('mongoose');

// Message Schema (inline to avoid ESM import issues)
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: false
    },
    text: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

app.prepare().then(async () => {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zero';
    try {
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
    }

    // MIME types for serving uploaded files
    const MIME_TYPES = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
    };

    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);

        // Serve uploaded files directly from public/uploads/
        if (parsedUrl.pathname && parsedUrl.pathname.startsWith('/uploads/')) {
            const filename = parsedUrl.pathname.replace('/uploads/', '');
            // Security: prevent directory traversal
            if (filename.includes('..') || filename.includes('/')) {
                res.writeHead(400);
                res.end('Bad request');
                return;
            }
            const filePath = join(process.cwd(), 'public', 'uploads', filename);
            if (existsSync(filePath)) {
                const ext = extname(filePath).toLowerCase();
                const contentType = MIME_TYPES[ext] || 'application/octet-stream';
                res.writeHead(200, { 'Content-Type': contentType });
                createReadStream(filePath).pipe(res);
                return;
            }
        }

        handle(req, res, parsedUrl);
    });

    // Initialize Socket.io
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
        transports: ['websocket', 'polling'],
    });

    // Socket.io connection handling
    io.on('connection', (socket) => {
        console.log('🔌 Client connected:', socket.id);

        // User joins their personal room to receive messages
        socket.on('joinRoom', (userId) => {
            socket.join(userId);
            console.log(`👤 User ${userId} joined room`);
        });

        // Handle sending messages
        socket.on('sendMessage', async (data) => {
            console.log('📨 Message received:', data);
            const { senderId, receiverId, text, jobId, imageUrl } = data;

            try {
                // Save message to database
                const newMessage = new Message({
                    senderId,
                    receiverId,
                    text,
                    imageUrl: imageUrl || null,
                    jobId: jobId || null,
                    createdAt: new Date(),
                });

                await newMessage.save();
                console.log('💾 Message saved to database');

                // Emit to receiver's room
                io.to(receiverId).emit('receiveMessage', {
                    senderId,
                    receiverId,
                    text,
                    imageUrl: imageUrl || null,
                    jobId: jobId || null,
                    createdAt: newMessage.createdAt,
                    _id: newMessage._id,
                });

                console.log(`📤 Message emitted to room: ${receiverId}`);

                // Send Push Notification
                try {
                    const User = mongoose.models.User;
                    const { sendPushNotification } = require('./lib/notifications/pushNotification');

                    const receiver = await User.findById(receiverId);
                    if (receiver && receiver.pushToken) {
                        await sendPushNotification(receiver.pushToken, text || 'You have a new image message');
                        console.log(`📲 Push notification sent to ${receiver.userName}`);
                    } else {
                        console.log(`🔕 No push token for user ${receiverId}`);
                    }
                } catch (pushError) {
                    console.error('❌ Error sending push notification:', pushError);
                }
            } catch (error) {
                console.error('❌ Error saving message:', error);
                socket.emit('messageError', { error: 'Failed to send message' });
            }
        });

        socket.on('disconnect', (reason) => {
            console.log('🔌 Client disconnected:', socket.id, 'Reason:', reason);
        });
    });

    server.listen(port, hostname, () => {
        console.log(`
🚀 Server ready!
   - Local:    http://localhost:${port}
   - Network:  http://${hostname}:${port}
   - Mode:     ${dev ? 'Development' : 'Production'}
    `);
    });
});
