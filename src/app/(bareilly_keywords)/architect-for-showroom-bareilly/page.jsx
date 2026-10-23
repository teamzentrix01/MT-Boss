// app/(bareilly_keywords)/architect-for-showroom-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Showroom in Bareilly',
  description:
    'Opening a showroom in Bareilly? MTBoss designs shop fronts, display zones, lighting and services, then builds the fit-out. Call +91 94584 10866 for a site visit.',
  keywords:
    'architect for showroom in Bareilly, showroom architect Bareilly, showroom design Bareilly, retail architect Bareilly, shop front design Bareilly, showroom interior design Bareilly, showroom fit-out Bareilly, commercial architect Bareilly, retail shop design Bareilly, showroom construction Bareilly, MTBoss Bareilly, architect near me Bareilly',
  alternates: {
    canonical: 'https://www.MTBoss.in/architect-for-showroom-bareilly',
  },
  openGraph: {
    title: 'Architect for Showroom in Bareilly',
    description:
      'Opening a showroom in Bareilly? MTBoss designs shop fronts, display zones, lighting and services, then builds the fit-out. Call +91 94584 10866 for a site visit.',
    url: 'https://www.MTBoss.in/architect-for-showroom-bareilly',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-architect-for-showroom-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Showroom in Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Showroom in Bareilly',
    description:
      'Opening a showroom in Bareilly? MTBoss designs shop fronts, display zones, lighting and services, then builds the fit-out. Call +91 94584 10866 for a site visit.',
    images: ['https://www.MTBoss.in/og-architect-for-showroom-bareilly.jpg'],
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
    url: 'https://www.MTBoss.in/architect-for-showroom-bareilly',
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