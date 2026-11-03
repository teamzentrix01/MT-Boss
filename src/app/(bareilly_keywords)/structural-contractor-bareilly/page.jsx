// app/(bareilly_keywords)/structural-contractor-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Structural Contractor in Bareilly | MTBoss',
  description:
    "Need a structural contractor in Bareilly? MTBoss builds foundations, RCC frames and steel structures to engineer's drawings, with inspections and clear billing.",
  keywords:
    'structural contractor in Bareilly, structural contractor Bareilly, RCC contractor Bareilly, foundation contractor Bareilly, steel structure contractor Bareilly, industrial shed contractor Bareilly, warehouse construction Bareilly, RCC frame contractor Bareilly, slab construction Bareilly, building repair Bareilly, structural repair Bareilly, added floor contractor Bareilly, MTBoss Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/structural-contractor-in-bareilly',
  },
  openGraph: {
    title: 'Structural Contractor in Bareilly | MTBoss',
    description:
      "Need a structural contractor in Bareilly? MTBoss builds foundations, RCC frames and steel structures to engineer's drawings, with inspections and clear billing.",
    url:
      'https://www.mtboss.in/structural-contractor-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-structural-contractor-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Structural Contractor in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Structural Contractor in Bareilly | MTBoss',
    description:
      "Need a structural contractor in Bareilly? MTBoss builds foundations, RCC frames and steel structures to engineer's drawings, with inspections and clear billing.",
    images: [
      'https://www.mtboss.in/og-structural-contractor-in-bareilly.jpg',
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
      'https://www.mtboss.in/structural-contractor-in-bareilly',
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