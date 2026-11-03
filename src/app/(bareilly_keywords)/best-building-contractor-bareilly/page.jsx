// app/(bareilly_keywords)/best-building-contractor-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Best Building Contractor in Bareilly | How to Shortlist & Decide | MTBOSS',
  description:
    'Choosing the best building contractor in Bareilly: shortlist, interview, visit live sites and compare quotations fairly. See how MTBOSS builds houses and commercial spaces.',
  keywords:
    'best building contractor in Bareilly, building contractor Bareilly, construction company Bareilly, house construction Bareilly, commercial construction Bareilly, building contractor near me Bareilly, how to choose building contractor Bareilly, compare building contractor quotations Bareilly, building contractor checklist Bareilly, building renovation Bareilly, waterproofing Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/best-building-contractor-in-bareilly',
  },
  openGraph: {
    title:
      'Best Building Contractor in Bareilly | How to Shortlist & Decide | MTBOSS',
    description:
      'Choosing the best building contractor in Bareilly: shortlist, interview, visit live sites and compare quotations fairly. See how MTBOSS builds houses and commercial spaces.',
    url:
      'https://www.mtboss.in/best-building-contractor-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-best-building-contractor-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Best Building Contractor in Bareilly - How to Shortlist and Decide - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Best Building Contractor in Bareilly | How to Shortlist & Decide | MTBOSS',
    description:
      'Choosing the best building contractor in Bareilly: shortlist, interview, visit live sites and compare quotations fairly. See how MTBOSS builds houses and commercial spaces.',
    images: [
      'https://www.mtboss.in/og-best-building-contractor-in-bareilly.jpg',
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
    url:
      'https://www.mtboss.in/best-building-contractor-in-bareilly',
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