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

  console.log("Database connected");

  const formData = await request.formData();
  const email = formData.get("email");
  const description = formData.get("description");
  const imageFile = formData.get("image");

  console.log("Form Data received:", { email, description, imageFile });

  if (!email || !description || !imageFile) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    // Convert the File object to an ArrayBuffer, then to a Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Buffer created");

    const result = await new Promise((resolve, reject) => {
      const cloudinaryStream = cloudinary.v2.uploader.upload_stream(
        { folder: "user_images" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload failed:", error);
            reject(new Error("Image upload failed"));
          } else {
            console.log("Image uploaded to Cloudinary:", result.secure_url);
            resolve(result.secure_url);
          }
        }
      );

      cloudinaryStream.end(buffer);
    });

    console.log("Image uploaded successfully:", result);

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.description = description;
    user.imageUrl = result;

    await user.save();

    console.log("User updated successfully:", user);

    return NextResponse.json(
      { message: "Profile updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("oh! Error during profile update:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
