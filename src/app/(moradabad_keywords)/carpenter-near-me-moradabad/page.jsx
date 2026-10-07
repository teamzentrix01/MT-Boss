// app/(moradabad_keywords)/carpenter-near-me-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Carpenter Near Me in Moradabad | Local Woodwork & Repair | MTBOSS',
  description:
    'Need a carpenter near you in Moradabad? MTBOSS offers local carpenters for furniture, doors, wardrobes and repairs. Call or WhatsApp to book a visit.',
  keywords:
    'carpenter near me Moradabad, carpenter near me Moradabad contact number, local carpenter Moradabad, carpenter services near me Moradabad, carpenter for furniture near me Moradabad, carpenter for door repair near me Moradabad, carpenter for wardrobe repair Moradabad, woodwork carpenter near me Moradabad, carpenter booking Moradabad, MTBOSS carpenter near me Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/carpenter-near-me-moradabad',
  },
  openGraph: {
    title: 'Carpenter Near Me in Moradabad | Local Woodwork & Repair | MTBOSS',
    description:
      'Need a carpenter near you in Moradabad? MTBOSS offers local carpenters for furniture, doors, wardrobes and repairs. Call or WhatsApp to book a visit.',
    url: 'https://www.mtboss.in/carpenter-near-me-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-carpenter-near-me-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Carpenter Near Me in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carpenter Near Me in Moradabad | Local Woodwork & Repair | MTBOSS',
    description:
      'Need a carpenter near you in Moradabad? MTBOSS offers local carpenters for furniture, doors, wardrobes and repairs. Call or WhatsApp to book a visit.',
    images: ['https://www.mtboss.in/og-carpenter-near-me-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/carpenter-near-me-moradabad',
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