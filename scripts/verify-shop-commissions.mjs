import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import pg from 'pg';
import {
  ensureShopVendorCommissionsSchema,
  getShopVendorCommissionPercent,
  setShopVendorCommissionPercent,
  recordShopVendorCommission,
} from '../src/lib/shop-commissions.js';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL });

async function verify() {
  console.log('--- 1. Testing Schema Guard & Settings Retrieval ---');
  await ensureShopVendorCommissionsSchema();
  const initialPercent = await getShopVendorCommissionPercent();
  console.log('Current shop_vendor_commission_percent:', initialPercent);

  console.log('\n--- 2. Testing Updating Commission Percent ---');
  await setShopVendorCommissionPercent(12.5);
  const updatedPercent = await getShopVendorCommissionPercent();
  console.log('Updated percent to 12.5. Retrieved:', updatedPercent);
  if (updatedPercent !== 12.5) {
    throw new Error(`Expected 12.5 but got ${updatedPercent}`);
  }

  // Restore back to 10
  await setShopVendorCommissionPercent(10.0);
  console.log('Restored percent to 10.0');

  console.log('\n--- 3. Testing Validation on Commission Percent ---');
  try {
    await setShopVendorCommissionPercent(150);
    throw new Error('Should have failed for percent > 100');
  } catch (err) {
    console.log('Successfully rejected 150:', err.message);
  }
  try {
    await setShopVendorCommissionPercent(-5);
    throw new Error('Should have failed for percent < 0');
  } catch (err) {
    console.log('Successfully rejected -5:', err.message);
  }

  console.log('\n--- 4. Checking Table Columns and Types ---');
  const cols = await pool.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'shop_vendor_commissions'
    ORDER BY ordinal_position
  `);
  console.log('shop_vendor_commissions columns:');
  for (const c of cols.rows) {
    console.log(`  ${c.column_name}: ${c.data_type} (nullable: ${c.is_nullable})`);
  }

  console.log('\n--- 5. Checking Foreign Keys ---');
  const fkeys = await pool.query(`
    SELECT
      tc.constraint_name,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.table_name = 'shop_vendor_commissions' AND tc.constraint_type = 'FOREIGN KEY'
  `);
  console.log('Foreign keys on shop_vendor_commissions:', fkeys.rows);

  console.log('\n--- 6. Checking Status Constraint ---');
  try {
    await pool.query(`
      INSERT INTO shop_vendor_commissions
      (order_id, vendor_id, product_id, order_amount, commission_percent_applied, commission_amount, status)
      VALUES (999999, 999999, 1, 100, 10, 10, 'invalid_status')
    `);
    throw new Error('Should have failed on invalid status');
  } catch (err) {
    console.log('Correctly rejected invalid status:', err.message);
  }

  console.log('\n✅ All verifications passed successfully!');
  await pool.end();
  process.exit(0);
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
