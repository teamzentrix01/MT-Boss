// app/(moradabad_keywords)/civil-work-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Civil Work in Moradabad | MTBOSS Construction Company',
  description:
    'Planning civil work in Moradabad? MTBOSS offers foundation, masonry, MEP & finishing work for homes and businesses. Get a free quote today!',
  keywords:
    'civil work in Moradabad, civil work contractor Moradabad, civil work company Moradabad, masonry work Moradabad, foundation work Moradabad, building civil work near me, residential civil work Moradabad, commercial civil work Moradabad, MTBOSS Moradabad, civil work rate near me',
  alternates: {
    canonical: 'https://www.mtboss.in/civil-work-in-moradabad',
  },
  openGraph: {
    title: 'Civil Work in Moradabad | MTBOSS Construction Company',
    description:
      'Planning civil work in Moradabad? MTBOSS offers foundation, masonry, MEP & finishing work for homes and businesses. Get a free quote today!',
    url: 'https://www.mtboss.in/civil-work-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-civil-work-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Work in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Work in Moradabad | MTBOSS Construction Company',
    description:
      'Planning civil work in Moradabad? MTBOSS offers foundation, masonry, MEP & finishing work for homes and businesses. Get a free quote today!',
    images: ['https://www.mtboss.in/og-civil-work-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/civil-work-in-moradabad',
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