// app/(moradabad_keywords)/civil-contractor-flooring-work-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Civil Contractor for Flooring Work in Moradabad | MT Boss',
  description:
    'Need a civil contractor for flooring work in Moradabad? MT Boss lays tile, marble, stone and industrial floors with proper base work, levels and clear quotations.',
  keywords:
    'civil contractor for flooring work Moradabad, flooring contractor Moradabad, tile flooring contractor Moradabad, marble flooring contractor Moradabad, granite flooring Moradabad, kota stone flooring Moradabad, IPS flooring contractor Moradabad, industrial flooring Moradabad, warehouse flooring contractor Moradabad, floor repair Moradabad, MT Boss flooring Moradabad',
  alternates: {
    canonical:
      'https://www.mtboss.in/civil-contractor-flooring-work-moradabad',
  },
  openGraph: {
    title: 'Civil Contractor for Flooring Work in Moradabad | MT Boss',
    description:
      'Need a civil contractor for flooring work in Moradabad? MT Boss lays tile, marble, stone and industrial floors with proper base work, levels and clear quotations.',
    url: 'https://www.mtboss.in/civil-contractor-flooring-work-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-civil-contractor-flooring-work-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Contractor for Flooring Work in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Contractor for Flooring Work in Moradabad | MT Boss',
    description:
      'Need a civil contractor for flooring work in Moradabad? MT Boss lays tile, marble, stone and industrial floors with proper base work, levels and clear quotations.',
    images: [
      'https://www.mtboss.in/og-civil-contractor-flooring-work-moradabad.jpg',
    ],
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
  url: 'https://www.mtboss.in/civil-contractor-flooring-work-moradabad',
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