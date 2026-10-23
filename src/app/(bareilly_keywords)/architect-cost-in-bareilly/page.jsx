// app/(bareilly_keywords)/architect-cost-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect Cost in Bareilly',
  description:
    'Planning architect cost in Bareilly? See the full spend: design fee, consultants, approvals, supervision and extras, with clear written proposals from MTBoss.',
  keywords:
    'architect cost in Bareilly, architect cost Bareilly, architect fees Bareilly, architect charges Bareilly, architect price Bareilly, house design cost Bareilly, architect consultation fees Bareilly, architect cost per square foot Bareilly, structural design cost Bareilly, approval support Bareilly, site supervision charges Bareilly, MTBoss Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.MTBoss.in/architect-cost-in-bareilly',
  },
  openGraph: {
    title: 'Architect Cost in Bareilly',
    description:
      'Planning architect cost in Bareilly? See the full spend: design fee, consultants, approvals, supervision and extras, with clear written proposals from MTBoss.',
    url: 'https://www.MTBoss.in/architect-cost-in-bareilly',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-architect-cost-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect Cost in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect Cost in Bareilly',
    description:
      'Planning architect cost in Bareilly? See the full spend: design fee, consultants, approvals, supervision and extras, with clear written proposals from MTBoss.',
    images: ['https://www.MTBoss.in/og-architect-cost-in-bareilly.jpg'],
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
    name: 'MTBoss Construction Private Limited',
    url: 'https://www.MTBoss.in/architect-cost-in-bareilly',
    telephone: '+91-9458410866',
    email: 'MTBoss2016@gmail.com',
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