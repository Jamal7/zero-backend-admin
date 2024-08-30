import { connectDb } from "@/app/lib/mongo/conectDB";
import Job from "@/app/lib/mongo/schema/jobSchema";
import User from "@/app/lib/mongo/schema/userSchema";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
    await connectDb();
    try {
      const { userId, jobId } = await request.json();
  
      // Check if the user has already applied for the job
      const existingApplication = await Job.findOne({ _id: jobId, userapplied: userId });
  
      if (existingApplication) {
        return NextResponse.json({ message: "User already applied for this job" });
      }
  
      // Update both User and Job with the applied job and user
      await Promise.all([
        User.updateOne({ _id: userId }, { $push: { jobapllied: jobId } }),
        Job.updateOne({ _id: jobId }, { $push: { userapplied: userId } }),
      ]);
  
      const updatedJob = await Job.findById(jobId);
      return NextResponse.json(updatedJob);
  
    } catch (error) {
      return NextResponse.json({ error: error.message });
    }
  }