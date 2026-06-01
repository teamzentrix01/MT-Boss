import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

function getSupplier(req) {
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try { return jwt.verify(auth.slice(7), JWT_SECRET); } catch { return null; }
}

// Extract meaningful keywords (≥3 chars) from a string
function keywords(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3);
}

// True if any keyword from enquiry category matches any keyword from supplier category
function categoryMatches(enquiryCat, supplierCategories) {
  const eKw = new Set(keywords(enquiryCat));
  return supplierCategories.some(sc => keywords(sc).some(k => eKw.has(k)));
}

// True only when both cities are present and match (case-insensitive)
function cityMatches(enquiryCity, supplierCity) {
  if (!enquiryCity || !supplierCity) return false;
  return enquiryCity.trim().toLowerCase() === supplierCity.trim().toLowerCase();
}

export async function GET(req) {
  try {
    const decoded = getSupplier(req);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // Fetch this supplier's registered product categories and city from DB
    const supplierRes = await pool.query(
      `SELECT product_categories, is_active, city FROM suppliers WHERE id = $1`,
      [decoded.id]
    );
    if (supplierRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Supplier not found' }, { status: 404 });
    }

    const { product_categories, is_active, city: supplierCity } = supplierRes.rows[0];

    // Inactive suppliers see no new enquiries
    if (!is_active) {
      const mine = await pool.query(
        `SELECT me.*, s.shop_name AS accepted_by_shop
         FROM material_enquiries me
         LEFT JOIN suppliers s ON s.id = me.accepted_by_supplier_id
         WHERE me.accepted_by_supplier_id = $1
         ORDER BY me.created_at DESC`,
        [decoded.id]
      );
      return NextResponse.json({ success: true, data: { open: [], mine: mine.rows, taken: [] } });
    }

    const myCategories = product_categories || [];

    // If no categories selected, return empty open list
    if (myCategories.length === 0) {
      return NextResponse.json({ success: true, data: { open: [], mine: [], taken: [] } });
    }

    // Get all enquiries from the last 30 days
    const allRes = await pool.query(
      `SELECT me.*, s.shop_name AS accepted_by_shop
       FROM material_enquiries me
       LEFT JOIN suppliers s ON s.id = me.accepted_by_supplier_id
       WHERE me.created_at > NOW() - INTERVAL '30 days'
       ORDER BY me.created_at DESC`
    );

    const all = allRes.rows;

    const mine  = all.filter(e => e.accepted_by_supplier_id === decoded.id);
    const open  = all.filter(e =>
      e.status === 'open' &&
      categoryMatches(e.category_name, myCategories) &&
      cityMatches(e.selected_city, supplierCity)
    );
    const taken = all.filter(e =>
      e.status === 'accepted' &&
      e.accepted_by_supplier_id !== decoded.id &&
      categoryMatches(e.category_name, myCategories) &&
      cityMatches(e.selected_city, supplierCity)
    );

    return NextResponse.json({ success: true, data: { open, mine, taken } });
  } catch (err) {
    console.error('GET supplier/enquiries error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
