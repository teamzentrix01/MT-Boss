// app/(bareilly_keywords)/architect-for-apartment-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Apartment Bareilly',
  description:
    'Planning an apartment building in Bareilly? MTBoss plans efficient flats, parking, lifts, services and structure for sale or rental. Call +91 94584 10866.',
  keywords:
    'architect for apartment Bareilly, apartment architect Bareilly, apartment design Bareilly, apartment planning Bareilly, builder floor architect Bareilly, apartment building design Bareilly, flat design Bareilly, apartment construction Bareilly, apartment builder Bareilly, apartment architect near me Bareilly, MTBoss Bareilly, apartment Bareilly',
  alternates: {
    canonical: 'https://www.MTBoss.in/architect-for-apartment-bareilly',
  },
  openGraph: {
    title: 'Architect for Apartment Bareilly',
    description:
      'Planning an apartment building in Bareilly? MTBoss plans efficient flats, parking, lifts, services and structure for sale or rental. Call +91 94584 10866.',
    url: 'https://www.MTBoss.in/architect-for-apartment-bareilly',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-architect-for-apartment-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Apartment Bareilly - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Apartment Bareilly',
    description:
      'Planning an apartment building in Bareilly? MTBoss plans efficient flats, parking, lifts, services and structure for sale or rental. Call +91 94584 10866.',
    images: [
      'https://www.MTBoss.in/og-architect-for-apartment-bareilly.jpg',
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
    url: 'https://www.MTBoss.in/architect-for-apartment-bareilly',
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