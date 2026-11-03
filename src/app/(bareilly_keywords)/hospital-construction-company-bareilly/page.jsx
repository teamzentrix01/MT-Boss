// app/(bareilly_keywords)/hospital-construction-company-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    "Hospital Construction Company in Bareilly | Owner's Planning Guide | MTBOSS",
  description:
    'Planning a hospital build in Bareilly? See the owner\'s checklist for budget, phasing, risks and choosing a construction company. MTBOSS supports building work for healthcare.',
  keywords:
    'hospital construction company in Bareilly, hospital construction Bareilly, clinic construction Bareilly, nursing home construction Bareilly, healthcare building contractor Bareilly, medical building construction Bareilly, hospital renovation Bareilly, healthcare renovation Bareilly, waterproofing Bareilly, commercial construction Bareilly, building contractor Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/hospital-construction-company-in-bareilly',
  },
  openGraph: {
    title:
      "Hospital Construction Company in Bareilly | Owner's Planning Guide | MTBOSS",
    description:
      'Planning a hospital build in Bareilly? See the owner\'s checklist for budget, phasing, risks and choosing a construction company. MTBOSS supports building work for healthcare.',
    url:
      'https://www.mtboss.in/hospital-construction-company-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-hospital-construction-company-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          "Hospital Construction Company in Bareilly - Owner's Planning Guide - MTBOSS",
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      "Hospital Construction Company in Bareilly | Owner's Planning Guide | MTBOSS",
    description:
      'Planning a hospital build in Bareilly? See the owner\'s checklist for budget, phasing, risks and choosing a construction company. MTBOSS supports building work for healthcare.',
    images: [
      'https://www.mtboss.in/og-hospital-construction-company-in-bareilly.jpg',
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
      'https://www.mtboss.in/hospital-construction-company-in-bareilly',
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