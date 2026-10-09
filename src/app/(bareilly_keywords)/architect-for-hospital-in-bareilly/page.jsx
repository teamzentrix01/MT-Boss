// app/(bareilly_keywords)/architect-for-hospital-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Hospital in Bareilly',
  description:
    'Architect for hospital in Bareilly: planning, design and construction guidance for hospitals, nursing homes and clinics. MTBOSS supports safe, efficient healthcare buildings.',
  keywords:
    'architect for hospital in Bareilly, hospital architect Bareilly, healthcare architect Bareilly, clinic architect Bareilly, nursing home architect Bareilly, hospital planning Bareilly, hospital design Bareilly, hospital building design Bareilly, medical building architect Bareilly, diagnostic centre architect Bareilly, MTBOSS Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-hospital-bareilly',
  },
  openGraph: {
    title: 'Architect for Hospital in Bareilly',
    description:
      'Architect for hospital in Bareilly: planning, design and construction guidance for hospitals, nursing homes and clinics. MTBOSS supports safe, efficient healthcare buildings.',
    url: 'https://www.mtboss.in/architect-for-hospital-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-for-hospital-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Hospital in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Hospital in Bareilly',
    description:
      'Architect for hospital in Bareilly: planning, design and construction guidance for hospitals, nursing homes and clinics. MTBOSS supports safe, efficient healthcare buildings.',
    images: ['https://www.mtboss.in/og-architect-for-hospital-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/architect-for-hospital-bareilly',
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