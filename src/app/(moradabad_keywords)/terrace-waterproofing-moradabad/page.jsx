// app/(moradabad_keywords)/terrace-waterproofing-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Terrace Waterproofing in Moradabad | MT Boss',
  description:
    'Terrace waterproofing in Moradabad by MT Boss. Leakage treatment for parapets, tanks, outlets and tiled terraces, with testing and clear itemised quotations.',
  keywords:
    'terrace waterproofing Moradabad, terrace leakage repair Moradabad, roof terrace waterproofing Moradabad, parapet waterproofing Moradabad, water tank platform waterproofing Moradabad, terrace drain waterproofing Moradabad, tiled terrace waterproofing Moradabad, terrace waterproofing contractor near me, waterproofing services Moradabad, MT Boss terrace waterproofing Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/terrace-waterproofing-moradabad',
  },
  openGraph: {
    title: 'Terrace Waterproofing in Moradabad | MT Boss',
    description:
      'Terrace waterproofing in Moradabad by MT Boss. Leakage treatment for parapets, tanks, outlets and tiled terraces, with testing and clear itemised quotations.',
    url: 'https://www.mtboss.in/terrace-waterproofing-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-terrace-waterproofing-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Terrace Waterproofing in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terrace Waterproofing in Moradabad | MT Boss',
    description:
      'Terrace waterproofing in Moradabad by MT Boss. Leakage treatment for parapets, tanks, outlets and tiled terraces, with testing and clear itemised quotations.',
    images: ['https://www.mtboss.in/og-terrace-waterproofing-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/terrace-waterproofing-moradabad',
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