// app/(bareilly_keywords)/construction-company-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Construction Company in Bareilly | MTBoss',
  description:
    'Looking for a construction company in Bareilly? MTBoss builds homes, shops, hotels, warehouses and roads with clear estimates, supervision and honest timelines.',
  keywords:
    'construction company in Bareilly, construction company Bareilly, builders in Bareilly, building contractor Bareilly, civil contractor Bareilly, house construction Bareilly, home construction company Bareilly, commercial construction Bareilly, warehouse construction Bareilly, road construction Bareilly, renovation company Bareilly, construction contractor Bareilly, MTBoss Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/construction-company-in-bareilly',
  },
  openGraph: {
    title: 'Construction Company in Bareilly | MTBoss',
    description:
      'Looking for a construction company in Bareilly? MTBoss builds homes, shops, hotels, warehouses and roads with clear estimates, supervision and honest timelines.',
    url:
      'https://www.mtboss.in/construction-company-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-construction-company-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Construction Company in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Company in Bareilly | MTBoss',
    description:
      'Looking for a construction company in Bareilly? MTBoss builds homes, shops, hotels, warehouses and roads with clear estimates, supervision and honest timelines.',
    images: [
      'https://www.mtboss.in/og-construction-company-in-bareilly.jpg',
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
      'https://www.mtboss.in/construction-company-in-bareilly',
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