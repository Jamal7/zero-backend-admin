export async function POST(request) {
    await connectDb();
  
    try {
      const contentType = request.headers.get('content-type');
      console.log("Content-Type:", contentType);
      
      const boundary = contentType.split('boundary=')[1];
      const rawBody = await request.arrayBuffer();
      const body = new TextDecoder().decode(rawBody);
  
      const parts = body.split(`--${boundary}`);
      console.log("Parts:", parts);
  
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
  
      console.log("Received Data:", { email, description, imageFileBuffer: !!imageFileBuffer });
  
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
  