import { NextResponse } from 'next/server';

// Legacy booking creation used to create vendor-visible jobs without verified
// payment. Keep the route closed so old clients cannot bypass the PayU flow.
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'This booking endpoint has been retired. Use /api/bookings/create and complete verified payment.',
      code: 'PAYMENT_REQUIRED_BOOKING_FLOW',
    },
    { status: 410 }
  );
}
