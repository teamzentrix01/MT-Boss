// app/(moradabad_keywords)/kitchen-renovation-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Kitchen Renovation in Moradabad',
  description:
    'Kitchen renovation in Moradabad: replace old platforms, fix leaks, upgrade plumbing, tiles and cabinets. MTBOSS manages every trade for you. Call or WhatsApp for a quote.',
  keywords:
    'kitchen renovation Moradabad, kitchen remodelling Moradabad, kitchen renovation contractor Moradabad, kitchen repair Moradabad, kitchen upgrade Moradabad, old kitchen renovation Moradabad, kitchen platform replacement Moradabad, kitchen plumbing upgrade Moradabad, kitchen tiles Moradabad, kitchen cabinets Moradabad, kitchen renovation cost Moradabad, MTBOSS kitchen renovation Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/kitchen-renovation-moradabad',
  },
  openGraph: {
    title: 'Kitchen Renovation in Moradabad',
    description:
      'Kitchen renovation in Moradabad: replace old platforms, fix leaks, upgrade plumbing, tiles and cabinets. MTBOSS manages every trade for you. Call or WhatsApp for a quote.',
    url: 'https://www.mtboss.in/kitchen-renovation-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-kitchen-renovation-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Kitchen Renovation in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kitchen Renovation in Moradabad',
    description:
      'Kitchen renovation in Moradabad: replace old platforms, fix leaks, upgrade plumbing, tiles and cabinets. MTBOSS manages every trade for you. Call or WhatsApp for a quote.',
    images: ['https://www.mtboss.in/og-kitchen-renovation-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/kitchen-renovation-moradabad',
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