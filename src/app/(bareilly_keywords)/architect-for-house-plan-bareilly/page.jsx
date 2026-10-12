// app/(bareilly_keywords)/architect-for-house-plan-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for House Plan in Bareilly',
  description:
    'Architect for house plan in Bareilly: floor plans, site plans, elevations and working drawings made for your plot. MTBOSS plans and builds. Call or WhatsApp.',
  keywords:
    'architect for house plan in Bareilly, house plan architect Bareilly, house map design Bareilly, floor plan architect Bareilly, site plan Bareilly, house elevation Bareilly, working drawings Bareilly, building plan Bareilly, home design Bareilly, MTBOSS Bareilly, architect near me Bareilly, house plan near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-house-plan-bareilly',
  },
  openGraph: {
    title: 'Architect for House Plan in Bareilly',
    description:
      'Architect for house plan in Bareilly: floor plans, site plans, elevations and working drawings made for your plot. MTBOSS plans and builds. Call or WhatsApp.',
    url: 'https://www.mtboss.in/architect-for-house-plan-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-for-house-plan-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for House Plan in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for House Plan in Bareilly',
    description:
      'Architect for house plan in Bareilly: floor plans, site plans, elevations and working drawings made for your plot. MTBOSS plans and builds. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-architect-for-house-plan-bareilly.jpg',
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
    url: 'https://www.mtboss.in/architect-for-house-plan-bareilly',
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