import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { getCustomerProfile } from '@/lib/orders-history';

export async function GET(req, { params }) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) return unauthorized();

    const { id } = await params;
    const profile = await getCustomerProfile(id);

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error('Error fetching customer profile:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch customer profile' },
      { status: 500 }
    );
  }
}
