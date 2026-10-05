// app/(moradabad_keywords)/basement-waterproofing-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Basement Waterproofing in Moradabad | MT Boss',
  description:
    'Basement waterproofing in Moradabad by MT Boss. Seepage, damp wall and floor treatment, drainage and sump planning with inspection and clear itemised quotes.',
  keywords:
    'basement waterproofing Moradabad, basement seepage repair Moradabad, damp basement walls Moradabad, basement leakage solution Moradabad, basement waterproofing contractor Moradabad, basement drainage system Moradabad, sump pump installation Moradabad, underground basement waterproofing Moradabad, basement damp proofing Moradabad, MT Boss basement waterproofing Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/basement-waterproofing-moradabad',
  },
  openGraph: {
    title: 'Basement Waterproofing in Moradabad | MT Boss',
    description:
      'Basement waterproofing in Moradabad by MT Boss. Seepage, damp wall and floor treatment, drainage and sump planning with inspection and clear itemised quotes.',
    url: 'https://www.mtboss.in/basement-waterproofing-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-basement-waterproofing-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Basement Waterproofing in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Basement Waterproofing in Moradabad | MT Boss',
    description:
      'Basement waterproofing in Moradabad by MT Boss. Seepage, damp wall and floor treatment, drainage and sump planning with inspection and clear itemised quotes.',
    images: ['https://www.mtboss.in/og-basement-waterproofing-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/basement-waterproofing-moradabad',
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