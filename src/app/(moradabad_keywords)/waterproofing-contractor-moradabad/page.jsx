// app/(moradabad_keywords)/waterproofing-contractor-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Waterproofing Contractor in Moradabad | MT Boss',
  description:
    'MT Boss is a waterproofing contractor in Moradabad for homes, buildings, shops and factories. Inspection, written scope, supervised work and clear itemised quotes.',
  keywords:
    'waterproofing contractor Moradabad, waterproofing contractor near me, waterproofing company Moradabad, waterproofing services Moradabad, leakage repair contractor Moradabad, terrace waterproofing Moradabad, bathroom waterproofing Moradabad, basement waterproofing Moradabad, water tank waterproofing Moradabad, MT Boss waterproofing Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/waterproofing-contractor-moradabad',
  },
  openGraph: {
    title: 'Waterproofing Contractor in Moradabad | MT Boss',
    description:
      'MT Boss is a waterproofing contractor in Moradabad for homes, buildings, shops and factories. Inspection, written scope, supervised work and clear itemised quotes.',
    url: 'https://www.mtboss.in/waterproofing-contractor-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-waterproofing-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Waterproofing Contractor in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waterproofing Contractor in Moradabad | MT Boss',
    description:
      'MT Boss is a waterproofing contractor in Moradabad for homes, buildings, shops and factories. Inspection, written scope, supervised work and clear itemised quotes.',
    images: ['https://www.mtboss.in/og-waterproofing-contractor-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/waterproofing-contractor-moradabad',
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