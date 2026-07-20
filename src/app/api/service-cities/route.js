import { NextResponse } from 'next/server';
import { getCityServiceCoverage, getServiceCities } from '@/lib/service-cities';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('service_id');
    if (!serviceId) {
      const coverage = await getCityServiceCoverage();
      return NextResponse.json({ success: true, ...coverage });
    }
    const cities = await getServiceCities(serviceId || undefined);
    return NextResponse.json({ success: true, cities });
  } catch (error) {
    console.error('Service cities fetch error:', error);
    return NextResponse.json({ success: false, error: 'Could not load service cities' }, { status: 500 });
  }
}
