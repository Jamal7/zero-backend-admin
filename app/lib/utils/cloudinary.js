import cloudinary from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (fileStream) => {
  try {
    let buffer;

    if (fileStream instanceof Buffer) {
      buffer = fileStream;
    } else if (fileStream instanceof ArrayBuffer) {
      buffer = Buffer.from(fileStream);
    } else if (fileStream instanceof Blob) {
      buffer = Buffer.from(await fileStream.arrayBuffer());
    } else if (typeof fileStream === 'string') {
      if (fileStream.startsWith('http')) {
        // Handle direct URL upload
        return new Promise((resolve, reject) => {
          cloudinary.v2.uploader.upload(fileStream, { folder: 'user_images' }, (error, result) => {
            if (error) {
              reject(new Error('Image upload failed with URL'));
            } else {
              resolve(result.secure_url);
            }
          });
        });
      } else {
        // Handle base64 string
        buffer = Buffer.from(fileStream, 'base64');
      }
    } else if (fileStream instanceof Readable) {
      // If it's already a stream, we pipe it directly
      return new Promise((resolve, reject) => {
        const cloudinaryStream = cloudinary.v2.uploader.upload_stream(
          { folder: 'user_images' },
          (error, result) => {
            if (error) {
              reject(new Error('Image upload failed with stream'));
            } else {
              resolve(result.secure_url);
            }
          }
        );

        fileStream.pipe(cloudinaryStream);
      });
    } else {
      throw new Error('Unsupported fileStream type');
    }

    // Handle the case where we have a buffer
    const result = await new Promise((resolve, reject) => {
      const cloudinaryStream = cloudinary.v2.uploader.upload_stream(
        { folder: 'user_images' },
        (error, result) => {
          if (error) {
            reject(new Error('Image upload failed with buffer'));
          } else {
            resolve(result.secure_url);
          }
        }
      );

      cloudinaryStream.end(buffer);
    });

    return result;
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};
