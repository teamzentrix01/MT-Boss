import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
const pool = new Pool({ connectionString });

async function inspect() {
  try {
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log('ALL TABLES IN DB:');
    console.log(tablesRes.rows.map(r => r.table_name).join(', '));

    const checkTableCols = async (tbl) => {
      const res = await pool.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position
      `, [tbl]);
      console.log(`\nCOLUMNS OF ${tbl}:`);
      console.log(res.rows.map(r => `  ${r.column_name}: ${r.data_type} (null: ${r.is_nullable})`).join('\n'));
    };

    await checkTableCols('users');
    await checkTableCols('shop_categories');
    await checkTableCols('material_enquiries');
    await checkTableCols('shop_coupons');
    if (tablesRes.rows.some(r => r.table_name === 'orders')) {
      await checkTableCols('orders');
    }
    if (tablesRes.rows.some(r => r.table_name === 'order_items')) {
      await checkTableCols('order_items');
    }

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

inspect();
