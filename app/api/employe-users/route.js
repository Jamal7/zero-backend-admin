import { NextResponse } from "next/server";
import { connectDb, disconnectDb } from '../../lib/mongo/conectDB'; // Adjust the path based on your directory structure
import User from '../../lib/mongo/schema/userSchema'; // Assuming you have a User model defined

export async function GET() {
  try {
    // Connect to the database
    await connectDb();

    // Fetch users with the count of applied jobs
    const users = await User.aggregate([
      {
        $match: { employer: { $regex: '^EMPLOYER$', $options: 'i' } } // Match employers with case-insensitive search
      },
      {
        $addFields: {
          jobAppliedCount: { $size: { $ifNull: ["$jobapllied", []] } } // Use $ifNull to handle missing or null jobapllied fields
        }
      }
    ]);


    // Disconnect from the database
    await disconnectDb();

    // Return the users with the count of applied jobs as a JSON response
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);

    // Disconnect from the database in case of an error
    await disconnectDb();

    // Return an error response
    return NextResponse.json({ error: 'Unable to fetch users' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
