// app/(moradabad_keywords)/civil-construction-services-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Civil Construction Services in Moradabad | MTBOSS',
  description:
    'Explore complete civil construction services in Moradabad — residential, commercial, industrial & renovation. MTBOSS delivers quality builds. Call now!',
  keywords:
    'civil construction services Moradabad, construction services near me, residential construction services Moradabad, commercial construction services Moradabad, industrial construction services Moradabad, building construction services near me, renovation services Moradabad, MTBOSS Moradabad, full construction services Moradabad, construction services company',
  alternates: {
    canonical: 'https://www.mtboss.in/civil-construction-services-in-moradabad',
  },
  openGraph: {
    title: 'Civil Construction Services in Moradabad | MTBOSS',
    description:
      'Explore complete civil construction services in Moradabad — residential, commercial, industrial & renovation. MTBOSS delivers quality builds. Call now!',
    url: 'https://www.mtboss.in/civil-construction-services-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-civil-construction-services-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Construction Services in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Construction Services in Moradabad | MTBOSS',
    description:
      'Explore complete civil construction services in Moradabad — residential, commercial, industrial & renovation. MTBOSS delivers quality builds. Call now!',
    images: ['https://www.mtboss.in/og-civil-construction-services-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/civil-construction-services-in-moradabad',
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