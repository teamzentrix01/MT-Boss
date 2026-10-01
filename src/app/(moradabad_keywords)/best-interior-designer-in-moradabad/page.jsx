// app/(moradabad_keywords)/best-interior-designer-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';


export const metadata = {
  title: 'Best Interior Designer in Moradabad | MT Boss – Design & Execution',
  description:
    'MT Boss is the best interior designer in Moradabad for custom home, office and shop interiors, with transparent pricing, quality materials and on-time handover.',
  keywords:
    'best interior designer Moradabad, best interior designer in Moradabad, interior designer Moradabad, home interior designer Moradabad, office interior designer Moradabad, shop interior designer Moradabad, custom interior design Moradabad, modular kitchen Moradabad, turnkey interior designer Moradabad, MT Boss Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/best-interior-designer-in-moradabad',
  },
  openGraph: {
    title: 'Best Interior Designer in Moradabad | MT Boss – Design & Execution',
    description:
      'MT Boss is the best interior designer in Moradabad for custom home, office and shop interiors, with transparent pricing, quality materials and on-time handover.',
    url: 'https://www.mtboss.in/best-interior-designer-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-best-interior-designer-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Interior Designer in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Interior Designer in Moradabad | MT Boss – Design & Execution',
    description:
      'MT Boss is the best interior designer in Moradabad for custom home, office and shop interiors, with transparent pricing, quality materials and on-time handover.',
    images: ['https://www.mtboss.in/og-best-interior-designer-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/best-interior-designer-in-moradabad',
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