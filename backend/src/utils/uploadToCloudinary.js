// src/utils/uploadToCloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a buffer (from multer) to Cloudinary
 * @param {Buffer} fileBuffer - file buffer from multer
 * @param {String} folder - folder in Cloudinary (optional)
 * @returns {Promise<String>} - secure URL of uploaded image
 */
export const uploadToCloudinary = async (
  fileBuffer,
  folder = "blog-platform/profiles",
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );

    stream.end(fileBuffer);
  });
};
