// app/(bareilly_keywords)/building-contractor-near-me-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Building Contractor Near Me in Bareilly | Local Site Visits | MTBOSS',
  description:
    'Looking for a building contractor near you in Bareilly? MTBOSS serves Bareilly and Moradabad for houses and commercial buildings. Share your plot details and book a site visit.',
  keywords:
    'building contractor near me in Bareilly, building contractor near Bareilly, local building contractor Bareilly, building contractor Bareilly, construction company near me Bareilly, house construction contractor Bareilly, commercial building contractor Bareilly, building renovation Bareilly, building repair Bareilly, waterproofing Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/building-contractor-near-me-in-bareilly',
  },
  openGraph: {
    title:
      'Building Contractor Near Me in Bareilly | Local Site Visits | MTBOSS',
    description:
      'Looking for a building contractor near you in Bareilly? MTBOSS serves Bareilly and Moradabad for houses and commercial buildings. Share your plot details and book a site visit.',
    url: 'https://www.mtboss.in/building-contractor-near-me-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-building-contractor-near-me-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Building Contractor Near Me in Bareilly - Local Site Visits - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Building Contractor Near Me in Bareilly | Local Site Visits | MTBOSS',
    description:
      'Looking for a building contractor near you in Bareilly? MTBOSS serves Bareilly and Moradabad for houses and commercial buildings. Share your plot details and book a site visit.',
    images: [
      'https://www.mtboss.in/og-building-contractor-near-me-in-bareilly.jpg',
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: 'MTBOSS Construction Private Limited',
    url: 'https://www.mtboss.in/building-contractor-near-me-in-bareilly',
    telephone: '+91-9458410866',
    email: 'mtboss2016@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        "Harthala Kanth Road, Behind Kr Collection, near Domino's",
      addressLocality: 'Moradabad',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: 'Bareilly',
    },
    priceRange: '₹₹',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Banner />
      <Content />
      <QuickServices />
      <Services />
      <CalculatorCTA />
    </>
  );
}