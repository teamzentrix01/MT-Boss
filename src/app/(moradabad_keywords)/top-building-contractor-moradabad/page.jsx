// app/(moradabad_keywords)/top-building-contractor-in-moradabad/page.tsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Top Building Contractor in Moradabad | MTBOSS',
  description:
    'Looking for a top building contractor in Moradabad? MTBOSS offers proven construction, materials & doorstep services with 22+ years of trust. Call now!',
  keywords:
    'top building contractor Moradabad, leading building contractor Moradabad, top rated contractor near me, experienced building contractor Moradabad, well known contractor Moradabad, top construction contractor Moradabad, MTBOSS Moradabad, building contractor near me, top construction company Moradabad, contractor near me',
  alternates: {
    canonical: 'https://www.mtboss.in/top-building-contractor-in-moradabad',
  },
  openGraph: {
    title: 'Top Building Contractor in Moradabad | MTBOSS',
    description:
      'Looking for a top building contractor in Moradabad? MTBOSS offers proven construction, materials & doorstep services with 22+ years of trust. Call now!',
    url: 'https://www.mtboss.in/top-building-contractor-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-top-building-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Top Building Contractor in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Building Contractor in Moradabad | MTBOSS',
    description:
      'Looking for a top building contractor in Moradabad? MTBOSS offers proven construction, materials & doorstep services with 22+ years of trust. Call now!',
    images: ['https://www.mtboss.in/og-top-building-contractor-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/top-building-contractor-in-moradabad',
  telephone: '+91-9458410866',
  email: 'mtboss2016@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
    addressLocality: 'Moradabad',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
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