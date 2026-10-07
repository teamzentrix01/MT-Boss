// app/(moradabad_keywords)/waterproofing-cost-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Waterproofing Cost in Moradabad | MT Boss Guide',
  description:
    'Understand waterproofing cost in Moradabad: what affects price for terraces, bathrooms and basements, how quotes are built, and how MT Boss gives clear estimates.',
  keywords:
    'waterproofing cost Moradabad, waterproofing price Moradabad, waterproofing rates Moradabad, terrace waterproofing cost Moradabad, bathroom waterproofing cost Moradabad, basement waterproofing cost Moradabad, waterproofing quotation Moradabad, waterproofing estimate Moradabad, waterproofing price per square foot Moradabad, MT Boss waterproofing cost Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/waterproofing-cost-moradabad',
  },
  openGraph: {
    title: 'Waterproofing Cost in Moradabad | MT Boss Guide',
    description:
      'Understand waterproofing cost in Moradabad: what affects price for terraces, bathrooms and basements, how quotes are built, and how MT Boss gives clear estimates.',
    url: 'https://www.mtboss.in/waterproofing-cost-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-waterproofing-cost-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Waterproofing Cost in Moradabad - MT Boss Guide',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waterproofing Cost in Moradabad | MT Boss Guide',
    description:
      'Understand waterproofing cost in Moradabad: what affects price for terraces, bathrooms and basements, how quotes are built, and how MT Boss gives clear estimates.',
    images: ['https://www.mtboss.in/og-waterproofing-cost-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/waterproofing-cost-moradabad',
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