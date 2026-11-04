// app/(bareilly_keywords)/hotel-building-contractor-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Hotel Building Contractor Bareilly | Room-by-Room Construction | MTBOSS',
  description:
    'Hotel building contractor Bareilly: sample room approval, repeatable room modules, services coordination and guest-ready finishing. MTBOSS builds to approved drawings.',
  keywords:
    'hotel building contractor Bareilly, hotel construction Bareilly, hotel contractor Bareilly, guest house construction Bareilly, hospitality construction Bareilly, hotel renovation Bareilly, hotel building construction Bareilly, hotel room construction Bareilly, hotel waterproofing Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/hotel-building-contractor-bareilly',
  },
  openGraph: {
    title:
      'Hotel Building Contractor Bareilly | Room-by-Room Construction | MTBOSS',
    description:
      'Hotel building contractor Bareilly: sample room approval, repeatable room modules, services coordination and guest-ready finishing. MTBOSS builds to approved drawings.',
    url: 'https://www.mtboss.in/hotel-building-contractor-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-hotel-building-contractor-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Hotel Building Contractor Bareilly - Room-by-Room Construction - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Hotel Building Contractor Bareilly | Room-by-Room Construction | MTBOSS',
    description:
      'Hotel building contractor Bareilly: sample room approval, repeatable room modules, services coordination and guest-ready finishing. MTBOSS builds to approved drawings.',
    images: [
      'https://www.mtboss.in/og-hotel-building-contractor-bareilly.jpg',
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
    url: 'https://www.mtboss.in/hotel-building-contractor-bareilly',
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