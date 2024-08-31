import { connectDb } from "@/app/lib/mongo/conectDB";
import User from "@/app/lib/mongo/schema/userSchema";
import Job from "@/app/lib/mongo/schema/jobSchema";

import { NextResponse } from 'next/server';

export async function GET(request) {
  await connectDb();
  try {
    // Get the logged-in user's ID from the query parameter
    const userId = request.nextUrl.searchParams.get("userId");

    // Step 1: Find all jobs created by the logged-in user
    const jobsCreatedByUser = await Job.find({ user: userId });

    // Extract job IDs created by the user
    const jobIds = jobsCreatedByUser.map((job) => job._id);

    // Step 2: Find all users who applied for these jobs
    const appliedUsers = await User.aggregate([
      {
        $match: {
          jobapllied: { $in: jobIds }, // Match users whose 'jobapllied' contains any of the job IDs created by the user
        },
      },
      {
        $lookup: {
          from: "jobs", // Ensure this matches the actual collection name in MongoDB
          localField: "jobapllied",
          foreignField: "_id",
          as: "appliedJobs",
        },
      },
      {
        $unwind: "$appliedJobs" // Unwind the appliedJobs array to create a separate document for each job
      },
      {
        $project: {
          userName: 1,
          email: 1,
          _id: 1,
          imageUrl: 1, // Include the user's image URL
          "appliedJobs.jobTitle": 1, // Include job titles from appliedJobs
          "appliedJobs._id": 1, // Include job IDs from appliedJobs
        },
      },
    ]);

    return NextResponse.json(appliedUsers);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users", error: error.message });
  }
}