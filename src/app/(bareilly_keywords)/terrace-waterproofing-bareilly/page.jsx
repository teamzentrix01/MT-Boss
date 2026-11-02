// app/(bareilly_keywords)/terrace-waterproofing-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Terrace Waterproofing Bareilly | MTBOSS",
  description:
    "Planning terrace waterproofing Bareilly? MTBOSS repairs, seals and tests terraces with clear costs and written scope. Call +91 94584 10866.",
  keywords:
    "terrace waterproofing Bareilly, terrace waterproofing cost Bareilly, terrace leakage solution Bareilly, terrace crack repair Bareilly, terrace tile waterproofing Bareilly, PU terrace coating Bareilly, terrace waterproofing contractor Bareilly, parapet waterproofing Bareilly, terrace garden waterproofing Bareilly, heat-reflective terrace coating Bareilly, building repair Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, terrace waterproofing quote Bareilly",
  alternates: {
    canonical: "https://www.mtboss.in/terrace-waterproofing-bareilly",
  },
  openGraph: {
    title: "Terrace Waterproofing Bareilly | MTBOSS",
    description:
      "Planning terrace waterproofing Bareilly? MTBOSS repairs, seals and tests terraces with clear costs and written scope. Call +91 94584 10866.",
    url: "https://www.mtboss.in/terrace-waterproofing-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-terrace-waterproofing-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Terrace Waterproofing in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terrace Waterproofing Bareilly | MTBOSS",
    description:
      "Planning terrace waterproofing Bareilly? MTBOSS repairs, seals and tests terraces with clear costs and written scope. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-terrace-waterproofing-bareilly.jpg"],
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
    url: "https://www.mtboss.in/terrace-waterproofing-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Harthala Kanth Road, Behind KR Collection, near Domino's",
      addressLocality: "Moradabad",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Bareilly",
      },
      {
        "@type": "City",
        name: "Moradabad",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    priceRange: "₹₹",
    serviceType: [
      "Terrace Waterproofing",
      "Terrace Leakage Repair",
      "Terrace Crack Repair",
      "Terrace Tile Waterproofing",
      "PU Terrace Coating",
      "Parapet Waterproofing",
      "Terrace Garden Waterproofing",
      "Heat-Reflective Terrace Coating",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Terrace Waterproofing in Bareilly",
    description:
      "MTBOSS provides terrace inspection, crack and joint repair, slope and drain correction, PU and polymer waterproofing, tile relaying, parapet sealing, terrace garden waterproofing and heat-reflective coating services in Bareilly.",
    provider: {
      "@type": "GeneralContractor",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.mtboss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Bareilly",
    },
    serviceType: "Terrace Waterproofing and Leakage Repair Services",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
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