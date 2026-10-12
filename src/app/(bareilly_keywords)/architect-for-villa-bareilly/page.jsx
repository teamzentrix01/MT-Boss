// app/(bareilly_keywords)/architect-for-villa-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Villa in Bareilly | MT Boss',
  description:
    'Planning a villa in Bareilly? MT Boss designs villas and bungalows with climate-smart planning, approval-ready drawings and build support. Call +91 94584 10866.',
  keywords:
    'architect for villa in Bareilly, villa architect Bareilly, bungalow architect Bareilly, villa design Bareilly, luxury villa architect Bareilly, villa planning Bareilly, villa construction Bareilly, bungalow design Bareilly, villa renovation Bareilly, MT Boss Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-villa-bareilly',
  },
  openGraph: {
    title: 'Architect for Villa in Bareilly | MT Boss',
    description:
      'Planning a villa in Bareilly? MT Boss designs villas and bungalows with climate-smart planning, approval-ready drawings and build support. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/architect-for-villa-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-for-villa-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Villa in Bareilly - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Villa in Bareilly | MT Boss',
    description:
      'Planning a villa in Bareilly? MT Boss designs villas and bungalows with climate-smart planning, approval-ready drawings and build support. Call +91 94584 10866.',
    images: ['https://www.mtboss.in/og-architect-for-villa-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/architect-for-villa-bareilly',
    telephone: '+91-9458410866',
    email: 'mtboss2016@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        "Harthala Kanth Road, Behind Kr Collection, near Domino's",
      addressLocality: 'Moradabad',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: 'Bareilly',
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