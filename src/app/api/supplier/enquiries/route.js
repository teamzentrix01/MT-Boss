import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ensurePackageSchema } from '@/lib/packages';
import { materialCategoryMatches, materialLeadStartAt } from '@/lib/material-lead-matching';

function getSupplier(req) {
  return requireRole(req, 'supplier');
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
    await ensurePackageSchema();

    // Fetch this supplier's registered product categories and city from DB
    const supplierRes = await pool.query(
      `SELECT product_categories, is_active, city, package_status, package_duration_months,
              package_purchased_at, package_starts_at, package_expires_at, created_at
       FROM suppliers WHERE id = $1`,
      [decoded.id]
    );
    if (supplierRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Supplier not found' }, { status: 404 });
    }

    const {
      product_categories,
      is_active,
      city: supplierCity,
      package_status,
      package_duration_months,
      package_purchased_at,
      package_starts_at,
      package_expires_at,
      created_at,
    } = supplierRes.rows[0];
    const packageActive = package_status === 'active'
      && (!package_expires_at || new Date(package_expires_at) > new Date());
    const leadStartAt = materialLeadStartAt({
      package_starts_at,
      package_purchased_at,
      package_expires_at,
      package_duration_months,
      created_at,
    });

    // Inactive/unpaid suppliers see no new enquiries.
    if (!is_active || !packageActive) {
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

    // Paid suppliers only see material enquiries created after their package started.
    const allRes = await pool.query(
      `SELECT me.*, s.shop_name AS accepted_by_shop
       FROM material_enquiries me
       LEFT JOIN suppliers s ON s.id = me.accepted_by_supplier_id
       WHERE me.created_at >= $1
       ORDER BY me.created_at DESC`,
      [leadStartAt]
    );

    const all = allRes.rows;

    const mine  = all.filter(e => e.accepted_by_supplier_id === decoded.id);
    const open  = all.filter(e =>
      e.status === 'open' &&
      materialCategoryMatches(e.category_name, myCategories) &&
      cityMatches(e.selected_city, supplierCity)
    );
    const taken = all.filter(e =>
      e.status === 'accepted' &&
      e.accepted_by_supplier_id !== decoded.id &&
      materialCategoryMatches(e.category_name, myCategories) &&
      cityMatches(e.selected_city, supplierCity)
    );

    return NextResponse.json({ success: true, data: { open, mine, taken } });
  } catch (err) {
    console.error('GET supplier/enquiries error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
