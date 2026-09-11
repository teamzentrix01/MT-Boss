import 'dotenv/config';
import { fileURLToPath } from 'url';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: 'src/.env' });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const mapUrl = 'https://www.google.com/maps?q=28.3975,79.452806&z=17&output=embed';
  
  const res = await pool.query(
    `UPDATE office_locations 
     SET map_url = $1, is_active = true, updated_at = NOW() 
     WHERE LOWER(city) = $2 
     RETURNING *`,
    [mapUrl, 'bareilly']
  );

  console.log('Bareilly office updated successfully:');
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}

main().catch((err) => {
  console.error('Update error:', err);
  process.exit(1);
});
