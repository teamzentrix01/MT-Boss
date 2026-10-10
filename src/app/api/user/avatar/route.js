import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { createInitializationGuard, handleApiError } from '@/lib/api-utils';

const ensureAvatarColumn = createInitializationGuard(async () => {
  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT');
  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()');
});

const TYPES = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req) {
  const decoded = requireRole(req, 'user');
  if (!decoded) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'Choose a photo to upload.' }, { status: 400 });
    }
    const ext = TYPES[file.type];
    if (!ext) {
      return NextResponse.json({ success: false, error: 'Only JPG, PNG or WEBP photos are allowed.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, error: 'Photo is too large. Max 5MB.' }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');
    if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
    const filename = `user-${decoded.id}-${Date.now()}.${ext}`;
    await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
    const avatarUrl = `/uploads/avatars/${filename}`;

    await ensureAvatarColumn();
    const result = await pool.query(
      `UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2
       RETURNING id, email, name, phone, avatar_url, created_at`,
      [avatarUrl, decoded.id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { ...result.rows[0], role: 'user' } });
  } catch (error) {
    return handleApiError(error);
  }
}
