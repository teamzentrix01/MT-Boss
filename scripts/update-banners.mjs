import pool from '../src/lib/db.js';

const banners = [
  {
    id: 4,
    service_name: 'Construction',
    label: 'PLANNING TO COMPLETION',
    title: 'Your vision.',
    subtitle: 'Built to last.',
    description: 'Bring your residential, commercial or industrial project to life with engineering excellence and timely delivery.',
    image_url: '/images/banners/construction.jpg',
    image_alt: 'Construction engineering and modern architecture',
    image_position: 'center',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 3,
    service_name: 'Home Services',
    label: 'CARE FOR EVERY CORNER',
    title: 'A better home.',
    subtitle: 'One service away.',
    description: 'From electrical repairs and plumbing to professional painting, get verified technicians at your doorstep in minutes.',
    image_url: '/images/banners/home-services.jpg',
    image_alt: 'Professional home maintenance and electrical services',
    image_position: 'center',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 5,
    service_name: 'Materials',
    label: 'ESSENTIALS FOR EVERY BUILD',
    title: 'The right materials.',
    subtitle: 'A stronger start.',
    description: 'Direct wholesale supply of cement, TMT steel bars, bricks, tiles and paints at best competitive market prices.',
    image_url: '/images/banners/materials.jpg',
    image_alt: 'Building materials, cement, bricks and steel supplies',
    image_position: 'center',
    sort_order: 3,
    is_active: true,
  },
  {
    id: 6,
    service_name: 'Property',
    label: 'BUY, SELL & RENT',
    title: 'Your next chapter.',
    subtitle: 'Your next property.',
    description: 'Discover verified residential flats, commercial properties and plots, or list your property across India with MTBOSS.',
    image_url: '/images/banners/property.jpg',
    image_alt: 'Luxury real estate villa and modern residential property',
    image_position: 'center',
    sort_order: 4,
    is_active: true,
  },

];

async function main() {
  for (const b of banners) {
    await pool.query(
      `UPDATE hero_banners
       SET service_name = $1, label = $2, title = $3, subtitle = $4,
           description = $5, image_url = $6, image_alt = $7,
           image_position = $8, sort_order = $9, is_active = $10, updated_at = NOW()
       WHERE id = $11`,
      [b.service_name, b.label, b.title, b.subtitle, b.description, b.image_url, b.image_alt, b.image_position, b.sort_order, b.is_active, b.id]
    );
  }
  const res = await pool.query('SELECT id, service_name, image_url, is_active FROM hero_banners WHERE is_active = true ORDER BY sort_order');
  console.log('Successfully updated banners in database:');
  console.log(res.rows);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
