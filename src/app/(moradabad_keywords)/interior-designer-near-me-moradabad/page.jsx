// app/(moradabad_keywords)/interior-designer-near-me-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer Near Me in Moradabad | MT Boss Design & Build",
  description:
    "Looking for an interior designer near you in Moradabad? MT Boss offers home, kitchen and office interiors with clear pricing, local site support and on-time delivery.",
  keywords:
    "interior designer near me Moradabad, interior designer Moradabad, best interior designer near me Moradabad, home interior designer Moradabad, modular kitchen designer Moradabad, office interior designer Moradabad, shop interior designer Moradabad, interior design company Moradabad, interior contractor Moradabad, MT Boss interior designer",
  alternates: {
    canonical: "https://www.mtboss.in/interior-designer-near-me-moradabad",
  },
  openGraph: {
    title: "Interior Designer Near Me in Moradabad | MT Boss Design & Build",
    description:
      "Looking for an interior designer near you in Moradabad? MT Boss offers home, kitchen and office interiors with clear pricing, local site support and on-time delivery.",
    url: "https://www.mtboss.in/interior-designer-near-me-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-near-me-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer Near Me in Moradabad - MT Boss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Designer Near Me in Moradabad | MT Boss Design & Build",
    description:
      "Looking for an interior designer near you in Moradabad? MT Boss offers home, kitchen and office interiors with clear pricing, local site support and on-time delivery.",
    images: [
      "https://www.mtboss.in/og-interior-designer-near-me-moradabad.jpg",
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
  url: "https://www.mtboss.in/interior-designer-near-me-moradabad",
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