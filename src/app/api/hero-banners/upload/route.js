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
    return Response.json({ success: true, ...await uploadBannerImage(file) });
  } catch (error) {
    console.error('Banner image upload failed:', error.message);
    return Response.json({ success: false, error: 'Image could not be uploaded to Cloudinary. Please try again.' }, { status: 502 });
  }
}
