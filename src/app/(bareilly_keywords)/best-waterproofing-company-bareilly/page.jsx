// app/(bareilly_keywords)/best-waterproofing-company-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Waterproofing Company in Bareilly | MT Boss',
  description:
    'Looking for the best waterproofing company in Bareilly? MT Boss offers terrace, bathroom, basement and tank waterproofing with inspection and clear pricing.',
  keywords:
    'best waterproofing company Bareilly, waterproofing contractor in Bareilly, terrace waterproofing Bareilly, bathroom leakage repair Bareilly, roof waterproofing cost Bareilly, water tank waterproofing Bareilly, damp proofing services Bareilly, MT Boss Bareilly, waterproofing services near me, best waterproofing contractor Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/best-waterproofing-company-bareilly',
  },
  openGraph: {
    title: 'Best Waterproofing Company in Bareilly | MT Boss',
    description:
      'Looking for the best waterproofing company in Bareilly? MT Boss offers terrace, bathroom, basement and tank waterproofing with inspection and clear pricing.',
    url: 'https://www.mtboss.in/best-waterproofing-company-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-best-waterproofing-company-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Waterproofing Company in Bareilly - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Waterproofing Company in Bareilly | MT Boss',
    description:
      'Looking for the best waterproofing company in Bareilly? MT Boss offers terrace, bathroom, basement and tank waterproofing with inspection and clear pricing.',
    images: ['https://www.mtboss.in/og-best-waterproofing-company-bareilly.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'MTBOSS Construction Private Limited',
  url: 'https://www.mtboss.in/best-waterproofing-company-bareilly',
  telephone: '+91-9458410866',
  email: 'mtboss2016@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Harthala Kanth Road, Behind Kr Collection, near Domino\'s',
    addressLocality: 'Moradabad',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
    // postalCode: 'ADD_PIN_CODE_HERE'
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Bareilly',
    },
    {
      '@type': 'City',
      name: 'Moradabad',
    },
  ],
  priceRange: '₹₹',
};

export default function Page() {
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