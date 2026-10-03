// app/(moradabad_keywords)/site-engineer-contractor-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Site Engineer Contractor in Moradabad',
  description:
    'Looking for a site engineer contractor in Moradabad? MT Boss provides engineer-supervised construction for homes, shops and industrial projects with quality control.',
  keywords:
    'site engineer contractor Moradabad, site engineer Moradabad, construction site engineer Moradabad, engineer supervision Moradabad, civil engineer contractor Moradabad, site supervision Moradabad, construction quality control Moradabad, building supervision Moradabad, MT Boss Moradabad, site engineer contact Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/site-engineer-contractor-moradabad',
  },
  openGraph: {
    title: 'Site Engineer Contractor in Moradabad',
    description:
      'Looking for a site engineer contractor in Moradabad? MT Boss provides engineer-supervised construction for homes, shops and industrial projects with quality control.',
    url: 'https://www.mtboss.in/site-engineer-contractor-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-site-engineer-contractor-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Site Engineer Contractor in Moradabad - MTBOSS',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Site Engineer Contractor in Moradabad',
    description:
      'Looking for a site engineer contractor in Moradabad? MT Boss provides engineer-supervised construction for homes, shops and industrial projects with quality control.',
    images: ['https://www.mtboss.in/og-site-engineer-contractor-moradabad.jpg'],
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
    url: 'https://www.mtboss.in/site-engineer-contractor-moradabad',
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