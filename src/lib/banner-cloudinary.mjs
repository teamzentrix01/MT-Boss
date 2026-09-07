import dotenv from 'dotenv';
dotenv.config({ path: '.env', override: false, quiet: true });
dotenv.config({ path: 'src/.env', override: false, quiet: true });

export async function uploadBannerImage(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !preset) throw new Error('Cloudinary image upload is not configured.');
  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', preset);
  body.append('folder', 'mtboss/hero-banners');
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST', body, signal: AbortSignal.timeout(60000),
  });
  const data = await response.json();
  if (!response.ok || !data.secure_url || !data.public_id) throw new Error(data.error?.message || 'Cloudinary upload failed.');
  return { url: data.secure_url, public_id: data.public_id, width: data.width, height: data.height };
}
