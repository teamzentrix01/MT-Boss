// app/(bareilly_keywords)/civil-work-contractor-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title:
    'Civil Work Contractor in Bareilly | Work Packages & BOQ | MTBOSS',
  description:
    'Civil work contractor in Bareilly: split your project into clear work packages, get a written BOQ and supervised execution. MTBOSS builds and repairs. Call or WhatsApp.',
  keywords:
    'civil work contractor in Bareilly, civil contractor Bareilly, civil work Bareilly, building contractor Bareilly, construction contractor Bareilly, house construction Bareilly, commercial construction Bareilly, BOQ contractor Bareilly, work packages construction Bareilly, building repair Bareilly, renovation contractor Bareilly, waterproofing Bareilly, civil work packages Bareilly, MTBOSS Bareilly',
  alternates: {
    canonical:
      'https://www.mtboss.in/civil-work-contractor-in-bareilly',
  },
  openGraph: {
    title:
      'Civil Work Contractor in Bareilly | Work Packages & BOQ | MTBOSS',
    description:
      'Civil work contractor in Bareilly: split your project into clear work packages, get a written BOQ and supervised execution. MTBOSS builds and repairs. Call or WhatsApp.',
    url:
      'https://www.mtboss.in/civil-work-contractor-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url:
          'https://www.mtboss.in/og-civil-work-contractor-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Civil Work Contractor in Bareilly - Work Packages and BOQ - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Civil Work Contractor in Bareilly | Work Packages & BOQ | MTBOSS',
    description:
      'Civil work contractor in Bareilly: split your project into clear work packages, get a written BOQ and supervised execution. MTBOSS builds and repairs. Call or WhatsApp.',
    images: [
      'https://www.mtboss.in/og-civil-work-contractor-in-bareilly.jpg',
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
      'https://www.mtboss.in/civil-work-contractor-in-bareilly',
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