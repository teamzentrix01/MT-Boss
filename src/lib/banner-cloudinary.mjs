import dotenv from 'dotenv';
dotenv.config({ path: '.env', override: false, quiet: true });
dotenv.config({ path: 'src/.env', override: false, quiet: true });

export async function uploadBannerImage(file, folder = 'mtboss/hero-banners') {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !preset) throw new Error('Cloudinary image upload is not configured.');
  const mimeSignatures = {
    'image/jpeg': (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
    'image/png': (bytes) => bytes.subarray(0, 8).join(',') === '137,80,78,71,13,10,26,10',
    'image/webp': (bytes) => String.fromCharCode(...bytes.subarray(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP',
  };
  if (!file || typeof file.arrayBuffer !== 'function' || !mimeSignatures[file.type]) {
    throw new Error('Choose a JPG, PNG or WEBP image.');
  }
  if (!file.size || file.size > 5 * 1024 * 1024) throw new Error('Choose an image smaller than 5 MB.');
  const signatureBytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!mimeSignatures[file.type](signatureBytes)) throw new Error('The image contents do not match the selected file type.');
  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', preset);
  body.append('folder', String(folder).replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '') || 'mtboss/uploads');
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST', body, signal: AbortSignal.timeout(60000),
  });
  const data = await response.json();
  if (!response.ok || !data.secure_url || !data.public_id) throw new Error(data.error?.message || 'Cloudinary upload failed.');
  return { url: data.secure_url, public_id: data.public_id, width: data.width, height: data.height };
}
