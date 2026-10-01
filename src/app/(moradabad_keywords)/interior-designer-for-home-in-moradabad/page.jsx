// app/(moradabad_keywords)/interior-designer-for-home-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Home in Moradabad | MT Boss",
  description:
    "Need an interior designer for your home in Moradabad? MT Boss plans and builds living rooms, kitchens, bedrooms and full-home interiors with clear pricing and local support.",
  keywords:
    "interior designer for home Moradabad, home interior designer Moradabad, interior designer near me Moradabad, best interior designer Moradabad, full home interior design Moradabad, modular kitchen designer Moradabad, bedroom interior designer Moradabad, living room interior designer Moradabad, home renovation interior designer Moradabad, MT Boss interior designer Moradabad",
  alternates: {
    canonical: "https://www.mtboss.in/interior-designer-for-home-moradabad",
  },
  openGraph: {
    title: "Interior Designer for Home in Moradabad | MT Boss",
    description:
      "Need an interior designer for your home in Moradabad? MT Boss plans and builds living rooms, kitchens, bedrooms and full-home interiors with clear pricing and local support.",
    url: "https://www.mtboss.in/interior-designer-for-home-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-for-home-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Home in Moradabad - MT Boss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Designer for Home in Moradabad | MT Boss",
    description:
      "Need an interior designer for your home in Moradabad? MT Boss plans and builds living rooms, kitchens, bedrooms and full-home interiors with clear pricing and local support.",
    images: [
      "https://www.mtboss.in/og-interior-designer-for-home-moradabad.jpg",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: "MTBOSS Construction Private Limited",
  url: "https://www.mtboss.in/interior-designer-for-home-moradabad",
  telephone: "+91-9458410866",
  email: "mtboss2016@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
    addressLocality: "Moradabad",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
    // postalCode: "ADD_PIN_CODE_HERE",
  },
  areaServed: {
    "@type": "City",
    name: "Moradabad",
  },
  priceRange: "₹₹",
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