import pool from '../src/lib/db.js';

async function main() {
  console.log('=== Verifying User Management Admin Backend & Queries ===');

  // 1. Insert a temporary test user
  const testEmail = `test_user_${Date.now()}@mtboss.example`;
  const insertUser = await pool.query(
    `INSERT INTO users (name, email, password, phone, delivery_city, created_at, last_login_at, is_blocked)
     VALUES ($1, $2, 'dummy_hash', '9876543210', 'Indore', NOW(), NOW(), false)
     RETURNING id, name, email`,
    ['Test Customer Verification', testEmail]
  );
  const testUserId = insertUser.rows[0].id;
  console.log('1. Created test user ID:', testUserId);

  // 2. Insert a test address for this user
  await pool.query(
    `INSERT INTO user_addresses (user_id, label, address_line, city, pincode, is_default)
     VALUES ($1, 'Home', '123 Test Street, Vijay Nagar', 'Indore', '452010', true)`,
    [testUserId]
  );
  console.log('2. Created test address for user');

  // 3. Test list query with search
  const listRes = await pool.query(`
    WITH user_order_stats AS (
      SELECT
        u.id AS user_id,
        COALESCE(b.order_count, 0) + COALESCE(m.order_count, 0) AS total_orders,
        COALESCE(b.total_spent, 0) + COALESCE(m.total_spent, 0) AS total_spent
      FROM users u
      LEFT JOIN (
        SELECT user_id, COUNT(*)::int AS order_count,
               COALESCE(SUM(COALESCE(final_amount, total_amount, 0)), 0)::numeric AS total_spent
        FROM service_bookings
        GROUP BY user_id
      ) b ON b.user_id = u.id
      LEFT JOIN (
        SELECT
          COALESCE(me.user_id, u_sub.id) AS uid,
          COUNT(*)::int AS order_count,
          COALESCE(SUM(COALESCE(me.grand_total, me.amount_received, me.product_total, 0)), 0)::numeric AS total_spent
        FROM material_enquiries me
        LEFT JOIN users u_sub ON LOWER(TRIM(u_sub.email)) = LOWER(TRIM(me.user_email))
        WHERE me.user_id IS NOT NULL OR u_sub.id IS NOT NULL
        GROUP BY COALESCE(me.user_id, u_sub.id)
      ) m ON m.uid = u.id
    )
    SELECT
      u.id, u.name, u.email, u.phone, u.delivery_city, u.created_at, u.last_login_at,
      u.is_blocked, u.blocked_reason, u.blocked_at,
      COALESCE(os.total_orders, 0)::int AS total_orders,
      COALESCE(os.total_spent, 0)::numeric AS total_spent
    FROM users u
    LEFT JOIN user_order_stats os ON os.user_id = u.id
    WHERE u.id = $1
  `, [testUserId]);

  console.log('3. List query returned user:', listRes.rows[0]?.name, 'City:', listRes.rows[0]?.delivery_city);
  if (!listRes.rows[0] || listRes.rows[0].delivery_city !== 'Indore') {
    throw new Error('User not found in list query');
  }

  // 4. Test blocking user
  await pool.query(
    `UPDATE users SET is_blocked = true, blocked_reason = 'Test block reason', blocked_at = NOW() WHERE id = $1`,
    [testUserId]
  );
  await pool.query(
    `INSERT INTO user_moderation_logs (user_id, action, reason, admin_name) VALUES ($1, 'blocked', 'Test block reason', 'Admin Test')`,
    [testUserId]
  );
  console.log('4. Blocked test user and recorded moderation log');

  // Verify blocked status
  const blockedCheck = await pool.query('SELECT is_blocked, blocked_reason FROM users WHERE id = $1', [testUserId]);
  if (!blockedCheck.rows[0].is_blocked) throw new Error('User was not blocked');

  // 5. Test unblocking user
  await pool.query(
    `UPDATE users SET is_blocked = false, blocked_reason = NULL, blocked_at = NULL WHERE id = $1`,
    [testUserId]
  );
  await pool.query(
    `INSERT INTO user_moderation_logs (user_id, action, reason, admin_name) VALUES ($1, 'unblocked', NULL, 'Admin Test')`,
    [testUserId]
  );
  console.log('5. Unblocked test user and recorded moderation log');

  // 6. Test delete cleanup
  await pool.query('DELETE FROM user_addresses WHERE user_id = $1', [testUserId]);
  await pool.query('DELETE FROM user_moderation_logs WHERE user_id = $1', [testUserId]);
  await pool.query('DELETE FROM users WHERE id = $1', [testUserId]);
  console.log('6. Cleaned up test user successfully');

  console.log('🎉 ALL User Management Admin Tests PASSED!');
  process.exit(0);
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
