// app/(moradabad_keywords)/architect-for-villa-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect for Villa in Moradabad | MTBoss',
  description:
    'Planning a villa in Moradabad? Learn about luxury layout design, premium finishes, costs, and how MTBoss supports villa design-to-build execution.',
  keywords:
    'architect for villa Moradabad, villa design Moradabad, luxury villa architect near me, villa construction company Moradabad, villa building cost Moradabad, premium villa design near me, villa contractor near me, MTBoss Moradabad, duplex villa design Moradabad, villa plan design near me',
  alternates: {
    canonical: 'https://www.MTBoss.in/architect-for-villa-in-moradabad',
  },
  openGraph: {
    title: 'Architect for Villa in Moradabad | MTBoss',
    description:
      'Planning a villa in Moradabad? Learn about luxury layout design, premium finishes, costs, and how MTBoss supports villa design-to-build execution.',
    url: 'https://www.MTBoss.in/architect-for-villa-in-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-architect-villa-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect for Villa in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect for Villa in Moradabad | MTBoss',
    description:
      'Planning a villa in Moradabad? Learn about luxury layout design, premium finishes, costs, and how MTBoss supports villa design-to-build execution.',
    images: ['https://www.MTBoss.in/og-architect-villa-moradabad.jpg'],
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
    url: 'https://www.MTBoss.in/architect-for-villa-in-moradabad',
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
    priceRange: '₹₹₹',
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