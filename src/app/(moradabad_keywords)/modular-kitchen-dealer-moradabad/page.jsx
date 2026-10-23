// app/(moradabad_keywords)/modular-kitchen-dealer-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Modular Kitchen Dealer in Moradabad | Design & Install | MTBoss',
  description:
    'Looking for a modular kitchen dealer in Moradabad? MTBoss plans, designs and installs modular kitchens for homes and apartments. Call or WhatsApp for a quote.',
  keywords:
    'modular kitchen dealer Moradabad, modular kitchen dealer near me Moradabad, modular kitchen supplier Moradabad, modular kitchen company Moradabad, modular kitchen design and installation Moradabad, modular kitchen for homes Moradabad, modular kitchen for apartments Moradabad, modular kitchen contractor Moradabad, modular kitchen interior Moradabad, MTBoss modular kitchen dealer Moradabad',
  alternates: {
    canonical: 'https://www.MTBoss.in/modular-kitchen-dealer-moradabad',
  },
  openGraph: {
    title: 'Modular Kitchen Dealer in Moradabad | Design & Install | MTBoss',
    description:
      'Looking for a modular kitchen dealer in Moradabad? MTBoss plans, designs and installs modular kitchens for homes and apartments. Call or WhatsApp for a quote.',
    url: 'https://www.MTBoss.in/modular-kitchen-dealer-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-modular-kitchen-dealer-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Modular Kitchen Dealer in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modular Kitchen Dealer in Moradabad | Design & Install | MTBoss',
    description:
      'Looking for a modular kitchen dealer in Moradabad? MTBoss plans, designs and installs modular kitchens for homes and apartments. Call or WhatsApp for a quote.',
    images: ['https://www.MTBoss.in/og-modular-kitchen-dealer-moradabad.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'MTBoss Construction Private Limited',
  url: 'https://www.MTBoss.in/modular-kitchen-dealer-moradabad',
  telephone: '+91-9458410866',
  email: 'MTBoss2016@gmail.com',
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