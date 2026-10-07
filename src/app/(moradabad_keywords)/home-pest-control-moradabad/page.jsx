// app/(moradabad_keywords)/home-pest-control-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Home Pest Control in Moradabad',
  description:
    'Home pest control in Moradabad for cockroaches, termites, bed bugs, ants and rodents. MTBOSS offers safe, inspection-led treatment. Call or WhatsApp to book.',
  keywords:
    'home pest control Moradabad, residential pest control Moradabad, pest control for homes Moradabad, cockroach control for homes Moradabad, termite control for homes Moradabad, bed bug treatment for homes Moradabad, rodent control for homes Moradabad, ant control Moradabad, home pest control near me Moradabad, MTBOSS home pest control Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/home-pest-control-moradabad',
  },
  openGraph: {
    title: 'Home Pest Control in Moradabad',
    description:
      'Home pest control in Moradabad for cockroaches, termites, bed bugs, ants and rodents. MTBOSS offers safe, inspection-led treatment. Call or WhatsApp to book.',
    url: 'https://www.mtboss.in/home-pest-control-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-home-pest-control-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Home Pest Control in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Pest Control in Moradabad',
    description:
      'Home pest control in Moradabad for cockroaches, termites, bed bugs, ants and rodents. MTBOSS offers safe, inspection-led treatment. Call or WhatsApp to book.',
    images: ['https://www.mtboss.in/og-home-pest-control-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/home-pest-control-moradabad',
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