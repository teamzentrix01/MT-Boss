// app/(bareilly_keywords)/construction-service-provider-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Construction Service Provider in Bareilly | MTBoss',
  description:
    'Need a construction service provider in Bareilly? MTBoss offers building, renovation, repair, waterproofing and finishing services, with itemised estimates.',
  keywords:
    'construction service provider in Bareilly, construction services Bareilly, building contractor Bareilly, renovation services Bareilly, building repair Bareilly, waterproofing services Bareilly, interior finishing Bareilly, plumber Bareilly, electrician Bareilly, carpenter Bareilly, painter Bareilly, modular kitchen Bareilly, false ceiling Bareilly, construction company Bareilly, MTBoss Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/construction-service-provider-in-bareilly',
  },
  openGraph: {
    title: 'Construction Service Provider in Bareilly | MTBoss',
    description:
      'Need a construction service provider in Bareilly? MTBoss offers building, renovation, repair, waterproofing and finishing services, with itemised estimates.',
    url:
      'https://www.mtboss.in/construction-service-provider-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-construction-service-provider-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Construction Service Provider in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Service Provider in Bareilly | MTBoss',
    description:
      'Need a construction service provider in Bareilly? MTBoss offers building, renovation, repair, waterproofing and finishing services, with itemised estimates.',
    images: [
      'https://www.mtboss.in/og-construction-service-provider-in-bareilly.jpg',
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
      'https://www.mtboss.in/construction-service-provider-in-bareilly',
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