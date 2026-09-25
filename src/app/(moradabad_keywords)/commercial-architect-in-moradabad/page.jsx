// app/(moradabad_keywords)/commercial-architect-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Commercial Architect in Moradabad | Design & Build',
  description:
    'Looking for a commercial architect in Moradabad? Learn what office, retail & business space design involves, costs, and how MTBOSS supports design-to-build.',
  keywords:
    'commercial architect Moradabad, office design architect Moradabad, retail architect near me, showroom design Moradabad, commercial building design company, business space architect Moradabad, commercial design and build Moradabad, MTBOSS Moradabad, office interior architect near me, commercial construction design Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/commercial-architect-in-moradabad',
  },
  openGraph: {
    title: 'Commercial Architect in Moradabad | Design & Build',
    description:
      'Looking for a commercial architect in Moradabad? Learn what office, retail & business space design involves, costs, and how MTBOSS supports design-to-build.',
    url: 'https://www.mtboss.in/commercial-architect-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-commercial-architect-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Commercial Architect in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commercial Architect in Moradabad | Design & Build',
    description:
      'Looking for a commercial architect in Moradabad? Learn what office, retail & business space design involves, costs, and how MTBOSS supports design-to-build.',
    images: ['https://www.mtboss.in/og-commercial-architect-moradabad.jpg'],
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
    url: 'https://www.mtboss.in/commercial-architect-in-moradabad',
    telephone: '+91-9458410866',
    email: 'mtboss2016@gmail.com',
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