// app/(bareilly_keywords)/civil-construction-company-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Civil Construction Company in Bareilly | Residential & Commercial | MTBOSS',
  description:
    'MTBOSS is a civil construction company serving Bareilly for houses, shops, offices and renovations, with clear scope, supervised sites and finishing under one team.',
  keywords:
    'civil construction company in Bareilly, civil construction Bareilly, construction company Bareilly, civil contractor Bareilly, building contractor Bareilly, house construction Bareilly, home construction company Bareilly, commercial construction Bareilly, office construction Bareilly, shop construction Bareilly, renovation company Bareilly, building repair Bareilly, waterproofing Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/civil-construction-company-in-bareilly',
  },
  openGraph: {
    title:
      'Civil Construction Company in Bareilly | Residential & Commercial | MTBOSS',
    description:
      'MTBOSS is a civil construction company serving Bareilly for houses, shops, offices and renovations, with clear scope, supervised sites and finishing under one team.',
    url:
      'https://www.mtboss.in/civil-construction-company-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-civil-construction-company-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Construction Company in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Civil Construction Company in Bareilly | Residential & Commercial | MTBOSS',
    description:
      'MTBOSS is a civil construction company serving Bareilly for houses, shops, offices and renovations, with clear scope, supervised sites and finishing under one team.',
    images: [
      'https://www.mtboss.in/og-civil-construction-company-in-bareilly.jpg',
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
      'https://www.mtboss.in/civil-construction-company-in-bareilly',
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