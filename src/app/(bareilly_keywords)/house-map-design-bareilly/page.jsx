// app/(bareilly_keywords)/house-map-design-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'House Map Design in Bareilly | MTBoss',
  description:
    'Need a house map design in Bareilly? MTBoss plans rooms, stairs and parking for your plot, prepares approval maps and working drawings, and builds if you choose.',
  keywords:
    'house map design in Bareilly, house map design Bareilly, house plan design Bareilly, house naksha design Bareilly, naksha design Bareilly, house map architect Bareilly, floor plan design Bareilly, house layout plan Bareilly, house map for approval Bareilly, house plan architect near me Bareilly, MTBoss Bareilly, house map design in Bareilly',
  alternates: {
    canonical:
      'https://www.MTBoss.in/house-map-design-in-bareilly',
  },
  openGraph: {
    title: 'House Map Design in Bareilly | MTBoss',
    description:
      'Need a house map design in Bareilly? MTBoss plans rooms, stairs and parking for your plot, prepares approval maps and working drawings, and builds if you choose.',
    url: 'https://www.MTBoss.in/house-map-design-in-bareilly',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-house-map-design-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'House Map Design in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House Map Design in Bareilly | MTBoss',
    description:
      'Need a house map design in Bareilly? MTBoss plans rooms, stairs and parking for your plot, prepares approval maps and working drawings, and builds if you choose.',
    images: [
      'https://www.MTBoss.in/og-house-map-design-in-bareilly.jpg',
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
    name: 'MTBoss Construction Private Limited',
    url: 'https://www.MTBoss.in/house-map-design-in-bareilly',
    telephone: '+91-9458410866',
    email: 'MTBoss2016@gmail.com',
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