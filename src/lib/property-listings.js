import pool from '@/lib/db';
import { createInitializationGuard } from '@/lib/api-utils';

export const PROPERTY_CATEGORIES = ['room_rent', 'flat', 'plot', 'general'];

export const ensurePropertyListingSchema = createInitializationGuard(async () => {
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS area_unit VARCHAR(20) NOT NULL DEFAULT 'sqft'`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS lister_user_id INTEGER`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS tracking_token VARCHAR(64)`);
  await pool.query(`ALTER TABLE properties ALTER COLUMN status SET DEFAULT 'pending'`);
  await pool.query(`UPDATE properties SET tracking_token = CONCAT('PROP-', id, '-', SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)) WHERE tracking_token IS NULL`);
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS properties_tracking_token_idx ON properties (tracking_token)`);

  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_category VARCHAR(30) NOT NULL DEFAULT 'general'`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS details JSONB NOT NULL DEFAULT '{}'::jsonb`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS amenities JSONB NOT NULL DEFAULT '[]'::jsonb`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_places JSONB NOT NULL DEFAULT '[]'::jsonb`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS security_deposit NUMERIC(14,2)`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS locality VARCHAR(120)`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS state VARCHAR(120)`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20)`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS available_from DATE`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS furnishing VARCHAR(40)`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS floor_plans JSONB NOT NULL DEFAULT '[]'::jsonb`);
  await pool.query(`ALTER TABLE properties ADD COLUMN IF NOT EXISTS documents JSONB NOT NULL DEFAULT '[]'::jsonb`);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_properties_category ON properties (property_category)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_properties_status_category ON properties (status, property_category)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_properties_status_created ON properties (status, created_at DESC)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_properties_listing_status ON properties (listing_type, status)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_properties_price_raw ON properties (price_raw)`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS property_bookings (
      id SERIAL PRIMARY KEY,
      property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(20) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE,
      duration_months INTEGER,
      message TEXT,
      status VARCHAR(30) NOT NULL DEFAULT 'requested',
      admin_notes TEXT,
      reviewed_by INTEGER,
      reviewed_at TIMESTAMP WITHOUT TIME ZONE,
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_property_bookings_property ON property_bookings (property_id)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_property_bookings_user ON property_bookings (user_id)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_property_bookings_status ON property_bookings (status)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_property_bookings_created ON property_bookings (created_at DESC)`);
});

export function normalizeCategory(value) {
  const c = String(value || '').trim().toLowerCase();
  if (PROPERTY_CATEGORIES.includes(c)) return c;
  return null;
}

export function parseJsonField(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function normalizeAmenities(input) {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .map((item) => {
        if (typeof item === 'string') return { name: item.trim(), enabled: true };
        if (item && typeof item === 'object') {
          return {
            name: String(item.name || item.label || '').trim(),
            enabled: item.enabled !== false,
            icon: item.icon || null,
          };
        }
        return null;
      })
      .filter((item) => item && item.name);
  }
  return [];
}

export function normalizeNearbyPlaces(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => ({
      type: String(item.type || item.category || 'landmark').trim(),
      name: String(item.name || '').trim(),
      distance_km: item.distance_km != null ? Number(item.distance_km) : item.distance != null ? Number(item.distance) : null,
      notes: item.notes ? String(item.notes) : null,
    }))
    .filter((item) => item.name);
}

export function coerceDetails(category, details = {}) {
  const d = details && typeof details === 'object' ? { ...details } : {};
  if (category === 'room_rent') {
    return {
      room_type: d.room_type || d.accommodation_type || null,
      rooms_count: d.rooms_count != null ? Number(d.rooms_count) : null,
      bathrooms: d.bathrooms != null ? Number(d.bathrooms) : null,
      suitable_for: d.suitable_for || null,
      food_available: Boolean(d.food_available),
      food_type: d.food_type || null,
      electricity_charges: d.electricity_charges || null,
      water_charges: d.water_charges || null,
      maintenance_charges: d.maintenance_charges || null,
      house_rules: d.house_rules || null,
      rental_conditions: d.rental_conditions || null,
      video_url: d.video_url || null,
      ...d,
    };
  }
  if (category === 'flat') {
    return {
      bhk_config: d.bhk_config || d.configuration || null,
      carpet_area: d.carpet_area != null ? Number(d.carpet_area) : null,
      builtup_area: d.builtup_area != null ? Number(d.builtup_area) : null,
      area_unit: d.area_unit || 'sqft',
      bedrooms: d.bedrooms != null ? Number(d.bedrooms) : null,
      bathrooms: d.bathrooms != null ? Number(d.bathrooms) : null,
      balconies: d.balconies != null ? Number(d.balconies) : null,
      parking_spaces: d.parking_spaces != null ? Number(d.parking_spaces) : null,
      floor_number: d.floor_number != null ? Number(d.floor_number) : null,
      total_floors: d.total_floors != null ? Number(d.total_floors) : null,
      property_age: d.property_age || null,
      possession_status: d.possession_status || null,
      ...d,
    };
  }
  if (category === 'plot') {
    return {
      plot_category: d.plot_category || d.intended_use || null,
      plot_area: d.plot_area != null ? Number(d.plot_area) : null,
      area_unit: d.area_unit || 'sqft',
      length: d.length != null ? Number(d.length) : null,
      width: d.width != null ? Number(d.width) : null,
      price_per_unit: d.price_per_unit != null ? Number(d.price_per_unit) : null,
      price_negotiable: Boolean(d.price_negotiable),
      road_access: d.road_access || null,
      road_width: d.road_width || null,
      facing: d.facing || null,
      boundary_wall: Boolean(d.boundary_wall),
      development_status: d.development_status || null,
      water: Boolean(d.water),
      electricity: Boolean(d.electricity),
      drainage: Boolean(d.drainage),
      ...d,
    };
  }
  return d;
}

export function defaultTypeForCategory(category) {
  if (category === 'room_rent') return 'Room Rent';
  if (category === 'flat') return 'Apartment';
  if (category === 'plot') return 'Plots';
  return 'Residential';
}

export function defaultListingType(category, listingType) {
  if (listingType === 'buy' || listingType === 'rent') return listingType;
  if (category === 'room_rent') return 'rent';
  if (category === 'plot') return 'buy';
  return 'buy';
}

/** Overlap: [startA, endA) vs [startB, endB). Null end = open-ended / long-term. */
export function datesOverlap(startA, endA, startB, endB) {
  const aStart = new Date(startA);
  const bStart = new Date(startB);
  const aEnd = endA ? new Date(endA) : new Date('9999-12-31');
  const bEnd = endB ? new Date(endB) : new Date('9999-12-31');
  return aStart < bEnd && bStart < aEnd;
}
