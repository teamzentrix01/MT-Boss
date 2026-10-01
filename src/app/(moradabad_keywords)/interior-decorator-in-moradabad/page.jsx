// app/(moradabad_keywords)/interior-decorator-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';


export const metadata = {
  title: 'Interior Decorator in Moradabad | MT Boss Home & Office Interiors',
  description:
    'Need an interior decorator in Moradabad? MT Boss creates stylish, practical homes, offices and shops with modular kitchens, wardrobes, false ceilings and more.',
  keywords:
    'interior decorator Moradabad, interior decorator in Moradabad, home interior decorator Moradabad, office interior decorator Moradabad, shop interior decorator Moradabad, modular kitchen Moradabad, false ceiling Moradabad, wardrobe designer Moradabad, interior design company Moradabad, MT Boss Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/interior-decorator-in-moradabad',
  },
  openGraph: {
    title: 'Interior Decorator in Moradabad | MT Boss Home & Office Interiors',
    description:
      'Need an interior decorator in Moradabad? MT Boss creates stylish, practical homes, offices and shops with modular kitchens, wardrobes, false ceilings and more.',
    url: 'https://www.mtboss.in/interior-decorator-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-interior-decorator-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Interior Decorator in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interior Decorator in Moradabad | MT Boss Home & Office Interiors',
    description:
      'Need an interior decorator in Moradabad? MT Boss creates stylish, practical homes, offices and shops with modular kitchens, wardrobes, false ceilings and more.',
    images: ['https://www.mtboss.in/og-interior-decorator-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/interior-decorator-in-moradabad',
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