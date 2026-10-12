// app/(bareilly_keywords)/residential-architect-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Residential Architect in Bareilly',
  description:
    'Residential architect in Bareilly for house planning, design, drawings and construction guidance. MTBOSS designs homes around your family, plot and budget. Call or WhatsApp.',
  keywords:
    'residential architect in Bareilly, house architect Bareilly, home design Bareilly, house planning Bareilly, house map design Bareilly, residential building design Bareilly, architect for home Bareilly, house construction architect Bareilly, home renovation architect Bareilly, Vastu home design Bareilly, MTBOSS Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/residential-architect-bareilly',
  },
  openGraph: {
    title: 'Residential Architect in Bareilly',
    description:
      'Residential architect in Bareilly for house planning, design, drawings and construction guidance. MTBOSS designs homes around your family, plot and budget. Call or WhatsApp.',
    url: 'https://www.mtboss.in/residential-architect-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-residential-architect-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Residential Architect in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Residential Architect in Bareilly',
    description:
      'Residential architect in Bareilly for house planning, design, drawings and construction guidance. MTBOSS designs homes around your family, plot and budget. Call or WhatsApp.',
    images: ['https://www.mtboss.in/og-residential-architect-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/residential-architect-bareilly',
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