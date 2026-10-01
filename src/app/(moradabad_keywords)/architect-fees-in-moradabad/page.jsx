// app/(moradabad_keywords)/architect-fees-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect Fees in Moradabad | Design Cost Guide',
  description:
    'Wondering about architect fees in Moradabad? Learn typical fee structures, what affects design costs, and how MTBOSS provides transparent estimates. Call now!',
  keywords:
    'architect fees Moradabad, architect fee structure India, house design cost Moradabad, architect charges near me, design fee percentage construction, architect consultation fees Moradabad, cheap architect fees near me, MTBOSS Moradabad, architect cost per square foot, design and build pricing Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-fees-in-moradabad',
  },
  openGraph: {
    title: 'Architect Fees in Moradabad | Design Cost Guide',
    description:
      'Wondering about architect fees in Moradabad? Learn typical fee structures, what affects design costs, and how MTBOSS provides transparent estimates. Call now!',
    url: 'https://www.mtboss.in/architect-fees-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-fees-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect Fees in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect Fees in Moradabad | Design Cost Guide',
    description:
      'Wondering about architect fees in Moradabad? Learn typical fee structures, what affects design costs, and how MTBOSS provides transparent estimates. Call now!',
    images: ['https://www.mtboss.in/og-architect-fees-moradabad.jpg'],
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
    url: 'https://www.mtboss.in/architect-fees-in-moradabad',
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