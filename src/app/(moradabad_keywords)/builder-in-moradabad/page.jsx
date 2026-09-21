// app/(moradabad_keywords)/builder-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Builder in Moradabad | MTBOSS Construction Experts',
  description:
    'Searching for a trusted builder in Moradabad? MTBOSS offers home, commercial & industrial construction with transparent pricing. Get a free quote now!',
  keywords:
    'builder in Moradabad, best builder Moradabad, house builder Moradabad, construction company in Moradabad, building contractor Moradabad, home builder near me, residential builder Moradabad, commercial builder Moradabad, top builders Moradabad, MTBOSS Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/builder-in-moradabad',
  },
  openGraph: {
    title: 'Best Builder in Moradabad | MTBOSS Construction Experts',
    description:
      'Searching for a trusted builder in Moradabad? MTBOSS offers home, commercial & industrial construction with transparent pricing. Get a free quote now!',
    url: 'https://www.mtboss.in/builder-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-builder-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Builder in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Builder in Moradabad | MTBOSS Construction Experts',
    description:
      'Searching for a trusted builder in Moradabad? MTBOSS offers home, commercial & industrial construction with transparent pricing. Get a free quote now!',
    images: ['https://www.mtboss.in/og-builder-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/builder-in-moradabad',
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