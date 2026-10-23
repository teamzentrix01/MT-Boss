// app/(moradabad_keywords)/contractor-for-house-construction-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'Contractor for House Construction in Moradabad | MTBoss',
  description:
    'Hire MTBoss, a trusted contractor for house construction in Moradabad. Custom home design, quality materials, transparent pricing and on-time handover.',
  keywords:
    'house construction contractor Moradabad, house contractor Moradabad, home construction Moradabad, house building contractor Moradabad, independent house construction Moradabad, duplex construction Moradabad, villa construction Moradabad, builder floor construction Moradabad, farmhouse construction Moradabad, MTBoss Moradabad',
  alternates: {
    canonical:
      'https://www.MTBoss.in/contractor-for-house-construction-moradabad',
  },
  openGraph: {
    title: 'Contractor for House Construction in Moradabad | MTBoss',
    description:
      'Hire MTBoss, a trusted contractor for house construction in Moradabad. Custom home design, quality materials, transparent pricing and on-time handover.',
    url: 'https://www.MTBoss.in/contractor-for-house-construction-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-contractor-for-house-construction-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Contractor for House Construction in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contractor for House Construction in Moradabad | MTBoss',
    description:
      'Hire MTBoss, a trusted contractor for house construction in Moradabad. Custom home design, quality materials, transparent pricing and on-time handover.',
    images: [
      'https://www.MTBoss.in/og-contractor-for-house-construction-moradabad.jpg',
    ],
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
    url: 'https://www.MTBoss.in/contractor-for-house-construction-moradabad',
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