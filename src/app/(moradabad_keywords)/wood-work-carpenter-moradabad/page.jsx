// app/(moradabad_keywords)/wood-work-carpenter-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Wood Work Carpenter in Moradabad',
  description:
    'Hire a wood work carpenter in Moradabad for doors, frames, panelling, partitions and interior woodwork. MTBOSS plans and fits woodwork for homes and shops.',
  keywords:
    'wood work carpenter Moradabad, woodwork carpenter Moradabad, wood work carpenter near me Moradabad, door carpenter Moradabad, door frame carpenter Moradabad, wall panelling Moradabad, wooden partition Moradabad, interior woodwork Moradabad, wooden partition Moradabad, woodwork contractor Moradabad, MTBOSS wood work carpenter Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/wood-work-carpenter-moradabad',
  },
  openGraph: {
    title: 'Wood Work Carpenter in Moradabad',
    description:
      'Hire a wood work carpenter in Moradabad for doors, frames, panelling, partitions and interior woodwork. MTBOSS plans and fits woodwork for homes and shops.',
    url: 'https://www.mtboss.in/wood-work-carpenter-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-wood-work-carpenter-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Wood Work Carpenter in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wood Work Carpenter in Moradabad',
    description:
      'Hire a wood work carpenter in Moradabad for doors, frames, panelling, partitions and interior woodwork. MTBOSS plans and fits woodwork for homes and shops.',
    images: ['https://www.mtboss.in/og-wood-work-carpenter-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/wood-work-carpenter-moradabad',
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