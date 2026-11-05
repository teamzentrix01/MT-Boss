// app/(bareilly_keywords)/warehouse-construction-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Warehouse Construction Bareilly | MTBOSS Construction',
  description:
    'MTBOSS provides warehouse construction Bareilly: godowns, storage facilities and logistics warehouses with strong floors, smart dock design and on-time delivery. Get a free quote.',
  keywords:
    'warehouse construction Bareilly, warehouse construction in Bareilly, warehouse builder Bareilly, godown construction Bareilly, storage warehouse Bareilly, logistics warehouse Bareilly, cold storage construction Bareilly, warehouse contractor Bareilly, industrial warehouse Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/warehouse-construction-bareilly',
  },
  openGraph: {
    title: 'Warehouse Construction Bareilly | MTBOSS Construction',
    description:
      'MTBOSS provides warehouse construction Bareilly: godowns, storage facilities and logistics warehouses with strong floors, smart dock design and on-time delivery. Get a free quote.',
    url: 'https://www.mtboss.in/warehouse-construction-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-warehouse-construction-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Warehouse Construction in Bareilly - MTBOSS Construction',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Warehouse Construction Bareilly | MTBOSS Construction',
    description:
      'MTBOSS provides warehouse construction Bareilly: godowns, storage facilities and logistics warehouses with strong floors, smart dock design and on-time delivery. Get a free quote.',
    images: [
      'https://www.mtboss.in/og-warehouse-construction-bareilly.jpg',
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
    url: 'https://www.mtboss.in/warehouse-construction-bareilly',
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