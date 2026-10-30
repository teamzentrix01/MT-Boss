const pool = require('c:/Zentrix office/MT-Boss new/MT-Boss/src/lib/db.js').default || require('c:/Zentrix office/MT-Boss new/MT-Boss/src/lib/db.js');

function parseExpenseData(row) {
  if (!row) return { category: '', item_name: '', note: '' };
  let cat = row.category || '';
  let note = row.note || '';
  let item_name = row.item_name || '';

  const catMatch = String(note).match(/^\[Category:\s*([^\]]+)\](?:\s*([\s\S]*))?$/);
  if (catMatch) {
    cat = catMatch[1].trim();
    note = (catMatch[2] || '').trim();
  }

  if (!item_name && note) {
    const itemMatch = String(note).match(/^\[Item:\s*([^\]]+)\](?:\s*([\s\S]*))?$/);
    if (itemMatch) {
      item_name = itemMatch[1].trim();
      note = (itemMatch[2] || '').trim();
    }
  }

  return {
    category: cat,
    item_name: item_name || '',
    note: note || '',
  };
}

async function runTests() {
  console.log('--- Starting Rent & Generator Fix Tests ---');

  // Test 1: Check pmSchemaLooksReady logic
  const checkRes = await pool.query(`
    SELECT
      EXISTS (
        SELECT 1
          FROM pg_constraint c
          JOIN pg_class t ON c.conrelid = t.oid
         WHERE t.relname = 'pm_other_expenses'
           AND c.conname = 'pm_other_expenses_category_check'
           AND pg_get_constraintdef(c.oid) LIKE '%tools%'
           AND pg_get_constraintdef(c.oid) LIKE '%rent%'
      ) AS has_oe_tools_rent_constraint,
      to_regclass('public.pm_commissions') IS NOT NULL AS has_commissions
  `);
  console.log('Test 1 Schema Check:', checkRes.rows[0]);
  if (!checkRes.rows[0].has_oe_tools_rent_constraint || !checkRes.rows[0].has_commissions) {
    throw new Error('Test 1 Failed: schema check failed');
  }
  console.log('✓ Test 1 Passed: Schema checks detect tools/rent constraint and pm_commissions table.');

  // Test 2: Insert category='rent' with item_name='generator'
  const c = await pool.connect();
  let insertedId = null;
  try {
    await c.query('BEGIN');
    const p = 11;
    const cat = 'rent';
    const amt = 1000;
    const expenseDate = '2026-10-27';
    const itemName = 'generator';
    const noteText = '';
    const storedNote = `[Item: ${itemName}]`;
    const actor = 'admin';

    // Test the savepoint logic directly
    let r;
    await c.query('SAVEPOINT oe_insert');
    try {
      r = await c.query(
        `INSERT INTO pm_other_expenses(project_id, category, amount, expense_date, note, created_by)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING *`,
        [p, cat, amt, expenseDate, storedNote, actor]
      );
      await c.query('RELEASE SAVEPOINT oe_insert');
    } catch (insertErr) {
      if (
        insertErr &&
        (insertErr.code === '23514' ||
          (insertErr.message && insertErr.message.includes('pm_other_expenses_category_check')))
      ) {
        await c.query('ROLLBACK TO SAVEPOINT oe_insert');
        const fallbackCat = cat === 'rent' ? 'machine_rent' : 'misc';
        const fallbackNote = `[Category: ${cat}] ${storedNote || ''}`.trim();
        r = await c.query(
          `INSERT INTO pm_other_expenses(project_id, category, amount, expense_date, note, created_by)
           VALUES ($1,$2,$3,$4,$5,$6)
           RETURNING *`,
          [p, fallbackCat, amt, expenseDate, fallbackNote, actor]
        );
      } else {
        throw insertErr;
      }
    }

    insertedId = r.rows[0].id;
    console.log('✓ Test 2 Passed: Successfully inserted expense id:', insertedId, 'category:', r.rows[0].category);

    // Test 3: Parse expense row
    const parsed = parseExpenseData(r.rows[0]);
    console.log('Test 3 Parsed row:', parsed);
    if (parsed.category !== 'rent' || parsed.item_name !== 'generator') {
      throw new Error('Test 3 Failed: Parsed category or item_name incorrect');
    }
    console.log('✓ Test 3 Passed: parseExpenseData correctly extracted rent and generator.');

    // Test 4: Simulate fallback row (as would happen if constraint was old)
    const fallbackRow = {
      id: 9999,
      project_id: 11,
      category: 'machine_rent',
      note: '[Category: rent] [Item: generator] 50L diesel included',
      amount: 1000,
    };
    const parsedFallback = parseExpenseData(fallbackRow);
    console.log('Test 4 Fallback Parsed:', parsedFallback);
    if (parsedFallback.category !== 'rent' || parsedFallback.item_name !== 'generator' || parsedFallback.note !== '50L diesel included') {
      throw new Error('Test 4 Failed: Fallback parsing did not extract correctly');
    }
    console.log('✓ Test 4 Passed: Legacy fallback row successfully unpacked to category="rent", item="generator", note="50L diesel included".');

    // Clean up test row
    await c.query('ROLLBACK');
    console.log('✓ Transaction rolled back cleanly.');
  } finally {
    c.release();
    await pool.end();
  }

  console.log('All automated tests passed successfully!');
}

runTests().catch((err) => {
  console.error('Test run error:', err);
  process.exit(1);
});
