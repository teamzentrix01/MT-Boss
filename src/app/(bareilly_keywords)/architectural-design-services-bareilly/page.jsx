// app/(bareilly_keywords)/architectural-design-services-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architectural Design Services in Bareilly | MTBoss',
  description:
    'Need architectural design services in Bareilly? MTBoss offers plans, elevations, interiors and approval-ready drawings for homes, shops and industrial buildings.',
  keywords:
    'architectural design services in Bareilly, architect in Bareilly, architecture design Bareilly, house design Bareilly, home plan Bareilly, building plan Bareilly, elevation design Bareilly, interior design Bareilly, approval drawing Bareilly, working drawing Bareilly, construction drawing Bareilly, architectural services Bareilly, MTBoss Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/architectural-design-services-in-bareilly',
  },
  openGraph: {
    title: 'Architectural Design Services in Bareilly | MTBoss',
    description:
      'Need architectural design services in Bareilly? MTBoss offers plans, elevations, interiors and approval-ready drawings for homes, shops and industrial buildings.',
    url:
      'https://www.mtboss.in/architectural-design-services-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-architectural-design-services-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architectural Design Services in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architectural Design Services in Bareilly | MTBoss',
    description:
      'Need architectural design services in Bareilly? MTBoss offers plans, elevations, interiors and approval-ready drawings for homes, shops and industrial buildings.',
    images: [
      'https://www.mtboss.in/og-architectural-design-services-in-bareilly.jpg',
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
    url:
      'https://www.mtboss.in/architectural-design-services-in-bareilly',
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