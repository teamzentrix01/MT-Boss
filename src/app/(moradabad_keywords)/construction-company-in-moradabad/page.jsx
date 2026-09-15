// app/(moradabad_keywords)/construction-company-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Construction Company in Moradabad | MTBOSS',
  description:
    'Looking for a trusted construction company in Moradabad? MTBOSS offers commercial, residential & industrial construction with 22+ years of experience. Get a free quote today.',
  keywords:
    'construction company in moradabad, best construction company moradabad, building contractor moradabad, house construction moradabad, construction services moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/construction-company-in-moradabad',
  },
  openGraph: {
    title: 'Best Construction Company in Moradabad | MTBOSS',
    description:
      'Trusted construction company in Moradabad — commercial, residential & industrial construction with 22+ years of experience.',
    url: 'https://www.mtboss.in/construction-company-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-construction-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Construction Company in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Construction Company in Moradabad | MTBOSS',
    description:
      'Trusted construction company in Moradabad — commercial, residential & industrial construction with 22+ years of experience.',
    images: ['https://www.mtboss.in/og-construction-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/construction-company-in-moradabad',
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