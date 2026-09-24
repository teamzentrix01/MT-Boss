// app/(moradabad_keywords)/best-builder-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Builder in Moradabad 2026 | MTBOSS Construction',
  description:
    'Want the best builder in Moradabad for your home or business? MTBOSS offers proven construction, materials & doorstep services. Get a free quote today!',
  keywords:
    'best builder in Moradabad, top builder Moradabad, best construction company Moradabad, reliable builder near me, best home builder Moradabad, best commercial builder Moradabad, trusted builder Moradabad, top rated contractor Moradabad, MTBOSS Moradabad, builder near me Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/best-builder-in-moradabad',
  },
  openGraph: {
    title: 'Best Builder in Moradabad 2026 | MTBOSS Construction',
    description:
      'Want the best builder in Moradabad for your home or business? MTBOSS offers proven construction, materials & doorstep services. Get a free quote today!',
    url: 'https://www.mtboss.in/best-builder-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-best-builder-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Builder in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Builder in Moradabad 2026 | MTBOSS Construction',
    description:
      'Want the best builder in Moradabad for your home or business? MTBOSS offers proven construction, materials & doorstep services. Get a free quote today!',
    images: ['https://www.mtboss.in/og-best-builder-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/best-builder-in-moradabad',
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