import { NextResponse } from "next/server";
import { connectDb } from "../../lib/mongo/conectDB";
import User from "../../lib/mongo/schema/userSchema";
import cloudinary from "cloudinary";
import formidable from "formidable";
import { promises as fs } from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's built-in body parser
  },
};

export async function POST(request) {
  await connectDb();

  const form = new formidable.IncomingForm();
  form.uploadDir = "./temp"; // You can change this directory

  try {
    const data = await new Promise((resolve, reject) => {
      form.parse(request, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    const { email, description } = data.fields;
    const imageFile = data.files.image;

    if (!email || !description || !imageFile) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const imageBuffer = await fs.readFile(imageFile.filepath);

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

      cloudinaryStream.end(imageBuffer);
    });

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Updating user fields
    user.description = description;
    user.imageUrl = result;
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
