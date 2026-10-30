// app/(bareilly_keywords)/roof-waterproofing-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Roof Waterproofing Bareilly | MTBOSS",
  description:
    "Need roof waterproofing Bareilly? MTBOSS inspects, repairs and seals terraces with the right system and clear costs. Call +91 94584 10866.",
  keywords:
    "roof waterproofing Bareilly, terrace waterproofing Bareilly, RCC roof waterproofing Bareilly, roof leakage repair Bareilly, roof crack repair Bareilly, roof waterproofing cost Bareilly, PU roof coating Bareilly, heat-reflective roof coating Bareilly, waterproofing contractor Bareilly, building repair Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, roof waterproofing quote Bareilly",
  alternates: {
    canonical: "https://www.mtboss.in/roof-waterproofing-bareilly",
  },
  openGraph: {
    title: "Roof Waterproofing Bareilly | MTBOSS",
    description:
      "Need roof waterproofing Bareilly? MTBOSS inspects, repairs and seals terraces with the right system and clear costs. Call +91 94584 10866.",
    url: "https://www.mtboss.in/roof-waterproofing-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-roof-waterproofing-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Roof Waterproofing in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roof Waterproofing Bareilly | MTBOSS",
    description:
      "Need roof waterproofing Bareilly? MTBOSS inspects, repairs and seals terraces with the right system and clear costs. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-roof-waterproofing-bareilly.jpg"],
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
    url: "https://www.mtboss.in/roof-waterproofing-bareilly",
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
      "Roof Waterproofing",
      "Terrace Waterproofing",
      "RCC Roof Waterproofing",
      "Roof Leakage Repair",
      "Roof Crack Repair",
      "PU Roof Coating",
      "Heat-Reflective Roof Coating",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Roof Waterproofing in Bareilly",
    description:
      "MTBOSS provides roof inspection, leakage repair, crack filling, terrace waterproofing, PU coating and heat-reflective roof coating services in Bareilly.",
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
    serviceType: "Roof and Terrace Waterproofing Services",
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