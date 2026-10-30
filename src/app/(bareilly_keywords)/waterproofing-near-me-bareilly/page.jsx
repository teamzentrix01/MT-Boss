// app/(bareilly_keywords)/waterproofing-near-me-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Waterproofing Near Me Bareilly | Local Experts | MTBOSS",
  description:
    "Searching waterproofing near me in Bareilly? MTBOSS offers inspection, leak repair and sealing for homes and shops. Call +91 94584 10866.",
  keywords:
    "waterproofing near me Bareilly, waterproofing services near me Bareilly, local waterproofing company Bareilly, leakage repair near me Bareilly, roof waterproofing near me Bareilly, bathroom waterproofing near me Bareilly, basement waterproofing near me Bareilly, waterproofing contractor Bareilly, waterproofing cost Bareilly, waterproofing quote Bareilly, building repair Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/waterproofing-near-me-bareilly",
  },
  openGraph: {
    title: "Waterproofing Near Me Bareilly | Local Experts | MTBOSS",
    description:
      "Searching waterproofing near me in Bareilly? MTBOSS offers inspection, leak repair and sealing for homes and shops. Call +91 94584 10866.",
    url: "https://www.mtboss.in/waterproofing-near-me-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-waterproofing-near-me-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Waterproofing Near Me in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waterproofing Near Me Bareilly | Local Experts | MTBOSS",
    description:
      "Searching waterproofing near me in Bareilly? MTBOSS offers inspection, leak repair and sealing for homes and shops. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-waterproofing-near-me-bareilly.jpg"],
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
    url: "https://www.mtboss.in/waterproofing-near-me-bareilly",
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
      "Waterproofing Services",
      "Leakage Repair",
      "Roof and Terrace Waterproofing",
      "Bathroom Waterproofing",
      "Basement Waterproofing",
      "External Wall Waterproofing",
      "Water Tank Waterproofing",
      "Crack Repair",
      "Waterproofing Contractor Services",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Waterproofing Near Me in Bareilly",
    description:
      "MTBOSS provides local waterproofing inspection, leak tracing, crack and joint repair, roof, bathroom, basement, tank and external wall waterproofing, water testing and handover services in Bareilly.",
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
    serviceType: "Local Waterproofing and Leakage Repair Services",
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