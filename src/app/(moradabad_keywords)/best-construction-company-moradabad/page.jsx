// app/(moradabad_keywords)/best-construction-company-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';


export const metadata = {
  title: 'Best Construction Company Moradabad | MTBOSS Builders & Contractors',
  description:
    'MTBOSS is the best construction company in Moradabad for homes, shops, hotels and factories. Get clear pricing, strong build quality and on-time delivery.',
  keywords:
    'best construction company Moradabad, best construction company in Moradabad, construction company Moradabad, builders in Moradabad, building contractor Moradabad, civil contractor Moradabad, home construction Moradabad, commercial construction Moradabad, factory construction Moradabad, MTBOSS Moradabad',
  alternates: {
    canonical: 'https://www.MTBOSS.in/best-construction-company-moradabad',
  },
  openGraph: {
    title: 'Best Construction Company Moradabad | MTBOSS Builders & Contractors',
    description:
      'MTBOSS is the best construction company in Moradabad for homes, shops, hotels and factories. Get clear pricing, strong build quality and on-time delivery.',
    url: 'https://www.MTBOSS.in/best-construction-company-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBOSS.in/og-best-construction-company-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Construction Company Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Construction Company Moradabad | MTBOSS Builders & Contractors',
    description:
      'MTBOSS is the best construction company in Moradabad for homes, shops, hotels and factories. Get clear pricing, strong build quality and on-time delivery.',
    images: ['https://www.MTBOSS.in/og-best-construction-company-moradabad.jpg'],
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
  url: 'https://www.MTBOSS.in/best-construction-company-moradabad',
  telephone: '+91-9458410866',
  email: 'MTBOSS2016@gmail.com',
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