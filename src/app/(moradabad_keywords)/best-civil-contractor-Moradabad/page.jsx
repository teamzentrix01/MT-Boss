// app/(moradabad_keywords)/best-civil-contractor-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Civil Contractor in Moradabad | MTBOSS Construction',
  description:
    'Searching for the best civil contractor in Moradabad? MTBOSS delivers quality construction, materials & doorstep services with 22+ years of trust. Call now!',
  keywords:
    'best civil contractor Moradabad, top civil contractor Moradabad, best construction contractor near me, reliable civil contractor Moradabad, best contractor for house construction, best commercial contractor Moradabad, trusted civil contractor Moradabad, MTBOSS Moradabad, civil contractor near me, best construction company Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/best-civil-contractor-in-moradabad',
  },
  openGraph: {
    title: 'Best Civil Contractor in Moradabad | MTBOSS Construction',
    description:
      'Searching for the best civil contractor in Moradabad? MTBOSS delivers quality construction, materials & doorstep services with 22+ years of trust. Call now!',
    url: 'https://www.mtboss.in/best-civil-contractor-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-best-civil-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Civil Contractor in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Civil Contractor in Moradabad | MTBOSS Construction',
    description:
      'Searching for the best civil contractor in Moradabad? MTBOSS delivers quality construction, materials & doorstep services with 22+ years of trust. Call now!',
    images: ['https://www.mtboss.in/og-best-civil-contractor-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/best-civil-contractor-in-moradabad',
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