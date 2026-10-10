// app/(bareilly_keywords)/architect-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect in Bareilly',
  description:
    'Looking for an architect in Bareilly? MT Boss offers house, commercial and interior design with drawings, elevation and build support. Call +91 94584 10866.',
  keywords:
    'architect in Bareilly, house architect Bareilly, building designer Bareilly, home design Bareilly, commercial architect Bareilly, interior designer Bareilly, elevation designer Bareilly, architectural drawings Bareilly, MT Boss Bareilly, design and build Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-in-bareilly',
  },
  openGraph: {
    title: 'Architect in Bareilly',
    description:
      'Looking for an architect in Bareilly? MT Boss offers house, commercial and interior design with drawings, elevation and build support. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/architect-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect in Bareilly - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect in Bareilly',
    description:
      'Looking for an architect in Bareilly? MT Boss offers house, commercial and interior design with drawings, elevation and build support. Call +91 94584 10866.',
    images: ['https://www.mtboss.in/og-architect-in-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/architect-in-bareilly',
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