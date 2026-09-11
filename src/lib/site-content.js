import pool from './db';
import { createInitializationGuard } from './api-utils';
import { faqDefaults } from './faq-defaults.mjs';

export const ensureSiteContent = createInitializationGuard(async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("SELECT pg_advisory_xact_lock(73291041)");
    await client.query(`CREATE TABLE IF NOT EXISTS site_content_migrations (name TEXT PRIMARY KEY);
      CREATE TABLE IF NOT EXISTS site_faqs (
        id SERIAL PRIMARY KEY, page VARCHAR(40) NOT NULL, q TEXT NOT NULL, a TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0, is_active BOOLEAN NOT NULL DEFAULT true,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS site_reviews (
        id SERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL, email VARCHAR(254) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5), service VARCHAR(100) NOT NULL,
        message TEXT NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS site_reviews_email_date ON site_reviews(email, created_at);`);
    const seeded = await client.query("INSERT INTO site_content_migrations(name) VALUES ('faq-seed-v1') ON CONFLICT DO NOTHING RETURNING name");
    if (seeded.rows.length) {
      for (const [page, faqs] of Object.entries(faqDefaults)) {
        for (const [index, faq] of faqs.entries()) {
          await client.query('INSERT INTO site_faqs(page,q,a,sort_order) VALUES ($1,$2,$3,$4)', [page, faq.q, faq.a, index]);
        }
      }
    }
    await client.query('COMMIT');
  } catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
});
