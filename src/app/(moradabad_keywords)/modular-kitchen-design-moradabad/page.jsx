// app/(moradabad_keywords)/modular-kitchen-design-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Modular Kitchen Design in Moradabad | MT Boss',
  description:
    'Modular kitchen design in Moradabad by MT Boss. Ergonomics, storage, lighting and style planned around how you cook, with clear plans before work begins.',
  keywords:
    'modular kitchen design Moradabad, kitchen design Moradabad, modular kitchen designer Moradabad, kitchen interior design Moradabad, modular kitchen layout Moradabad, L shaped modular kitchen Moradabad, U shaped modular kitchen Moradabad, kitchen planner Moradabad, 3D kitchen design Moradabad, MT Boss modular kitchen design Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/modular-kitchen-design-moradabad',
  },
  openGraph: {
    title: 'Modular Kitchen Design in Moradabad | MT Boss',
    description:
      'Modular kitchen design in Moradabad by MT Boss. Ergonomics, storage, lighting and style planned around how you cook, with clear plans before work begins.',
    url: 'https://www.mtboss.in/modular-kitchen-design-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-modular-kitchen-design-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Modular Kitchen Design in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modular Kitchen Design in Moradabad | MT Boss',
    description:
      'Modular kitchen design in Moradabad by MT Boss. Ergonomics, storage, lighting and style planned around how you cook, with clear plans before work begins.',
    images: ['https://www.mtboss.in/og-modular-kitchen-design-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/modular-kitchen-design-moradabad',
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