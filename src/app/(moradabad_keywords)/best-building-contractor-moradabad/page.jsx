// app/(moradabad_keywords)/best-building-contractor-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Building Contractor in Moradabad | MTBOSS',
  description:
    'Searching for the best building contractor in Moradabad? MTBOSS delivers proven construction, materials & doorstep services. Get a free quote today!',
  keywords:
    'best building contractor Moradabad, top building contractor near me, best construction contractor Moradabad, reliable building contractor Moradabad, best house building contractor, best commercial building contractor, trusted building contractor Moradabad, MTBOSS Moradabad, building contractor near me, best construction company Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/best-building-contractor-in-moradabad',
  },
  openGraph: {
    title: 'Best Building Contractor in Moradabad | MTBOSS',
    description:
      'Searching for the best building contractor in Moradabad? MTBOSS delivers proven construction, materials & doorstep services. Get a free quote today!',
    url: 'https://www.mtboss.in/best-building-contractor-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-best-building-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Building Contractor in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Building Contractor in Moradabad | MTBOSS',
    description:
      'Searching for the best building contractor in Moradabad? MTBOSS delivers proven construction, materials & doorstep services. Get a free quote today!',
    images: ['https://www.mtboss.in/og-best-building-contractor-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/best-building-contractor-in-moradabad',
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