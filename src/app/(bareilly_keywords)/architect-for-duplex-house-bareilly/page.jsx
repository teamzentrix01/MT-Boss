// app/(bareilly_keywords)/architect-for-duplex-house-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Architect for Duplex House in Bareilly | Two-Floor Home Design | MTBOSS',
  description:
    'Architect for duplex house in Bareilly: smart two-floor planning, staircase, double height, privacy and structure coordination. MTBOSS designs and builds. Call or WhatsApp.',
  keywords:
    'architect for duplex house in Bareilly, duplex house architect Bareilly, duplex house design Bareilly, duplex plan Bareilly, two floor house design Bareilly, duplex map design Bareilly, duplex house plan architect Bareilly, duplex home architect Bareilly, duplex house design near me Bareilly, two storey house plan Bareilly, MTBOSS Bareilly, architect for duplex house in Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/architect-for-duplex-house-in-bareilly',
  },
  openGraph: {
    title:
      'Architect for Duplex House in Bareilly | Two-Floor Home Design | MTBOSS',
    description:
      'Architect for duplex house in Bareilly: smart two-floor planning, staircase, double height, privacy and structure coordination. MTBOSS designs and builds. Call or WhatsApp.',
    url:
      'https://www.mtboss.in/architect-for-duplex-house-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-architect-for-duplex-house-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Duplex House in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Architect for Duplex House in Bareilly | Two-Floor Home Design | MTBOSS',
    description:
      'Architect for duplex house in Bareilly: smart two-floor planning, staircase, double height, privacy and structure coordination. MTBOSS designs and builds. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-architect-for-duplex-house-in-bareilly.jpg',
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
      'https://www.mtboss.in/architect-for-duplex-house-in-bareilly',
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