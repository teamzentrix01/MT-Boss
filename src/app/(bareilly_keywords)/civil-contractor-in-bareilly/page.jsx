// app/(bareilly_keywords)/civil-contractor-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Civil Contractor in Bareilly | Residential & Commercial Work | MTBOSS',
  description:
    'Looking for a civil contractor in Bareilly? MTBOSS handles construction, repair and extension work with written scope, supervised sites and finishing under one team.',
  keywords:
    'civil contractor in Bareilly, civil contractor Bareilly, building contractor Bareilly, construction contractor Bareilly, house contractor Bareilly, home construction Bareilly, commercial contractor Bareilly, building repair Bareilly, renovation contractor Bareilly, extension contractor Bareilly, waterproofing contractor Bareilly, civil work Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/civil-contractor-in-bareilly',
  },
  openGraph: {
    title:
      'Civil Contractor in Bareilly | Residential & Commercial Work | MTBOSS',
    description:
      'Looking for a civil contractor in Bareilly? MTBOSS handles construction, repair and extension work with written scope, supervised sites and finishing under one team.',
    url: 'https://www.mtboss.in/civil-contractor-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-civil-contractor-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Contractor in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Civil Contractor in Bareilly | Residential & Commercial Work | MTBOSS',
    description:
      'Looking for a civil contractor in Bareilly? MTBOSS handles construction, repair and extension work with written scope, supervised sites and finishing under one team.',
    images: ['https://www.mtboss.in/og-civil-contractor-in-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/civil-contractor-in-bareilly',
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