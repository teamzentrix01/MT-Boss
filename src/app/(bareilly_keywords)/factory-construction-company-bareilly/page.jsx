// app/(bareilly_keywords)/factory-construction-company-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Factory Construction Company Bareilly | MTBOSS Construction',
  description:
    'MTBOSS is a factory construction company Bareilly that plans and builds manufacturing units from layout to handover, with strong structures, utilities and on-time delivery.',
  keywords:
    'factory construction company Bareilly, factory construction Bareilly, factory builder Bareilly, manufacturing unit construction Bareilly, industrial construction Bareilly, factory shed Bareilly, PEB factory Bareilly, steel structure factory Bareilly, factory renovation Bareilly, factory expansion Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/factory-construction-company-bareilly',
  },
  openGraph: {
    title:
      'Factory Construction Company Bareilly | MTBOSS Construction',
    description:
      'MTBOSS is a factory construction company Bareilly that plans and builds manufacturing units from layout to handover, with strong structures, utilities and on-time delivery.',
    url:
      'https://www.mtboss.in/factory-construction-company-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-factory-construction-company-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Factory Construction Company in Bareilly - MTBOSS Construction',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Factory Construction Company Bareilly | MTBOSS Construction',
    description:
      'MTBOSS is a factory construction company Bareilly that plans and builds manufacturing units from layout to handover, with strong structures, utilities and on-time delivery.',
    images: [
      'https://www.mtboss.in/og-factory-construction-company-bareilly.jpg',
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
      'https://www.mtboss.in/factory-construction-company-bareilly',
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