// app/(moradabad_keywords)/rodent-control-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Rodent Control in Moradabad',
  description:
    'Professional rodent control in Moradabad for homes, shops and godowns. MTBOSS offers inspection, rat removal, sealing and prevention. Book by call or WhatsApp.',
  keywords:
    'rodent control Moradabad, rat control Moradabad, mice control Moradabad, rat removal Moradabad, rodent pest control Moradabad, rat proofing Moradabad, rodent control near me Moradabad, rat control for godowns Moradabad, rodent control for shops Moradabad, MTBOSS rodent control Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/rodent-control-moradabad',
  },
  openGraph: {
    title: 'Rodent Control in Moradabad',
    description:
      'Professional rodent control in Moradabad for homes, shops and godowns. MTBOSS offers inspection, rat removal, sealing and prevention. Book by call or WhatsApp.',
    url: 'https://www.mtboss.in/rodent-control-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-rodent-control-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Rodent Control in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rodent Control in Moradabad',
    description:
      'Professional rodent control in Moradabad for homes, shops and godowns. MTBOSS offers inspection, rat removal, sealing and prevention. Book by call or WhatsApp.',
    images: ['https://www.mtboss.in/og-rodent-control-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/rodent-control-moradabad',
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