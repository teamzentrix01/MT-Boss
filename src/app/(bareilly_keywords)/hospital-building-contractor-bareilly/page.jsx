// app/(bareilly_keywords)/hospital-building-contractor-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Hospital Building Contractor in Bareilly | Contract Scope & Packages | MTBOSS',
  description:
    'Hospital building contractor in Bareilly: clear main-contract scope, specialist coordination, quality hold points and handover records. MTBOSS builds to approved drawings.',
  keywords:
    'hospital building contractor in Bareilly, hospital construction Bareilly, healthcare building contractor Bareilly, clinic construction Bareilly, nursing home construction Bareilly, hospital renovation Bareilly, healthcare renovation Bareilly, medical building contractor Bareilly, specialist coordination construction Bareilly, waterproofing Bareilly, commercial construction Bareilly, building contractor Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/hospital-building-contractor-in-bareilly',
  },
  openGraph: {
    title:
      'Hospital Building Contractor in Bareilly | Contract Scope & Packages | MTBOSS',
    description:
      'Hospital building contractor in Bareilly: clear main-contract scope, specialist coordination, quality hold points and handover records. MTBOSS builds to approved drawings.',
    url:
      'https://www.mtboss.in/hospital-building-contractor-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-hospital-building-contractor-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Hospital Building Contractor in Bareilly - Contract Scope and Packages - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Hospital Building Contractor in Bareilly | Contract Scope & Packages | MTBOSS',
    description:
      'Hospital building contractor in Bareilly: clear main-contract scope, specialist coordination, quality hold points and handover records. MTBOSS builds to approved drawings.',
    images: [
      'https://www.mtboss.in/og-hospital-building-contractor-in-bareilly.jpg',
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
      'https://www.mtboss.in/hospital-building-contractor-in-bareilly',
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