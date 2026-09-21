// app/(moradabad_keywords)/building-contractor-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Building Contractor in Moradabad | MTBOSS Construction',
  description:
    'Need a building contractor in Moradabad for your home or business? MTBOSS delivers quality construction, materials & doorstep services. Call now!',
  keywords:
    'building contractor in Moradabad, building contractor near me, house building contractor Moradabad, commercial building contractor Moradabad, building construction company Moradabad, residential building contractor near me, industrial building contractor Moradabad, MTBOSS Moradabad, building contractor contact number, building work near me',
  alternates: {
    canonical: 'https://www.mtboss.in/building-contractor-in-moradabad',
  },
  openGraph: {
    title: 'Building Contractor in Moradabad | MTBOSS Construction',
    description:
      'Need a building contractor in Moradabad for your home or business? MTBOSS delivers quality construction, materials & doorstep services. Call now!',
    url: 'https://www.mtboss.in/building-contractor-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-building-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Building Contractor in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Building Contractor in Moradabad | MTBOSS Construction',
    description:
      'Need a building contractor in Moradabad for your home or business? MTBOSS delivers quality construction, materials & doorstep services. Call now!',
    images: ['https://www.mtboss.in/og-building-contractor-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/building-contractor-in-moradabad',
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