// app/(bareilly_keywords)/licensed-contractor-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Licensed Contractor in Bareilly | Documents to Check Before You Hire | MTBOSS',
  description:
    'Looking for a licensed contractor in Bareilly? See which registrations and documents to ask for, how to verify them, and what MTBOSS shares on request.',
  keywords:
    'licensed contractor in Bareilly, licensed contractor Bareilly, registered contractor Bareilly, verified contractor Bareilly, contractor documents Bareilly, contractor registration Bareilly, building contractor Bareilly, civil contractor Bareilly, construction contractor Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/licensed-contractor-in-bareilly',
  },
  openGraph: {
    title:
      'Licensed Contractor in Bareilly | Documents to Check Before You Hire | MTBOSS',
    description:
      'Looking for a licensed contractor in Bareilly? See which registrations and documents to ask for, how to verify them, and what MTBOSS shares on request.',
    url: 'https://www.mtboss.in/licensed-contractor-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-licensed-contractor-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Licensed Contractor in Bareilly - Documents to Check Before You Hire - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Licensed Contractor in Bareilly | Documents to Check Before You Hire | MTBOSS',
    description:
      'Looking for a licensed contractor in Bareilly? See which registrations and documents to ask for, how to verify them, and what MTBOSS shares on request.',
    images: [
      'https://www.mtboss.in/og-licensed-contractor-in-bareilly.jpg',
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
    url: 'https://www.mtboss.in/licensed-contractor-in-bareilly',
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