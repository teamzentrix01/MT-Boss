import pool from '@/lib/db';
import { defaultHeroBanners } from './hero-banner-defaults.mjs';
import { validateBanner } from './hero-banner-fields.mjs';

// Only called by the explicit, authenticated admin import action.
export async function installServiceBanners() {
  const banners = defaultHeroBanners.map(banner => {
    const result = validateBanner(banner, process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    if (result.error) throw new Error(result.error);
    return result.data;
  });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('LOCK TABLE hero_banners IN SHARE ROW EXCLUSIVE MODE');
    await client.query(`CREATE TABLE IF NOT EXISTS hero_banner_backups (
      id SERIAL PRIMARY KEY, reason TEXT NOT NULL, banners JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    const { rows } = await client.query('SELECT * FROM hero_banners ORDER BY sort_order, id');
    await client.query('INSERT INTO hero_banner_backups (reason, banners) VALUES ($1, $2::jsonb)',
      ['Admin loaded the four service banners', JSON.stringify(rows)]);
    await client.query('UPDATE hero_banners SET is_active=false, updated_at=NOW() WHERE is_active=true');
    for (const banner of banners) {
      const existing = rows.find(row => row.cloudinary_public_id === banner.cloudinary_public_id || row.image_url === banner.image_url);
      const fields = Object.keys(banner);
      const values = Object.values(banner);
      if (existing) {
        await client.query(`UPDATE hero_banners SET ${fields.map((field, i) => `${field}=$${i + 1}`).join(', ')}, updated_at=NOW() WHERE id=$${values.length + 1}`, [...values, existing.id]);
      } else {
        await client.query(`INSERT INTO hero_banners (${fields.join(', ')}) VALUES (${values.map((_, i) => `$${i + 1}`).join(', ')})`, values);
      }
    }
    const result = await client.query('SELECT * FROM hero_banners ORDER BY sort_order, id');
    await client.query('COMMIT');
    return result.rows;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}
