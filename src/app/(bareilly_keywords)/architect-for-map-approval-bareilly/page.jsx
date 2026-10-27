// app/(bareilly_keywords)/architect-for-map-approval-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Map Approval in Bareilly | MTBOSS',
  description:
    'Need an architect for map approval in Bareilly? MTBOSS prepares sanction drawings, checks rules before submission and tracks your file. Call +91 94584 10866.',
  keywords:
    'architect for map approval in Bareilly, map approval architect Bareilly, map approval Bareilly, building map approval Bareilly, sanction drawing Bareilly, building plan approval Bareilly, map sanction Bareilly, naksha approval Bareilly, building plan sanction Bareilly, map approval architect near me Bareilly, MTBOSS Bareilly, architect for map approval Bareilly',
  alternates: {
    canonical:
      'https://www.MTBOSS.in/architect-for-map-approval-in-bareilly',
  },
  openGraph: {
    title: 'Architect for Map Approval in Bareilly | MTBOSS',
    description:
      'Need an architect for map approval in Bareilly? MTBOSS prepares sanction drawings, checks rules before submission and tracks your file. Call +91 94584 10866.',
    url: 'https://www.MTBOSS.in/architect-for-map-approval-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBOSS.in/og-architect-for-map-approval-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Map Approval in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Map Approval in Bareilly | MTBOSS',
    description:
      'Need an architect for map approval in Bareilly? MTBOSS prepares sanction drawings, checks rules before submission and tracks your file. Call +91 94584 10866.',
    images: [
      'https://www.MTBOSS.in/og-architect-for-map-approval-in-bareilly.jpg',
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
    url: 'https://www.MTBOSS.in/architect-for-map-approval-in-bareilly',
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