// app/(moradabad_keywords)/renovation-and-repair-services-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Renovation & Repair Services in Moradabad | Home & Shop | MTBOSS',
  description:
    'Renovation and repair services in Moradabad for homes, flats and shops. MTBOSS handles civil, plumbing, electrical, tiles, painting and more. Call or WhatsApp.',
  keywords:
    'renovation and repair services Moradabad, renovation services Moradabad, repair services Moradabad, home renovation Moradabad, flat renovation Moradabad, shop renovation Moradabad, building repair Moradabad, waterproofing Moradabad, plumber Moradabad, electrician Moradabad, tile and marble Moradabad, painter Moradabad, pest control Moradabad, MTBOSS renovation repair Moradabad',
  alternates: {
    canonical:
      'https://www.mtboss.in/renovation-and-repair-services-moradabad',
  },
  openGraph: {
    title:
      'Renovation & Repair Services in Moradabad | Home & Shop | MTBOSS',
    description:
      'Renovation and repair services in Moradabad for homes, flats and shops. MTBOSS handles civil, plumbing, electrical, tiles, painting and more. Call or WhatsApp.',
    url: 'https://www.mtboss.in/renovation-and-repair-services-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-renovation-and-repair-services-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Renovation and Repair Services in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Renovation & Repair Services in Moradabad | Home & Shop | MTBOSS',
    description:
      'Renovation and repair services in Moradabad for homes, flats and shops. MTBOSS handles civil, plumbing, electrical, tiles, painting and more. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-renovation-and-repair-services-moradabad.jpg',
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
  url: 'https://www.mtboss.in/renovation-and-repair-services-moradabad',
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