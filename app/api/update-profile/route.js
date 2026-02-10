import { NextResponse } from "next/server";
import { connectDb } from "../../lib/mongo/conectDB";
import User from "../../lib/mongo/schema/userSchema";
import bcrypt from 'bcrypt';

export async function POST(request) {
  await connectDb();

  try {
    const {
      userId,
      userName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      description,
      imageUrl,
    } = await request.json();

    // Validate required fields
    if (!userId || !userName || !email || !phoneNumber) {
      return NextResponse.json(
        { error: "User ID, name, email, and phone number are required." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    // Validate phone number (e.g., must be 10-14 digits, optional +)
    const phoneRegex = /^\+?[0-9]{10,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json({ error: "Invalid phone number. Must be 10-14 digits." }, { status: 400 });
    }

    // Check if the email is already registered to another user
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      return NextResponse.json({ error: "Email is already associated with another account." }, { status: 400 });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user fields
    user.userName = userName;
    user.email = email;
    user.phoneNumber = phoneNumber;
    if (description) {
      user.description = description;
    }
    if (imageUrl) {
      user.imageUrl = imageUrl;
    }

    // Check if password update is requested
    if (password) {
      if (password !== confirmPassword) {
        return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
      }
      // Hash the new password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    return NextResponse.json(
      { message: "Profile updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during profile update:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
