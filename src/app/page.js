import React from 'react';
import Hero from './components/Hero';
// import AboutSection from './components/About';
import Services from './components/Services';
import QuickServices from './components/QuickServices';
// import TestimonialsSection from './components/Testimonal';\r
import DeferredHomeSections from './components/DeferredHomeSections';
import { defaultHeroBanners, CONSTRUCTION_HERO_IMAGE_URL } from '@/lib/hero-banner-defaults.mjs';

// ---------- METADATA ----------
export const metadata = {
  title: 'Best Architect, Interior Designer & Construction Company in Moradabad & Bareilly | MTBOSS',
  description:
    'MTBOSS - architect & interior designer and construction company offering modular kitchen and waterproofing experts in Moradabad & Bareilly. Quality work, transparent pricing, on-time delivery.',
  keywords:
    'construction company near me, home services near me, electrician plumber near me, AC repair near me, pest control near me, building renovation near me, water tank cleaning near me, buy sell rent property near me, building materials online, construction cost calculator, contractor near me',
  alternates: {
    canonical: 'https://www.mtboss.in/',
  },
  openGraph: {
    title: 'Best Architect, Interior Designer & Construction Company in Moradabad & Bareilly | MTBOSS',
    description:
      'MTBOSS - architect & interior designer and construction company offering modular kitchen and waterproofing experts in Moradabad & Bareilly. Quality work, transparent pricing, on-time delivery.',
    url: 'https://www.mtboss.in/',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/icon.png',
        width: 1200,
        height: 630,
        alt: 'MTBOSS - Construction, Home Services & Property',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Architect, Interior Designer & Construction Company in Moradabad & Bareilly | MTBOSS',
    description:
      'MTBOSS - architect & interior designer and construction company offering modular kitchen and waterproofing experts in Moradabad & Bareilly. Quality work, transparent pricing, on-time delivery.',
    images: ['https://www.mtboss.in/icon.png'],
  },
};

// ---------- JSON-LD SCHEMA ----------
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'MTBOSS Construction Private Limited',
  url: 'https://www.mtboss.in/',
  logo: 'https://www.mtboss.in/logo.png',
  telephone: '+91-9458410866',
  email: 'mtboss2016@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
    addressLocality: 'Moradabad',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
    postalCode: '244001',
  },
  areaServed: [
    { '@type': 'City', name: 'Moradabad' },
    { '@type': 'City', name: 'Rampur' },
    { '@type': 'City', name: 'Bilari' },
  ],
  sameAs: [
    'https://www.facebook.com/share/19QJ3uZKtq/',
    'https://www.instagram.com/mtboss.in',
    'https://in.linkedin.com/company/mtboss-construction-company',
    'https://x.com/mtboss',
    'https://youtube.com/@mtbossconstruction4906',
  ],
};

const homeServicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Home & Building Services',
  provider: {
    '@type': 'GeneralContractor',
    name: 'MTBOSS Construction Private Limited',
  },
  areaServed: [
    { '@type': 'City', name: 'Moradabad' },
    { '@type': 'City', name: 'Rampur' },
    { '@type': 'City', name: 'Bilari' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Quick Home Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Building Contractor' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Carpenter' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AC Repair' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Door & Window Installation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Wallpaper Installation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Readymade Boundary' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'HVAC Installation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Water Proofing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Building Renovation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pest Control' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Building Repair' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Electrician' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Plumber' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Tile & Marble Work' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'False Ceiling' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'PVC Panel Installation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Interior Repair' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Furniture Repair' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bathroom Cleaning' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Water Tank Cleaning' } },
    ],
  },
};

// ---------- SERVER-SIDE BANNER FETCH ----------
// Directly queries the DB at render time so ALL slides (including 5th) are
// embedded in the HTML — zero client-side delay, zero layout shift.
async function getHeroBanners() {
  try {
    // Dynamic import keeps the DB pool out of the client bundle
    const { default: pool } = await import('@/lib/db');
    const result = await pool.query(
      'SELECT * FROM hero_banners WHERE is_active = true ORDER BY sort_order ASC, id ASC'
    );
    if (result.rows.length > 0) {
      return result.rows.map(banner =>
        banner.service_name?.trim().toLowerCase() === 'construction'
          ? { ...banner, image_url: CONSTRUCTION_HERO_IMAGE_URL, cloudinary_public_id: '' }
          : banner
      );
    }
    return defaultHeroBanners;
  } catch {
    return defaultHeroBanners;
  }
}

// ---------- SERVER-SIDE QUICK SERVICES FETCH ----------
async function getQuickServices() {
  try {
    const { default: pool } = await import('@/lib/db');
    let result;
    try {
      result = await pool.query(
        'SELECT * FROM quick_services ORDER BY COALESCE(sort_order, 0) ASC, id ASC'
      );
    } catch {
      result = await pool.query('SELECT * FROM quick_services ORDER BY id ASC');
    }
    if (result.rows.length > 0) {
      return result.rows;
    }
    const { fallbackQuickServices } = await import('@/lib/public-fallbacks');
    return fallbackQuickServices;
  } catch {
    const { fallbackQuickServices } = await import('@/lib/public-fallbacks');
    return fallbackQuickServices;
  }
}

// ---------- PAGE ----------
const Page = async () => {
  // Pre-fetch banners on the server so the Hero renders all slides instantly.
  const heroBanners = await getHeroBanners();
  const quickServices = await getQuickServices();

  return (
    <div className="transition-colors duration-500">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeServicesSchema) }}
      />

      <Hero initialBanners={heroBanners} />
      {/* <AboutSection /> */}
      <QuickServices initialServices={quickServices} />
      <Services />
      <DeferredHomeSections />
      {/* <TestimonialsSection /> */}
    </div>
  );
};

export default Page;

