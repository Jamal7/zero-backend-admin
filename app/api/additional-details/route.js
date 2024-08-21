import { NextResponse } from "next/server";
import { connectDb } from "../../lib/mongo/conectDB";
import User from "../../lib/mongo/schema/userSchema";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const routeSegmentConfig = {
  api: {
    bodyParser: false, // Disable Next.js's built-in body parser
  },
};

export async function POST(request) {
  await connectDb();

  try {
    const contentType = request.headers.get('content-type');
    const boundary = contentType.split('boundary=')[1];
    const rawBody = await request.arrayBuffer();
    const body = new TextDecoder().decode(rawBody);
    
    const parts = body.split(`--${boundary}`);

    let email = '';
    let description = '';
    let imageFileBuffer = null;

    for (let part of parts) {
      if (part.includes('Content-Disposition: form-data; name="email"')) {
        email = part.split('\r\n\r\n')[1].split('\r\n--')[0].trim();
      }
      if (part.includes('Content-Disposition: form-data; name="description"')) {
        description = part.split('\r\n\r\n')[1].split('\r\n--')[0].trim();
      }
      if (part.includes('Content-Disposition: form-data; name="image";')) {
        const rawImage = part.split('\r\n\r\n')[1].split('\r\n--')[0].trim();
        imageFileBuffer = Buffer.from(rawImage, 'binary');
      }
    }

    if (!email || !description || !imageFileBuffer) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

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

      cloudinaryStream.end(imageFileBuffer);
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
    console.error("Error during profile update:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
