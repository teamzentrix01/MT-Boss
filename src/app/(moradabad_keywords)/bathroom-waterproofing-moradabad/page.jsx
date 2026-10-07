// app/(moradabad_keywords)/bathroom-waterproofing-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Bathroom Waterproofing in Moradabad | MT Boss',
  description:
    'Bathroom waterproofing in Moradabad by MT Boss. Floor, wall and pipe-opening treatment, leak tracing, testing and tile restoration with clear itemised quotes.',
  keywords:
    'bathroom waterproofing Moradabad, bathroom leakage repair Moradabad, toilet waterproofing Moradabad, bathroom waterproofing contractor Moradabad, bathroom seepage solution Moradabad, bathroom floor waterproofing Moradabad, bathroom wall waterproofing Moradabad, bathroom tile leakage repair Moradabad, waterproofing services Moradabad, MT Boss bathroom waterproofing Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/bathroom-waterproofing-moradabad',
  },
  openGraph: {
    title: 'Bathroom Waterproofing in Moradabad | MT Boss',
    description:
      'Bathroom waterproofing in Moradabad by MT Boss. Floor, wall and pipe-opening treatment, leak tracing, testing and tile restoration with clear itemised quotes.',
    url: 'https://www.mtboss.in/bathroom-waterproofing-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-bathroom-waterproofing-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Bathroom Waterproofing in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bathroom Waterproofing in Moradabad | MT Boss',
    description:
      'Bathroom waterproofing in Moradabad by MT Boss. Floor, wall and pipe-opening treatment, leak tracing, testing and tile restoration with clear itemised quotes.',
    images: ['https://www.mtboss.in/og-bathroom-waterproofing-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/bathroom-waterproofing-moradabad',
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