// app/(moradabad_keywords)/waterproofing-services-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Waterproofing Services in Moradabad | MT Boss',
  description:
    'Need waterproofing services in Moradabad? MT Boss treats terrace, bathroom, basement, tank and wall leakage with proper diagnosis, testing and clear quotations.',
  keywords:
    'waterproofing services Moradabad, waterproofing contractor Moradabad, terrace waterproofing Moradabad, bathroom waterproofing Moradabad, basement waterproofing Moradabad, water tank waterproofing Moradabad, wall leakage repair Moradabad, roof leakage solution Moradabad, waterproofing company near me, MT Boss waterproofing Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/waterproofing-services-moradabad',
  },
  openGraph: {
    title: 'Waterproofing Services in Moradabad | MT Boss',
    description:
      'Need waterproofing services in Moradabad? MT Boss treats terrace, bathroom, basement, tank and wall leakage with proper diagnosis, testing and clear quotations.',
    url: 'https://www.mtboss.in/waterproofing-services-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-waterproofing-services-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Waterproofing Services in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waterproofing Services in Moradabad | MT Boss',
    description:
      'Need waterproofing services in Moradabad? MT Boss treats terrace, bathroom, basement, tank and wall leakage with proper diagnosis, testing and clear quotations.',
    images: ['https://www.mtboss.in/og-waterproofing-services-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/waterproofing-services-moradabad',
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