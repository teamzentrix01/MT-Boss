// app/(moradabad_keywords)/civil-construction-company-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Civil Construction Company in Moradabad | MTBOSS',
  description:
    'Looking for a trusted civil construction company in Moradabad? MTBOSS delivers residential, commercial & industrial projects with transparent pricing. Call now!',
  keywords:
    'civil construction company Moradabad, construction company in Moradabad, best construction company Moradabad, civil engineering company Moradabad, building company Moradabad, industrial construction company Moradabad, residential construction company Moradabad, MTBOSS Moradabad, construction firm near me, top construction company Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/civil-construction-company-in-moradabad',
  },
  openGraph: {
    title: 'Civil Construction Company in Moradabad | MTBOSS',
    description:
      'Looking for a trusted civil construction company in Moradabad? MTBOSS delivers residential, commercial & industrial projects with transparent pricing. Call now!',
    url: 'https://www.mtboss.in/civil-construction-company-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-civil-construction-company-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Construction Company in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Construction Company in Moradabad | MTBOSS',
    description:
      'Looking for a trusted civil construction company in Moradabad? MTBOSS delivers residential, commercial & industrial projects with transparent pricing. Call now!',
    images: ['https://www.mtboss.in/og-civil-construction-company-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/civil-construction-company-in-moradabad',
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