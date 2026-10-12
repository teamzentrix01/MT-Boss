// app/(bareilly_keywords)/architect-near-me-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect Near Me in Bareilly | MT Boss Design & Build',
  description:
    'Looking for an architect near you in Bareilly? MT Boss serves Bareilly from Moradabad with site visits, video reviews and shared drawings. Call +91 94584 10866.',
  keywords:
    'architect near me Bareilly, architect in Bareilly, house architect Bareilly, building designer Bareilly, home design Bareilly, commercial architect Bareilly, interior designer Bareilly, elevation designer Bareilly, architectural drawings Bareilly, MT Boss Bareilly, design and build Bareilly, architect near me',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-near-me-bareilly',
  },
  openGraph: {
    title: 'Architect Near Me in Bareilly | MT Boss Design & Build',
    description:
      'Looking for an architect near you in Bareilly? MT Boss serves Bareilly from Moradabad with site visits, video reviews and shared drawings. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/architect-near-me-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-near-me-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect Near Me in Bareilly - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect Near Me in Bareilly | MT Boss Design & Build',
    description:
      'Looking for an architect near you in Bareilly? MT Boss serves Bareilly from Moradabad with site visits, video reviews and shared drawings. Call +91 94584 10866.',
    images: ['https://www.mtboss.in/og-architect-near-me-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/architect-near-me-bareilly',
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