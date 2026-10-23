// app/(bareilly_keywords)/building-plan-architect-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Building Plan Architect in Bareilly',
  description:
    'Need a building plan architect in Bareilly? MTBoss prepares plans for sanction, coordinates structure and services, and builds if you choose. Call +91 94584 10866.',
  keywords:
    'building plan architect in Bareilly, building plan architect Bareilly, architect for building plan Bareilly, house plan architect Bareilly, building plan design Bareilly, building plan for sanction Bareilly, architectural plan Bareilly, house map design Bareilly, building drawing architect Bareilly, plan architect near me Bareilly, MTBoss Bareilly, building plan architect Bareilly',
  alternates: {
    canonical:
      'https://www.MTBoss.in/building-plan-architect-in-bareilly',
  },
  openGraph: {
    title: 'Building Plan Architect in Bareilly',
    description:
      'Need a building plan architect in Bareilly? MTBoss prepares plans for sanction, coordinates structure and services, and builds if you choose. Call +91 94584 10866.',
    url: 'https://www.MTBoss.in/building-plan-architect-in-bareilly',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-building-plan-architect-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Building Plan Architect in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Building Plan Architect in Bareilly',
    description:
      'Need a building plan architect in Bareilly? MTBoss prepares plans for sanction, coordinates structure and services, and builds if you choose. Call +91 94584 10866.',
    images: [
      'https://www.MTBoss.in/og-building-plan-architect-in-bareilly.jpg',
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
    name: 'MTBoss Construction Private Limited',
    url: 'https://www.MTBoss.in/building-plan-architect-in-bareilly',
    telephone: '+91-9458410866',
    email: 'MTBoss2016@gmail.com',
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