// app/(bareilly_keywords)/school-building-contractor-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'School Building Contractor in Bareilly | Contract Scope & Packages | MTBOSS',
  description:
    'School building contractor in Bareilly: clear contract packages, trust-friendly approvals, child-safe site rules and snagging before handover. MTBOSS builds to approved drawings.',
  keywords:
    'school building contractor in Bareilly, school building contractor Bareilly, school construction contractor Bareilly, school building packages Bareilly, school construction company Bareilly, school renovation contractor Bareilly, school extension contractor Bareilly, classroom construction Bareilly, institutional building contractor Bareilly, school building repair Bareilly, waterproofing Bareilly, building contractor Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/school-building-contractor-in-bareilly',
  },
  openGraph: {
    title:
      'School Building Contractor in Bareilly | Contract Scope & Packages | MTBOSS',
    description:
      'School building contractor in Bareilly: clear contract packages, trust-friendly approvals, child-safe site rules and snagging before handover. MTBOSS builds to approved drawings.',
    url:
      'https://www.mtboss.in/school-building-contractor-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-school-building-contractor-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'School Building Contractor in Bareilly - Contract Scope & Packages - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'School Building Contractor in Bareilly | Contract Scope & Packages | MTBOSS',
    description:
      'School building contractor in Bareilly: clear contract packages, trust-friendly approvals, child-safe site rules and snagging before handover. MTBOSS builds to approved drawings.',
    images: [
      'https://www.mtboss.in/og-school-building-contractor-in-bareilly.jpg',
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
      'https://www.mtboss.in/school-building-contractor-in-bareilly',
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