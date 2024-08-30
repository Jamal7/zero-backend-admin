import { connectDb } from "@/app/lib/mongo/conectDB";
import User from "@/app/lib/mongo/schema/userSchema";
import Job from "@/app/lib/mongo/schema/jobSchema";

import { NextResponse } from 'next/server';

export async function GET(request) {
  await connectDb();
  try {
    // Assuming the logged-in user's ID is provided as a query parameter
    const userId = request.nextUrl.searchParams.get("userId");

    // Step 1: Find all jobs created by the logged-in user
    const jobsCreatedByUser = await Job.find({ user: userId });

    // Extract job IDs created by the user
    const jobIds = jobsCreatedByUser.map(job => job._id);

    // Step 2: Find all users who applied for these jobs
    const appliedUsers = await User.aggregate([
      {
        $match: {
          jobapllied: { $in: jobIds } // Match users whose 'jobapllied' contains any of the job IDs created by the user
        }
      },
      {
        $lookup: {
          from: "jobs", // The name of the jobs collection
          localField: "jobapllied",
          foreignField: "_id",
          as: "appliedJobs"
        }
      },
      {
        $project: {
          userName: 1,
          email: 1,
          jobapllied: 1,
          "appliedJobs._id": 1,
          "appliedJobs.jobTitle": 1 // Assuming 'jobTitle' is the field for the job's name
        }
      }
    ]);

    return NextResponse.json(appliedUsers);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users", error: error.message });
  }
}