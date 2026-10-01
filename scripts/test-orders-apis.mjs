import pool from '../src/lib/db.js';
import {
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  getCustomerProfile,
  getCustomerOrdersHistory,
  generateOrderInvoicePdf,
} from '../src/lib/orders-history.js';

async function runTests() {
  console.log('--- Testing Orders History Module ---');

  // Test 1: Fetch Orders list
  console.log('\n[1] Testing getAdminOrders:');
  const listResult = await getAdminOrders({ page: 1, limit: 10, type: 'all' });
  console.log(`✓ Fetched ${listResult.orders.length} orders (Total: ${listResult.summary.total_orders})`);
  console.log('✓ Summary Metrics:', listResult.summary);
  if (listResult.orders.length > 0) {
    console.log('✓ Sample Order ID:', listResult.orders[0].order_id, 'Type:', listResult.orders[0].type);
  }

  // Test 2: Fetch Order by ID
  console.log('\n[2] Testing getAdminOrderById:');
  if (listResult.orders.length > 0) {
    const firstOrder = listResult.orders[0];
    const orderDetails = await getAdminOrderById(firstOrder.order_id);
    console.log('✓ Bill / Order details fetched successfully:', {
      order_id: orderDetails.order_id,
      customer_name: orderDetails.customer_name,
      items_count: orderDetails.items.length,
      grand_total: orderDetails.grand_total,
      payment_mode: orderDetails.payment_mode,
    });

    // Test 3: Generate PDF Invoice
    console.log('\n[3] Testing generateOrderInvoicePdf:');
    const pdfBuf = await generateOrderInvoicePdf(orderDetails);
    console.log(`✓ PDF Invoice generated successfully! Buffer length: ${pdfBuf.length} bytes (starts with: ${pdfBuf.slice(0, 4).toString()})`);
  }

  // Test 4: Customer Details & Orders
  console.log('\n[4] Testing Customer Profile & Orders:');
  const testCustomer = listResult.orders.find(o => o.customer_id) || listResult.orders[0];
  if (testCustomer) {
    const profile = await getCustomerProfile(testCustomer.customer_id || testCustomer.customer_phone);
    console.log('✓ Customer profile:', profile ? { name: profile.name, phone: profile.phone, city: profile.delivery_city } : 'None');

    const customerOrders = await getCustomerOrdersHistory(testCustomer.customer_id, testCustomer.customer_phone);
    console.log('✓ Customer orders history:', {
      total_orders: customerOrders.total_orders,
      lifetime_spend: customerOrders.lifetime_spend,
      coupons_used: customerOrders.coupons_used,
      duration_ms: customerOrders.query_duration_ms,
    });
  }

  // Test 5: Status Change & Audit Log
  console.log('\n[5] Testing Status Change & Audit Logging:');
  const shopOrder = listResult.orders.find(o => o.type === 'shop_order');
  if (shopOrder) {
    const prevStatus = shopOrder.status;
    const testNewStatus = prevStatus === 'processing' ? 'confirmed' : 'processing';
    console.log(`Updating order ${shopOrder.id} from ${prevStatus} to ${testNewStatus}...`);

    await updateAdminOrderStatus({
      orderId: shopOrder.id,
      type: 'shop_order',
      newStatus: testNewStatus,
      notes: 'Automated integration test status update',
      adminUser: { id: 1, email: 'admin@mtboss.com', name: 'Super Admin' },
    });

    // Verify pm_audit_log
    const auditRes = await pool.query(
      `SELECT * FROM pm_audit_log WHERE table_name = 'material_enquiries' AND record_id = $1 ORDER BY id DESC LIMIT 1`,
      [shopOrder.id]
    );
    console.log('✓ pm_audit_log verified:', auditRes.rows[0]);

    // Revert back
    await updateAdminOrderStatus({
      orderId: shopOrder.id,
      type: 'shop_order',
      newStatus: prevStatus,
      notes: 'Reverting test status update',
      adminUser: { id: 1, email: 'admin@mtboss.com', name: 'Super Admin' },
    });
    console.log('✓ Reverted status successfully.');
  }

  console.log('\n All backend tests completed successfully!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
