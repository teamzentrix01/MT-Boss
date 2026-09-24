// app/(moradabad_keywords)/architect-for-hotel-construction-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Hotel in Moradabad | Design & Build',
  description:
    'Planning a hotel in Moradabad? Learn what hotel design and construction involves, key compliance needs, costs, and how MTBOSS supports design-to-build execution.',
  keywords:
    'architect for hotel Moradabad, hotel design and construction Moradabad, hotel building contractor Moradabad, hospitality project architect near me, hotel construction company Moradabad, resort architect Moradabad, hotel building cost Moradabad, MTBOSS Moradabad, hospitality construction near me, hotel infrastructure contractor',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-hotel-construction-in-moradabad',
  },
  openGraph: {
    title: 'Architect for Hotel in Moradabad | Design & Build',
    description:
      'Planning a hotel in Moradabad? Learn what hotel design and construction involves, key compliance needs, costs, and how MTBOSS supports design-to-build execution.',
    url: 'https://www.mtboss.in/architect-for-hotel-construction-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-hotel-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Hotel Construction in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Hotel in Moradabad | Design & Build',
    description:
      'Planning a hotel in Moradabad? Learn what hotel design and construction involves, key compliance needs, costs, and how MTBOSS supports design-to-build execution.',
    images: ['https://www.mtboss.in/og-architect-hotel-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/architect-for-hotel-construction-in-moradabad',
  telephone: '+91-9458410866',
  email: 'mtboss2016@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
    addressLocality: 'Moradabad',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
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