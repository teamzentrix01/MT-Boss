// app/(bareilly_keywords)/vastu-architect-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Vastu Architect in Bareilly | MTBoss Design and Build',
  description:
    'Looking for a Vastu architect in Bareilly? MTBoss plans homes around your Vastu preferences while keeping light, structure and local rules in order.',
  keywords:
    'vastu architect in Bareilly, vastu architect Bareilly, vastu house plan Bareilly, vastu map design Bareilly, vastu naksha Bareilly, vastu compliant house plan Bareilly, vastu home design Bareilly, vastu consultant architect Bareilly, vastu building plan Bareilly, vastu house map architect Bareilly, MTBoss Bareilly, vastu architect in Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/vastu-architect-in-bareilly',
  },
  openGraph: {
    title: 'Vastu Architect in Bareilly | MTBoss Design and Build',
    description:
      'Looking for a Vastu architect in Bareilly? MTBoss plans homes around your Vastu preferences while keeping light, structure and local rules in order.',
    url: 'https://www.mtboss.in/vastu-architect-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-vastu-architect-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Vastu Architect in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vastu Architect in Bareilly | MTBoss Design and Build',
    description:
      'Looking for a Vastu architect in Bareilly? MTBoss plans homes around your Vastu preferences while keeping light, structure and local rules in order.',
    images: [
      'https://www.mtboss.in/og-vastu-architect-in-bareilly.jpg',
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
    url: 'https://www.mtboss.in/vastu-architect-in-bareilly',
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