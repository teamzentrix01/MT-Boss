// app/(moradabad_keywords)/structural-architect-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Structural Architect in Moradabad | MTBoss',
  description:
    'Need a structural architect in Moradabad for safe, code-compliant design? Learn about load calculations, retrofitting, audits, and MTBoss\'s engineering support.',
  keywords:
    'structural architect Moradabad, structural design consultant near me, structural safety audit Moradabad, structural engineer near me, building structural design company, retrofitting contractor Moradabad, seismic design consultant near me, MTBoss Moradabad, structural certification Moradabad, structural drawing consultant',
  alternates: {
    canonical: 'https://www.MTBoss.in/structural-architect-in-moradabad',
  },
  openGraph: {
    title: 'Structural Architect in Moradabad | MTBoss',
    description:
      'Need a structural architect in Moradabad for safe, code-compliant design? Learn about load calculations, retrofitting, audits, and MTBoss\'s engineering support.',
    url: 'https://www.MTBoss.in/structural-architect-in-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-structural-architect-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Structural Architect in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Structural Architect in Moradabad | MTBoss',
    description:
      'Need a structural architect in Moradabad for safe, code-compliant design? Learn about load calculations, retrofitting, audits, and MTBoss\'s engineering support.',
    images: ['https://www.MTBoss.in/og-structural-architect-moradabad.jpg'],
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
    url: 'https://www.MTBoss.in/structural-architect-in-moradabad',
    telephone: '+91-9458410866',
    email: 'MTBoss2016@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
      addressLocality: 'Moradabad',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: 'Moradabad',
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