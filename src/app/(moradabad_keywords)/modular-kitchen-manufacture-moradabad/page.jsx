// app/(moradabad_keywords)/modular-kitchen-manufacturer-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Modular Kitchen Manufacturer in Moradabad | MT Boss',
  description:
    'Looking for a modular kitchen manufacturer in Moradabad? See how made-to-measure kitchens are cut, finished, checked and fitted by MT Boss. Call +91 94584 10866.',
  keywords:
    'modular kitchen manufacturer Moradabad, modular kitchen manufacturer near me Moradabad, modular kitchen factory Moradabad, modular kitchen maker Moradabad, modular kitchen manufacturing Moradabad, made to measure modular kitchen Moradabad, modular kitchen supplier Moradabad, modular kitchen workshop Moradabad, modular kitchen production Moradabad, MT Boss modular kitchen manufacturer Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/modular-kitchen-manufacturer-moradabad',
  },
  openGraph: {
    title: 'Modular Kitchen Manufacturer in Moradabad | MT Boss',
    description:
      'Looking for a modular kitchen manufacturer in Moradabad? See how made-to-measure kitchens are cut, finished, checked and fitted by MT Boss. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/modular-kitchen-manufacturer-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-modular-kitchen-manufacturer-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Modular Kitchen Manufacturer in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modular Kitchen Manufacturer in Moradabad | MT Boss',
    description:
      'Looking for a modular kitchen manufacturer in Moradabad? See how made-to-measure kitchens are cut, finished, checked and fitted by MT Boss. Call +91 94584 10866.',
    images: [
      'https://www.mtboss.in/og-modular-kitchen-manufacturer-moradabad.jpg',
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
  url: 'https://www.mtboss.in/modular-kitchen-manufacturer-moradabad',
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