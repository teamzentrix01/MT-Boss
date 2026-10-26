// app/(moradabad_keywords)/luxury-interior-designer-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Luxury Interior Designer in Moradabad | MTBOSS Interiors",
  description:
    "Looking for a luxury interior designer in Moradabad? MTBOSS creates premium homes, villas and showrooms with custom design, fine finishes and precise execution.",
  keywords:
    "luxury interior designer in Moradabad, luxury interior designer Moradabad, premium interior designer Moradabad, luxury home interior Moradabad, luxury villa interior designer Moradabad, luxury apartment interior Moradabad, luxury interior design Moradabad, high end interior designer Moradabad, luxury interior designer near me, premium home interiors Moradabad, luxury showroom interior designer Moradabad, MTBOSS interiors, MTBOSS luxury interiors",
  alternates: {
    canonical:
      "https://www.MTBOSS.in/luxury-interior-designer-in-moradabad",
  },
  openGraph: {
    title: "Luxury Interior Designer in Moradabad | MTBOSS Interiors",
    description:
      "Looking for a luxury interior designer in Moradabad? MTBOSS creates premium homes, villas and showrooms with custom design, fine finishes and precise execution.",
    url: "https://www.MTBOSS.in/luxury-interior-designer-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.MTBOSS.in/og-luxury-interior-designer-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Luxury Interior Designer in Moradabad - MTBOSS Interiors",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Interior Designer in Moradabad | MTBOSS Interiors",
    description:
      "Looking for a luxury interior designer in Moradabad? MTBOSS creates premium homes, villas and showrooms with custom design, fine finishes and precise execution.",
    images: [
      "https://www.MTBOSS.in/og-luxury-interior-designer-moradabad.jpg",
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
  url: "https://www.MTBOSS.in/luxury-interior-designer-in-moradabad",
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
  priceRange: "₹₹₹",
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