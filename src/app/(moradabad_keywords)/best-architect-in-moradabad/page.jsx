// app/(moradabad_keywords)/best-architect-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';


export const metadata = {
  title: 'Best Architect in Moradabad | MT Boss',
  description:
    'Looking for the best architect in Moradabad? MT Boss offers house plans, 3D elevation, commercial design and construction under one roof. Free site visit.',
  keywords:
    'best architect in Moradabad, architect near me Moradabad, architect in Moradabad, house architect Moradabad, residential architect Moradabad, commercial architect Moradabad, 3D elevation designer Moradabad, house plan designer Moradabad, architect and builder Moradabad, MT Boss architect Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/best-architect-in-moradabad',
  },
  openGraph: {
    title: 'Best Architect in Moradabad | MT Boss',
    description:
      'Looking for the best architect in Moradabad? MT Boss offers house plans, 3D elevation, commercial design and construction under one roof. Free site visit.',
    url: 'https://www.mtboss.in/best-architect-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-best-architect-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Architect in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Architect in Moradabad | MT Boss',
    description:
      'Looking for the best architect in Moradabad? MT Boss offers house plans, 3D elevation, commercial design and construction under one roof. Free site visit.',
    images: ['https://www.mtboss.in/og-best-architect-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/best-architect-in-moradabad',
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