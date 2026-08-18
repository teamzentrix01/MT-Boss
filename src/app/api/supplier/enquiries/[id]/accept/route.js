import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendEnquiryAcceptedEmail } from '@/lib/email';
import { requireRole } from '@/lib/auth';
import { addMaterialOrderEvent, ensureMaterialOrderSchema } from '@/lib/material-orders';
import { ensurePackageSchema } from '@/lib/packages';

function getSupplier(req) {
  return requireRole(req, 'supplier');
}

export async function POST(req, { params }) {
  try {
    const decoded = getSupplier(req);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await ensureMaterialOrderSchema();
    await ensurePackageSchema();

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const supplierCheck = await client.query(
        `SELECT id, product_categories, city, is_active, package_status, package_starts_at, package_expires_at
           FROM suppliers
          WHERE id = $1
            AND is_active = TRUE
            AND package_status = 'active'
            AND package_starts_at IS NOT NULL
            AND package_expires_at > NOW()
          FOR UPDATE`,
        [decoded.id]
      );
      if (!supplierCheck.rows[0]) {
        await client.query('ROLLBACK');
        return NextResponse.json({
          success: false,
          error: 'Active supplier package required before accepting material enquiries',
          package_required: true,
        }, { status: 403 });
      }

      // Lock and check the enquiry
      const check = await client.query(
        `SELECT * FROM material_enquiries WHERE id = $1 FOR UPDATE`,
        [id]
      );
      if (check.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
      }

      const enquiry = check.rows[0];
      const supplier = supplierCheck.rows[0];
      const supplierCity = String(supplier.city || '').trim().toLowerCase();
      const enquiryCity = String(enquiry.selected_city || '').trim().toLowerCase();
      const enquiryWords = new Set(
        String(enquiry.category_name || '')
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((word) => word.length >= 3)
      );
      const categoryAllowed = (supplier.product_categories || []).some((category) => (
        String(category || '')
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((word) => word.length >= 3)
          .some((word) => enquiryWords.has(word))
      ));
      if (
        new Date(enquiry.created_at) < new Date(supplier.package_starts_at)
        || !supplierCity
        || supplierCity !== enquiryCity
        || !categoryAllowed
      ) {
        await client.query('ROLLBACK');
        return NextResponse.json({
          success: false,
          error: 'This material enquiry is not available for your package, city or categories',
        }, { status: 403 });
      }
      if (enquiry.status !== 'open') {
        await client.query('ROLLBACK');
        return NextResponse.json({
          success: false,
          error: enquiry.accepted_by_supplier_id === decoded.id
            ? 'You already accepted this enquiry'
            : 'This enquiry has already been accepted by another supplier',
          already_taken: true,
        }, { status: 409 });
      }

      // Accept it
      const result = await client.query(
        `UPDATE material_enquiries
         SET status = 'accepted', accepted_by_supplier_id = $1,
             assigned_role = 'supplier', assigned_entity_id = $1,
             accepted_at = NOW(), updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [decoded.id, id]
      );
      await addMaterialOrderEvent(client, {
        orderId: id,
        status: 'accepted',
        title: 'Accepted by supplier',
        note: 'A supplier has accepted this material order.',
        actorRole: 'supplier',
        actorId: decoded.id,
        actorName: decoded.shop_name || decoded.email || 'Supplier',
      });

      await client.query('COMMIT');

      // Send email to user (non-blocking)
      if (enquiry.user_email) {
        sendEnquiryAcceptedEmail({
          to: enquiry.user_email,
          userName: enquiry.user_name,
          shopName: decoded.shop_name,
          categoryName: enquiry.category_name,
          phone: enquiry.user_phone,
        }).catch(err => console.warn('Email send failed (non-critical):', err.message));
      }

      return NextResponse.json({ success: true, message: 'Enquiry accepted', data: result.rows[0] });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Accept enquiry error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
