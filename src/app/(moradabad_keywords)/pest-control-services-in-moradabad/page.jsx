// app/(moradabad_keywords)/pest-control-services-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Pest Control Services in Moradabad | MT Boss',
  description:
    'Pest control services in Moradabad by MT Boss. Cockroach, termite, ant, bed bug, mosquito and rodent treatment for homes, shops and godowns. Call +91 94584 10866.',
  keywords:
    'pest control services Moradabad, pest control Moradabad, cockroach control Moradabad, termite treatment Moradabad, anti termite treatment Moradabad, bed bug treatment Moradabad, mosquito control Moradabad, rodent control Moradabad, ant control Moradabad, pest control for godowns Moradabad, MT Boss pest control Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/pest-control-services-moradabad',
  },
  openGraph: {
    title: 'Pest Control Services in Moradabad | MT Boss',
    description:
      'Pest control services in Moradabad by MT Boss. Cockroach, termite, ant, bed bug, mosquito and rodent treatment for homes, shops and godowns. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/pest-control-services-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-pest-control-services-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Pest Control Services in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pest Control Services in Moradabad | MT Boss',
    description:
      'Pest control services in Moradabad by MT Boss. Cockroach, termite, ant, bed bug, mosquito and rodent treatment for homes, shops and godowns. Call +91 94584 10866.',
    images: ['https://www.mtboss.in/og-pest-control-services-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/pest-control-services-moradabad',
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