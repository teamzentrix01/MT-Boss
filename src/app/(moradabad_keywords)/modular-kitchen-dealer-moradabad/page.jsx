// app/(moradabad_keywords)/modular-kitchen-dealer-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Modular Kitchen Dealer in Moradabad | Design & Install | MTBOSS',
  description:
    'Looking for a modular kitchen dealer in Moradabad? MTBOSS plans, designs and installs modular kitchens for homes and apartments. Call or WhatsApp for a quote.',
  keywords:
    'modular kitchen dealer Moradabad, modular kitchen dealer near me Moradabad, modular kitchen supplier Moradabad, modular kitchen company Moradabad, modular kitchen design and installation Moradabad, modular kitchen for homes Moradabad, modular kitchen for apartments Moradabad, modular kitchen contractor Moradabad, modular kitchen interior Moradabad, MTBOSS modular kitchen dealer Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/modular-kitchen-dealer-moradabad',
  },
  openGraph: {
    title: 'Modular Kitchen Dealer in Moradabad | Design & Install | MTBOSS',
    description:
      'Looking for a modular kitchen dealer in Moradabad? MTBOSS plans, designs and installs modular kitchens for homes and apartments. Call or WhatsApp for a quote.',
    url: 'https://www.mtboss.in/modular-kitchen-dealer-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-modular-kitchen-dealer-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Modular Kitchen Dealer in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modular Kitchen Dealer in Moradabad | Design & Install | MTBOSS',
    description:
      'Looking for a modular kitchen dealer in Moradabad? MTBOSS plans, designs and installs modular kitchens for homes and apartments. Call or WhatsApp for a quote.',
    images: ['https://www.mtboss.in/og-modular-kitchen-dealer-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/modular-kitchen-dealer-moradabad',
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