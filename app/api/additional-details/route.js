import { NextResponse } from "next/server";
import { connectDb } from "../../lib/mongo/conectDB";
import User from "../../lib/mongo/schema/userSchema";
import cloudinary from "cloudinary";
import Busboy from "busboy";
import { Writable } from "stream";
import { promises as fs } from "fs";

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

  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: request.headers });
    let email = "";
    let description = "";
    let imageFileBuffer = null;
    let imageFileType = "";

    busboy.on("field", (fieldname, val) => {
      if (fieldname === "email") email = val;
      if (fieldname === "description") description = val;
    });

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const bufferArray = [];
      file.on("data", (data) => {
        bufferArray.push(data);
      });

      file.on("end", () => {
        imageFileBuffer = Buffer.concat(bufferArray);
        imageFileType = mimetype;
      });
    });

    busboy.on("finish", async () => {
      if (!email || !description || !imageFileBuffer) {
        return resolve(
          NextResponse.json({ error: "All fields are required." }, { status: 400 })
        );
      }

      try {
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
          return resolve(
            NextResponse.json({ error: "User not found" }, { status: 404 })
          );
        }

        user.description = description;
        user.imageUrl = result;
        await user.save();

        resolve(
          NextResponse.json(
            { message: "Profile updated successfully", user },
            { status: 200 }
          )
        );
      } catch (error) {
        console.error("Error during profile update:", error);
        resolve(
          NextResponse.json({ error: "Server error" }, { status: 500 })
        );
      }
    });

    busboy.on("error", (error) => {
      console.error("Error processing file upload:", error);
      reject(
        NextResponse.json({ error: "File processing error" }, { status: 500 })
      );
    });

    request.pipe(busboy);
  });
}
