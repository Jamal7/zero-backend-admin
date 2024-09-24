import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

import { connectDb, disconnectDb } from "../../lib/mongo/conectDB";
import User from "../../lib/mongo/schema/userSchema";

export async function POST(request) {
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

    // Parse the request body to get user data
    const { userName, email, totalJobPosted, status } = await request.json();

    // Validate input
    if (!userName || !email || totalJobPosted === undefined || !status) {
      await disconnectDb();
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a new user document
    const newUser = new User({
      userName,
      email,
      totalJobPosted,
      status,
      createdBy: decoded.userId, // Optionally track who created this user
    });

    // Save the new user to the database
    await newUser.save();

    // Disconnect from the database
    await disconnectDb();

    // Respond with the created user data
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);

    // Ensure database is disconnected in case of an error
    await disconnectDb();

    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
