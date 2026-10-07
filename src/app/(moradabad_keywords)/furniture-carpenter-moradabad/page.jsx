// app/(moradabad_keywords)/furniture-carpenter-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Furniture Carpenter in Moradabad | Custom Furniture Making | MTBOSS',
  description:
    'Hire a furniture carpenter in Moradabad for custom beds, wardrobes, sofas, tables and repairs. MTBOSS plans, builds and finishes furniture for homes and shops.',
  keywords:
    'furniture carpenter Moradabad, furniture carpenter near me Moradabad, custom furniture Moradabad, furniture maker Moradabad, wooden furniture Moradabad, furniture repair Moradabad, furniture polish Moradabad, bed carpenter Moradabad, wardrobe carpenter Moradabad, sofa carpenter Moradabad, table carpenter Moradabad, MTBOSS furniture carpenter Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/furniture-carpenter-moradabad',
  },
  openGraph: {
    title: 'Furniture Carpenter in Moradabad | Custom Furniture Making | MTBOSS',
    description:
      'Hire a furniture carpenter in Moradabad for custom beds, wardrobes, sofas, tables and repairs. MTBOSS plans, builds and finishes furniture for homes and shops.',
    url: 'https://www.mtboss.in/furniture-carpenter-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-furniture-carpenter-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Furniture Carpenter in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Furniture Carpenter in Moradabad | Custom Furniture Making | MTBOSS',
    description:
      'Hire a furniture carpenter in Moradabad for custom beds, wardrobes, sofas, tables and repairs. MTBOSS plans, builds and finishes furniture for homes and shops.',
    images: ['https://www.mtboss.in/og-furniture-carpenter-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/furniture-carpenter-moradabad',
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