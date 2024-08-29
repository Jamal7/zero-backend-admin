import { NextResponse } from "next/server";
import { connectDb, disconnectDb } from '../../lib/mongo/conectDB'; // Adjust the path based on your directory structure
import User from '../../lib/mongo/schema/userSchema'; // Assuming you have a User model defined

export async function GET() {
  try {
    // Connect to the database
    await connectDb();

    // Fetch users whose 'employer' field matches 'EMPLOYER' (case-insensitive)
    const users = await User.find({ employer: { $regex: 'EMPLOYER', $options: 'i' } });

    // Disconnect from the database
    await disconnectDb();

    // Return the users as a JSON response
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);

    // Disconnect from the database in case of an error
    await disconnectDb();

    // Return an error response
    return NextResponse.json({ error: 'Unable to fetch users' }, { status: 500 });
  }
}

// Force dynamic response behavior
export const dynamic = 'force-dynamic';
