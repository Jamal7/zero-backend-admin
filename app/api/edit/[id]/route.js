import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectDb, disconnectDb } from "@/app/lib/mongo/conectDB";
import User from "@/app/lib/mongo/schema/userSchema";
import { ObjectId } from "mongodb"; // Import ObjectId for MongoDB queries
export async function GET(request, { params }) {
  // Middleware should have attached the user to the request if the token was valid
  const user = request.user; 
  const { id } = params; // 'id' is retrieved from the URL params (e.g., /edit/123)

  // If the user isn't authenticated, return a 401 Unauthorized response
  if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // If user is authenticated, proceed with the logic for editing based on the 'id'
  return new Response(JSON.stringify({ message: `Editing item with ID: ${id}` }), { status: 200 });
}


export async function POST(request, { params }) {
  const { id } = params; // Get the ID from the URL parameters
  await connectDb(); // Connect to the database

  try {
    // Check if Authorization header is present
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      await disconnectDb();
      return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
    }

    // Extract the token from the Bearer token format
    const token = authHeader.split(' ')[1]; 
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

    // Parse the request body to get the updated user data
    const { userName, email, totalJobPosted } = await request.json();

    // Input validation
    if (!userName || !email || typeof totalJobPosted !== 'number') {
      await disconnectDb();
      return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
    }

    // Update the user in the database
    const result = await User.updateOne(
      { _id: new ObjectId(id) }, // Use ObjectId to query the MongoDB document
      {
        $set: {
          userName,
          email,
          totalJobPosted,
        },
      }
    );

    if (result.modifiedCount === 1) {
      // Successfully updated user

      // Generate a new JWT token
      const newToken = jwt.sign({ id: decoded.id, userName }, process.env.JWT_SECRET, { expiresIn: '1h' });

      await disconnectDb();
      return NextResponse.json({
        message: "User updated successfully.",
        token: newToken, // Include the new token in the response
      }, { status: 200 });
    } else {
      // User not found or no fields were updated
      await disconnectDb();
      return NextResponse.json({ message: "User not found or no changes made." }, { status: 404 });
    }
    
  } catch (error) {
    console.error('Error updating user:', error);
    await disconnectDb();
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';