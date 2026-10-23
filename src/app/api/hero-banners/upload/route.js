import { requireRole, unauthorized } from '@/lib/auth';
import { uploadBannerImage } from '@/lib/banner-cloudinary.mjs';

export async function POST(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    const body = await req.formData();
    const file = body.get('file');
    if (!file || typeof file.arrayBuffer !== 'function') {
      return Response.json({ success: false, error: 'Please choose a file to upload.' }, { status: 400 });
    }
    // Allow up to 200MB
    if (!file.size || file.size > 200 * 1024 * 1024) {
      return Response.json({ success: false, error: 'File size must be under 200 MB.' }, { status: 400 });
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
        const fitMode = (body.get('fit') || body.get('image_fit') || 'cover').toLowerCase();

        let sharpPipeline = sharp(inputBuffer);
        
        // Trim transparent borders around the image so it doesn't have artificial empty margins
        try {
          sharpPipeline = sharpPipeline.trim();
        } catch {
          // trim might fail if image is single color; ignore
        }

        if (fitMode === 'contain') {
          // Keep crisp icon/logo without cropping or transparent canvas distortion
          sharpPipeline = sharpPipeline
            .resize(500, 500, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 90 });
        } else {
          // Cover mode: photo or image fills full card, keep natural aspect ratio
          sharpPipeline = sharpPipeline
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
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
