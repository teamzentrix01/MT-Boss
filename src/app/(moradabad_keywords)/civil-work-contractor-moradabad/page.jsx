// app/(moradabad_keywords)/civil-work-contractor-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Civil Work Contractor in Moradabad | MTBOSS',
  description:
    'Need a civil work contractor in Moradabad for foundation, masonry & structural work? MTBOSS offers expert teams and transparent pricing. Call now!',
  keywords:
    'civil work contractor Moradabad, civil contractor for masonry work, foundation contractor Moradabad, structural work contractor near me, brickwork contractor Moradabad, civil work labour contractor Moradabad, MTBOSS Moradabad, civil contractor near me, masonry contractor near me, civil work rate contractor',
  alternates: {
    canonical: 'https://www.mtboss.in/civil-work-contractor-in-moradabad',
  },
  openGraph: {
    title: 'Civil Work Contractor in Moradabad | MTBOSS',
    description:
      'Need a civil work contractor in Moradabad for foundation, masonry & structural work? MTBOSS offers expert teams and transparent pricing. Call now!',
    url: 'https://www.mtboss.in/civil-work-contractor-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-civil-work-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Work Contractor in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Work Contractor in Moradabad | MTBOSS',
    description:
      'Need a civil work contractor in Moradabad for foundation, masonry & structural work? MTBOSS offers expert teams and transparent pricing. Call now!',
    images: ['https://www.mtboss.in/og-civil-work-contractor-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/civil-work-contractor-in-moradabad',
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