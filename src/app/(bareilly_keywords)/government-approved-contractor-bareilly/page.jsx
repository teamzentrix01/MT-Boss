// app/(bareilly_keywords)/government-approved-contractor-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Government Approved Contractor in Bareilly | Verify Before You Hire | MTBOSS',
  description:
    'Looking for a government approved contractor in Bareilly? Learn what the term means, how to verify registration, and how MTBOSS shares verified credentials on request.',
  keywords:
    'government approved contractor in Bareilly, government approved contractor Bareilly, registered contractor Bareilly, licensed contractor Bareilly, verified contractor Bareilly, construction contractor Bareilly, building contractor Bareilly, civil contractor Bareilly, contractor registration Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/government-approved-contractor-bareilly',
  },
  openGraph: {
    title:
      'Government Approved Contractor in Bareilly | Verify Before You Hire | MTBOSS',
    description:
      'Looking for a government approved contractor in Bareilly? Learn what the term means, how to verify registration, and how MTBOSS shares verified credentials on request.',
    url:
      'https://www.mtboss.in/government-approved-contractor-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-government-approved-contractor-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Government Approved Contractor in Bareilly - Verify Before You Hire - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Government Approved Contractor in Bareilly | Verify Before You Hire | MTBOSS',
    description:
      'Looking for a government approved contractor in Bareilly? Learn what the term means, how to verify registration, and how MTBOSS shares verified credentials on request.',
    images: [
      'https://www.mtboss.in/og-government-approved-contractor-in-bareilly.jpg',
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
      'https://www.mtboss.in/government-approved-contractor-bareilly',
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