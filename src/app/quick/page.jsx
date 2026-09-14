// app/quick/page.jsx
import QuickServicesClient from './QuickServicesClient';

export const metadata = {
  title: 'MTBOSS | Quick Home Services - Electrician, Plumber, AC Repair & More',
  description:
    'Book trusted home service professionals instantly — electrician, plumber, AC repair, pest control, carpenter, and 15+ more services. Verified technicians at your doorstep.',
  keywords:
    'home services near me, electrician near me, plumber near me, AC repair near me, pest control near me, carpenter near me, home repair services, doorstep home services',
  alternates: {
    canonical: 'https://www.mtboss.in/quick',
  },
  openGraph: {
    title: 'MTBOSS | Quick Home Services - Book Trusted Professionals Instantly',
    description:
      'Electrician, plumber, AC repair, pest control & 15+ more home services — verified technicians at your doorstep.',
    url: 'https://www.mtboss.in/quick',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/icon.png',
        width: 1200,
        height: 630,
        alt: 'Quick Home Services - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MTBOSS | Quick Home Services - Book Trusted Professionals Instantly',
    description:
      'Electrician, plumber, AC repair, pest control & 15+ more home services — verified technicians at your doorstep.',
    images: ['https://www.mtboss.in/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const quickServicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Home & Building Services',
  provider: {
    '@type': 'GeneralContractor',
    name: 'MTBOSS Construction Private Limited',
  },
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

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quickServicesSchema) }}
      />
      <QuickServicesClient />
    </>
  );
}