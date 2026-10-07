// app/(moradabad_keywords)/modular-kitchen-cost-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Modular Kitchen Cost in Moradabad',
  description:
    'Understand modular kitchen cost in Moradabad: what makes up the price, where quotes differ and how MT Boss gives itemised estimates after a site visit.',
  keywords:
    'modular kitchen cost Moradabad, modular kitchen price Moradabad, modular kitchen price per running foot Moradabad, modular kitchen quotation Moradabad, modular kitchen budget Moradabad, modular kitchen rates Moradabad, kitchen cost calculator Moradabad, modular kitchen estimate Moradabad, modular kitchen price near me Moradabad, MT Boss modular kitchen cost Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/modular-kitchen-cost-moradabad',
  },
  openGraph: {
    title: 'Modular Kitchen Cost in Moradabad',
    description:
      'Understand modular kitchen cost in Moradabad: what makes up the price, where quotes differ and how MT Boss gives itemised estimates after a site visit.',
    url: 'https://www.mtboss.in/modular-kitchen-cost-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-modular-kitchen-cost-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Modular Kitchen Cost in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modular Kitchen Cost in Moradabad',
    description:
      'Understand modular kitchen cost in Moradabad: what makes up the price, where quotes differ and how MT Boss gives itemised estimates after a site visit.',
    images: ['https://www.mtboss.in/og-modular-kitchen-cost-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/modular-kitchen-cost-moradabad',
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