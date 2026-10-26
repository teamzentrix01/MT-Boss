// app/(bareilly_keywords)/architect-for-bda-map-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for BDA Map in Bareilly',
  description:
    'Architect for BDA map in Bareilly: building plan drawings, document guidance and construction-ready layouts for house and commercial projects. MTBOSS designs and builds.',
  keywords:
    'architect for BDA map in Bareilly, BDA map architect Bareilly, BDA map Bareilly, BDA building plan Bareilly, building plan for BDA Bareilly, BDA map approval Bareilly, BDA sanction map Bareilly, building map architect Bareilly, house map for BDA Bareilly, BDA map drawing Bareilly, MTBOSS Bareilly, architect for BDA map in Bareilly',
  alternates: {
    canonical:
      'https://www.MTBOSS.in/architect-for-bda-map-in-bareilly',
  },
  openGraph: {
    title: 'Architect for BDA Map in Bareilly',
    description:
      'Architect for BDA map in Bareilly: building plan drawings, document guidance and construction-ready layouts for house and commercial projects. MTBOSS designs and builds.',
    url: 'https://www.MTBOSS.in/architect-for-bda-map-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBOSS.in/og-architect-for-bda-map-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for BDA Map in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for BDA Map in Bareilly',
    description:
      'Architect for BDA map in Bareilly: building plan drawings, document guidance and construction-ready layouts for house and commercial projects. MTBOSS designs and builds.',
    images: [
      'https://www.MTBOSS.in/og-architect-for-bda-map-in-bareilly.jpg',
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
    url: 'https://www.MTBOSS.in/architect-for-bda-map-in-bareilly',
    telephone: '+91-9458410866',
    email: 'MTBOSS2016@gmail.com',
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