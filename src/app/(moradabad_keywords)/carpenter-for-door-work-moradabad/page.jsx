// app/(moradabad_keywords)/carpenter-for-door-work-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Carpenter for Door Work in Moradabad',
  description:
    'Need a carpenter for door work in Moradabad? MT Boss fits new doors and frames and repairs sticking, sagging and damaged doors, with clear quotes. Call +91 94584 10866.',
  keywords:
    'carpenter for door work Moradabad, door carpenter Moradabad, door fitting Moradabad, door installation Moradabad, door repair Moradabad, door frame repair Moradabad, new door fitting Moradabad, main door installation Moradabad, bathroom door fitting Moradabad, sticking door repair Moradabad, sagging door repair Moradabad, MT Boss door work Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/carpenter-for-door-work-moradabad',
  },
  openGraph: {
    title: 'Carpenter for Door Work in Moradabad',
    description:
      'Need a carpenter for door work in Moradabad? MT Boss fits new doors and frames and repairs sticking, sagging and damaged doors, with clear quotes. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/carpenter-for-door-work-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-carpenter-for-door-work-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Carpenter for Door Work in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carpenter for Door Work in Moradabad',
    description:
      'Need a carpenter for door work in Moradabad? MT Boss fits new doors and frames and repairs sticking, sagging and damaged doors, with clear quotes. Call +91 94584 10866.',
    images: ['https://www.mtboss.in/og-carpenter-for-door-work-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/carpenter-for-door-work-moradabad',
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