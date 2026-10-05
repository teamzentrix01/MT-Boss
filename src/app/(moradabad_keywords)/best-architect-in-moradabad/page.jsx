// app/(moradabad_keywords)/architect-near-me-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Architect in Moradabad (2026) – Design & Build – MTBOSS',
  description:
    'Looking for the best architect in Moradabad? MTBOSS combines design, map approval & construction under one roof. 100+ projects. Free consultation.',
  keywords:
    'best architect in Moradabad, architect Moradabad, top architect Moradabad, architect near me Moradabad, house architect Moradabad, residential architect Moradabad, map approval Moradabad, building design Moradabad, design and build Moradabad, MTBOSS Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-near-me-in-moradabad',
  },
  openGraph: {
    title: 'Best Architect in Moradabad (2026) – Design & Build – MTBOSS',
    description:
      'Looking for the best architect in Moradabad? MTBOSS combines design, map approval & construction under one roof. 100+ projects. Free consultation.',
    url: 'https://www.mtboss.in/architect-near-me-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-near-me-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Architect in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Architect in Moradabad (2026) – Design & Build – MTBOSS',
    description:
      'Looking for the best architect in Moradabad? MTBOSS combines design, map approval & construction under one roof. 100+ projects. Free consultation.',
    images: ['https://www.mtboss.in/og-architect-near-me-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/architect-near-me-in-moradabad',
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