import { NextResponse } from "next/server";
import { connectDb } from "../../lib/mongo/conectDB";
import User from "../../lib/mongo/schema/userSchema";

export async function POST(request) {
  await connectDb();

  try {
    const { email, description, imageUrl } = await request.json();

    if (!email || !description || !imageUrl) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Updating user fields
    user.description = description;
    user.imageUrl = imageUrl;
    await user.save(); // Save user directly

    return NextResponse.json(
      { message: "Profile updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during profile update:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
