// app/(moradabad_keywords)/home-interior-designer-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Home Interior Designer in Moradabad | MT Boss",
  description:
    "Looking for a home interior designer in Moradabad? MT Boss offers modular kitchens, wardrobes, false ceilings, painting and full-home interiors. Get a free quote today.",
  keywords:
    "home interior designer in Moradabad, interior designer Moradabad, residential interior designer Moradabad, full home interior Moradabad, modular kitchen designer Moradabad, bedroom interior design Moradabad, living room interior design Moradabad, false ceiling design Moradabad, wardrobe design Moradabad, home renovation Moradabad, interior decorators in Moradabad, budget interior design Moradabad, luxury home interior Moradabad, bungalow interior design Moradabad, interior design cost in Moradabad, interior designer near me, turnkey interior solutions, wall texture painting Moradabad, home interior contractors Moradabad, flat interior design Moradabad, MT Boss interior designer, best interior designer in Moradabad, home makeover services, interior design and construction company, interior budget calculator",

  alternates: {
    canonical: "https://www.mtboss.in/home-interior-designer-in-moradabad",
  },

  openGraph: {
    title: "Home Interior Designer in Moradabad | MT Boss",
    description:
      "Looking for a home interior designer in Moradabad? MT Boss offers modular kitchens, wardrobes, false ceilings, painting and full-home interiors. Get a free quote today.",
    url: "https://www.mtboss.in/home-interior-designer-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-top-civil-contractor-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Home Interior Designer in Moradabad - MT Boss",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Home Interior Designer in Moradabad | MT Boss",
    description:
      "Looking for a home interior designer in Moradabad? MT Boss offers modular kitchens, wardrobes, false ceilings, painting and full-home interiors. Get a free quote today.",
    images: ["https://www.mtboss.in/og-top-civil-contractor-moradabad.jpg"],
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
  url: "https://www.mtboss.in/home-interior-designer-in-moradabad",
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