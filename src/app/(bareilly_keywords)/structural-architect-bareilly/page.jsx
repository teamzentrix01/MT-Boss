// app/(bareilly_keywords)/structural-architect-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Structural Architect in Bareilly',
  description:
    'Structural architect in Bareilly: building design planned with column grid, spans, foundations and future floors, coordinated with a qualified structural engineer. Call MTBOSS.',
  keywords:
    'structural architect in Bareilly, structural architect Bareilly, architect and structural engineer Bareilly, structural design architect Bareilly, structural coordination architect Bareilly, building structure design Bareilly, house structural design Bareilly, column beam design architect Bareilly, structural engineer and architect Bareilly, structural architect near me Bareilly, MTBOSS Bareilly, structural architect in Bareilly',
  alternates: {
    canonical:
      'https://www.MTBOSS.in/structural-architect-in-bareilly',
  },
  openGraph: {
    title: 'Structural Architect in Bareilly',
    description:
      'Structural architect in Bareilly: building design planned with column grid, spans, foundations and future floors, coordinated with a qualified structural engineer. Call MTBOSS.',
    url: 'https://www.MTBOSS.in/structural-architect-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBOSS.in/og-structural-architect-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Structural Architect in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Structural Architect in Bareilly',
    description:
      'Structural architect in Bareilly: building design planned with column grid, spans, foundations and future floors, coordinated with a qualified structural engineer. Call MTBOSS.',
    images: [
      'https://www.MTBOSS.in/og-structural-architect-in-bareilly.jpg',
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
    url: 'https://www.MTBOSS.in/structural-architect-in-bareilly',
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