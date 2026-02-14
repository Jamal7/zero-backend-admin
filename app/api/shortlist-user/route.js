import { connectDb } from "@/app/lib/mongo/conectDB";
import Job from "@/app/lib/mongo/schema/jobSchema";
import User from "@/app/lib/mongo/schema/userSchema";
import { NextRequest, NextResponse } from "next/server";

import mongoose from "mongoose";

export async function POST(request) {
  await connectDb();
  try {
    const body = await request.json();
    let { userId, jobId } = body;

    // Ensure IDs are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(jobId)) {
      return NextResponse.json({ error: "Invalid User ID or Job ID" }, { status: 400 });
    }

    userId = new mongoose.Types.ObjectId(userId);
    jobId = new mongoose.Types.ObjectId(jobId);

    // Step 1: Check if the user is already shortlisted for this job
    const user = await User.findOne({ _id: userId, jobshortlist: jobId });
    const job = await Job.findOne({ _id: jobId, usershortlist: userId });

    if (user || job) {
      // User is already shortlisted for this job
      return NextResponse.json({ message: "User is already shortlisted for this job." });
    }

    // If not shortlisted, proceed with updating the user and job documents
    await User.updateOne(
      { _id: userId },
      { $push: { jobshortlist: jobId } }
    );

    await Job.updateOne(
      { _id: jobId },
      { $push: { usershortlist: userId } }
    );

    const updatedJob = await Job.findById({ _id: jobId });

    return NextResponse.json(updatedJob);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
