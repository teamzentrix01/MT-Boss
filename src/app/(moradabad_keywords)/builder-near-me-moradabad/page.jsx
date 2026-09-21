// app/(moradabad_keywords)/builder-near-me-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Builder Near Me in Moradabad | MTBOSS Construction',
  description:
    'Searching for a "builder near me" in Moradabad? MTBOSS offers local construction, materials & home services with fast response. Get a free quote now!',
  keywords:
    'builder near me Moradabad, local builder near me, nearby construction company Moradabad, builder near me, house construction near me, contractor near me Moradabad, home builder near my area, local contractor Moradabad, MTBOSS Moradabad, construction company near me',
  alternates: {
    canonical: 'https://www.mtboss.in/builder-near-me-in-moradabad',
  },
  openGraph: {
    title: 'Builder Near Me in Moradabad | MTBOSS Construction',
    description:
      'Searching for a "builder near me" in Moradabad? MTBOSS offers local construction, materials & home services with fast response. Get a free quote now!',
    url: 'https://www.mtboss.in/builder-near-me-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-builder-near-me-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Builder Near Me in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Builder Near Me in Moradabad | MTBOSS Construction',
    description:
      'Searching for a "builder near me" in Moradabad? MTBOSS offers local construction, materials & home services with fast response. Get a free quote now!',
    images: ['https://www.mtboss.in/og-builder-near-me-moradabad.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'MTBOSS Construction Private Limited',
  url: 'https://www.mtboss.in/builder-near-me-in-moradabad',
  telephone: '+91-9458410866',
  email: 'mtboss2016@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
    addressLocality: 'Moradabad',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
    // postalCode: 'ADD_PIN_CODE_HERE'
  },
  areaServed: {
    '@type': 'City',
    name: 'Moradabad',
  },
  priceRange: '₹₹',
};

export default function Page() {
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