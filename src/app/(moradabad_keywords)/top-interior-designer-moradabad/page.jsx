// app/(moradabad_keywords)/top-interior-designer-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';


export const metadata = {
  title: 'Top Interior Designer in Moradabad | MTBoss Design Studio',
  description:
    'Searching for the top interior designer in Moradabad? MTBoss delivers space planning, 3D designs, modular interiors and execution for homes and businesses.',
  keywords:
    'top interior designer Moradabad, best interior designer Moradabad, interior designer in Moradabad, interior design studio Moradabad, home interior designer Moradabad, office interior designer Moradabad, 3D interior design Moradabad, modular interior designer Moradabad, turnkey interiors Moradabad, MTBoss Moradabad',
  alternates: {
    canonical: 'https://www.MTBoss.in/top-interior-designer-moradabad',
  },
  openGraph: {
    title: 'Top Interior Designer in Moradabad | MTBoss Design Studio',
    description:
      'Searching for the top interior designer in Moradabad? MTBoss delivers space planning, 3D designs, modular interiors and execution for homes and businesses.',
    url: 'https://www.MTBoss.in/top-interior-designer-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-top-interior-designer-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Top Interior Designer in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Interior Designer in Moradabad | MTBoss Design Studio',
    description:
      'Searching for the top interior designer in Moradabad? MTBoss delivers space planning, 3D designs, modular interiors and execution for homes and businesses.',
    images: ['https://www.MTBoss.in/og-top-interior-designer-moradabad.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};


const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'MTBoss Construction Private Limited',
  url: 'https://www.MTBoss.in/top-interior-designer-moradabad',
  telephone: '+91-9458410866',
  email: 'MTBoss2016@gmail.com',
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