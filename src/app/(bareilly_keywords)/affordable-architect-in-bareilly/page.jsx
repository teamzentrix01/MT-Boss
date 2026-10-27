// app/(bareilly_keywords)/affordable-architect-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Affordable Architect in Bareilly',
  description:
    'Looking for an affordable architect in Bareilly? MTBOSS offers stage-wise, clearly priced design for houses, shops and buildings, without cutting safety.',
  keywords:
    'affordable architect in Bareilly, affordable architect Bareilly, cheap architect Bareilly, low cost architect Bareilly, budget architect Bareilly, architect price Bareilly, architect fees Bareilly, house design cost Bareilly, architect near me Bareilly, affordable house design Bareilly, budget home design Bareilly, MTBOSS Bareilly, architect Bareilly',
  alternates: {
    canonical: 'https://www.MTBOSS.in/affordable-architect-in-bareilly',
  },
  openGraph: {
    title: 'Affordable Architect in Bareilly',
    description:
      'Looking for an affordable architect in Bareilly? MTBOSS offers stage-wise, clearly priced design for houses, shops and buildings, without cutting safety.',
    url: 'https://www.MTBOSS.in/affordable-architect-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBOSS.in/og-affordable-architect-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Affordable Architect in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Affordable Architect in Bareilly',
    description:
      'Looking for an affordable architect in Bareilly? MTBOSS offers stage-wise, clearly priced design for houses, shops and buildings, without cutting safety.',
    images: [
      'https://www.MTBOSS.in/og-affordable-architect-in-bareilly.jpg',
    ],
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
    url: 'https://www.MTBOSS.in/affordable-architect-in-bareilly',
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