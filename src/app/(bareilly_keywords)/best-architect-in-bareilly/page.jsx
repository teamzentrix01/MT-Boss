// app/(bareilly_keywords)/best-architect-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Architect in Bareilly',
  description:
    'Choosing the best architect in Bareilly. Judge on registration, built work, listening, cost sense and clear scope. See how MT Boss measures up. Call +91 94584 10866.',
  keywords:
    'best architect in Bareilly, top architect Bareilly, registered architect Bareilly, house architect Bareilly, commercial architect Bareilly, interior designer Bareilly, architectural drawings Bareilly, MT Boss Bareilly, design and build Bareilly, architect near me Bareilly, COA registered architect Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/best-architect-in-bareilly',
  },
  openGraph: {
    title: 'Best Architect in Bareilly',
    description:
      'Choosing the best architect in Bareilly. Judge on registration, built work, listening, cost sense and clear scope. See how MT Boss measures up. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/best-architect-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-best-architect-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Architect in Bareilly - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Architect in Bareilly',
    description:
      'Choosing the best architect in Bareilly. Judge on registration, built work, listening, cost sense and clear scope. See how MT Boss measures up. Call +91 94584 10866.',
    images: ['https://www.mtboss.in/og-best-architect-in-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/best-architect-in-bareilly',
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