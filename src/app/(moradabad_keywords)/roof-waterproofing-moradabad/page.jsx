// app/(moradabad_keywords)/roof-waterproofing-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Roof Waterproofing in Moradabad | MT Boss',
  description:
    'Roof waterproofing in Moradabad by MT Boss. Terrace and sheet roof leakage treatment, slope correction and testing for homes, shops and factories.',
  keywords:
    'roof waterproofing Moradabad, terrace waterproofing Moradabad, roof leakage solution Moradabad, roof waterproofing contractor Moradabad, sheet roof waterproofing Moradabad, factory roof waterproofing Moradabad, RCC terrace waterproofing Moradabad, parapet waterproofing Moradabad, roof leakage repair near me, MT Boss roof waterproofing Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/roof-waterproofing-moradabad',
  },
  openGraph: {
    title: 'Roof Waterproofing in Moradabad | MT Boss',
    description:
      'Roof waterproofing in Moradabad by MT Boss. Terrace and sheet roof leakage treatment, slope correction and testing for homes, shops and factories.',
    url: 'https://www.mtboss.in/roof-waterproofing-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-roof-waterproofing-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Roof Waterproofing in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roof Waterproofing in Moradabad | MT Boss',
    description:
      'Roof waterproofing in Moradabad by MT Boss. Terrace and sheet roof leakage treatment, slope correction and testing for homes, shops and factories.',
    images: ['https://www.mtboss.in/og-roof-waterproofing-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/roof-waterproofing-moradabad',
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