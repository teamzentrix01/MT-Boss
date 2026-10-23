// app/(moradabad_keywords)/l-shape-modular-kitchen-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'L Shape Modular Kitchen in Moradabad',
  description:
    'L shape modular kitchen in Moradabad by MTBoss. Corner solutions, sink, hob and fridge placement, and breakfast counters, planned from a site measurement.',
  keywords:
    'L shape modular kitchen Moradabad, L shaped kitchen Moradabad, L shape kitchen design Moradabad, L shaped modular kitchen price Moradabad, L shape kitchen corner unit Moradabad, L shape kitchen with breakfast counter Moradabad, L shaped kitchen designer Moradabad, L shape modular kitchen installation Moradabad, L shape kitchen near me Moradabad, MTBoss L shape modular kitchen Moradabad',
  alternates: {
    canonical: 'https://www.MTBoss.in/l-shape-modular-kitchen-moradabad',
  },
  openGraph: {
    title: 'L Shape Modular Kitchen in Moradabad',
    description:
      'L shape modular kitchen in Moradabad by MTBoss. Corner solutions, sink, hob and fridge placement, and breakfast counters, planned from a site measurement.',
    url: 'https://www.MTBoss.in/l-shape-modular-kitchen-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-l-shape-modular-kitchen-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'L Shape Modular Kitchen in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'L Shape Modular Kitchen in Moradabad',
    description:
      'L shape modular kitchen in Moradabad by MTBoss. Corner solutions, sink, hob and fridge placement, and breakfast counters, planned from a site measurement.',
    images: ['https://www.MTBoss.in/og-l-shape-modular-kitchen-moradabad.jpg'],
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
  url: 'https://www.MTBoss.in/l-shape-modular-kitchen-moradabad',
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