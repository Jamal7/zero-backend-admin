import { connectDb } from "@/app/lib/mongo/conectDB";
import User from "@/app/lib/mongo/schema/userSchema";
import Job from "@/app/lib/mongo/schema/jobSchema";

import { NextResponse } from 'next/server';
import mongoose from "mongoose";

export async function GET(request) {

  await connectDb();

  try {

    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId || userId === "undefined") {
      return NextResponse.json([]);
    }

    const appliedUser = await Job.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userapplied",
          foreignField: "_id",
          as: "appliedUsers",
        },
      },
      {
        $unwind: "$appliedUsers"
      },
      // Lookup latest message between employer and applied user for THIS job
      {
        $lookup: {
          from: "messages",
          let: {
            employerId: new mongoose.Types.ObjectId(userId),
            applicantId: "$appliedUsers._id",
            jobId: "$_id"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $or: [
                        { $and: [{ $eq: ["$senderId", "$$employerId"] }, { $eq: ["$receiverId", "$$applicantId"] }] },
                        { $and: [{ $eq: ["$senderId", "$$applicantId"] }, { $eq: ["$receiverId", "$$employerId"] }] }
                      ]
                    },
                    { $eq: ["$jobId", "$$jobId"] }
                  ]
                }
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
          ],
          as: "latestMessage"
        }
      },
      {
        $unwind: {
          path: "$latestMessage",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          jobTitle: 1,
          salary: 1,
          _id: 1,
          "appliedUsers.userName": 1,
          "appliedUsers._id": 1,
          "appliedUsers.imageUrl": 1,
          "appliedUsers.description": 1,
          "appliedUsers.email": 1,
          lastMessage: { $ifNull: ["$latestMessage.text", null] },
          lastMessageTime: { $ifNull: ["$latestMessage.createdAt", null] },
        },
      },
    ]);

    return NextResponse.json(appliedUser);
  } catch (error) {
    console.error("FULL Error fetching users:", error);
    return NextResponse.json({ message: "Error fetching users", error: error.message }, { status: 500 });
  }
}