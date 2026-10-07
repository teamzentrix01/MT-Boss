// app/(moradabad_keywords)/small-modular-kitchen-design-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Small Modular Kitchen Design in Moradabad | Space-Saving Ideas | MTBOSS',
  description:
    'Small modular kitchen design in Moradabad for flats and compact homes. MTBOSS plans space-saving layouts, smart storage and clean installation. Call or WhatsApp.',
  keywords:
    'small modular kitchen design Moradabad, small kitchen design Moradabad, compact modular kitchen Moradabad, small kitchen ideas Moradabad, small kitchen layout Moradabad, space saving kitchen design Moradabad, small modular kitchen for flats Moradabad, small kitchen interior design Moradabad, modular kitchen for small homes Moradabad, MTBOSS small modular kitchen Moradabad',
  alternates: {
    canonical:
      'https://www.mtboss.in/small-modular-kitchen-design-moradabad',
  },
  openGraph: {
    title:
      'Small Modular Kitchen Design in Moradabad | Space-Saving Ideas | MTBOSS',
    description:
      'Small modular kitchen design in Moradabad for flats and compact homes. MTBOSS plans space-saving layouts, smart storage and clean installation. Call or WhatsApp.',
    url: 'https://www.mtboss.in/small-modular-kitchen-design-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-small-modular-kitchen-design-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Small Modular Kitchen Design in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Small Modular Kitchen Design in Moradabad | Space-Saving Ideas | MTBOSS',
    description:
      'Small modular kitchen design in Moradabad for flats and compact homes. MTBOSS plans space-saving layouts, smart storage and clean installation. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-small-modular-kitchen-design-moradabad.jpg',
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
  url: 'https://www.mtboss.in/small-modular-kitchen-design-moradabad',
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