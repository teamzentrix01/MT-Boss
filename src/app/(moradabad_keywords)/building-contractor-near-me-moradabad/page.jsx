// app/(moradabad_keywords)/building-contractor-near-me-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Building Contractor Near Me in Moradabad | MTBOSS',
  description:
    'Searching for a "building contractor near me" in Moradabad? MTBOSS offers local construction, materials & home services with fast response. Get a free quote!',
  keywords:
    'building contractor near me Moradabad, contractor near me, local building contractor Moradabad, nearby construction company Moradabad, house construction near me, building work near my area, local contractor Moradabad, MTBOSS Moradabad, construction company near me, building contractor contact near me',
  alternates: {
    canonical: 'https://www.mtboss.in/building-contractor-near-me-in-moradabad',
  },
  openGraph: {
    title: 'Building Contractor Near Me in Moradabad | MTBOSS',
    description:
      'Searching for a "building contractor near me" in Moradabad? MTBOSS offers local construction, materials & home services with fast response. Get a free quote!',
    url: 'https://www.mtboss.in/building-contractor-near-me-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-building-contractor-near-me-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Building Contractor Near Me in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Building Contractor Near Me in Moradabad | MTBOSS',
    description:
      'Searching for a "building contractor near me" in Moradabad? MTBOSS offers local construction, materials & home services with fast response. Get a free quote!',
    images: ['https://www.mtboss.in/og-building-contractor-near-me-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/building-contractor-near-me-in-moradabad',
  telephone: '+91-9458410866',
  email: 'mtboss2016@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
    addressLocality: 'Moradabad',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
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