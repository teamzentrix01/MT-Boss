import { NextResponse } from 'next/server';
import { getServiceCities } from '@/lib/service-cities';

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const configuredCities = await getServiceCities(id);

    return NextResponse.json({
      success: true,
      cities: [...new Set(configuredCities.map(city => city.trim()).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b)),
    });
  } catch (error) {
    console.error('Error fetching cities for quick service:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
