// app/(bareilly_keywords)/commercial-building-contractor-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Commercial Building Contractor Bareilly | MTBOSS Construction',
  description:
    'Hire MTBOSS, a trusted commercial building contractor Bareilly, for offices, showrooms, hotels, hospitals and warehouses. Clear contracts, quality control and on-time handover.',
  keywords:
    'commercial building contractor Bareilly, commercial contractor Bareilly, commercial construction Bareilly, office building contractor Bareilly, showroom contractor Bareilly, hotel construction contractor Bareilly, warehouse contractor Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/commercial-building-contractor-bareilly',
  },
  openGraph: {
    title:
      'Commercial Building Contractor Bareilly | MTBOSS Construction',
    description:
      'Hire MTBOSS, a trusted commercial building contractor Bareilly, for offices, showrooms, hotels, hospitals and warehouses. Clear contracts, quality control and on-time handover.',
    url:
      'https://www.mtboss.in/commercial-building-contractor-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-commercial-building-contractor-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Commercial Building Contractor Bareilly - MTBOSS Construction',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Commercial Building Contractor Bareilly | MTBOSS Construction',
    description:
      'Hire MTBOSS, a trusted commercial building contractor Bareilly, for offices, showrooms, hotels, hospitals and warehouses. Clear contracts, quality control and on-time handover.',
    images: [
      'https://www.mtboss.in/og-commercial-building-contractor-bareilly.jpg',
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
      'https://www.mtboss.in/commercial-building-contractor-bareilly',
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