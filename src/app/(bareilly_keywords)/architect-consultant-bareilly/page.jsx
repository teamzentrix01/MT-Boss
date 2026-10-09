// app/(bareilly_keywords)/architect-consultant-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect Consultant in Bareilly',
  description:
    'Architect consultant in Bareilly for home planning, design, drawings and construction guidance. MTBOSS supports plots, houses and commercial projects. Call or WhatsApp.',
  keywords:
    'architect consultant in Bareilly, architect consultation Bareilly, architect near me Bareilly, house plan consultant Bareilly, home design consultant Bareilly, plot planning Bareilly, building consultant Bareilly, construction consultant Bareilly, commercial architect consultant Bareilly, renovation consultant Bareilly, MTBOSS Bareilly, architect for house Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-consultant-bareilly',
  },
  openGraph: {
    title: 'Architect Consultant in Bareilly',
    description:
      'Architect consultant in Bareilly for home planning, design, drawings and construction guidance. MTBOSS supports plots, houses and commercial projects. Call or WhatsApp.',
    url: 'https://www.mtboss.in/architect-consultant-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-consultant-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect Consultant in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect Consultant in Bareilly',
    description:
      'Architect consultant in Bareilly for home planning, design, drawings and construction guidance. MTBOSS supports plots, houses and commercial projects. Call or WhatsApp.',
    images: ['https://www.mtboss.in/og-architect-consultant-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/architect-consultant-bareilly',
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