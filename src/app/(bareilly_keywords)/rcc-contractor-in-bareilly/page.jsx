// app/(bareilly_keywords)/rcc-contractor-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'RCC Contractor in Bareilly | Columns, Slabs & Beams | MTBOSS',
  description:
    'RCC contractor in Bareilly for houses, shops and offices: shuttering, reinforcement, concreting and curing, built from structural drawings. MTBOSS. Call or WhatsApp.',
  keywords:
    'RCC contractor in Bareilly, RCC contractor Bareilly, RCC work Bareilly, concrete contractor Bareilly, shuttering contractor Bareilly, reinforcement contractor Bareilly, slab casting Bareilly, column beam construction Bareilly, RCC repair Bareilly, RCC extension Bareilly, structural concrete Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/rcc-contractor-in-bareilly',
  },
  openGraph: {
    title:
      'RCC Contractor in Bareilly | Columns, Slabs & Beams | MTBOSS',
    description:
      'RCC contractor in Bareilly for houses, shops and offices: shuttering, reinforcement, concreting and curing, built from structural drawings. MTBOSS. Call or WhatsApp.',
    url: 'https://www.mtboss.in/rcc-contractor-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-rcc-contractor-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'RCC Contractor in Bareilly - Columns, Slabs and Beams - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'RCC Contractor in Bareilly | Columns, Slabs & Beams | MTBOSS',
    description:
      'RCC contractor in Bareilly for houses, shops and offices: shuttering, reinforcement, concreting and curing, built from structural drawings. MTBOSS. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-rcc-contractor-in-bareilly.jpg',
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
    url: 'https://www.mtboss.in/rcc-contractor-in-bareilly',
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