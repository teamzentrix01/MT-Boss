// app/(moradabad_keywords)/best-pest-control-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Pest Control in Moradabad | MT Boss',
  description:
    'Looking for the best pest control in Moradabad? Judge companies on inspection, method, safety and follow-up. See how MT Boss measures up. Call +91 94584 10866.',
  keywords:
    'best pest control Moradabad, best pest control company Moradabad, pest control services Moradabad, top pest control Moradabad, pest control near me Moradabad, cockroach control Moradabad, termite treatment Moradabad, bed bug treatment Moradabad, rodent control Moradabad, MT Boss pest control Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/best-pest-control-moradabad',
  },
  openGraph: {
    title: 'Best Pest Control in Moradabad | MT Boss',
    description:
      'Looking for the best pest control in Moradabad? Judge companies on inspection, method, safety and follow-up. See how MT Boss measures up. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/best-pest-control-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-best-pest-control-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Pest Control in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Pest Control in Moradabad | MT Boss',
    description:
      'Looking for the best pest control in Moradabad? Judge companies on inspection, method, safety and follow-up. See how MT Boss measures up. Call +91 94584 10866.',
    images: ['https://www.mtboss.in/og-best-pest-control-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/best-pest-control-moradabad',
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