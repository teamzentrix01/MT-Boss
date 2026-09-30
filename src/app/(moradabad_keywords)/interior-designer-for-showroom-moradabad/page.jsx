// app/(moradabad_keywords)/interior-designer-for-showroom-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';


export const metadata = {
  title: 'Interior Designer for Showroom Moradabad | MT Boss',
  description:
    'Looking for an interior designer for a showroom in Moradabad? MT Boss designs and builds showrooms with 3D designs, clear pricing and on-time delivery. Call now.',
  keywords:
    'interior designer for showroom Moradabad, showroom interior designer Moradabad, showroom design Moradabad, commercial interior designer Moradabad, retail showroom designer Moradabad, jewellery showroom interior Moradabad, furniture showroom design Moradabad, automobile showroom interior Moradabad, showroom renovation Moradabad, MT Boss showroom interior Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/interior-designer-for-showroom-moradabad',
  },
  openGraph: {
    title: 'Interior Designer for Showroom Moradabad | MT Boss',
    description:
      'Looking for an interior designer for a showroom in Moradabad? MT Boss designs and builds showrooms with 3D designs, clear pricing and on-time delivery. Call now.',
    url: 'https://www.mtboss.in/interior-designer-for-showroom-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-interior-designer-for-showroom-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Interior Designer for Showroom in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interior Designer for Showroom Moradabad | MT Boss',
    description:
      'Looking for an interior designer for a showroom in Moradabad? MT Boss designs and builds showrooms with 3D designs, clear pricing and on-time delivery. Call now.',
    images: ['https://www.mtboss.in/og-interior-designer-for-showroom-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/interior-designer-for-showroom-moradabad',
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