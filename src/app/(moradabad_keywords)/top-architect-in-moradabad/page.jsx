// app/(moradabad_keywords)/top-architect-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';


export const metadata = {
  title: 'Top Architect in Moradabad | MTBOSS',
  description:
    'Searching for a top architect in Moradabad? MTBOSS offers house plans, 3D elevation, commercial design and construction under one roof. Free site visit.',
  keywords:
    'top architect in Moradabad, best architect Moradabad, architect near me Moradabad, architect in Moradabad, house architect Moradabad, residential architect Moradabad, commercial architect Moradabad, 3D elevation designer Moradabad, house plan designer Moradabad, architect and builder Moradabad, MTBOSS architect Moradabad',
  alternates: {
    canonical: 'https://www.MTBOSS.in/top-architect-in-moradabad',
  },
  openGraph: {
    title: 'Top Architect in Moradabad | MTBOSS',
    description:
      'Searching for a top architect in Moradabad? MTBOSS offers house plans, 3D elevation, commercial design and construction under one roof. Free site visit.',
    url: 'https://www.MTBOSS.in/top-architect-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBOSS.in/og-top-architect-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Top Architect in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Architect in Moradabad | MTBOSS',
    description:
      'Searching for a top architect in Moradabad? MTBOSS offers house plans, 3D elevation, commercial design and construction under one roof. Free site visit.',
    images: ['https://www.MTBOSS.in/og-top-architect-moradabad.jpg'],
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
  url: 'https://www.MTBOSS.in/top-architect-in-moradabad',
  telephone: '+91-9458410866',
  email: 'MTBOSS2016@gmail.com',
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