import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";

// Cloudinary SDK parses CLOUDINARY_URL automatically when it's set in the environment.
// Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
cloudinary.config(true);

export { cloudinary };

// Use memory storage — we stream the buffer to Cloudinary ourselves
export const memUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB
});

/**
 * Upload a buffer to Cloudinary and return the result.
 * @param {Buffer} buffer
 * @param {string} folder   e.g. 'work', 'reels'
 * @param {string} resourceType  'image' | 'video' | 'auto'
 */
export function uploadToCloudinary(buffer, folder, resourceType = "auto") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `shotbyvor/${folder}`,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}
