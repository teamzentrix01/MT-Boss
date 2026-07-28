import pool from '@/lib/db';

let subcategorySchemaPromise;

export function ensureServiceBookingSubcategorySchema() {
  if (!subcategorySchemaPromise) {
    subcategorySchemaPromise = pool.query(`
      ALTER TABLE service_bookings
      ADD COLUMN IF NOT EXISTS service_subcategory VARCHAR(200)
    `).catch((error) => {
      subcategorySchemaPromise = undefined;
      throw error;
    });
  }

  return subcategorySchemaPromise;
}
