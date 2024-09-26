import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectDb, disconnectDb } from "../../lib/mongo/conectDB";
import User from "../../lib/mongo/schema/userSchema";

export async function PUT(request, { params }) {
  const { id } = params; // Get the ID from the URL parameters
  await connectDb(); // Connect to the database

  try {
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

    // Extract user data from request body
    const { userName, email, totalJobPosted } = await request.json();

    // Validate input data
    if (!userName || !email || typeof totalJobPosted !== 'number') {
      await disconnectDb();
      return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { userName, email, totalJobPosted },
      { new: true }
    );

    if (!updatedUser) {
      await disconnectDb();
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Successfully updated user
    await disconnectDb();
    return NextResponse.json(updatedUser, { status: 200 });
    
  } catch (error) {
    console.error('Error updating user:', error);
    await disconnectDb();
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
