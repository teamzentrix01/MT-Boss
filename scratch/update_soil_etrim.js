const { Pool } = require('c:/Zentrix office/MT-Boss new/MT-Boss/node_modules/pg');
require('c:/Zentrix office/MT-Boss new/MT-Boss/node_modules/dotenv').config({ path: 'c:/Zentrix office/MT-Boss new/MT-Boss/.env' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL, password: process.env.DB_PASSWORD });

async function run() {
  const url = 'https://res.cloudinary.com/dwvfedqrb/image/upload/e_trim/v1792751185/mtboss/quick-services/qya76oj7pzrnabkb6iz8.webp';
  await pool.query('UPDATE quick_services SET icon = $1, image_fit = $2 WHERE id = 21', [url, 'cover']);
  console.log('Updated Soil Filling successfully with e_trim URL');
  await pool.end();
}
run();
