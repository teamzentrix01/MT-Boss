import pool from '@/lib/db';
import { NextResponse } from 'next/server';

let ready = false;

const seedProducts = [
  ['Steel', 'Mandatory', 'TATA Steel', 'FE 500D, dia as per calculation (6MM-24MM), bottom painted', '', 'kg', 68, 1],
  ['Steel', 'Mandatory', 'SAIL', '<12% elongation, corrosion resistance, tensile strength <545N/mm2', '', 'kg', 65, 2],
  ['Steel', 'Mandatory', 'Rathi', 'Steel, dia as per calculation (6MM-24MM), moisture free', '', 'kg', 64, 3],
  ['Bricks', 'Mandatory', 'RED BRICK A', 'Uniform & regular, well burnt, <20% water absorbtion', '', 'piece', 9, 4],
  ['Bricks', 'Mandatory', 'FLY ASH BRICK', 'Uniform & regular, compressive strength >= 7 N/mm2, thermal conductivity ~0.81 Kw-M/C max.', '', 'piece', 11, 5],
  ['Cement', 'Mandatory', 'Lafarge Duraguard Concrete', 'R3B structure required, contains silicate, SPF technology', '', 'bag', 410, 6],
  ['Cement', 'Mandatory', 'Ultratech', 'Plain PPC cement, low heat of hydration, reduction in water demand', '', 'bag', 420, 7],
  ['Cement', 'Mandatory', 'ACC', 'Fine crystalline, ultimate higher strength, plasticity and drying shrinkage', '', 'bag', 405, 8],
  ['Cement', 'Mandatory', 'Lafarge PSC', 'The original sulphate, shine and smooth finish, class less than 90%', '', 'bag', 400, 9],
  ['Cement', 'Mandatory', 'Ambuja Roof Special', '100% silicate gel, SPF technology, denser-stronger-leak proof', '', 'bag', 430, 10],
  ['Cement', 'Mandatory', 'Ambuja Combo Cem', 'Scientific equilibrium, color-mineral orange, capacity 29.02 million tonnes', '', 'bag', 425, 11],
  ['Cement', 'Mandatory', 'Ambuja HDPE', 'Less CO2 production, dense micro structure, improved permeability and compatibility', '', 'bag', 415, 12],
  ['Cement', 'Mandatory', 'Bangur PPC', 'PPC cement, micro durable, moisture free', '', 'bag', 395, 13],
  ['Wiring', 'Recommended', 'Havells', 'Fire resistant wires and switches for home wiring', '', 'bundle', 2400, 14],
  ['Wiring', 'Recommended', 'Anchor', 'Wires and switch gear for residential projects', '', 'bundle', 2100, 15],
  ['Plumbing', 'Recommended', 'Ashirvad CPVC Pipes', 'High pressure CPVC plumbing pipes and fittings', '', 'set', 5200, 16],
  ['Plumbing', 'Recommended', 'Local CPVC Pipes', 'Standard CPVC pipes for water lines', '', 'set', 3800, 17],
  ['Putty', 'Putty', 'JK Wall Putty', 'Lifespan of the wall paint, not easy damaged, resistant to efflorescence', '', 'bag', 780, 18],
  ['Putty', 'Putty', 'Birla Wall Putty', 'Resistant to moisture, smooth finish, tensile more strength of the wall', '', 'bag', 820, 19],
  ['Putty', 'Putty', 'WalPlast Wall Putty', 'Whitest putty, excellent workability, strong bonding', '', 'bag', 760, 20],
  ['Paints', 'Paint', 'Dulux', 'Durability, anti-carbonation, amazing opacity', '', 'bucket', 2600, 21],
  ['Paints', 'Paint', 'Asian Paints', 'Specialty coatings, agrochemical, dynamic capabilities', '', 'bucket', 2850, 22],
  ['Paints', 'Paint', 'Nerolac', '7 bar film thickness, waterproof, 20X rain protection', '', 'bucket', 2750, 23],
  ['Window', 'Window', 'UPVC Window', 'White UPVC window with glazed glass', '', 'piece', 6500, 24],
  ['Door', 'Door', 'Main Flush Door', '36MM flush door for main entrance', '', 'piece', 7200, 25],
];

async function ensureTable() {
  if (ready) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS calculator_products (
      id SERIAL PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      badge VARCHAR(50) DEFAULT 'Recommended',
      name VARCHAR(200) NOT NULL,
      description TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      unit VARCHAR(50) DEFAULT 'unit',
      price NUMERIC(12,2) NOT NULL DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(
    `DELETE FROM calculator_products
     WHERE category = 'Cement'
       AND name IN ('Ultratech Cement', 'ACC Cement')`
  );

  await pool.query(
    `DELETE FROM calculator_products
     WHERE category = 'Bricks'
       AND name IN ('Red Brick A', 'Fly Ash Brick')`
  );

  await pool.query(
    `DELETE FROM calculator_products
     WHERE category = 'Paints'
       AND name IN ('Dulux Paint')`
  );

  for (const item of seedProducts) {
    const [category, , name] = item;
    const exists = await pool.query(
      'SELECT id FROM calculator_products WHERE LOWER(category)=LOWER($1) AND LOWER(name)=LOWER($2) LIMIT 1',
      [category, name]
    );

    if (exists.rows.length === 0) {
      await pool.query(
        `INSERT INTO calculator_products
          (category, badge, name, description, image_url, unit, price, sort_order, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,TRUE)`,
        item
      );
    } else {
      await pool.query(
        `UPDATE calculator_products
         SET badge=$1, description=$2, image_url=COALESCE(NULLIF(image_url, ''), $3),
             unit=$4, price=$5, sort_order=$6, updated_at=NOW()
         WHERE id=$7`,
        [item[1], item[3], item[4], item[5], item[6], item[7], exists.rows[0].id]
      );
    }
  }

  ready = true;
}

export async function GET(req) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';

    const result = await pool.query(
      `SELECT * FROM calculator_products
       ${isAdmin ? '' : 'WHERE is_active = TRUE'}
       ORDER BY sort_order ASC, id ASC`
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET calculator-products error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureTable();
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { category, badge, name, description, image_url, unit, price, is_active } = body;
    if (!category || !name || price === undefined || price === '') {
      return NextResponse.json({ error: 'Category, name and price are required' }, { status: 400 });
    }

    const { rows: [{ max }] } = await pool.query('SELECT COALESCE(MAX(sort_order),0) AS max FROM calculator_products');
    const result = await pool.query(
      `INSERT INTO calculator_products
        (category, badge, name, description, image_url, unit, price, sort_order, is_active, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW()) RETURNING *`,
      [
        category,
        badge || 'Recommended',
        name,
        description || '',
        image_url || '',
        unit || 'unit',
        parseFloat(price),
        parseInt(max) + 1,
        is_active ?? true,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST calculator-products error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await ensureTable();
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id, category, badge, name, description, image_url, unit, price, is_active } = body;
    if (!id || !category || !name || price === undefined || price === '') {
      return NextResponse.json({ error: 'ID, category, name and price are required' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE calculator_products
       SET category=$1, badge=$2, name=$3, description=$4, image_url=$5, unit=$6,
           price=$7, is_active=$8, updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [
        category,
        badge || 'Recommended',
        name,
        description || '',
        image_url || '',
        unit || 'unit',
        parseFloat(price),
        is_active ?? true,
        id,
      ]
    );

    if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('PUT calculator-products error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await ensureTable();
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const result = await pool.query('DELETE FROM calculator_products WHERE id=$1 RETURNING id', [id]);
    if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE calculator-products error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
