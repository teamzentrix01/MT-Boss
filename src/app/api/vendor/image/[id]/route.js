import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';

// GET /api/vendor/image/[id]?type=profile|aadhaar
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const admin = requireRole(req, 'admin');
    const vendor = requireRole(req, 'vendor');
    if (!admin && String(vendor?.id || '') !== String(id)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'profile';

    let col = 'profile_photo';
    let mimeCol = 'profile_photo_mime';
    if (type === 'aadhaar') {
      col = 'aadhar_image';
      mimeCol = 'aadhar_image_mime';
    } else if (type === 'pan') {
      col = 'pan_image';
      mimeCol = 'pan_image_mime';
    } else if (type === 'gst') {
      col = 'gst_image';
      mimeCol = 'gst_image_mime';
    }

    // Check if mime column exists
    const colCheck = await pool.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'vendors' AND column_name = $1`,
      [mimeCol]
    );
    const hasMimeCol = colCheck.rows.length > 0;

    const query = hasMimeCol
      ? `SELECT ${col}, ${mimeCol} FROM vendors WHERE id = $1`
      : `SELECT ${col} FROM vendors WHERE id = $1`;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0 || !result.rows[0][col]) {
      return new Response('Image not found', { status: 404 });
    }

    const imageBuffer = result.rows[0][col];
    const mimeType    = hasMimeCol
      ? (result.rows[0][mimeCol] || 'image/jpeg')
      : 'image/jpeg';

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    console.error('Vendor image error:', err);
    return new Response('Error fetching image', { status: 500 });
  }
}
