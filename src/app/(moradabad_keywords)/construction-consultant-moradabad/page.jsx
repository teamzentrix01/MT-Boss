// app/(moradabad_keywords)/construction-consultant-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Construction Consultant in Moradabad',
  description:
    'Need a construction consultant in Moradabad? MT Boss offers planning, budgeting, design review and site monitoring for homes, shops and industrial projects.',
  keywords:
    'construction consultant Moradabad, construction consultancy Moradabad, building consultant Moradabad, construction planning Moradabad, construction budget consultant Moradabad, design review consultant Moradabad, site monitoring Moradabad, construction project consultant Moradabad, MT Boss Moradabad, construction advisor Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/construction-consultant-moradabad',
  },
  openGraph: {
    title: 'Construction Consultant in Moradabad',
    description:
      'Need a construction consultant in Moradabad? MT Boss offers planning, budgeting, design review and site monitoring for homes, shops and industrial projects.',
    url: 'https://www.mtboss.in/construction-consultant-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-construction-consultant-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Construction Consultant in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Construction Consultant in Moradabad',
    description:
      'Need a construction consultant in Moradabad? MT Boss offers planning, budgeting, design review and site monitoring for homes, shops and industrial projects.',
    images: ['https://www.mtboss.in/og-construction-consultant-moradabad.jpg'],
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
    url: 'https://www.mtboss.in/construction-consultant-moradabad',
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