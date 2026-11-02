// app/(bareilly_keywords)/builder-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Builder in Bareilly | MTBoss Construction',
  description:
    'Looking for a builder in Bareilly? Learn the two kinds of builders, how to hire one for your plot and what to check before you sign. See how MTBoss works.',
  keywords:
    'builder in Bareilly, builders in Bareilly, construction company Bareilly, house builder Bareilly, building contractor Bareilly, civil contractor Bareilly, builder for own plot Bareilly, builder floors Bareilly, house construction Bareilly, commercial builder Bareilly, renovation builder Bareilly, MTBoss Bareilly, MTBoss construction',
  alternates: {
    canonical: 'https://www.mtboss.in/builder-in-bareilly',
  },
  openGraph: {
    title: 'Builder in Bareilly | MTBoss Construction',
    description:
      'Looking for a builder in Bareilly? Learn the two kinds of builders, how to hire one for your plot and what to check before you sign. See how MTBoss works.',
    url: 'https://www.mtboss.in/builder-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-builder-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Builder in Bareilly - MTBoss Construction',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Builder in Bareilly | MTBoss Construction',
    description:
      'Looking for a builder in Bareilly? Learn the two kinds of builders, how to hire one for your plot and what to check before you sign. See how MTBoss works.',
    images: ['https://www.mtboss.in/og-builder-in-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/builder-in-bareilly',
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