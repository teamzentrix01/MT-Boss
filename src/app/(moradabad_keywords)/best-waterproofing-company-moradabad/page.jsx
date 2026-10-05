// app/(moradabad_keywords)/best-waterproofing-company-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Waterproofing Company in Moradabad | MT Boss',
  description:
    'Compare waterproofing companies in Moradabad with confidence. MT Boss offers inspection-led treatment, testing and clear quotes for terraces, bathrooms and tanks.',
  keywords:
    'best waterproofing company Moradabad, waterproofing company near me, waterproofing contractor Moradabad, terrace waterproofing Moradabad, bathroom waterproofing Moradabad, water tank waterproofing Moradabad, basement waterproofing Moradabad, leakage repair Moradabad, waterproofing services Moradabad, MT Boss waterproofing Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/best-waterproofing-company-moradabad',
  },
  openGraph: {
    title: 'Best Waterproofing Company in Moradabad | MT Boss',
    description:
      'Compare waterproofing companies in Moradabad with confidence. MT Boss offers inspection-led treatment, testing and clear quotes for terraces, bathrooms and tanks.',
    url: 'https://www.mtboss.in/best-waterproofing-company-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-best-waterproofing-company-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Waterproofing Company in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Waterproofing Company in Moradabad | MT Boss',
    description:
      'Compare waterproofing companies in Moradabad with confidence. MT Boss offers inspection-led treatment, testing and clear quotes for terraces, bathrooms and tanks.',
    images: [
      'https://www.mtboss.in/og-best-waterproofing-company-moradabad.jpg',
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
  url: 'https://www.mtboss.in/best-waterproofing-company-moradabad',
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