// app/(bareilly_keywords)/government-approved-architect-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Government Approved Architect in Bareilly | Registered & Verified | MTBOSS',
  description:
    'Looking for a government approved architect in Bareilly? Learn what approval means, how to verify credentials, and how MTBOSS prepares drawings for authority submission.',
  keywords:
    'government approved architect in Bareilly, government approved architect Bareilly, registered architect Bareilly, COA registered architect Bareilly, architect registration Bareilly, architect for building plan Bareilly, architect for map approval Bareilly, authority approved architect Bareilly, BDA approved architect Bareilly, architect verification Bareilly, MTBOSS Bareilly, government approved architect in Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/government-approved-architect-in-bareilly',
  },
  openGraph: {
    title:
      'Government Approved Architect in Bareilly | Registered & Verified | MTBOSS',
    description:
      'Looking for a government approved architect in Bareilly? Learn what approval means, how to verify credentials, and how MTBOSS prepares drawings for authority submission.',
    url:
      'https://www.mtboss.in/government-approved-architect-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-government-approved-architect-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Government Approved Architect in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Government Approved Architect in Bareilly | Registered & Verified | MTBOSS',
    description:
      'Looking for a government approved architect in Bareilly? Learn what approval means, how to verify credentials, and how MTBOSS prepares drawings for authority submission.',
    images: [
      'https://www.mtboss.in/og-government-approved-architect-in-bareilly.jpg',
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
    url:
      'https://www.mtboss.in/government-approved-architect-in-bareilly',
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