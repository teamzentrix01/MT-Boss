// app/(moradabad_keywords)/building-material-supplier-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Building Material Supplier in Moradabad | MT Boss',
  description:
    'Looking for a building material supplier in Moradabad? MT Boss connects you with cement, steel, bricks and more for your project, with clear pricing and support.',
  keywords:
    'building material supplier Moradabad, construction material supplier Moradabad, cement supplier Moradabad, TMT steel supplier Moradabad, bricks supplier Moradabad, sand and aggregate supplier Moradabad, building materials near me, construction material shop Moradabad, MT Boss Moradabad, material supplier contact Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/building-material-supplier-moradabad',
  },
  openGraph: {
    title: 'Building Material Supplier in Moradabad | MT Boss',
    description:
      'Looking for a building material supplier in Moradabad? MT Boss connects you with cement, steel, bricks and more for your project, with clear pricing and support.',
    url: 'https://www.mtboss.in/building-material-supplier-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-building-material-supplier-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Building Material Supplier in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Building Material Supplier in Moradabad | MT Boss',
    description:
      'Looking for a building material supplier in Moradabad? MT Boss connects you with cement, steel, bricks and more for your project, with clear pricing and support.',
    images: ['https://www.mtboss.in/og-building-material-supplier-moradabad.jpg'],
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
    url: 'https://www.mtboss.in/building-material-supplier-moradabad',
    telephone: '+91-9458410866',
    email: 'mtboss2016@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
      addressLocality: 'Moradabad',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: 'Moradabad',
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