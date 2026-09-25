// app/(moradabad_keywords)/architect-firm-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect Firm in Moradabad | Design & Build Company',
  description:
    'Comparing architect firms in Moradabad? Learn what to look for in a design company\'s team, portfolio & process, and how MTBOSS supports design-to-build.',
  keywords:
    'architect firm Moradabad, architecture firm near me, design firm Moradabad, top architect firm Moradabad, architectural company Moradabad, best design firm near me, design and build firm Moradabad, MTBOSS Moradabad, architecture company contact Moradabad, established architect firm',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-firm-in-moradabad',
  },
  openGraph: {
    title: 'Architect Firm in Moradabad | Design & Build Company',
    description:
      'Comparing architect firms in Moradabad? Learn what to look for in a design company\'s team, portfolio & process, and how MTBOSS supports design-to-build.',
    url: 'https://www.mtboss.in/architect-firm-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-firm-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect Firm in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect Firm in Moradabad | Design & Build Company',
    description:
      'Comparing architect firms in Moradabad? Learn what to look for in a design company\'s team, portfolio & process, and how MTBOSS supports design-to-build.',
    images: ['https://www.mtboss.in/og-architect-firm-moradabad.jpg'],
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
    url: 'https://www.mtboss.in/architect-firm-in-moradabad',
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