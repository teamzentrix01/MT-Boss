import dotenv from 'dotenv';
dotenv.config({ path: '.env', override: false, quiet: true });
dotenv.config({ path: 'src/.env', override: false, quiet: true });

export async function uploadBannerImage(file, folder = 'MTBOSS/hero-banners') {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !preset) throw new Error('Cloudinary image upload is not configured.');

  if (!file || typeof file.arrayBuffer !== 'function') {
    throw new Error('Please select a valid image or file.');
  }

  // Allow up to 200MB
  if (!file.size || file.size > 200 * 1024 * 1024) {
    throw new Error('Choose a file smaller than 200 MB.');
  }

  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', preset);
  body.append('folder', String(folder).replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '') || 'MTBOSS/uploads');
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST', body, signal: AbortSignal.timeout(120000),
  });
  const data = await response.json();
  let finalUrl = data.secure_url;
  if (finalUrl.toLowerCase().endsWith('.pdf')) {
    finalUrl = finalUrl.replace(/\.pdf$/i, '.webp');
  }
  return { url: finalUrl, public_id: data.public_id, width: data.width, height: data.height };
}
