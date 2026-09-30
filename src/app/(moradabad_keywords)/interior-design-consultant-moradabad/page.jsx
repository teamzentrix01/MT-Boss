// app/(moradabad_keywords)/interior-design-consultant-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';


export const metadata = {
  title: 'Interior Design Consultant Moradabad | MT Boss',
  description:
    'MT Boss is a trusted interior design consultant in Moradabad for homes, shops and offices. Clear pricing, 3D designs and full execution. Book a free visit.',
  keywords:
    'interior design consultant Moradabad, interior designer Moradabad, interior design consultant near me, home interior designer Moradabad, office interior designer Moradabad, shop interior designer Moradabad, modular kitchen designer Moradabad, interior design company Moradabad, MT Boss interior designer Moradabad, interior decoration Moradabad',
  alternates: {
    canonical: 'https://www.mtboss.in/interior-design-consultant-moradabad',
  },
  openGraph: {
    title: 'Interior Design Consultant Moradabad | MT Boss',
    description:
      'MT Boss is a trusted interior design consultant in Moradabad for homes, shops and offices. Clear pricing, 3D designs and full execution. Book a free visit.',
    url: 'https://www.mtboss.in/interior-design-consultant-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-interior-design-consultant-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Interior Design Consultant in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interior Design Consultant Moradabad | MT Boss',
    description:
      'MT Boss is a trusted interior design consultant in Moradabad for homes, shops and offices. Clear pricing, 3D designs and full execution. Book a free visit.',
    images: ['https://www.mtboss.in/og-interior-design-consultant-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/interior-design-consultant-moradabad',
  telephone: '+91-9458410866',
  email: 'mtboss2016@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
    addressLocality: 'Moradabad',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
    // postalCode: 'ADD_PIN_CODE_HERE'
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