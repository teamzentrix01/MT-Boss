// app/(bareilly_keywords)/waterproofing-cost-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Waterproofing Cost in Bareilly | Rates & Quote | MTBOSS",
  description:
    "Waterproofing cost in Bareilly depends on area, system and surface. See cost factors and get a clear MTBOSS quote. Call +91 94584 10866.",
  keywords:
    "waterproofing cost in Bareilly, waterproofing rate per sq ft Bareilly, roof waterproofing cost Bareilly, bathroom waterproofing cost Bareilly, basement waterproofing cost Bareilly, terrace waterproofing price Bareilly, external wall waterproofing cost Bareilly, water tank waterproofing cost Bareilly, waterproofing quote Bareilly, waterproofing contractor Bareilly, building repair Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/waterproofing-cost-bareilly",
  },
  openGraph: {
    title: "Waterproofing Cost in Bareilly | Rates & Quote | MTBOSS",
    description:
      "Waterproofing cost in Bareilly depends on area, system and surface. See cost factors and get a clear MTBOSS quote. Call +91 94584 10866.",
    url: "https://www.mtboss.in/waterproofing-cost-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-waterproofing-cost-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Waterproofing Cost in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waterproofing Cost in Bareilly | Rates & Quote | MTBOSS",
    description:
      "Waterproofing cost in Bareilly depends on area, system and surface. See cost factors and get a clear MTBOSS quote. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-waterproofing-cost-bareilly.jpg"],
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
    url: "https://www.mtboss.in/waterproofing-cost-bareilly",
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
      "Waterproofing Cost Estimation",
      "Roof and Terrace Waterproofing",
      "Bathroom Waterproofing",
      "Basement Waterproofing",
      "External Wall Waterproofing",
      "Water Tank Waterproofing",
      "Terrace Waterproofing",
      "Leakage Repair",
      "Waterproofing Contractor Services",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Waterproofing Cost in Bareilly",
    description:
      "MTBOSS provides waterproofing cost guidance, site inspection, leak tracing, crack and joint repair, roof, bathroom, basement, tank and external wall waterproofing, itemised quotations, water testing and handover services in Bareilly.",
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
    serviceType: "Waterproofing Cost Estimation and Leakage Repair Services",
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