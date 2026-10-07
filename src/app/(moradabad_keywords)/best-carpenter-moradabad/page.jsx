// app/(moradabad_keywords)/best-carpenter-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Carpenter in Moradabad',
  description:
    'Find the best carpenter in Moradabad for furniture, doors, wardrobes and repairs. MTBOSS offers skilled, well-planned woodwork with clear quotes. Call or WhatsApp.',
  keywords:
    'best carpenter Moradabad, best carpenter near me Moradabad, carpenter services Moradabad, carpenter for furniture Moradabad, carpenter for wardrobe Moradabad, carpenter for doors Moradabad, carpenter for repairs Moradabad, custom carpenter Moradabad, woodwork contractor Moradabad, MTBOSS carpenter Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/best-carpenter-moradabad',
  },
  openGraph: {
    title: 'Best Carpenter in Moradabad',
    description:
      'Find the best carpenter in Moradabad for furniture, doors, wardrobes and repairs. MTBOSS offers skilled, well-planned woodwork with clear quotes. Call or WhatsApp.',
    url: 'https://www.mtboss.in/best-carpenter-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-best-carpenter-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Carpenter in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Carpenter in Moradabad',
    description:
      'Find the best carpenter in Moradabad for furniture, doors, wardrobes and repairs. MTBOSS offers skilled, well-planned woodwork with clear quotes. Call or WhatsApp.',
    images: ['https://www.mtboss.in/og-best-carpenter-moradabad.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'MTBOSS Construction Private Limited',
  url: 'https://www.mtboss.in/best-carpenter-moradabad',
  telephone: '+91-9458410866',
  email: 'mtboss2016@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
    addressLocality: 'Moradabad',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
    // postalCode: 'ADD_PIN_CODE_HERE'
  },
  areaServed: {
    '@type': 'City',
    name: 'Moradabad',
  },
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