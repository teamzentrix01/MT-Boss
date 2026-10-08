// app/(moradabad_keywords)/house-renovation-cost-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'House Renovation Cost Moradabad',
  description:
    'Understand house renovation cost in Moradabad: what affects pricing, hidden costs and how to plan your budget. Get an inspection-based quote from MTBOSS.',
  keywords:
    'house renovation cost Moradabad, home renovation cost Moradabad, renovation cost Moradabad, house renovation budget Moradabad, renovation price Moradabad, home renovation estimate Moradabad, renovation quotation Moradabad, home makeover cost Moradabad, renovation contractor Moradabad, MTBOSS renovation Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/house-renovation-cost-moradabad',
  },
  openGraph: {
    title: 'House Renovation Cost Moradabad',
    description:
      'Understand house renovation cost in Moradabad: what affects pricing, hidden costs and how to plan your budget. Get an inspection-based quote from MTBOSS.',
    url: 'https://www.mtboss.in/house-renovation-cost-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-house-renovation-cost-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'House Renovation Cost in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House Renovation Cost Moradabad',
    description:
      'Understand house renovation cost in Moradabad: what affects pricing, hidden costs and how to plan your budget. Get an inspection-based quote from MTBOSS.',
    images: ['https://www.mtboss.in/og-house-renovation-cost-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/house-renovation-cost-moradabad',
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