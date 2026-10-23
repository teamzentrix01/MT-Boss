// app/(bareilly_keywords)/architect-near-me-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect Near Me in Bareilly | MTBoss Design & Build',
  description:
    'Looking for an architect near you in Bareilly? MTBoss serves Bareilly from Moradabad with site visits, video reviews and shared drawings. Call +91 94584 10866.',
  keywords:
    'architect near me Bareilly, architect in Bareilly, house architect Bareilly, building designer Bareilly, home design Bareilly, commercial architect Bareilly, interior designer Bareilly, elevation designer Bareilly, architectural drawings Bareilly, MTBoss Bareilly, design and build Bareilly, architect near me',
  alternates: {
    canonical: 'https://www.MTBoss.in/architect-near-me-bareilly',
  },
  openGraph: {
    title: 'Architect Near Me in Bareilly | MTBoss Design & Build',
    description:
      'Looking for an architect near you in Bareilly? MTBoss serves Bareilly from Moradabad with site visits, video reviews and shared drawings. Call +91 94584 10866.',
    url: 'https://www.MTBoss.in/architect-near-me-bareilly',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-architect-near-me-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect Near Me in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect Near Me in Bareilly | MTBoss Design & Build',
    description:
      'Looking for an architect near you in Bareilly? MTBoss serves Bareilly from Moradabad with site visits, video reviews and shared drawings. Call +91 94584 10866.',
    images: ['https://www.MTBoss.in/og-architect-near-me-bareilly.jpg'],
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
    url: 'https://www.MTBoss.in/architect-near-me-bareilly',
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