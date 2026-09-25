// app/(moradabad_keywords)/architect-consultant-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Architect Consultant in Moradabad | Design & Build',
  description:
    'Need an architect consultant in Moradabad for design advice or plan review? Learn what consultants offer, costs, and how MTBOSS supports full execution.',
  keywords:
    'architect consultant Moradabad, design consultant near me, building plan consultant Moradabad, architectural consultancy Moradabad, house plan consultant near me, structural consultant Moradabad, construction consultant Moradabad, MTBOSS Moradabad, architect advice near me, design review consultant Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/architect-consultant-in-moradabad',
  },
  openGraph: {
    title: 'Architect Consultant in Moradabad | Design & Build',
    description:
      'Need an architect consultant in Moradabad for design advice or plan review? Learn what consultants offer, costs, and how MTBOSS supports full execution.',
    url: 'https://www.mtboss.in/architect-consultant-in-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-architect-consultant-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Architect Consultant in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architect Consultant in Moradabad | Design & Build',
    description:
      'Need an architect consultant in Moradabad for design advice or plan review? Learn what consultants offer, costs, and how MTBOSS supports full execution.',
    images: ['https://www.mtboss.in/og-architect-consultant-moradabad.jpg'],
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
    url: 'https://www.mtboss.in/architect-consultant-in-moradabad',
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