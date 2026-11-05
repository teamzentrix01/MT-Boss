// app/(bareilly_keywords)/industrial-construction-company-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Industrial Construction Company Bareilly | MTBOSS Construction',
  description:
    'MTBOSS is an industrial construction company Bareilly building factories, warehouses, godowns and cold storage with strong structures, fast schedules and transparent pricing.',
  keywords:
    'industrial construction company Bareilly, industrial construction Bareilly, factory construction Bareilly, warehouse construction Bareilly, godown construction Bareilly, cold storage construction Bareilly, industrial building contractor Bareilly, factory shed construction Bareilly, industrial renovation Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/industrial-construction-company-bareilly',
  },
  openGraph: {
    title:
      'Industrial Construction Company Bareilly | MTBOSS Construction',
    description:
      'MTBOSS is an industrial construction company Bareilly building factories, warehouses, godowns and cold storage with strong structures, fast schedules and transparent pricing.',
    url:
      'https://www.mtboss.in/industrial-construction-company-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-industrial-construction-company-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Industrial Construction Company in Bareilly - MTBOSS Construction',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Industrial Construction Company Bareilly | MTBOSS Construction',
    description:
      'MTBOSS is an industrial construction company Bareilly building factories, warehouses, godowns and cold storage with strong structures, fast schedules and transparent pricing.',
    images: [
      'https://www.mtboss.in/og-industrial-construction-company-bareilly.jpg',
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
      'https://www.mtboss.in/industrial-construction-company-bareilly',
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