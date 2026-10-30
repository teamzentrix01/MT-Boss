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

async function testOldProductionConstraintFallback() {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');

    // Create a temporary table with the exact OLD constraint that was on main
    await c.query(`
      CREATE TEMP TABLE test_pm_other_expenses (
        id BIGSERIAL PRIMARY KEY,
        category VARCHAR(30) NOT NULL CHECK(category IN ('transport','machine_rent','electricity_water','permit','misc')),
        amount NUMERIC(14,2) NOT NULL,
        note TEXT
      )
    `);

    const cat = 'rent';
    const amt = 1000;
    const storedNote = '[Item: generator]';

    let r;
    await c.query('SAVEPOINT oe_insert');
    try {
      r = await c.query(
        `INSERT INTO test_pm_other_expenses(category, amount, note)
         VALUES ($1,$2,$3) RETURNING *`,
        [cat, amt, storedNote]
      );
      await c.query('RELEASE SAVEPOINT oe_insert');
    } catch (insertErr) {
      console.log('Caught expected check constraint violation code:', insertErr.code, insertErr.message);
      if (
        insertErr &&
        (insertErr.code === '23514' ||
          (insertErr.message && insertErr.message.includes('test_pm_other_expenses_category_check')))
      ) {
        await c.query('ROLLBACK TO SAVEPOINT oe_insert');
        const fallbackCat = cat === 'rent' ? 'machine_rent' : 'misc';
        const fallbackNote = `[Category: ${cat}] ${storedNote || ''}`.trim();
        r = await c.query(
          `INSERT INTO test_pm_other_expenses(category, amount, note)
           VALUES ($1,$2,$3) RETURNING *`,
          [fallbackCat, amt, fallbackNote]
        );
      } else {
        throw insertErr;
      }
    }

    console.log('Stored row with fallback in DB:', r.rows[0]);
    const parsed = parseExpenseData(r.rows[0]);
    console.log('Parsed for user display:', parsed);

    if (parsed.category !== 'rent' || parsed.item_name !== 'generator') {
      throw new Error('Fallback failed to parse properly');
    }

    await c.query('ROLLBACK');
    console.log('✓ Success! Even with the old production constraint active, the savepoint fallback saved the record without error and parsed it seamlessly.');
  } finally {
    c.release();
    await pool.end();
  }
}

testOldProductionConstraintFallback().catch((e) => {
  console.error(e);
  process.exit(1);
});
