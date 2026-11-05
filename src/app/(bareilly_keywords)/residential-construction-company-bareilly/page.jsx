// app/(bareilly_keywords)/residential-construction-company-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Residential Construction Company Bareilly | Houses, Duplexes & Floors | MTBOSS',
  description:
    'Residential construction company Bareilly: houses, duplexes, bungalows, builder floors and rental buildings, built to approved drawings with supervised sites. MTBOSS.',
  keywords:
    'residential construction company Bareilly, house construction Bareilly, duplex construction Bareilly, bungalow construction Bareilly, builder floor construction Bareilly, rental building construction Bareilly, home builder Bareilly, residential contractor Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/residential-construction-company-bareilly',
  },
  openGraph: {
    title:
      'Residential Construction Company Bareilly | Houses, Duplexes & Floors | MTBOSS',
    description:
      'Residential construction company Bareilly: houses, duplexes, bungalows, builder floors and rental buildings, built to approved drawings with supervised sites. MTBOSS.',
    url:
      'https://www.mtboss.in/residential-construction-company-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-residential-construction-company-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Residential Construction Company Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Residential Construction Company Bareilly | Houses, Duplexes & Floors | MTBOSS',
    description:
      'Residential construction company Bareilly: houses, duplexes, bungalows, builder floors and rental buildings, built to approved drawings with supervised sites. MTBOSS.',
    images: [
      'https://www.mtboss.in/og-residential-construction-company-bareilly.jpg',
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
      'https://www.mtboss.in/residential-construction-company-bareilly',
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