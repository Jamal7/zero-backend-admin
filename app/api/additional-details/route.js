import { NextResponse } from "next/server";
import { connectDb } from "../../lib/mongo/conectDB";
import User from "../../lib/mongo/schema/userSchema";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  await connectDb();

  try {
    const formData = await request.formData();
    const email = formData.get("email");
    const description = formData.get("description");
    const imageFile = formData.get("image");

    if (!email || !description || !imageFile) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      const cloudinaryStream = cloudinary.v2.uploader.upload_stream(
        { folder: "user_images" },
        (error, result) => {
          if (error) {
            reject(new Error("Image upload failed"));
          } else {
            resolve(result.secure_url);
          }
        }
      );

      cloudinaryStream.end(buffer);
    });

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.description = description;
    user.imageUrl = result;

    await user.save();

    return NextResponse.json(
      { message: "Profile updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("oh! Error during profile update:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
