export async function ensureHeroBannersSchema(db) {
  await db.query(`CREATE TABLE IF NOT EXISTS hero_banners (
    id SERIAL PRIMARY KEY, label VARCHAR(255), title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500), description TEXT, image_url TEXT NOT NULL,
    cloudinary_public_id VARCHAR(255), sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
  )`);
  await db.query(`ALTER TABLE hero_banners
    ADD COLUMN IF NOT EXISTS service_name VARCHAR(32) DEFAULT '',
    ADD COLUMN IF NOT EXISTS image_alt VARCHAR(160) DEFAULT '',
    ADD COLUMN IF NOT EXISTS image_position VARCHAR(16) DEFAULT 'center',
    ADD COLUMN IF NOT EXISTS cta_text VARCHAR(32) DEFAULT '',
    ADD COLUMN IF NOT EXISTS cta_href VARCHAR(300) DEFAULT '',
    ADD COLUMN IF NOT EXISTS secondary_cta_text VARCHAR(32) DEFAULT '',
    ADD COLUMN IF NOT EXISTS secondary_cta_href VARCHAR(300) DEFAULT ''`);
}
