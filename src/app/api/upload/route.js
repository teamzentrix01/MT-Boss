import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { requireAnyRole, unauthorized } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = requireAnyRole(req, ['admin', 'agent']);
    if (!user) return unauthorized();

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      return Response.json(
        { success: false, error: 'Invalid file type. Only JPG, PNG, WEBP, and PDF allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return Response.json(
        { success: false, error: 'File too large. Max 10MB.' },
        { status: 400 }
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const ext = file.type === 'application/pdf' ? 'pdf' : file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
    const filename = `${timestamp}-${random}.${ext}`;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET;

    let publicUrl = '';

    // If Cloudinary is configured (e.g. production mtboss.in), upload to Cloudinary directly
    if (cloudName && uploadPreset) {
      try {
        const cldBody = new FormData();
        cldBody.append('file', file);
        cldBody.append('upload_preset', uploadPreset);
        cldBody.append('folder', 'MTBOSS/bills');

        const cldRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: 'POST',
          body: cldBody,
        });

        const cldData = await cldRes.json();
        if (cldRes.ok && cldData.secure_url) {
          publicUrl = cldData.secure_url;
        } else {
          console.warn('Cloudinary upload responded with error, falling back to disk:', cldData?.error?.message);
        }
      } catch (cldErr) {
        console.warn('Cloudinary upload exception, falling back to disk:', cldErr?.message);
      }
    }

    // If not uploaded to Cloudinary, save to public/uploads (local dev fallback)
    if (!publicUrl) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);

      publicUrl = `/uploads/${filename}`;
    }

    return Response.json({
      success: true,
      url: publicUrl,
      filename: filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json(
      { success: false, error: error?.message || 'Server error during upload' },
      { status: 500 }
    );
  }
}
