import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL });

async function inspect() {
  const tables = ['vendor_orders'];
  for (const t of tables) {
    try {
      const res = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [t]);
      console.log(`\n=== TABLE: ${t} (${res.rows.length} columns) ===`);
      console.log(res.rows.map(r => `${r.column_name}: ${r.data_type} (${r.is_nullable})`).join('\n'));
      
      const countRes = await pool.query(`SELECT COUNT(*) FROM ${t}`);
      console.log(`Row count: ${countRes.rows[0].count}`);
    } catch (e) {
      console.log(`TABLE ${t} ERROR: ${e.message}`);
    }
  }

  // Sample material enquiry
  const sampleMe = await pool.query(`SELECT * FROM material_enquiries LIMIT 1`);
  console.log('\n=== SAMPLE material_enquiries row ===');
  console.log(JSON.stringify(sampleMe.rows[0], null, 2));

  // Sample service booking
  const sampleSb = await pool.query(`SELECT * FROM service_bookings LIMIT 1`);
  console.log('\n=== SAMPLE service_bookings row ===');
  console.log(JSON.stringify(sampleSb.rows[0], null, 2));

  await pool.end();
}

inspect();
