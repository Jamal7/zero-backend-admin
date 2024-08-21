import cloudinary from 'cloudinary';
import streamToBuffer from 'stream-to-buffer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (fileStream) => {
    try {
      let buffer;
  
      if (fileStream instanceof ArrayBuffer) {
        buffer = Buffer.from(fileStream);
      } else if (fileStream instanceof Blob) {
        buffer = Buffer.from(await fileStream.arrayBuffer());
      } else if (typeof fileStream === 'string') {
        // Handle base64 string or URL if that's the case
        buffer = Buffer.from(fileStream, 'base64');
      } else {
        throw new Error('Unsupported fileStream type');
      }
  
      const result = await new Promise((resolve, reject) => {
        const cloudinaryStream = cloudinary.v2.uploader.upload_stream(
          { folder: 'user_images' },
          (error, result) => {
            if (error) {
              reject(new Error('Image upload failed'));
            } else {
              resolve(result.secure_url);
            }
          }
        );
  
        // Send the buffer to the Cloudinary stream
        cloudinaryStream.end(buffer);
      });
  
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
