import { NextResponse } from "next/server";
import { connectDb, disconnectDb } from '../../lib/mongo/conectDB'; // Adjust the path based on your directory structure
import User from '../../lib/mongo/schema/userSchema'; // Assuming you have a User model defined

export async function GET() {
  try {
    await connectDb(); // Ensure the DB is connected

    // Aggregate to get the total number of jobs posted per user and count of jobapllied
    const result = await User.aggregate([
      {
        $lookup: {
          from: 'jobs', // Name of the Job collection
          localField: '_id', // User's ID in the User collection
          foreignField: 'createdBy', // User reference field in the Job collection
          as: 'jobs', // Name of the new field to store joined jobs
        },
      },
      {
        $addFields: {
          totalJobPosted: { $size: "$jobs" }, // Count the number of jobs posted by each user
          jobAppliedCount: { $size: { $ifNull: ["$jobapllied", []] } } // Count the number of jobs applied for by each user
        }
      },
      {
        $project: {
          userName: 1, // Keep the user's name
          email: 1, // Keep the user's email
          totalJobPosted: 1, // Include the total job count
          jobAppliedCount: 1 // Include the total applied job count
        }
      }
    ]);

    await disconnectDb(); // Disconnect after the query is done

    // Return the users with the total number of jobs posted and applied as a JSON response
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);

    await disconnectDb();

    return NextResponse.json({ error: 'Unable to fetch users' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
