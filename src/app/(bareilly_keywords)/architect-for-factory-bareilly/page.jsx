// app/(bareilly_keywords)/architect-for-factory-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Factory in Bareilly',
  description:
    'Planning a factory in Bareilly? MT Boss designs factory layouts, sheds and warehouses with truck flow, services and fire planning, then builds if you choose.',
  keywords:
    'architect for factory in Bareilly, factory architect Bareilly, industrial architect Bareilly, factory design Bareilly, factory shed design Bareilly, warehouse architect Bareilly, factory construction Bareilly, industrial building design Bareilly, workshop architect Bareilly, factory layout planning Bareilly, MT Boss Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-factory-bareilly',
  },
  openGraph: {
    title: 'Architect for Factory in Bareilly',
    description:
      'Planning a factory in Bareilly? MT Boss designs factory layouts, sheds and warehouses with truck flow, services and fire planning, then builds if you choose.',
    url: 'https://www.mtboss.in/architect-for-factory-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-for-factory-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Factory in Bareilly - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Factory in Bareilly',
    description:
      'Planning a factory in Bareilly? MT Boss designs factory layouts, sheds and warehouses with truck flow, services and fire planning, then builds if you choose.',
    images: ['https://www.mtboss.in/og-architect-for-factory-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/architect-for-factory-bareilly',
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