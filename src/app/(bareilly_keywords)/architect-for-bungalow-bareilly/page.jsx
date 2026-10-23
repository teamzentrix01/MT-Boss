// app/(bareilly_keywords)/architect-for-bungalow-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Bungalow in Bareilly',
  description:
    'Architect for bungalow in Bareilly: planning and design for kothis and villas with courtyards, landscaping and generous rooms. MTBoss designs and builds. Call or WhatsApp.',
  keywords:
    'architect for bungalow in Bareilly, bungalow architect Bareilly, kothi architect Bareilly, villa architect Bareilly, bungalow design Bareilly, kothi design Bareilly, villa design Bareilly, luxury house architect Bareilly, bungalow renovation Bareilly, bungalow extension Bareilly, MTBoss Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.MTBoss.in/architect-for-bungalow-bareilly',
  },
  openGraph: {
    title: 'Architect for Bungalow in Bareilly',
    description:
      'Architect for bungalow in Bareilly: planning and design for kothis and villas with courtyards, landscaping and generous rooms. MTBoss designs and builds. Call or WhatsApp.',
    url: 'https://www.MTBoss.in/architect-for-bungalow-bareilly',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-architect-for-bungalow-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Bungalow in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Bungalow in Bareilly',
    description:
      'Architect for bungalow in Bareilly: planning and design for kothis and villas with courtyards, landscaping and generous rooms. MTBoss designs and builds. Call or WhatsApp.',
    images: ['https://www.MTBoss.in/og-architect-for-bungalow-bareilly.jpg'],
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
    url: 'https://www.MTBoss.in/architect-for-bungalow-bareilly',
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