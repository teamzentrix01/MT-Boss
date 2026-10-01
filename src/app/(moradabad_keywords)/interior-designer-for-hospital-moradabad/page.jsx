// app/(moradabad_keywords)/interior-designer-for-hospital-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title:
    "Interior Designer for Hospital Moradabad | MT Boss Healthcare Design",
  description:
    "Looking for an interior designer for a hospital in Moradabad? MT Boss designs and builds hygienic, patient-friendly hospital, clinic and nursing home interiors with clear pricing.",
  keywords:
    "interior designer for hospital Moradabad, hospital interior designer Moradabad, healthcare interior design Moradabad, clinic interior designer Moradabad, nursing home interior designer Moradabad, diagnostic centre interior design Moradabad, hospital renovation Moradabad, patient room interior designer Moradabad, hospital reception interior designer Moradabad, MT Boss hospital interiors Moradabad",
  alternates: {
    canonical: "https://www.mtboss.in/interior-designer-for-hospital-moradabad",
  },
  openGraph: {
    title:
      "Interior Designer for Hospital Moradabad | MT Boss Healthcare Design",
    description:
      "Looking for an interior designer for a hospital in Moradabad? MT Boss designs and builds hygienic, patient-friendly hospital, clinic and nursing home interiors with clear pricing.",
    url: "https://www.mtboss.in/interior-designer-for-hospital-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-for-hospital-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Hospital in Moradabad - MT Boss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Interior Designer for Hospital Moradabad | MT Boss Healthcare Design",
    description:
      "Looking for an interior designer for a hospital in Moradabad? MT Boss designs and builds hygienic, patient-friendly hospital, clinic and nursing home interiors with clear pricing.",
    images: [
      "https://www.mtboss.in/og-interior-designer-for-hospital-moradabad.jpg",
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
  url: "https://www.mtboss.in/interior-designer-for-hospital-moradabad",
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