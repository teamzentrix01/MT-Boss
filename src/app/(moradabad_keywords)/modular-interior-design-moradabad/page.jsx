// app/(moradabad_keywords)/modular-interior-design-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Modular Interior Design in Moradabad | MT Boss",
  description:
    "Get stylish modular interior design in Moradabad with MT Boss. Modular kitchens, wardrobes, TV units and more with clear pricing and timely delivery. Book a free quote.",
  keywords:
    "modular interior design Moradabad, modular kitchen Moradabad, modular wardrobe Moradabad, modular interior designer in Moradabad, modular furniture Moradabad, modular TV unit design, modular kitchen designer near me, modular kitchen price in Moradabad, modular interior cost in Moradabad, full home modular interiors, modular bedroom furniture, modular pooja unit, modular crockery unit, modular bathroom vanity, modular shoe rack, modular study unit, BWP plywood modular kitchen, HDHMR modular furniture, soft close modular wardrobe, L shaped modular kitchen, parallel modular kitchen, island kitchen design Moradabad, home interior designer Moradabad, MT Boss modular interiors, budget modular interior design, turnkey modular interior solutions",

  alternates: {
    canonical: "https://www.mtboss.in/modular-interior-design-in-moradabad",
  },

  openGraph: {
    title: "Modular Interior Design in Moradabad | MT Boss",
    description:
      "Get stylish modular interior design in Moradabad with MT Boss. Modular kitchens, wardrobes, TV units and more with clear pricing and timely delivery. Book a free quote.",
    url: "https://www.mtboss.in/modular-interior-design-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-structural-architect-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Modular Interior Design in Moradabad - MT Boss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Modular Interior Design in Moradabad | MT Boss",
    description:
      "Get stylish modular interior design in Moradabad with MT Boss. Modular kitchens, wardrobes, TV units and more with clear pricing and timely delivery. Book a free quote.",
    images: ["https://www.mtboss.in/og-structural-architect-moradabad.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/modular-interior-design-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Harthala Kanth Road, Behind Kr Collection, near Domino's",
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