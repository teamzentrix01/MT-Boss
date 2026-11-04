import { NextResponse } from 'next/server';
import { getManagedCities } from '@/lib/cities';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json(
        { success: false, error: 'Latitude and Longitude are required' },
        { status: 400 }
      );
    }

    // Fetch managed cities from DB
    const managedCities = await getManagedCities({ includeInactive: false }).catch(() => []);
    const supportedCityNames = managedCities.map((c) => c.name);

    let detectedCity = '';
    let district = '';
    let state = '';
    let pincode = '';
    let rawAddress = null;

    try {
      // Free OpenStreetMap Nominatim reverse geocode
      const osmRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
          lat
        )}&lon=${encodeURIComponent(lng)}&zoom=12&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'MTBOSS-Shop-LocationService/1.0',
            'Accept-Language': 'en',
          },
          signal: AbortSignal.timeout(6000),
        }
      );

      if (osmRes.ok) {
        const osmData = await osmRes.json();
        rawAddress = osmData.address || {};
        detectedCity =
          rawAddress.city ||
          rawAddress.town ||
          rawAddress.village ||
          rawAddress.municipality ||
          rawAddress.suburb ||
          rawAddress.state_district ||
          rawAddress.county ||
          '';
        district = rawAddress.state_district || rawAddress.county || '';
        state = rawAddress.state || '';
        pincode = rawAddress.postcode || '';
      }
    } catch (fetchErr) {
      console.warn('Reverse geocode provider timeout/failed:', fetchErr?.message);
    }

    // Match detected city or district with our managed cities (case-insensitive)
    const norm = (str) => String(str || '').trim().toLowerCase();
    const cleanDetected = norm(detectedCity);
    const cleanDistrict = norm(district);

    let matchedCity = null;

    if (cleanDetected || cleanDistrict) {
      // 1. Exact match
      matchedCity = supportedCityNames.find(
        (c) => norm(c) === cleanDetected || norm(c) === cleanDistrict
      );

      // 2. Contains match (e.g. "Moradabad Division" -> "Moradabad")
      if (!matchedCity) {
        matchedCity = supportedCityNames.find(
          (c) => cleanDetected.includes(norm(c)) || cleanDistrict.includes(norm(c)) || norm(c).includes(cleanDetected)
        );
      }
    }

    return NextResponse.json({
      success: true,
      city: matchedCity || detectedCity || '',
      matchedCity: matchedCity || null,
      isSupported: Boolean(matchedCity),
      district,
      state,
      pincode,
      supportedCities: supportedCityNames,
    });
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

