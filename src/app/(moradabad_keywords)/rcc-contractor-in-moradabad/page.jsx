// app/(moradabad_keywords)/rcc-contractor-in-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';

export const metadata = {
  title: 'RCC Contractor in Moradabad | MTBoss RCC Slab, Column & Foundation Work',
  description:
    'MTBoss is an RCC contractor in Moradabad for foundations, columns, beams, slabs and staircases, with checked reinforcement, graded concrete and proper curing.',
  keywords:
    'RCC contractor Moradabad, RCC work Moradabad, RCC slab contractor Moradabad, RCC column contractor Moradabad, foundation contractor Moradabad, beam and slab construction Moradabad, civil contractor Moradabad, building contractor Moradabad, reinforced cement concrete Moradabad, MTBoss Moradabad',
  alternates: {
    canonical: 'https://www.MTBoss.in/rcc-contractor-in-moradabad',
  },
  openGraph: {
    title: 'RCC Contractor in Moradabad | MTBoss RCC Slab, Column & Foundation Work',
    description:
      'MTBoss is an RCC contractor in Moradabad for foundations, columns, beams, slabs and staircases, with checked reinforcement, graded concrete and proper curing.',
    url: 'https://www.MTBoss.in/rcc-contractor-in-moradabad',
    siteName: 'MTBoss Construction Private Limited',
    images: [
      {
        url: 'https://www.MTBoss.in/og-rcc-contractor-in-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'RCC Contractor in Moradabad - MTBoss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RCC Contractor in Moradabad | MTBoss RCC Slab, Column & Foundation Work',
    description:
      'MTBoss is an RCC contractor in Moradabad for foundations, columns, beams, slabs and staircases, with checked reinforcement, graded concrete and proper curing.',
    images: ['https://www.MTBoss.in/og-rcc-contractor-in-moradabad.jpg'],
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
    url: 'https://www.MTBoss.in/rcc-contractor-in-moradabad',
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