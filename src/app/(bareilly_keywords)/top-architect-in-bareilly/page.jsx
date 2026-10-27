// app/(bareilly_keywords)/top-architect-in-bareilly/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Top Architect in Bareilly | MTBOSS Design & Build',
  description:
    'Shortlisting a top architect in Bareilly . Learn how to screen credentials, read portfolios, check references and compare proposals, and see how MTBOSS answers.',
  keywords:
    'top architect in Bareilly, best architect Bareilly, registered architect Bareilly, house architect Bareilly, commercial architect Bareilly, interior designer Bareilly, architectural drawings Bareilly, MTBOSS Bareilly, design and build Bareilly, architect near me Bareilly, COA registered architect Bareilly, shortlist architect Bareilly',
  alternates: {
    canonical: 'https://www.MTBOSS.in/top-architect-in-bareilly',
  },
  openGraph: {
    title: 'Top Architect in Bareilly | MTBOSS Design & Build',
    description:
      'Shortlisting a top architect in Bareilly . Learn how to screen credentials, read portfolios, check references and compare proposals, and see how MTBOSS answers.',
    url: 'https://www.MTBOSS.in/top-architect-in-bareilly',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBOSS.in/og-top-architect-in-bareilly.jpg',
        width: 1200,
        height: 630,
        alt: 'Top Architect in Bareilly - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Architect in Bareilly | MTBOSS Design & Build',
    description:
      'Shortlisting a top architect in Bareilly . Learn how to screen credentials, read portfolios, check references and compare proposals, and see how MTBOSS answers.',
    images: ['https://www.MTBOSS.in/og-top-architect-in-bareilly.jpg'],
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
    url: 'https://www.MTBOSS.in/top-architect-in-bareilly',
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