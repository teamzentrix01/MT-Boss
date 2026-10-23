// app/(bareilly_keywords)/architect-for-shopping-complex-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Shopping  Complex  Bareilly',
  description:
    'Planning a shopping complex Bareilly  MTBoss designs unit mix, frontage, parking and services, then builds in phases. Call +91 94584 10866 for a site visit.',
  keywords:
    'architect for shopping complex Bareilly, shopping complex architect Bareilly, shopping complex design Bareilly, shopping complex planning Bareilly, shopping complex construction Bareilly, commercial complex architect Bareilly, retail complex design Bareilly, shop complex architect Bareilly, shopping complex builder Bareilly, commercial building architect Bareilly, MTBoss Bareilly, shopping complex Bareilly',
  alternates: {
    canonical: 'https://www.MTBoss.in/architect-for-shopping-complex-bareilly',
  },
  openGraph: {
    title: 'Architect for Shopping  Complex  Bareilly',
    description:
      'Planning a shopping complex Bareilly  MTBoss designs unit mix, frontage, parking and services, then builds in phases. Call +91 94584 10866 for a site visit.',
    url: 'https://www.MTBoss.in/architect-for-shopping-complex-bareilly',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-architect-for-shopping-complex-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Shopping Complex Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Shopping  Complex  Bareilly',
    description:
      'Planning a shopping complex Bareilly  MTBoss designs unit mix, frontage, parking and services, then builds in phases. Call +91 94584 10866 for a site visit.',
    images: [
      'https://www.MTBoss.in/og-architect-for-shopping-complex-bareilly.jpg',
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
    name: 'MTBoss Construction Private Limited',
    url: 'https://www.MTBoss.in/architect-for-shopping-complex-bareilly',
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