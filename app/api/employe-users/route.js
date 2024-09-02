  import { NextResponse } from "next/server";
  import { connectDb, disconnectDb } from '../../lib/mongo/conectDB'; // Adjust the path based on your directory structure
  import User from '../../lib/mongo/schema/userSchema'; // Assuming you have a User model defined

  export async function GET() {
    try {
      // Connect to the database
      await connectDb();

      // Aggregate to get the number of jobs applied and posted per user
      const users = await User.aggregate([
        {
          $match: { employer: { $regex: '^EMPLOYER$', $options: 'i' } } // Match employers with case-insensitive search
        },
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
            jobAppliedCount: { $size: { $ifNull: ["$jobapllied", []] } }, // Count the number of jobs applied for by each user
            totalJobPosted: { $size: { $ifNull: ["$jobIds", []] } } // Count the number of jobs posted by using jobIds array
          }
        },
        {
          $project: {
            userName: 1, // Keep the user's name
            email: 1, // Keep the user's email
            status: 1,
            jobAppliedCount: 1, // Include the total applied job count
            totalJobPosted: 1 // Include the total job posted count
          }
        }
      ]);

      // Disconnect from the database
      await disconnectDb();

      // Return the users with the count of applied jobs and posted jobs as a JSON response
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