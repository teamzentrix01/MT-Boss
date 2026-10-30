// app/(bareilly_keywords)/architect-for-hospital-design-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Hospital Design in Bareilly',
  description:
    'Planning a hospital or nursing home in Bareilly? MTBoss plans patient flow, infection-safe layouts, services and approvals with clear drawings and honest costs.',
  keywords:
    'architect for hospital design in Bareilly, hospital architect Bareilly, hospital design architect Bareilly, nursing home architect Bareilly, hospital building design Bareilly, hospital plan architect Bareilly, clinic design architect Bareilly, diagnostic centre architect Bareilly, hospital building plan Bareilly, hospital design and build Bareilly, MTBoss Bareilly, architect for hospital design in Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/architect-for-hospital-design-in-bareilly',
  },
  openGraph: {
    title: 'Architect for Hospital Design in Bareilly',
    description:
      'Planning a hospital or nursing home in Bareilly? MTBoss plans patient flow, infection-safe layouts, services and approvals with clear drawings and honest costs.',
    url:
      'https://www.mtboss.in/architect-for-hospital-design-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-architect-for-hospital-design-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Hospital Design in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Hospital Design in Bareilly',
    description:
      'Planning a hospital or nursing home in Bareilly? MTBoss plans patient flow, infection-safe layouts, services and approvals with clear drawings and honest costs.',
    images: [
      'https://www.mtboss.in/og-architect-for-hospital-design-in-bareilly.jpg',
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
      'https://www.mtboss.in/architect-for-hospital-design-in-bareilly',
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