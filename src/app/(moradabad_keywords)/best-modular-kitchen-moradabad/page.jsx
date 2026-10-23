// app/(moradabad_keywords)/best-modular-kitchen-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Modular Kitchen in Moradabad | MTBoss',
  description:
    'Choosing the best modular kitchen in Moradabad? Judge companies on planning, materials, installation and service. See how MTBoss measures up.',
  keywords:
    'best modular kitchen Moradabad, modular kitchen Moradabad, modular kitchen company Moradabad, modular kitchen design Moradabad, modular kitchen installation Moradabad, modular kitchen price Moradabad, modular kitchen contractor Moradabad, kitchen interior Moradabad, best modular kitchen near me Moradabad, MTBoss modular kitchen Moradabad',
  alternates: {
    canonical: 'https://www.MTBoss.in/best-modular-kitchen-moradabad',
  },
  openGraph: {
    title: 'Best Modular Kitchen in Moradabad | MTBoss',
    description:
      'Choosing the best modular kitchen in Moradabad? Judge companies on planning, materials, installation and service. See how MTBoss measures up.',
    url: 'https://www.MTBoss.in/best-modular-kitchen-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-best-modular-kitchen-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Modular Kitchen in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Modular Kitchen in Moradabad | MTBoss',
    description:
      'Choosing the best modular kitchen in Moradabad? Judge companies on planning, materials, installation and service. See how MTBoss measures up.',
    images: ['https://www.MTBoss.in/og-best-modular-kitchen-moradabad.jpg'],
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
  url: 'https://www.MTBoss.in/best-modular-kitchen-moradabad',
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