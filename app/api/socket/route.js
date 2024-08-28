import { Server } from "socket.io";
import { connectDb } from "../../lib/mongo/conectDB";
import Message from "../../lib/mongo/schema/messageSchema";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export default async function handler(req, res) {
  await connectDb();

  if (!res.socket.server.io) {
    console.log("Initializing Socket.io");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      socket.on("sendMessage", async (data) => {
        const { senderId, receiverId, text, jobId } = data;

        const newMessage = new Message({
          senderId,
          receiverId,
          text,
          jobId,
          createdAt: new Date(),
        });

        await newMessage.save();
        io.to(receiverId).emit("receiveMessage", newMessage);
      });

      socket.on("joinRoom", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    console.log("Socket.io initialized");
  } else {
    console.log("Socket.io already initialized");
  }

  res.end();
}
