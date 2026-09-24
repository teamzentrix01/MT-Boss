// app/(moradabad_keywords)/architect-near-me-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect Near Me in Moradabad | Design & Build Guide',
  description:
    'Searching for an "architect near me" in Moradabad? Learn what to look for, typical costs, and how design-and-build firms like MTBOSS can help. Call now!',
  keywords:
    'architect near me Moradabad, house architect Moradabad, best architect near me, residential architect Moradabad, commercial architect Moradabad, architect for house design, architect contact number Moradabad, design and build company Moradabad, MTBOSS Moradabad, house design near me',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-near-me-in-moradabad',
  },
  openGraph: {
    title: 'Architect Near Me in Moradabad | Design & Build Guide',
    description:
      'Searching for an "architect near me" in Moradabad? Learn what to look for, typical costs, and how design-and-build firms like MTBOSS can help. Call now!',
    url: 'https://www.mtboss.in/architect-near-me-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-near-me-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect Near Me in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect Near Me in Moradabad | Design & Build Guide',
    description:
      'Searching for an "architect near me" in Moradabad? Learn what to look for, typical costs, and how design-and-build firms like MTBOSS can help. Call now!',
    images: ['https://www.mtboss.in/og-architect-near-me-moradabad.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'MTBOSS Construction Private Limited',
  url: 'https://www.mtboss.in/architect-near-me-in-moradabad',
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

export default function Page() {
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