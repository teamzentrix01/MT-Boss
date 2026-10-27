// app/(bareilly_keywords)/architect-fees-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect Fees in Bareilly',
  description:
    'Understand architect fees in Bareilly: fee models, what each stage includes, extra charges and how MTBOSS writes clear design proposals. Call +91 94584 10866.',
  keywords:
    'architect fees in Bareilly, architect fees Bareilly, architect charges Bareilly, architect cost Bareilly, architect price Bareilly, house design fees Bareilly, architect consultation fees Bareilly, architect fee per square foot Bareilly, architect fee structure Bareilly, architect payment schedule Bareilly, architect design proposal Bareilly, MTBOSS Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.MTBOSS.in/architect-fees-in-bareilly',
  },
  openGraph: {
    title: 'Architect Fees in Bareilly',
    description:
      'Understand architect fees in Bareilly: fee models, what each stage includes, extra charges and how MTBOSS writes clear design proposals. Call +91 94584 10866.',
    url: 'https://www.MTBOSS.in/architect-fees-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBOSS.in/og-architect-fees-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect Fees in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect Fees in Bareilly',
    description:
      'Understand architect fees in Bareilly: fee models, what each stage includes, extra charges and how MTBOSS writes clear design proposals. Call +91 94584 10866.',
    images: ['https://www.MTBOSS.in/og-architect-fees-in-bareilly.jpg'],
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
    url: 'https://www.MTBOSS.in/architect-fees-in-bareilly',
    telephone: '+91-9458410866',
    email: 'MTBOSS2016@gmail.com',
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