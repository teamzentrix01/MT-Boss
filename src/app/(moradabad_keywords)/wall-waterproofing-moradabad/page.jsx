// app/(moradabad_keywords)/wall-waterproofing-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Wall Waterproofing in Moradabad | MT Boss',
  description:
    'Wall waterproofing in Moradabad by MT Boss. Damp wall, seepage and rising damp treatment, crack sealing and repainting, with inspection and itemised quotes.',
  keywords:
    'wall waterproofing Moradabad, damp wall treatment Moradabad, wall seepage treatment Moradabad, rising damp treatment Moradabad, external wall waterproofing Moradabad, internal wall waterproofing Moradabad, wall crack sealing Moradabad, damp proofing Moradabad, wall leakage repair Moradabad, MT Boss wall waterproofing Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/wall-waterproofing-moradabad',
  },
  openGraph: {
    title: 'Wall Waterproofing in Moradabad | MT Boss',
    description:
      'Wall waterproofing in Moradabad by MT Boss. Damp wall, seepage and rising damp treatment, crack sealing and repainting, with inspection and itemised quotes.',
    url: 'https://www.mtboss.in/wall-waterproofing-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-wall-waterproofing-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Wall Waterproofing in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wall Waterproofing in Moradabad | MT Boss',
    description:
      'Wall waterproofing in Moradabad by MT Boss. Damp wall, seepage and rising damp treatment, crack sealing and repainting, with inspection and itemised quotes.',
    images: ['https://www.mtboss.in/og-wall-waterproofing-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/wall-waterproofing-moradabad',
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