// app/(bareilly_keywords)/architect-for-petrol-pump-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Petrol Pump in Bareilly | MT Boss',
  description:
    'Planning a petrol pump in Bareilly? MT Boss supports site planning, building design, civil works and approvals coordination for fuel outlets. Call +91 94584 10866.',
  keywords:
    'architect for petrol pump in Bareilly, petrol pump architect Bareilly, fuel station architect Bareilly, petrol pump design Bareilly, petrol pump site planning Bareilly, petrol pump construction Bareilly, fuel outlet architect Bareilly, petrol pump civil works Bareilly, petrol pump approvals Bareilly, MT Boss Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-petrol-pump-bareilly',
  },
  openGraph: {
    title: 'Architect for Petrol Pump in Bareilly | MT Boss',
    description:
      'Planning a petrol pump in Bareilly? MT Boss supports site planning, building design, civil works and approvals coordination for fuel outlets. Call +91 94584 10866.',
    url: 'https://www.mtboss.in/architect-for-petrol-pump-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-for-petrol-pump-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Petrol Pump in Bareilly - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Petrol Pump in Bareilly | MT Boss',
    description:
      'Planning a petrol pump in Bareilly? MT Boss supports site planning, building design, civil works and approvals coordination for fuel outlets. Call +91 94584 10866.',
    images: ['https://www.mtboss.in/og-architect-for-petrol-pump-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/architect-for-petrol-pump-bareilly',
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