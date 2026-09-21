// app/(moradabad_keywords)/civil-engineering-contractor-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Civil Engineering Contractor in Moradabad | MTBOSS',
  description:
    'Looking for a civil engineering contractor in Moradabad? MTBOSS combines structural expertise with BIM technology for safe, durable builds. Call now!',
  keywords:
    'civil engineering contractor Moradabad, structural engineering contractor Moradabad, civil engineering company Moradabad, engineering construction firm Moradabad, structural design contractor near me, civil engineer near me Moradabad, BIM construction company Moradabad, MTBOSS Moradabad, engineering contractor near me, structural consultant Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/civil-engineering-contractor-in-moradabad',
  },
  openGraph: {
    title: 'Civil Engineering Contractor in Moradabad | MTBOSS',
    description:
      'Looking for a civil engineering contractor in Moradabad? MTBOSS combines structural expertise with BIM technology for safe, durable builds. Call now!',
    url: 'https://www.mtboss.in/civil-engineering-contractor-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-civil-engineering-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Engineering Contractor in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Engineering Contractor in Moradabad | MTBOSS',
    description:
      'Looking for a civil engineering contractor in Moradabad? MTBOSS combines structural expertise with BIM technology for safe, durable builds. Call now!',
    images: ['https://www.mtboss.in/og-civil-engineering-contractor-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/civil-engineering-contractor-in-moradabad',
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