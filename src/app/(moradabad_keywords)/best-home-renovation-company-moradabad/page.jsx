// app/(moradabad_keywords)/best-home-renovation-company-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Home Renovation Company in Moradabad',
  description:
    'Planning a home makeover? MTBOSS is a home renovation company in Moradabad offering repair, interiors, waterproofing and finishing under one team. Call or WhatsApp.',
  keywords:
    'best home renovation company Moradabad, home renovation company Moradabad, home renovation Moradabad, home remodelling Moradabad, renovation contractor Moradabad, home makeover Moradabad, house renovation Moradabad, home repair Moradabad, waterproofing Moradabad, interior renovation Moradabad, home finishing Moradabad, MTBOSS renovation Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/best-home-renovation-company-moradabad',
  },
  openGraph: {
    title: 'Best Home Renovation Company in Moradabad',
    description:
      'Planning a home makeover? MTBOSS is a home renovation company in Moradabad offering repair, interiors, waterproofing and finishing under one team. Call or WhatsApp.',
    url: 'https://www.mtboss.in/best-home-renovation-company-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-best-home-renovation-company-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Home Renovation Company in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Home Renovation Company in Moradabad',
    description:
      'Planning a home makeover? MTBOSS is a home renovation company in Moradabad offering repair, interiors, waterproofing and finishing under one team. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-best-home-renovation-company-moradabad.jpg',
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
  url: 'https://www.mtboss.in/best-home-renovation-company-moradabad',
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