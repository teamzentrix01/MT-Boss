// app/(moradabad_keywords)/architect-company-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect Company in Moradabad | Design & Build',
  description:
    'Looking for an architect company in Moradabad? Learn what a design company offers, how to evaluate one, and how MTBOSS supports design-to-build execution.',
  keywords:
    'architect company Moradabad, architecture company near me, design company Moradabad, best architect company near me, architectural company contact number, design and build company Moradabad, house design company Moradabad, MTBOSS Moradabad, commercial design company Moradabad, architect company services',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-company-in-moradabad',
  },
  openGraph: {
    title: 'Architect Company in Moradabad | Design & Build',
    description:
      'Looking for an architect company in Moradabad? Learn what a design company offers, how to evaluate one, and how MTBOSS supports design-to-build execution.',
    url: 'https://www.mtboss.in/architect-company-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-company-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect Company in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect Company in Moradabad | Design & Build',
    description:
      'Looking for an architect company in Moradabad? Learn what a design company offers, how to evaluate one, and how MTBOSS supports design-to-build execution.',
    images: ['https://www.mtboss.in/og-architect-company-moradabad.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: 'MTBOSS Construction Private Limited',
    url: 'https://www.mtboss.in/architect-company-in-moradabad',
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