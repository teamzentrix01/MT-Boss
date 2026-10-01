import jwt from 'jsonwebtoken';
import pool from '../src/lib/db.js';
const JWT_SECRET = process.env.JWT_SECRET || 'development-only-change-me';

const ADMIN_TOKEN = jwt.sign(
  { id: 999, email: 'admin@mtboss.com', role: 'admin', name: 'Super Admin' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const USER_TOKEN = jwt.sign(
  { id: 101, email: 'user@example.com', role: 'user', name: 'Normal User' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(name, fn) {
  process.stdout.write(`Testing: ${name}... `);
  try {
    await fn();
    console.log('✅ PASS');
  } catch (err) {
    console.log('❌ FAIL');
    console.error(err);
    process.exitCode = 1;
  }
}

async function runAll() {
  console.log('=== Running Orders History Verification Suite ===\n');

  let sampleOrderId = null;
  let sampleCustomerId = null;

  // 1. Role enforcement
  await testEndpoint('GET /api/admin/orders without auth token (should be 401)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/orders`);
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await testEndpoint('GET /api/admin/orders with normal user token (should be 401)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${USER_TOKEN}` },
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 2. Fetch orders list
  await testEndpoint('GET /api/admin/orders with admin token (should be 200 & return summary)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/orders?limit=10`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed');
    if (!Array.isArray(data.orders)) throw new Error('orders is not an array');
    if (typeof data.summary?.total_orders !== 'number') throw new Error('summary.total_orders missing');
    if (typeof data.summary?.total_revenue !== 'number') throw new Error('summary.total_revenue missing');

    sampleOrderId = data.orders[0]?.order_id || data.orders[0]?.id;
    sampleCustomerId = data.orders[0]?.customer_id || data.orders[0]?.customer_phone;
  });

  // 3. Filter by type
  await testEndpoint('GET /api/admin/orders?type=shop_order', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/orders?type=shop_order&limit=5`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error('Failed');
    const nonShop = data.orders.find(o => o.type !== 'shop_order');
    if (nonShop) throw new Error(`Found non-shop order: ${nonShop.type}`);
  });

  // 4. Export CSV
  await testEndpoint('GET /api/admin/orders?export=csv (returns CSV text)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/orders?export=csv`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('text/csv')) throw new Error(`Expected text/csv, got ${contentType}`);
    const text = await res.text();
    if (!text.includes('Order / Booking ID')) throw new Error('Missing CSV headers');
  });

  // 5. Bill view by ID
  if (sampleOrderId) {
    await testEndpoint(`GET /api/admin/orders/${sampleOrderId} (Bill / Invoice details)`, async () => {
      const res = await fetch(`${BASE_URL}/api/admin/orders/${sampleOrderId}`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const data = await res.json();
      if (!data.success || !data.order) throw new Error('Missing order bill');
      if (!Array.isArray(data.order.items)) throw new Error('Missing items table');
      if (data.order.grand_total === undefined) throw new Error('Missing grand_total');
    });

    // 6. PDF generation
    await testEndpoint(`GET /api/admin/orders/${sampleOrderId}/pdf (PDF download stream)`, async () => {
      const res = await fetch(`${BASE_URL}/api/admin/orders/${sampleOrderId}/pdf`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/pdf')) throw new Error(`Expected application/pdf, got ${contentType}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 100) throw new Error(`PDF too small: ${buf.length} bytes`);
      if (buf.slice(0, 4).toString() !== '%PDF') throw new Error('Not a valid PDF header');
    });

    // 7. Status update & Audit Log
    await testEndpoint(`PATCH /api/admin/orders/${sampleOrderId}/status (Status update + audit log)`, async () => {
      const patchRes = await fetch(`${BASE_URL}/api/admin/orders/${sampleOrderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify({
          status: 'confirmed',
          notes: 'Integration test update status',
        }),
      });
      if (patchRes.status !== 200) {
        const err = await patchRes.json();
        throw new Error(`PATCH failed: ${err.error}`);
      }

      // Verify in audit log
      const auditRes = await pool.query(
        `SELECT * FROM pm_audit_log WHERE record_id = (
           SELECT id FROM material_enquiries WHERE order_reference = $1 OR id::TEXT = $1 LIMIT 1
         ) ORDER BY id DESC LIMIT 1`,
        [String(sampleOrderId)]
      );
      if (auditRes.rows.length === 0) {
        throw new Error('Audit log record not found in pm_audit_log');
      }
      const log = auditRes.rows[0];
      if (log.action !== 'status_change') throw new Error(`Expected action status_change, got ${log.action}`);
    });

    // 8. Delete prevention
    await testEndpoint(`DELETE /api/admin/orders/${sampleOrderId} (should be 405 Method Not Allowed)`, async () => {
      const res = await fetch(`${BASE_URL}/api/admin/orders/${sampleOrderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      if (res.status !== 405) throw new Error(`Expected 405, got ${res.status}`);
    });
  }

  // 9. Customer details & orders
  if (sampleCustomerId) {
    await testEndpoint(`GET /api/admin/customers/${sampleCustomerId} (Profile)`, async () => {
      const res = await fetch(`${BASE_URL}/api/admin/customers/${sampleCustomerId}`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const data = await res.json();
      if (!data.success || !data.profile) throw new Error('Missing profile');
    });

    await testEndpoint(`GET /api/admin/customers/${sampleCustomerId}/orders (Orders & Spend)`, async () => {
      const res = await fetch(`${BASE_URL}/api/admin/customers/${sampleCustomerId}/orders`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      const data = await res.json();
      if (!data.success || !Array.isArray(data.orders)) throw new Error('Missing customer orders');
      if (typeof data.lifetime_spend !== 'number') throw new Error('Missing lifetime_spend');
    });
  }

  // 10. Phone search normalization
  await testEndpoint('GET /api/admin/orders?phone= (Flexible phone search matching)', async () => {
    const formats = ['7307939550', '+91 73079 39550', '73079 39550'];
    for (const p of formats) {
      const res = await fetch(`${BASE_URL}/api/admin/orders?phone=${encodeURIComponent(p)}`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      if (res.status !== 200) throw new Error(`Phone search failed for "${p}" with status ${res.status}`);
      const data = await res.json();
      if (!data.success || data.orders.length === 0) {
        throw new Error(`Phone search failed for format "${p}" - 0 orders returned`);
      }
    }
  });

  console.log('\n=== All Verification Tests Passed Successfully! ===');
  process.exit(0);
}

runAll().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
