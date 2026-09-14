import React from 'react';
import Hero from './components/Hero';
// import AboutSection from './components/About';
import Services from './components/Services';
import QuickServices from './components/QuickServices';
import PropertyCTA from './components/PropertyCTA';
import AgentCTA from './components/AgentCTA';
import FranchiseCTA from './components/FranchiseCTA';
import ShopCTA from './components/ShopCTA';
import CalculatorCTA from './components/CalculatorCTA';
// import TestimonialsSection from './components/Testimonal';
import FeaturedProjects from './components/FeaturedProjects';
import ExperienceSection from './components/ExperienceSection';

// ---------- METADATA ----------
export const metadata = {
  title: 'MTBOSS | Best Construction, Property & Materials Company in Moradabad',
  description:
    'MTBOSS offers construction, doorstep home services (electrician, plumber, AC repair, pest control & more), verified property buy/sell/rent, and building materials - trusted by homeowners near you. Book instantly, get quotes fast.',
  keywords:
    'construction company near me, home services near me, electrician plumber near me, AC repair near me, pest control near me, building renovation near me, water tank cleaning near me, buy sell rent property near me, building materials online, construction cost calculator, contractor near me',
  alternates: {
    canonical: 'https://www.mtboss.in/',
  },
  openGraph: {
    title: 'MTBOSS | Best Construction, Property & Materials Company in Moradabad',
    description:
      'Construction quotes, doorstep home services, verified properties, and wholesale materials — trusted by homeowners near you.',
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
    title: 'MTBOSS | Best Construction, Property & Materials Company in Moradabad',
    description:
      'Construction quotes, doorstep home services, verified properties, and wholesale materials — trusted by homeowners near you.',
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

// ---------- PAGE ----------
const Page = () => {
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

      <Hero />
      {/* <AboutSection /> */}
      <QuickServices />
      <Services />
      <CalculatorCTA />
      <ShopCTA />
      <PropertyCTA />
      <FranchiseCTA />
      <AgentCTA />
      <FeaturedProjects />
      <ExperienceSection />
      {/* <TestimonialsSection /> */}
    </div>
  );
};

export default Page;