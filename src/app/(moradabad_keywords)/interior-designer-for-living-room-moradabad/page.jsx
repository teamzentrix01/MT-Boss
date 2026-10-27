// app/(moradabad_keywords)/interior-designer-for-living-room-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Living Room in Moradabad | MTBOSS",
  description:
    "Need a living room interior designer in Moradabad? MTBOSS creates stylish, comfortable living rooms with smart storage, TV units and lighting. Get a free quote.",
  keywords:
    "interior designer for living room in Moradabad, living room interior designer Moradabad, living room design Moradabad, TV unit designer Moradabad, TV wall design Moradabad, false ceiling for living room Moradabad, living room renovation Moradabad, living room interior work Moradabad, wall paneling Moradabad, home interior designer Moradabad, living room lighting design Moradabad, MTBOSS living room interiors",
  alternates: {
    canonical:
      "https://www.MTBOSS.in/interior-designer-for-living-room-in-moradabad",
  },
  openGraph: {
    title: "Interior Designer for Living Room in Moradabad | MTBOSS",
    description:
      "Need a living room interior designer in Moradabad? MTBOSS creates stylish, comfortable living rooms with smart storage, TV units and lighting. Get a free quote.",
    url: "https://www.MTBOSS.in/interior-designer-for-living-room-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-designer-living-room-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Living Room in Moradabad - MTBOSS",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Designer for Living Room in Moradabad | MTBOSS",
    description:
      "Need a living room interior designer in Moradabad? MTBOSS creates stylish, comfortable living rooms with smart storage, TV units and lighting. Get a free quote.",
    images: [
      "https://www.MTBOSS.in/og-interior-designer-living-room-moradabad.jpg",
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
  url: "https://www.MTBOSS.in/interior-designer-for-living-room-in-moradabad",
  telephone: "+91-9458410866",
  email: "MTBOSS2016@gmail.com",
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