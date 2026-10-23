import { requireRole, unauthorized } from '@/lib/auth';
import { uploadBannerImage } from '@/lib/banner-cloudinary.mjs';

export async function POST(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    const body = await req.formData();
    const file = body.get('file');
    if (!file || typeof file.arrayBuffer !== 'function' || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return Response.json({ success: false, error: 'Choose a JPG, PNG or WEBP image.' }, { status: 400 });
    }
    if (!file.size || file.size > 5 * 1024 * 1024) {
      return Response.json({ success: false, error: 'Choose an image smaller than 5 MB.' }, { status: 400 });
    }
    const requestedFolder = body.get('folder');
    const allowedFolders = new Set([
      'mtboss/quick-services',
      'mtboss/quick-service-subcategories',
    ]);
    const folder = allowedFolders.has(requestedFolder) ? requestedFolder : 'mtboss/hero-banners';

    let fileToUpload = file;
    if (folder === 'mtboss/quick-services') {
      try {
        const sharp = (await import('sharp')).default;
        const inputBuffer = Buffer.from(await file.arrayBuffer());
        const fitMode = (body.get('fit') || body.get('image_fit') || 'icon').toLowerCase();

        let sharpPipeline = sharp(inputBuffer);
        if (fitMode === 'cover') {
          sharpPipeline = sharpPipeline
            .resize(400, 300, {
              fit: 'cover',
              position: 'center',
            })
            .webp({ quality: 85 });
        } else {
          sharpPipeline = sharpPipeline
            .resize(256, 256, {
              fit: 'contain',
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .webp({ quality: 90 });
        }

        const resizedBuffer = await sharpPipeline.toBuffer();
        const cleanName = (file.name || 'service-icon').replace(/\.[^/.]+$/, '');
        fileToUpload = new File([resizedBuffer], `${cleanName}.webp`, { type: 'image/webp' });
      } catch (optErr) {
        console.warn('Sharp optimization skipped:', optErr?.message);
      }
    }

    return Response.json({ success: true, ...await uploadBannerImage(fileToUpload, folder) });
  } catch (error) {
    console.error('Banner image upload failed:', error.message);
    return Response.json({ success: false, error: 'Image could not be uploaded to Cloudinary. Please try again.' }, { status: 502 });
  }
}
