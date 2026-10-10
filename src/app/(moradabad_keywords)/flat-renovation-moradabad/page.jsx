// app/(moradabad_keywords)/flat-renovation-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Flat Renovation in Moradabad | Apartment Repair & Remodel | MTBOSS',
  description:
    'Flat renovation in Moradabad: plan around society rules, shared walls and compact space. MTBOSS manages repair, interiors and finishing in one team. Call or WhatsApp.',
  keywords:
    'flat renovation Moradabad, apartment renovation Moradabad, flat remodelling Moradabad, apartment repair Moradabad, flat interior renovation Moradabad, society renovation permission Moradabad, flat waterproofing Moradabad, compact flat renovation Moradabad, flat kitchen renovation Moradabad, flat bathroom renovation Moradabad, MTBOSS flat renovation Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/flat-renovation-moradabad',
  },
  openGraph: {
    title:
      'Flat Renovation in Moradabad | Apartment Repair & Remodel | MTBOSS',
    description:
      'Flat renovation in Moradabad: plan around society rules, shared walls and compact space. MTBOSS manages repair, interiors and finishing in one team. Call or WhatsApp.',
    url: 'https://www.mtboss.in/flat-renovation-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-flat-renovation-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Flat Renovation in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Flat Renovation in Moradabad | Apartment Repair & Remodel | MTBOSS',
    description:
      'Flat renovation in Moradabad: plan around society rules, shared walls and compact space. MTBOSS manages repair, interiors and finishing in one team. Call or WhatsApp.',
    images: ['https://www.mtboss.in/og-flat-renovation-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/flat-renovation-moradabad',
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