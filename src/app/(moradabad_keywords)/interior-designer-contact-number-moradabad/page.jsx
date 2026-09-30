// app/(moradabad_keywords)/interior-designer-contact-number-moradabad/page.jsx
import Banner from './Banner';
import Content from './Content';
import QuickServices from '../../components/QuickServices';
import CalculatorCTA from '../../components/CalculatorCTA';
import Services from '../../components/Services';


export const metadata = {
  title: 'Interior Designer Contact Number Moradabad | MT Boss',
  description:
    'Need an interior designer in Moradabad? Call MT Boss on +91 94584 10866 for home, shop and office interiors. Free site visit, 3D designs and clear pricing.',
  keywords:
    'interior designer contact number Moradabad, interior designer near me Moradabad, best interior designer Moradabad, home interior designer Moradabad, office interior designer Moradabad, shop interior designer Moradabad, modular kitchen designer Moradabad, interior design company Moradabad, MT Boss interior designer Moradabad, interior designer Moradabad contact number',
  alternates: {
    canonical: 'https://www.mtboss.in/interior-designer-contact-number-moradabad',
  },
  openGraph: {
    title: 'Interior Designer Contact Number Moradabad | MT Boss',
    description:
      'Need an interior designer in Moradabad? Call MT Boss on +91 94584 10866 for home, shop and office interiors. Free site visit, 3D designs and clear pricing.',
    url: 'https://www.mtboss.in/interior-designer-contact-number-moradabad',
    siteName: 'MTBOSS Construction Private Limited',
    images: [
      {
        url: 'https://www.mtboss.in/og-interior-designer-contact-number-moradabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Interior Designer Contact Number in Moradabad - MT Boss',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interior Designer Contact Number Moradabad | MT Boss',
    description:
      'Need an interior designer in Moradabad? Call MT Boss on +91 94584 10866 for home, shop and office interiors. Free site visit, 3D designs and clear pricing.',
    images: ['https://www.mtboss.in/og-interior-designer-contact-number-moradabad.jpg'],
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
  url: 'https://www.mtboss.in/interior-designer-contact-number-moradabad',
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