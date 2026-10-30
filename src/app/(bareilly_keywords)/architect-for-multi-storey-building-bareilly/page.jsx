// app/(bareilly_keywords)/architect-for-multi-storey-building-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Multi Storey Building in Bareilly',
  description:
    'Architect for multi storey building in Bareilly: apartments, builder floors and mixed-use planning with lifts, stairs, parking and structure coordination. MTBOSS designs and builds.',
  keywords:
    'architect for multi storey building in Bareilly, multi storey building architect Bareilly, multi storey building design Bareilly, apartment building architect Bareilly, builder floor architect Bareilly, mixed use building architect Bareilly, commercial building architect Bareilly, multi storey building plan Bareilly, apartment building design Bareilly, multi storey building architect near me Bareilly, MTBOSS Bareilly, architect for multi storey building in Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/architect-for-multi-storey-building-in-bareilly',
  },
  openGraph: {
    title: 'Architect for Multi Storey Building in Bareilly',
    description:
      'Architect for multi storey building in Bareilly: apartments, builder floors and mixed-use planning with lifts, stairs, parking and structure coordination. MTBOSS designs and builds.',
    url:
      'https://www.mtboss.in/architect-for-multi-storey-building-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-architect-for-multi-storey-building-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Multi Storey Building in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Multi Storey Building in Bareilly',
    description:
      'Architect for multi storey building in Bareilly: apartments, builder floors and mixed-use planning with lifts, stairs, parking and structure coordination. MTBOSS designs and builds.',
    images: [
      'https://www.mtboss.in/og-architect-for-multi-storey-building-in-bareilly.jpg',
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
      'https://www.mtboss.in/architect-for-multi-storey-building-in-bareilly',
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