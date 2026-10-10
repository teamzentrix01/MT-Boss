// app/(moradabad_keywords)/carpenter-for-home-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Carpenter for Home in Moradabad',
  description:
    'Need a carpenter for your home in Moradabad MT Boss handles doors, wardrobes, beds, shelves, repairs and polish, with clear quotes. Call +91 94584 10866.',
  keywords:
    'carpenter for home Moradabad, home carpenter Moradabad, carpenter near me Moradabad, carpenter services Moradabad, carpenter for doors Moradabad, carpenter for wardrobes Moradabad, carpenter for beds Moradabad, carpenter for shelves Moradabad, furniture repair Moradabad, carpenter polish Moradabad, MT Boss carpenter Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/carpenter-for-home-moradabad',
  },
  openGraph: {
    title: 'Carpenter for Home in Moradabad',
    description:
      'Need a carpenter for your home in Moradabad MT Boss handles doors, wardrobes, beds, shelves, repairs and polish, with clear quotes. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/carpenter-for-home-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-carpenter-for-home-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Carpenter for Home in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carpenter for Home in Moradabad',
    description:
      'Need a carpenter for your home in Moradabad MT Boss handles doors, wardrobes, beds, shelves, repairs and polish, with clear quotes. Call +91 94584 10866.',
    images: ['https://www.mtboss.in/og-carpenter-for-home-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/carpenter-for-home-moradabad',
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