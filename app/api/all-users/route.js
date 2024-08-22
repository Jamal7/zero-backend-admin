import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectDb, disconnectDb } from "../../lib/mongo/conectDB";
import User from "../../lib/mongo/schema/userSchema";

export async function GET(request) {
  try {
    // Connect to the database
    await connectDb();

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      await disconnectDb();
      return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer"
    if (!token) {
      await disconnectDb();
      return NextResponse.json({ error: 'Token missing' }, { status: 401 });
    }

    // Verify and decode the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      await disconnectDb();
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    console.log('Decoded token:', decoded);

    // Use the decoded token to fetch the user
    const user = await User.findById(decoded.userId);
    if (!user) {
      await disconnectDb();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user data or proceed with your logic
    await disconnectDb();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);

    // Ensure database is disconnected in case of an error
    await disconnectDb();

    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic'
