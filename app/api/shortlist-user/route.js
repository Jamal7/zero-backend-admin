import { connectDb } from "@/app/lib/mongo/conectDB";
import Job from "@/app/lib/mongo/schema/jobSchema";
import User from "@/app/lib/mongo/schema/userSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
    await connectDb();
    try {
      const body = await request.json();
      const { userId, jobId } = body;
  
      // Step 1: Check if the user is already shortlisted for this job
      const user = await User.findOne({ _id: userId, jobshortlist: jobId });
      const job = await Job.findOne({ _id: jobId, usershortlist: userId });
  
      if (user || job) {
        // User is already shortlisted for this job
        return NextResponse.json({ message: "User is already shortlisted for this job." });
      }
  
      // Step 2: If not shortlisted, proceed with updating the user and job documents
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
  