// app/(moradabad_keywords)/residential-architect-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Residential Architect in Moradabad | Design & Build',
  description:
    'Looking for a residential architect in Moradabad? Learn what home design involves, typical costs, and how design-and-build firms like MTBOSS can help. Call now!',
  keywords:
    'residential architect Moradabad, house architect near me, home design architect Moradabad, independent house architect Moradabad, villa architect Moradabad, residential design and build Moradabad, house plan architect near me, MTBOSS Moradabad, home architect contact number, residential design company Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/residential-architect-in-moradabad',
  },
  openGraph: {
    title: 'Residential Architect in Moradabad | Design & Build',
    description:
      'Looking for a residential architect in Moradabad? Learn what home design involves, typical costs, and how design-and-build firms like MTBOSS can help. Call now!',
    url: 'https://www.mtboss.in/residential-architect-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-residential-architect-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Residential Architect in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Residential Architect in Moradabad | Design & Build',
    description:
      'Looking for a residential architect in Moradabad? Learn what home design involves, typical costs, and how design-and-build firms like MTBOSS can help. Call now!',
    images: ['https://www.mtboss.in/og-residential-architect-moradabad.jpg'],
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
    url: 'https://www.mtboss.in/residential-architect-in-moradabad',
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