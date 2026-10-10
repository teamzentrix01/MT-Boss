// app/(bareilly_keywords)/architect-for-hotel-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Hotel in Bareilly',
  description:
    'Architect for hotel in Bareilly: planning, design and construction guidance for new hotels, guest houses and renovations. MTBOSS supports practical, guest-ready projects. Call or WhatsApp.',
  keywords:
    'architect for hotel in Bareilly, hotel architect Bareilly, hotel design Bareilly, hotel planning Bareilly, guest house architect Bareilly, boutique hotel architect Bareilly, hotel renovation architect Bareilly, hotel construction Bareilly, hotel interior design Bareilly, banquet hall architect Bareilly, MTBOSS Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-for-hotel-bareilly',
  },
  openGraph: {
    title: 'Architect for Hotel in Bareilly',
    description:
      'Architect for hotel in Bareilly: planning, design and construction guidance for new hotels, guest houses and renovations. MTBOSS supports practical, guest-ready projects. Call or WhatsApp.',
    url: 'https://www.mtboss.in/architect-for-hotel-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-for-hotel-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Hotel in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Hotel in Bareilly',
    description:
      'Architect for hotel in Bareilly: planning, design and construction guidance for new hotels, guest houses and renovations. MTBOSS supports practical, guest-ready projects. Call or WhatsApp.',
    images: ['https://www.mtboss.in/og-architect-for-hotel-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/architect-for-hotel-bareilly',
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