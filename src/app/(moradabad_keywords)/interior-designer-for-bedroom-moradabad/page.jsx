// app/(moradabad_keywords)/interior-designer-for-bedroom-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Bedroom in Moradabad | MT Boss",
  description:
    "Looking for a bedroom interior designer in Moradabad? MT Boss creates cozy, storage-smart bedrooms with quality materials and on-time delivery. Get a free quote.",
  keywords:
    "interior designer for bedroom in Moradabad, bedroom interior designer Moradabad, bedroom design Moradabad, bedroom interior work Moradabad, wardrobe designer Moradabad, bedroom wardrobe design Moradabad, master bedroom interior Moradabad, kids bedroom design Moradabad, false ceiling for bedroom Moradabad, bedroom renovation Moradabad, bedroom furniture designer Moradabad, bedroom makeover Moradabad, MT Boss bedroom interiors",
  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-bedroom-in-moradabad",
  },
  openGraph: {
    title: "Interior Designer for Bedroom in Moradabad | MT Boss",
    description:
      "Looking for a bedroom interior designer in Moradabad? MT Boss creates cozy, storage-smart bedrooms with quality materials and on-time delivery. Get a free quote.",
    url: "https://www.mtboss.in/interior-designer-for-bedroom-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-bedroom-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Bedroom in Moradabad - MT Boss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Designer for Bedroom in Moradabad | MT Boss",
    description:
      "Looking for a bedroom interior designer in Moradabad? MT Boss creates cozy, storage-smart bedrooms with quality materials and on-time delivery. Get a free quote.",
    images: [
      "https://www.mtboss.in/og-interior-designer-bedroom-moradabad.jpg",
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
  url: "https://www.mtboss.in/interior-designer-for-bedroom-in-moradabad",
  telephone: "+91-9458410866",
  email: "mtboss2016@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Harthala Kanth Road, Behind KR Collection, near Domino's",
    addressLocality: "Moradabad",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <Banner />
      <Content />
      <QuickServices />
      <Services />
      <CalculatorCTA />
    </>
  );
}