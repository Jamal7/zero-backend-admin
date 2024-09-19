import { connectDb } from "@/app/lib/mongo/conectDB";
import User from "@/app/lib/mongo/schema/userSchema";
import Job from "@/app/lib/mongo/schema/jobSchema";

import { NextResponse } from 'next/server';
import mongoose from "mongoose";

export async function GET(request) {
  await connectDb();
  try {
    
    // Get the logged-in user's ID from the query parameter
    const userId = request.nextUrl.searchParams.get("userId");

    const allusers = await User.find({employer: "seeker"});

    const appliedUsers = await Job.aggregate([
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
          as: "appliedJobs",
        },
      },
      {
        $unwind: "$appliedJobs"
      },
      {
        $project: {
          jobTitle: 1,
          _id: 1,
          "appliedJobs.userName": 1, 
          "appliedJobs._id": 1,
          "appliedJobs.imageUrl": 1,
          "appliedJobs.description": 1
        },
      },
    ]);

    return NextResponse.json([appliedUsers, allusers]);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users", error: error.message });
  }
}