// app/(bareilly_keywords)/architect-company-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect Company in Bareilly',
  description:
    'Hiring an architect company in Bareilly? MT Boss serves developers, businesses and institutions with briefs, approvals, milestone billing and reporting.',
  keywords:
    'architect company in Bareilly, architecture company Bareilly, design company Bareilly, building design company Bareilly, commercial architect Bareilly, developer architect Bareilly, institutional architect Bareilly, architectural drawings Bareilly, MT Boss Bareilly, design and build Bareilly, architect near me Bareilly, COA registered architect Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-company-in-bareilly',
  },
  openGraph: {
    title: 'Architect Company in Bareilly',
    description:
      'Hiring an architect company in Bareilly? MT Boss serves developers, businesses and institutions with briefs, approvals, milestone billing and reporting.',
    url: 'https://www.mtboss.in/architect-company-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-company-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect Company in Bareilly - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect Company in Bareilly',
    description:
      'Hiring an architect company in Bareilly? MT Boss serves developers, businesses and institutions with briefs, approvals, milestone billing and reporting.',
    images: ['https://www.mtboss.in/og-architect-company-in-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/architect-company-in-bareilly',
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