// app/(bareilly_keywords)/hotel-construction-company-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Hotel Construction Company in Bareilly | MTBoss',
  description:
    'Planning a hotel in Bareilly? MTBoss builds hotels and guest houses with planned sequencing, inspected stages, tested services and itemised estimates.',
  keywords:
    'hotel construction company in Bareilly, hotel construction Bareilly, hotel builders Bareilly, hospitality construction Bareilly, guest house construction Bareilly, hotel contractor Bareilly, banquet hall construction Bareilly, hotel renovation Bareilly, MTBoss Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/hotel-construction-company-in-bareilly',
  },
  openGraph: {
    title: 'Hotel Construction Company Bareilly | MTBoss',
    description:
      'Planning a hotel in Bareilly? MTBoss builds hotels and guest houses with planned sequencing, inspected stages, tested services and itemised estimates.',
    url:
      'https://www.mtboss.in/hotel-construction-company-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-hotel-construction-company-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Hotel Construction Company Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotel Construction Company in Bareilly | MTBoss',
    description:
      'Planning a hotel in Bareilly? MTBoss builds hotels and guest houses with planned sequencing, inspected stages, tested services and itemised estimates.',
    images: [
      'https://www.mtboss.in/og-hotel-construction-company-in-bareilly.jpg',
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
      'https://www.mtboss.in/hotel-construction-company-bareilly',
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