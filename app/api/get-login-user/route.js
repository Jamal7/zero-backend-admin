import { NextResponse } from "next/server";
import { connectDb } from "../../lib/mongo/conectDB";
import User from "../../lib/mongo/schema/userSchema";

export async function POST(request) {
  await connectDb();

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if imageUrl exists, if not, use a placeholder image
    const imageUrl = user.imageUrl || "https://via.placeholder.com/150";

    const userData = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      description: user.description || "",
      imageUrl: imageUrl,
    };

    return NextResponse.json(
      { message: "User data retrieved successfully", user: userData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
