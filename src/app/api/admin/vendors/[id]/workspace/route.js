import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/agent-auth';
import { ensureAgentSchema } from '@/lib/agent-auth';
import { ensureServiceBookingSubcategorySchema } from '@/lib/booking-schema';

// Admin-only vendor workspace, matching the visibility already available for agents.
export async function GET(req, { params }) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    await Promise.all([ensureAgentSchema(), ensureServiceBookingSubcategorySchema()]);
    const { id } = await params;
    const [vendorResult, bookingsResult, crmLeadsResult] = await Promise.all([
      pool.query(
        `SELECT id, shop_name, email, phone, city, state, status, verification_status,
                is_approved, package_status, package_expires_at, created_at, updated_at
           FROM vendors WHERE id=$1`,
        [id]
      ),
      pool.query(
        `SELECT sb.id, sb.booking_reference, sb.status, sb.user_name, sb.user_phone,
                sb.service_address, sb.service_city, sb.booking_date, sb.booking_time,
                sb.service_subcategory, sb.service_description, sb.final_amount,
                sb.created_at, sb.accepted_at, sb.completed_at, qs.label AS service_label
           FROM service_bookings sb
           LEFT JOIN quick_services qs ON qs.id=sb.quick_service_id
          WHERE sb.vendor_id=$1
          ORDER BY COALESCE(sb.completed_at, sb.accepted_at, sb.created_at) DESC
          LIMIT 100`,
        [id]
      ),
      pool.query(
        `SELECT l.id, l.client_name, l.client_phone, l.client_email, l.city, l.service_type,
                l.lead_type, l.status, l.lead_stage, l.follow_up_date, l.client_requirement,
                l.notes, l.final_amount, l.updated_at, l.created_at,
                a.name AS agent_name
           FROM agent_leads l
           LEFT JOIN agents a ON a.id=l.agent_id
          WHERE l.assigned_vendor_id=$1
             OR (l.assigned_vendor_id IS NULL AND LOWER(TRIM(COALESCE(l.city,'')))=(SELECT LOWER(TRIM(COALESCE(city,''))) FROM vendors WHERE id=$1))
          ORDER BY l.updated_at DESC
          LIMIT 100`,
        [id]
      ),
    ]);
    const vendor = vendorResult.rows[0];
    if (!vendor) return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
    const bookings = bookingsResult.rows;
    const crmLeads = crmLeadsResult.rows;
    return NextResponse.json({
      success: true, vendor, bookings, crm_leads: crmLeads,
      counts: {
        total_bookings: bookings.length,
        active_bookings: bookings.filter((item) => ['VENDOR_ACCEPTED', 'VENDOR_ON_WAY', 'IN_PROGRESS', 'AWAITING_PAYMENT'].includes(item.status)).length,
        completed_bookings: bookings.filter((item) => item.status === 'COMPLETED').length,
        crm_leads: crmLeads.length,
      },
    });
  } catch (error) {
    console.error('Admin vendor workspace error:', error);
    return NextResponse.json({ success: false, error: 'Vendor workspace could not be loaded' }, { status: 500 });
  }
}
