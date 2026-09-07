// One-time content refresh. Run from the project root with --apply.
// Refuses to overwrite banners changed since this refresh was prepared.
import dotenv from 'dotenv';
import pg from 'pg';
import { mkdir, writeFile } from 'node:fs/promises';
import { ensureHeroBannersSchema } from '../src/lib/hero-banners-schema.mjs';
import { defaultHeroBanners } from '../src/lib/hero-banner-defaults.mjs';
import { validateBanner } from '../src/lib/hero-banner-fields.mjs';
dotenv.config({ path: '.env', quiet: true });
dotenv.config({ path: 'src/.env', quiet: true });
if (!process.argv.includes('--apply')) {
  console.log('Updates the four existing service banners, preserving IDs and inactive banners. Run with --apply to back up and save.');
  process.exit(0);
}
const expected = [
  [4, 'Building Your Legacy'], [3, 'Built on Trust'],
  [5, 'Strong Foundation, Lifelong Trust'], [6, ' Smartest Way to Buy and Sell Real Estate'],
];
const pool = new pg.Pool(process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000,
} : { host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 5432), user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await ensureHeroBannersSchema(client);
  const { rows } = await client.query('SELECT * FROM hero_banners ORDER BY sort_order, id FOR UPDATE');
  for (const [id, title] of expected) {
    if (rows.find(row => row.id === id)?.title !== title) throw new Error(`Banner ${id} has changed. Refresh stopped to protect admin edits.`);
  }
  await mkdir('db-dumps', { recursive: true });
  const backup = `db-dumps/hero-banners-before-refresh-${Date.now()}.json`;
  await writeFile(backup, JSON.stringify(rows, null, 2));
  for (let index = 0; index < expected.length; index++) {
    const { data, error } = validateBanner(defaultHeroBanners[index], process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    if (error) throw new Error(error);
    const keys = Object.keys(data);
    await client.query(`UPDATE hero_banners SET ${keys.map((key, i) => `${key}=$${i + 1}`).join(', ')}, updated_at=NOW() WHERE id=$${keys.length + 1}`, [...Object.values(data), expected[index][0]]);
  }
  await client.query('COMMIT');
  console.log(`Updated four service banners. Original records saved to ${backup}.`);
} catch (error) {
  await client.query('ROLLBACK'); console.error(error.message); process.exitCode = 1;
} finally { client.release(); await pool.end(); }
