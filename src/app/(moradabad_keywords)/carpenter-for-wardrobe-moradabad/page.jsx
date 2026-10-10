// app/(moradabad_keywords)/carpenter-for-wardrobe-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Carpenter for Wardrobe in Moradabad | MT Boss',
  description:
    'Need a carpenter for wardrobe work in Moradabad? MT Boss builds hinged, sliding and loft wardrobes, measured on site, with clear quotes. Call +91 94584 10866.',
  keywords:
    'carpenter for wardrobe Moradabad, wardrobe carpenter Moradabad, wardrobe maker Moradabad, wardrobe contractor Moradabad, hinged wardrobe Moradabad, sliding wardrobe Moradabad, loft wardrobe Moradabad, wardrobe design Moradabad, wardrobe installation Moradabad, bedroom wardrobe Moradabad, wardrobe repair Moradabad, MT Boss wardrobe Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/carpenter-for-wardrobe-moradabad',
  },
  openGraph: {
    title: 'Carpenter for Wardrobe in Moradabad | MT Boss',
    description:
      'Need a carpenter for wardrobe work in Moradabad? MT Boss builds hinged, sliding and loft wardrobes, measured on site, with clear quotes. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/carpenter-for-wardrobe-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-carpenter-for-wardrobe-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Carpenter for Wardrobe in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carpenter for Wardrobe in Moradabad | MT Boss',
    description:
      'Need a carpenter for wardrobe work in Moradabad? MT Boss builds hinged, sliding and loft wardrobes, measured on site, with clear quotes. Call +91 94584 10866.',
    images: ['https://www.mtboss.in/og-carpenter-for-wardrobe-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/carpenter-for-wardrobe-moradabad',
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