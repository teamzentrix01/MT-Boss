// app/(bareilly_keywords)/architect-for-marriage-hall-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Marriage Hall in Bareilly',
  description:
    'Planning a marriage hall in Bareilly? MTBOSS designs banquet halls and wedding lawns with guest flow, parking, kitchens and safety. Call +91 94584 10866.',
  keywords:
    'architect for marriage hall in Bareilly, marriage hall architect Bareilly, marriage hall design Bareilly, banquet hall architect Bareilly, wedding lawn design Bareilly, banquet hall construction Bareilly, marriage garden architect Bareilly, wedding venue architect Bareilly, marriage hall builder Bareilly, banquet hall design Bareilly, MTBOSS Bareilly, marriage hall Bareilly',
  alternates: {
    canonical: 'https://www.MTBOSS.in/architect-for-marriage-hall-in-bareilly',
  },
  openGraph: {
    title: 'Architect for Marriage Hall in Bareilly',
    description:
      'Planning a marriage hall in Bareilly? MTBOSS designs banquet halls and wedding lawns with guest flow, parking, kitchens and safety. Call +91 94584 10866.',
    url: 'https://www.MTBOSS.in/architect-for-marriage-hall-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBOSS.in/og-architect-for-marriage-hall-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Marriage Hall in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Marriage Hall in Bareilly',
    description:
      'Planning a marriage hall in Bareilly? MTBOSS designs banquet halls and wedding lawns with guest flow, parking, kitchens and safety. Call +91 94584 10866.',
    images: [
      'https://www.MTBOSS.in/og-architect-for-marriage-hall-in-bareilly.jpg',
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
    name: 'MTBOSS Construction Private Limited',
    url: 'https://www.MTBOSS.in/architect-for-marriage-hall-in-bareilly',
    telephone: '+91-9458410866',
    email: 'MTBOSS2016@gmail.com',
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