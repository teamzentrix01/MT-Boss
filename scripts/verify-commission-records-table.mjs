import pool from '../src/lib/db.js';
import {
  getShopVendorCommissionRecords,
  markShopVendorCommissionPaid,
} from '../src/lib/shop-commissions.js';

async function main() {
  console.log('=== Verifying Tracked Commission Records Table & Mark as Paid ===');

  const vRes = await pool.query('SELECT id, shop_name FROM vendors LIMIT 1');
  const vendorId = vRes.rows[0].id;

  const meRes = await pool.query('SELECT id FROM material_enquiries LIMIT 1');
  const orderId = meRes.rows[0].id;

  // Insert a test pending commission record
  const insertRes = await pool.query(
    `INSERT INTO shop_vendor_commissions
      (order_id, vendor_id, product_id, order_amount, commission_percent_applied, commission_amount, status, rate_source, created_at)
     VALUES ($1, $2, NULL, 8000, 5, 400, 'pending', 'category', NOW())
     RETURNING id, status, commission_amount`,
    [orderId, vendorId]
  );
  const testRecId = insertRes.rows[0].id;
  console.log('1. Created test pending record ID:', testRecId);

  // Test getShopVendorCommissionRecords with status = pending
  const pendingList = await getShopVendorCommissionRecords({ status: 'pending' });
  const found = pendingList.records.find((r) => r.id === Number(testRecId));
  console.log('2. Found in pending query:', Boolean(found));
  if (!found) throw new Error('Test record not found in pending query');

  // Test mark as paid
  const updated = await markShopVendorCommissionPaid({
    commissionId: testRecId,
    paidNote: 'Settled offline by admin for testing',
  });
  console.log('3. Marked as paid:', updated[0]?.status, 'Note:', updated[0]?.paid_note);
  if (updated[0].status !== 'paid' || !updated[0].paid_at) {
    throw new Error('Settlement did not update properly');
  }

  // Verify found in paid query
  const paidList = await getShopVendorCommissionRecords({ status: 'paid' });
  const foundPaid = paidList.records.find((r) => r.id === Number(testRecId));
  console.log('4. Found in paid query:', Boolean(foundPaid));
  if (!foundPaid) throw new Error('Test record not found in paid query');

  // Clean up
  await pool.query('DELETE FROM shop_vendor_commissions WHERE id = $1', [testRecId]);
  console.log('5. Cleaned up test record.');

  console.log('🎉 ALL Tracked Commission Records Table Tests PASSED!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
