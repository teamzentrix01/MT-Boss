// app/(bareilly_keywords)/architect-and-interior-designer-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect and Interior Designer in Bareilly',
  description:
    'Looking for an architect and interior designer in Bareilly? MTBOSS plans structure and interiors together, with clear drawings, joinery and finishing support.',
  keywords:
    'architect and interior designer in Bareilly, architect Bareilly, interior designer Bareilly, home interior designer Bareilly, house architect Bareilly, residential architect Bareilly, interior design Bareilly, architect and interior designer near me Bareilly, home design Bareilly, flat interior designer Bareilly, MTBOSS Bareilly, architect interior designer Bareilly',
  alternates: {
    canonical:
      'https://www.MTBOSS.in/architect-and-interior-designer-in-bareilly',
  },
  openGraph: {
    title: 'Architect and Interior Designer in Bareilly',
    description:
      'Looking for an architect and interior designer in Bareilly? MTBOSS plans structure and interiors together, with clear drawings, joinery and finishing support.',
    url: 'https://www.MTBOSS.in/architect-and-interior-designer-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBOSS.in/og-architect-and-interior-designer-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect and Interior Designer in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect and Interior Designer in Bareilly',
    description:
      'Looking for an architect and interior designer in Bareilly? MTBOSS plans structure and interiors together, with clear drawings, joinery and finishing support.',
    images: [
      'https://www.MTBOSS.in/og-architect-and-interior-designer-in-bareilly.jpg',
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
    url: 'https://www.MTBOSS.in/architect-and-interior-designer-in-bareilly',
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