// app/(moradabad_keywords)/carpenter-services-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Carpenter Services in Moradabad | Furniture, Doors & Repair | MTBOSS',
  description:
    'Carpenter services in Moradabad for furniture, wardrobes, doors, windows and repairs. MTBOSS offers skilled woodwork for homes and shops. Call or WhatsApp to book.',
  keywords:
    'carpenter services Moradabad, carpenter near me Moradabad, carpenter for furniture Moradabad, carpenter for wardrobe Moradabad, carpenter for door repair Moradabad, carpenter for window repair Moradabad, custom furniture Moradabad, wooden furniture maker Moradabad, carpenter for home repair Moradabad, MTBOSS carpenter services Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/carpenter-services-moradabad',
  },
  openGraph: {
    title:
      'Carpenter Services in Moradabad | Furniture, Doors & Repair | MTBOSS',
    description:
      'Carpenter services in Moradabad for furniture, wardrobes, doors, windows and repairs. MTBOSS offers skilled woodwork for homes and shops. Call or WhatsApp to book.',
    url: 'https://www.mtboss.in/carpenter-services-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-carpenter-services-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Carpenter Services in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Carpenter Services in Moradabad | Furniture, Doors & Repair | MTBOSS',
    description:
      'Carpenter services in Moradabad for furniture, wardrobes, doors, windows and repairs. MTBOSS offers skilled woodwork for homes and shops. Call or WhatsApp to book.',
    images: ['https://www.mtboss.in/og-carpenter-services-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/carpenter-services-moradabad',
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