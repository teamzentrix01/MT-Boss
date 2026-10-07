// app/(moradabad_keywords)/civil-contractor-small-work-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Civil Contractor for Small Work in Moradabad | MT Boss',
  description:
    'Need a civil contractor for small work in Moradabad? MT Boss handles repairs, extensions, walls, waterproofing and small builds with clear quotes.',
  keywords:
    'civil contractor for small work Moradabad, small civil work contractor Moradabad, home repair contractor Moradabad, wall crack repair Moradabad, waterproofing contractor Moradabad, small extension contractor Moradabad, bathroom renovation contractor Moradabad, boundary wall repair Moradabad, tile repair contractor Moradabad, MT Boss small civil work Moradabad',
  alternates: {
    canonical:
      'https://www.mtboss.in/civil-contractor-small-work-moradabad',
  },
  openGraph: {
    title: 'Civil Contractor for Small Work in Moradabad | MT Boss',
    description:
      'Need a civil contractor for small work in Moradabad? MT Boss handles repairs, extensions, walls, waterproofing and small builds with clear quotes.',
    url: 'https://www.mtboss.in/civil-contractor-small-work-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-civil-contractor-small-work-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Contractor for Small Work in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Contractor for Small Work in Moradabad | MT Boss',
    description:
      'Need a civil contractor for small work in Moradabad? MT Boss handles repairs, extensions, walls, waterproofing and small builds with clear quotes.',
    images: [
      'https://www.mtboss.in/og-civil-contractor-small-work-moradabad.jpg',
    ],
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
  url: 'https://www.mtboss.in/civil-contractor-small-work-moradabad',
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