// app/(bareilly_keywords)/architect-for-home-design-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Home Design in Bareilly',
  description:
    'Architect for home design in Bareilly: floor plans, layouts, elevations and drawings made around your family and plot. MTBOSS designs and builds. Call or WhatsApp.',
  keywords:
    'architect for home design in Bareilly, home design architect Bareilly, house design Bareilly, floor plan architect Bareilly, home layout Bareilly, house elevation Bareilly, home map design Bareilly, building design Bareilly, MTBOSS Bareilly, architect near me Bareilly, home design near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-home-design-bareilly',
  },
  openGraph: {
    title: 'Architect for Home Design in Bareilly',
    description:
      'Architect for home design in Bareilly: floor plans, layouts, elevations and drawings made around your family and plot. MTBOSS designs and builds. Call or WhatsApp.',
    url: 'https://www.mtboss.in/architect-for-home-design-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-for-home-design-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Home Design in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Home Design in Bareilly',
    description:
      'Architect for home design in Bareilly: floor plans, layouts, elevations and drawings made around your family and plot. MTBOSS designs and builds. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-architect-for-home-design-bareilly.jpg',
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
    url: 'https://www.mtboss.in/architect-for-home-design-bareilly',
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