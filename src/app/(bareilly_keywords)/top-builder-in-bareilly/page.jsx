// app/(bareilly_keywords)/top-builder-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Top Builder in Bareilly | House & Commercial Building | MTBOSS',
  description:
    'Looking for a top builder in Bareilly? MTBOSS builds houses, shops and offices with clear scope, supervised work and finishing under one team. Call or WhatsApp.',
  keywords:
    'top builder in Bareilly, best builder in Bareilly, builder in Bareilly, construction company Bareilly, building contractor Bareilly, civil contractor Bareilly, house builder Bareilly, home construction Bareilly, commercial builder Bareilly, shop construction Bareilly, office construction Bareilly, renovation builder Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/top-builder-in-bareilly',
  },
  openGraph: {
    title: 'Top Builder in Bareilly | House & Commercial Building | MTBOSS',
    description:
      'Looking for a top builder in Bareilly? MTBOSS builds houses, shops and offices with clear scope, supervised work and finishing under one team. Call or WhatsApp.',
    url: 'https://www.mtboss.in/top-builder-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-top-builder-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Top Builder in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Builder in Bareilly | House & Commercial Building | MTBOSS',
    description:
      'Looking for a top builder in Bareilly? MTBOSS builds houses, shops and offices with clear scope, supervised work and finishing under one team. Call or WhatsApp.',
    images: ['https://www.mtboss.in/og-top-builder-in-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/top-builder-in-bareilly',
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