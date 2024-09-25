import { connectDb } from "@/app/lib/mongo/conectDB";
import User from "@/app/lib/mongo/schema/userSchema";
import Job from "@/app/lib/mongo/schema/jobSchema";

import { NextResponse } from 'next/server';
import mongoose from "mongoose";

export async function GET(request) {
  
  await connectDb();

  try {

    const userId = request.nextUrl.searchParams.get("userId");

    const alluser = await User.find({employer: "seeker"});

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
      {
        $project: {
          jobTitle: 1,
          _id: 1,
          "appliedUsers.userName": 1, 
          "appliedUsers._id": 1,
          "appliedUsers.imageUrl": 1,
          "appliedUsers.description": 1,
        },
      },
    ]);

    return NextResponse.json([appliedUser, alluser]);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users", error: error.message });
  }
}