// app/(moradabad_keywords)/termite-control-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Termite Control in Moradabad | MT Boss',
  description:
    'Termite control in Moradabad by MT Boss. Inspection, treatment for existing homes, protection for new buildings and wood treatment. Call +91 94584 10866.',
  keywords:
    'termite control Moradabad, termite treatment Moradabad, anti termite treatment Moradabad, termite pest control Moradabad, termite inspection Moradabad, pre construction termite treatment Moradabad, post construction termite treatment Moradabad, wood treatment Moradabad, termite control near me Moradabad, MT Boss termite control Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/termite-control-moradabad',
  },
  openGraph: {
    title: 'Termite Control in Moradabad | MT Boss',
    description:
      'Termite control in Moradabad by MT Boss. Inspection, treatment for existing homes, protection for new buildings and wood treatment. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/termite-control-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-termite-control-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Termite Control in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Termite Control in Moradabad | MT Boss',
    description:
      'Termite control in Moradabad by MT Boss. Inspection, treatment for existing homes, protection for new buildings and wood treatment. Call +91 94584 10866.',
    images: ['https://www.mtboss.in/og-termite-control-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/termite-control-moradabad',
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