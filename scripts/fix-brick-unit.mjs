import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env', quiet: true });
const config = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };
const pool = new pg.Pool(config);
const apply = process.argv.includes('--apply');

try {
  const categories = await pool.query(`SELECT id, name, unit, city_prices
    FROM shop_categories WHERE LOWER(TRIM(name)) IN ('brick', 'bricks')`);
  const products = await pool.query(`SELECT id, name, unit, price, category
    FROM supplier_materials
    WHERE LOWER(TRIM(category)) IN ('brick', 'bricks') OR LOWER(TRIM(name)) IN ('brick', 'bricks')`);
  if (apply) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const category of categories.rows) {
        const cityPrices = category.city_prices && typeof category.city_prices === 'object' ? category.city_prices : {};
        const updatedCityPrices = Object.fromEntries(Object.entries(cityPrices).map(([city, price]) => [
          city,
          price && typeof price === 'object' && String(price.unit || '').toLowerCase() === 'kg'
            ? { ...price, unit: 'pcs' }
            : price,
        ]));
        await client.query(`UPDATE shop_categories SET unit = 'pcs', city_prices = $2::jsonb,
          updated_at = NOW() WHERE id = $1`, [category.id, JSON.stringify(updatedCityPrices)]);
      }
      // A priced per-kg supplier listing needs a new per-piece price before its unit changes.
      for (const product of products.rows.filter((row) => row.unit === 'kg' && row.price == null)) {
        await client.query(`UPDATE supplier_materials SET unit = 'pcs', updated_at = NOW() WHERE id = $1`, [product.id]);
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  console.log(JSON.stringify({ applied: apply, categories: categories.rows, products: products.rows }));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
