// app/(bareilly_keywords)/architect-firm-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect Firm in Bareilly',
  description:
    'Looking for an architect firm in Bareilly? See how MT Boss organises design teams, drawings, quality checks and handover for homes, shops and industrial projects.',
  keywords:
    'architect firm in Bareilly, architecture firm Bareilly, design firm Bareilly, building design firm Bareilly, interior design firm Bareilly, architectural drawings Bareilly, MT Boss Bareilly, design and build Bareilly, architect near me Bareilly, COA registered architect Bareilly, design firm for homes Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-firm-in-bareilly',
  },
  openGraph: {
    title: 'Architect Firm in Bareilly',
    description:
      'Looking for an architect firm in Bareilly? See how MT Boss organises design teams, drawings, quality checks and handover for homes, shops and industrial projects.',
    url: 'https://www.mtboss.in/architect-firm-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-firm-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect Firm in Bareilly - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect Firm in Bareilly',
    description:
      'Looking for an architect firm in Bareilly? See how MT Boss organises design teams, drawings, quality checks and handover for homes, shops and industrial projects.',
    images: ['https://www.mtboss.in/og-architect-firm-in-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/architect-firm-in-bareilly',
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