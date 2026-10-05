// app/(moradabad_keywords)/building-contractor-quotation-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Building Contractor Quotation in Moradabad | MT Boss',
  description:
    'Get a clear building contractor quotation in Moradabad from MT Boss. Itemised estimates, free site visit and transparent pricing for homes, shops and factories.',
  keywords:
    'building contractor quotation Moradabad, construction quotation Moradabad, building estimate Moradabad, house construction quotation Moradabad, civil contractor quotation Moradabad, construction cost estimate Moradabad, itemised construction quotation Moradabad, building contractor estimate Moradabad, MT Boss quotation Moradabad, construction quote Moradabad',
  alternates: {
    canonical:
      'https://www.mtboss.in/building-contractor-quotation-moradabad',
  },
  openGraph: {
    title: 'Building Contractor Quotation in Moradabad | MT Boss',
    description:
      'Get a clear building contractor quotation in Moradabad from MT Boss. Itemised estimates, free site visit and transparent pricing for homes, shops and factories.',
    url: 'https://www.mtboss.in/building-contractor-quotation-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-building-contractor-quotation-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Building Contractor Quotation in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Building Contractor Quotation in Moradabad | MT Boss',
    description:
      'Get a clear building contractor quotation in Moradabad from MT Boss. Itemised estimates, free site visit and transparent pricing for homes, shops and factories.',
    images: [
      'https://www.mtboss.in/og-building-contractor-quotation-moradabad.jpg',
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
  url: 'https://www.mtboss.in/building-contractor-quotation-moradabad',
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