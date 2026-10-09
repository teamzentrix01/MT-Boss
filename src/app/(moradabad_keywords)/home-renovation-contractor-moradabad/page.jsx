// app/(moradabad_keywords)/home-renovation-contractor-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Home Renovation Contractor Moradabad',
  description:
    'Hire a home renovation contractor in Moradabad for turnkey repair, civil work, interiors and finishing. MTBOSS manages every trade for you. Call or WhatsApp.',
  keywords:
    'home renovation contractor Moradabad, renovation contractor Moradabad, home renovation Moradabad, house renovation contractor Moradabad, turnkey renovation Moradabad, home remodelling Moradabad, renovation company Moradabad, home repair contractor Moradabad, interior renovation Moradabad, civil renovation contractor Moradabad, MTBOSS renovation Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/home-renovation-contractor-moradabad',
  },
  openGraph: {
    title: 'Home Renovation Contractor Moradabad',
    description:
      'Hire a home renovation contractor in Moradabad for turnkey repair, civil work, interiors and finishing. MTBOSS manages every trade for you. Call or WhatsApp.',
    url: 'https://www.mtboss.in/home-renovation-contractor-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-home-renovation-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Home Renovation Contractor in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Renovation Contractor Moradabad',
    description:
      'Hire a home renovation contractor in Moradabad for turnkey repair, civil work, interiors and finishing. MTBOSS manages every trade for you. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-home-renovation-contractor-moradabad.jpg',
    ],
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
  url: 'https://www.mtboss.in/home-renovation-contractor-moradabad',
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