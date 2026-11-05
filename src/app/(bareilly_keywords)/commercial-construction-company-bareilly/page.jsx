// app/(bareilly_keywords)/commercial-construction-company-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Commercial Construction Company  Bareilly | MTBOSS Construction',
  description:
    'MTBOSS is a commercial construction company in Bareilly building offices, showrooms, hotels, hospitals and warehouses with transparent pricing and on-time delivery. Request a quote.',
  keywords:
    'commercial construction company in Bareilly, commercial builder Bareilly, office construction Bareilly, showroom construction Bareilly, hotel construction Bareilly, hospital construction Bareilly, warehouse construction Bareilly, commercial building contractor Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/commercial-construction-company-bareilly',
  },
  openGraph: {
    title:
      'Commercial Construction Company  Bareilly | MTBOSS Construction',
    description:
      'MTBOSS is a commercial construction company in Bareilly building offices, showrooms, hotels, hospitals and warehouses with transparent pricing and on-time delivery. Request a quote.',
    url:
      'https://www.mtboss.in/commercial-construction-company-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-commercial-construction-company-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Commercial Construction Company in Bareilly - MTBOSS Construction',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Commercial Construction Company in Bareilly | MTBOSS Construction',
    description:
      'MTBOSS is a commercial construction company in Bareilly building offices, showrooms, hotels, hospitals and warehouses with transparent pricing and on-time delivery. Request a quote.',
    images: [
      'https://www.mtboss.in/og-commercial-construction-company-in-bareilly.jpg',
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
      'https://www.mtboss.in/commercial-construction-company-bareilly',
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