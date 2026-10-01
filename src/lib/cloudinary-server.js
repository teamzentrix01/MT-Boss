import { v2 as cloudinary } from 'cloudinary';

let configured = false;

function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret || apiKey === 'YOUR_EXISTING_API_KEY' || apiSecret === 'YOUR_EXISTING_API_SECRET') {
    throw new Error('Cloudinary server credentials are not configured.');
  }
  if (!configured) {
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
    configured = true;
  }
  return cloudinary;
}

export const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function validateImageFile(file) {
  if (!file || typeof file.arrayBuffer !== 'function') throw new Error('No image file provided.');
  if (!IMAGE_TYPES.has(file.type)) throw new Error('Invalid file type. Only JPG, PNG, or WEBP images are allowed.');
  if (!file.size || file.size > MAX_IMAGE_SIZE) throw new Error('Image is too large. Maximum size is 5 MB.');
}

export async function uploadImageToCloudinary(file, folder) {
  validateImageFile(file);
  const safeFolder = String(folder || 'uploads').replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '') || 'uploads';
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await getCloudinary().uploader.upload(`data:${file.type};base64,${buffer.toString('base64')}`, {
    folder: safeFolder,
    resource_type: 'image',
  });
  return { url: result.secure_url, public_id: result.public_id, width: result.width, height: result.height };
}

export async function deleteCloudinaryImage(publicId) {
  if (!publicId) return null;
  return getCloudinary().uploader.destroy(String(publicId), { resource_type: 'image', invalidate: true });
}

export function cloudinaryConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}
