// import { Server } from "socket.io";
// import { connectDb } from "../../lib/mongo/connectDB";
// import Message from "../../lib/mongo/schema/messageSchema";
// import { NextResponse, NextRequest } from "next/server";

// export const dynamic = 'force-dynamic';

// export async function GET(req, res) {
//     await connectDb();

//     const socketServer = req.nextUrl.searchParams.get("socketServer");

//     if (!socketServer) {
//         const io = new Server(res.socket.server);
//         res.socket.server.io = io;

//         io.on("connection", (socket) => {
//             console.log("New client connected:", socket.id);

//             // Handle incoming chat messages
//             socket.on("sendMessage", async (data) => {
//                 const { senderId, receiverId, text, jobId } = data;

//                 // Save the message to the database
//                 const newMessage = new Message({
//                     senderId,
//                     receiverId,
//                     text,
//                     jobId,
//                     createdAt: new Date(),
//                 });

//                 await newMessage.save();

//                 // Broadcast the message to the receiver
//                 io.to(receiverId).emit("receiveMessage", newMessage);
//             });

//             // Handle joining a room
//             socket.on("joinRoom", (userId) => {
//                 socket.join(userId);
//                 console.log(`User ${userId} joined room ${userId}`);
//             });

//             socket.on("disconnect", () => {
//                 console.log("Client disconnected:", socket.id);
//             });
//         });

//         return NextResponse.json({ message: "Socket initialized" });
//     }

//     return NextResponse.json({ message: "Socket already initialized" });
// }


import { Server } from "socket.io";

let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io");
    io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      socket.on("sendMessage", (data) => {
        console.log("Received message:", data);
        io.to(data.receiverId).emit("receiveMessage", data);
      });

      socket.on("joinRoom", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room.`);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  } else {
    console.log("Socket.io already initialized");
  }
  res.end();
}
