import { NextResponse } from "next/server";
import { connectDb, disconnectDb } from '../../lib/mongo/conectDB'; // Adjust the path based on your directory structure
import User from '../../lib/mongo/schema/userSchema'; // Assuming you have a User model defined

export async function GET() {
  try {
    await connectDb(); // Ensure the DB is connected

    const users = await User.find({ employer: { $regex: '^seeker$', $options: 'i' } });

    await disconnectDb(); // Disconnect after the query is done

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);

    await disconnectDb();

    return NextResponse.json({ error: 'Unable to fetch users' }, { status: 500 });
  }
}
