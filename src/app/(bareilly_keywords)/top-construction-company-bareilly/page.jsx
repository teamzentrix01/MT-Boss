// app/(bareilly_keywords)/top-construction-company-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Top Construction Company in Bareilly | MTBoss',
  description:
    'Looking for a top construction company in Bareilly? Learn how to build a shortlist, test each builder and compare quotes, and see where MTBoss stands..',
  keywords:
    'top construction company in Bareilly, top builder in Bareilly, best construction company Bareilly, construction company Bareilly, building contractor Bareilly, civil contractor Bareilly, house construction Bareilly, home construction company Bareilly, commercial construction Bareilly, construction contractor Bareilly, reliable builder Bareilly, MTBoss Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/top-construction-company-in-bareilly',
  },
  openGraph: {
    title: 'Top Construction Company in Bareilly | MTBoss',
    description:
      'Looking for a top construction company in Bareilly? Learn how to build a shortlist, test each builder and compare quotes, and see where MTBoss stands..',
    url:
      'https://www.mtboss.in/top-construction-company-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-top-construction-company-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Top Construction Company in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Construction Company in Bareilly | MTBoss',
    description:
      'Looking for a top construction company in Bareilly? Learn how to build a shortlist, test each builder and compare quotes, and see where MTBoss stands..',
    images: [
      'https://www.mtboss.in/og-top-construction-company-in-bareilly.jpg',
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
      'https://www.mtboss.in/top-construction-company-in-bareilly',
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