// app/(moradabad_keywords)/top-interior-designer-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';


export const metadata = {
  title: 'Top Interior Designer in Moradabad | MT Boss Design Studio',
  description:
    'Searching for the top interior designer in Moradabad? MT Boss delivers space planning, 3D designs, modular interiors and execution for homes and businesses.',
  keywords:
    'top interior designer Moradabad, best interior designer Moradabad, interior designer in Moradabad, interior design studio Moradabad, home interior designer Moradabad, office interior designer Moradabad, 3D interior design Moradabad, modular interior designer Moradabad, turnkey interiors Moradabad, MT Boss Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/top-interior-designer-moradabad',
  },
  openGraph: {
    title: 'Top Interior Designer in Moradabad | MT Boss Design Studio',
    description:
      'Searching for the top interior designer in Moradabad? MT Boss delivers space planning, 3D designs, modular interiors and execution for homes and businesses.',
    url: 'https://www.mtboss.in/top-interior-designer-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-top-interior-designer-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Top Interior Designer in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Interior Designer in Moradabad | MT Boss Design Studio',
    description:
      'Searching for the top interior designer in Moradabad? MT Boss delivers space planning, 3D designs, modular interiors and execution for homes and businesses.',
    images: ['https://www.mtboss.in/og-top-interior-designer-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/top-interior-designer-moradabad',
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