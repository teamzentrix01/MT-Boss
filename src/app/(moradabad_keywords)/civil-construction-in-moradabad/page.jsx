// app/(moradabad_keywords)/civil-construction-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Civil Construction in Moradabad | MTBOSS Construction Company',
  description:
    'Planning civil construction in Moradabad? MTBOSS offers residential, commercial & industrial building solutions with transparent pricing. Get a free quote!',
  keywords:
    'civil construction in Moradabad, civil construction company Moradabad, construction services Moradabad, civil engineering Moradabad, building construction Moradabad, industrial construction Moradabad, residential civil work Moradabad, commercial construction Moradabad, MTBOSS Moradabad, construction company near me',
  alternates: {
    canonical: 'https://www.mtboss.in/civil-construction-in-moradabad',
  },
  openGraph: {
    title: 'Civil Construction in Moradabad | MTBOSS Construction Company',
    description:
      'Planning civil construction in Moradabad? MTBOSS offers residential, commercial & industrial building solutions with transparent pricing. Get a free quote!',
    url: 'https://www.mtboss.in/civil-construction-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-civil-construction-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Construction in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Construction in Moradabad | MTBOSS Construction Company',
    description:
      'Planning civil construction in Moradabad? MTBOSS offers residential, commercial & industrial building solutions with transparent pricing. Get a free quote!',
    images: ['https://www.mtboss.in/og-civil-construction-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/civil-construction-in-moradabad',
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