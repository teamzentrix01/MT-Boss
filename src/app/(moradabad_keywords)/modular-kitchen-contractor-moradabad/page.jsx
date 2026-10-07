// app/(moradabad_keywords)/modular-kitchen-contractor-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Modular Kitchen Contractor in Moradabad | Turnkey Service | MTBOSS',
  description:
    'Hire a modular kitchen contractor in Moradabad for planning, civil work, installation and handover. MTBOSS manages your kitchen project end to end. Call or WhatsApp.',
  keywords:
    'modular kitchen contractor Moradabad, modular kitchen contractor near me Moradabad, turnkey modular kitchen Moradabad, modular kitchen installation contractor Moradabad, modular kitchen civil work Moradabad, modular kitchen plumbing electrical Moradabad, modular kitchen renovation contractor Moradabad, modular kitchen project management Moradabad, modular kitchen fitting Moradabad, MTBOSS modular kitchen contractor Moradabad',
  alternates: {
    canonical:
      'https://www.mtboss.in/modular-kitchen-contractor-moradabad',
  },
  openGraph: {
    title:
      'Modular Kitchen Contractor in Moradabad | Turnkey Service | MTBOSS',
    description:
      'Hire a modular kitchen contractor in Moradabad for planning, civil work, installation and handover. MTBOSS manages your kitchen project end to end. Call or WhatsApp.',
    url: 'https://www.mtboss.in/modular-kitchen-contractor-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-modular-kitchen-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Modular Kitchen Contractor in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Modular Kitchen Contractor in Moradabad | Turnkey Service | MTBOSS',
    description:
      'Hire a modular kitchen contractor in Moradabad for planning, civil work, installation and handover. MTBOSS manages your kitchen project end to end. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-modular-kitchen-contractor-moradabad.jpg',
    ],
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
  url: 'https://www.mtboss.in/modular-kitchen-contractor-moradabad',
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