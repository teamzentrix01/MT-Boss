// app/(moradabad_keywords)/modular-kitchen-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Modular Kitchen in Moradabad | MT Boss',
  description:
    'Modular kitchen in Moradabad by MT Boss. Layout planning, moisture-resistant materials, soft-close hardware and civil groundwork under one team. Call +91 94584 10866.',
  keywords:
    'modular kitchen Moradabad, modular kitchen design Moradabad, modular kitchen installation Moradabad, modular kitchen price Moradabad, modular kitchen cost Moradabad, modular kitchen contractor Moradabad, L shaped modular kitchen Moradabad, U shaped modular kitchen Moradabad, kitchen interior Moradabad, MT Boss modular kitchen Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/modular-kitchen-moradabad',
  },
  openGraph: {
    title: 'Modular Kitchen in Moradabad | MT Boss',
    description:
      'Modular kitchen in Moradabad by MT Boss. Layout planning, moisture-resistant materials, soft-close hardware and civil groundwork under one team. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/modular-kitchen-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-modular-kitchen-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Modular Kitchen in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modular Kitchen in Moradabad | MT Boss',
    description:
      'Modular kitchen in Moradabad by MT Boss. Layout planning, moisture-resistant materials, soft-close hardware and civil groundwork under one team. Call +91 94584 10866.',
    images: ['https://www.mtboss.in/og-modular-kitchen-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/modular-kitchen-moradabad',
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