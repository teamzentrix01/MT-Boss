// app/(moradabad_keywords)/modular-kitchen-near-me-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Modular Kitchen Near Me Moradabad',
  description:
    'Looking for a modular kitchen near you in Moradabad? MT Boss, Kanth Road, offers site visits, design, installation and local service. Call +91 94584 10866.',
  keywords:
    'modular kitchen near me Moradabad, modular kitchen company near me Moradabad, modular kitchen dealer near me Moradabad, modular kitchen shop near me Moradabad, modular kitchen designer near me Moradabad, kitchen interior near me Moradabad, modular kitchen installation near me Moradabad, modular kitchen service near me Moradabad, MT Boss modular kitchen Moradabad, modular kitchen Kanth Road Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/modular-kitchen-near-me-moradabad',
  },
  openGraph: {
    title: 'Modular Kitchen Near Me Moradabad',
    description:
      'Looking for a modular kitchen near you in Moradabad? MT Boss, Kanth Road, offers site visits, design, installation and local service. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/modular-kitchen-near-me-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-modular-kitchen-near-me-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Modular Kitchen Near Me in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modular Kitchen Near Me Moradabad',
    description:
      'Looking for a modular kitchen near you in Moradabad? MT Boss, Kanth Road, offers site visits, design, installation and local service. Call +91 94584 10866.',
    images: ['https://www.mtboss.in/og-modular-kitchen-near-me-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/modular-kitchen-near-me-moradabad',
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