// app/(moradabad_keywords)/top-builder-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Top Builder in Moradabad | MTBOSS Construction Company',
  description:
    'Searching for a top builder in Moradabad? MTBOSS delivers quality construction, materials & doorstep services with 22+ years of trust. Call now!',
  keywords:
    'top builder in Moradabad, top construction company Moradabad, leading builder Moradabad, top rated builder near me, top home builder Moradabad, top commercial builder Moradabad, experienced builder Moradabad, well known builder Moradabad, MTBOSS Moradabad, construction company near me',
  alternates: {
    canonical: 'https://www.mtboss.in/top-builder-in-moradabad',
  },
  openGraph: {
    title: 'Top Builder in Moradabad | MTBOSS Construction Company',
    description:
      'Searching for a top builder in Moradabad? MTBOSS delivers quality construction, materials & doorstep services with 22+ years of trust. Call now!',
    url: 'https://www.mtboss.in/top-builder-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-top-builder-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Top Builder in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Builder in Moradabad | MTBOSS Construction Company',
    description:
      'Searching for a top builder in Moradabad? MTBOSS delivers quality construction, materials & doorstep services with 22+ years of trust. Call now!',
    images: ['https://www.mtboss.in/og-top-builder-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/top-builder-in-moradabad',
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