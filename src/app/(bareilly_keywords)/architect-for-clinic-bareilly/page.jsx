// app/(bareilly_keywords)/architect-for-clinic-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Clinic in Bareilly',
  description:
    'Architect for clinic in Bareilly: layout, waiting area, consultation rooms and interiors for doctors and specialists. MTBOSS plans and builds. Call or WhatsApp.',
  keywords:
    'architect for clinic in Bareilly, clinic architect Bareilly, clinic design Bareilly, doctor clinic interior design Bareilly, dental clinic architect Bareilly, skin clinic design Bareilly, paediatric clinic architect Bareilly, eye clinic design Bareilly, physiotherapy clinic architect Bareilly, diagnostic centre design Bareilly, MTBOSS Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-clinic-bareilly',
  },
  openGraph: {
    title: 'Architect for Clinic in Bareilly',
    description:
      'Architect for clinic in Bareilly: layout, waiting area, consultation rooms and interiors for doctors and specialists. MTBOSS plans and builds. Call or WhatsApp.',
    url: 'https://www.mtboss.in/architect-for-clinic-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-for-clinic-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Clinic in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Clinic in Bareilly',
    description:
      'Architect for clinic in Bareilly: layout, waiting area, consultation rooms and interiors for doctors and specialists. MTBOSS plans and builds. Call or WhatsApp.',
    images: ['https://www.mtboss.in/og-architect-for-clinic-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/architect-for-clinic-bareilly',
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