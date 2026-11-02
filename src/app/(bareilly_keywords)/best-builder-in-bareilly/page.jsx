// app/(bareilly_keywords)/best-builder-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Best Builder in Bareilly | MTBoss Construction',
  description:
    'Looking for the best builder in Bareilly? See what to check on quotes, supervision, materials and agreements, and how MTBoss answers each point.',
  keywords:
    'best builder in Bareilly, top builder in Bareilly, builder in Bareilly, construction company Bareilly, building contractor Bareilly, civil contractor Bareilly, house builder Bareilly, home construction Bareilly, commercial builder Bareilly, renovation builder Bareilly, builder checklist Bareilly, MTBoss Bareilly, MTBoss construction',
  alternates: {
    canonical: 'https://www.mtboss.in/best-builder-in-bareilly',
  },
  openGraph: {
    title: 'Best Builder in Bareilly | MTBoss Construction',
    description:
      'Looking for the best builder in Bareilly? See what to check on quotes, supervision, materials and agreements, and how MTBoss answers each point.',
    url: 'https://www.mtboss.in/best-builder-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-best-builder-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Best Builder in Bareilly - MTBoss Construction',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Builder in Bareilly | MTBoss Construction',
    description:
      'Looking for the best builder in Bareilly? See what to check on quotes, supervision, materials and agreements, and how MTBoss answers each point.',
    images: ['https://www.mtboss.in/og-best-builder-in-bareilly.jpg'],
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
    url: 'https://www.mtboss.in/best-builder-in-bareilly',
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