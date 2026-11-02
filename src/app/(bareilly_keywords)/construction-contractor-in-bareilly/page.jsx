// app/(bareilly_keywords)/construction-contractor-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Construction Contractor in Bareilly | Homes, Shops & Institutions | MTBOSS',
  description:
    'Construction contractor in Bareilly for homeowners, shop owners, institutions and investors. MTBOSS builds, renovates and finishes with written scope and supervised sites.',
  keywords:
    'construction contractor in Bareilly, construction contractor Bareilly, building contractor Bareilly, civil contractor Bareilly, house construction Bareilly, home construction Bareilly, shop construction Bareilly, office construction Bareilly, institutional construction Bareilly, building renovation Bareilly, waterproofing Bareilly, finishing contractor Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical: 'https://www.mtboss.in/construction-contractor-in-bareilly',
  },
  openGraph: {
    title:
      'Construction Contractor in Bareilly | Homes, Shops & Institutions | MTBOSS',
    description:
      'Construction contractor in Bareilly for homeowners, shop owners, institutions and investors. MTBOSS builds, renovates and finishes with written scope and supervised sites.',
    url: 'https://www.mtboss.in/construction-contractor-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-construction-contractor-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt:
          'Construction Contractor in Bareilly - Homes, Shops and Institutions - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Construction Contractor in Bareilly | Homes, Shops & Institutions | MTBOSS',
    description:
      'Construction contractor in Bareilly for homeowners, shop owners, institutions and investors. MTBOSS builds, renovates and finishes with written scope and supervised sites.',
    images: [
      'https://www.mtboss.in/og-construction-contractor-in-bareilly.jpg',
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
    url: 'https://www.mtboss.in/construction-contractor-in-bareilly',
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