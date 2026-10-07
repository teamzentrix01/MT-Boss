// app/(moradabad_keywords)/pest-control-cost-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Pest Control Cost in Moradabad',
  description:
    'Understand pest control cost in Moradabad for flats, houses, shops and godowns. Learn what affects pricing and get an inspection-based quote from MTBOSS.',
  keywords:
    'pest control cost Moradabad, pest control price Moradabad, pest control charges Moradabad, pest control rates Moradabad, pest control cost per room Moradabad, cockroach control cost Moradabad, termite treatment cost Moradabad, bed bug treatment cost Moradabad, rodent control cost Moradabad, MTBOSS pest control cost Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/pest-control-cost-moradabad',
  },
  openGraph: {
    title: 'Pest Control Cost in Moradabad',
    description:
      'Understand pest control cost in Moradabad for flats, houses, shops and godowns. Learn what affects pricing and get an inspection-based quote from MTBOSS.',
    url: 'https://www.mtboss.in/pest-control-cost-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-pest-control-cost-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Pest Control Cost in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pest Control Cost in Moradabad',
    description:
      'Understand pest control cost in Moradabad for flats, houses, shops and godowns. Learn what affects pricing and get an inspection-based quote from MTBOSS.',
    images: ['https://www.mtboss.in/og-pest-control-cost-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/pest-control-cost-moradabad',
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