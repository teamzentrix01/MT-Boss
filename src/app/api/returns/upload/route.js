import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { requireRole } from '@/lib/auth';

export async function POST(req) {
  try {
    const user = requireRole(req, 'user');
    if (!user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return Response.json(
        { success: false, error: 'Invalid file type. Only JPG, PNG, and WEBP images allowed.' },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ success: false, error: 'Image too large. Max 10MB.' }, { status: 400 });
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const ext = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
    const filename = `return-${timestamp}-${random}.${ext}`;

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'returns');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const publicUrl = `/uploads/returns/${filename}`;
    return Response.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('[returns upload error]:', err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

