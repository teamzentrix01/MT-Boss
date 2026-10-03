// app/(moradabad_keywords)/construction-company-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';


export const metadata = {
  title: 'Construction Company in Moradabad | MT Boss Builders & Contractors',
  description:
    'MT Boss is a construction company in Moradabad building homes, commercial complexes, hotels and factories with transparent pricing, quality materials and on-time delivery.',
  keywords:
    'construction company Moradabad, construction company in Moradabad, builders in Moradabad, building contractor Moradabad, civil contractor Moradabad, residential construction Moradabad, commercial construction Moradabad, industrial construction Moradabad, hotel construction Moradabad, MT Boss Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/construction-company-in-moradabad',
  },
  openGraph: {
    title: 'Construction Company in Moradabad | MT Boss Builders & Contractors',
    description:
      'MT Boss is a construction company in Moradabad building homes, commercial complexes, hotels and factories with transparent pricing, quality materials and on-time delivery.',
    url: 'https://www.mtboss.in/construction-company-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-construction-company-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Construction Company in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Company in Moradabad | MT Boss Builders & Contractors',
    description:
      'MT Boss is a construction company in Moradabad building homes, commercial complexes, hotels and factories with transparent pricing, quality materials and on-time delivery.',
    images: ['https://www.mtboss.in/og-construction-company-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/construction-company-in-moradabad',
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