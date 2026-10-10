// app/(bareilly_keywords)/architect-for-office-building-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Office Building in Bareilly',
  description:
    'Architect for office building in Bareilly: floor plans, core planning, parking, services and facade for owner-occupied or rental offices. MTBOSS designs and builds. Call or WhatsApp.',
  keywords:
    'architect for office building in Bareilly, office building architect Bareilly, office building design Bareilly, office floor plan Bareilly, rental office building Bareilly, commercial office architect Bareilly, office construction Bareilly, office building renovation Bareilly, office interior design Bareilly, MTBOSS Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-office-building-bareilly',
  },
  openGraph: {
    title: 'Architect for Office Building in Bareilly',
    description:
      'Architect for office building in Bareilly: floor plans, core planning, parking, services and facade for owner-occupied or rental offices. MTBOSS designs and builds. Call or WhatsApp.',
    url: 'https://www.mtboss.in/architect-for-office-building-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-for-office-building-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Office Building in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Office Building in Bareilly',
    description:
      'Architect for office building in Bareilly: floor plans, core planning, parking, services and facade for owner-occupied or rental offices. MTBOSS designs and builds. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-architect-for-office-building-bareilly.jpg',
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
    url: 'https://www.mtboss.in/architect-for-office-building-bareilly',
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