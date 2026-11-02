// app/(bareilly_keywords)/waterproofing-contractor-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Waterproofing Contractor Bareilly | MTBOSS",
  description:
    "Looking for a waterproofing contractor in Bareilly? MTBOSS offers inspection, leak repair and sealing with clear quotes. Call +91 94584 10866.",
  keywords:
    "waterproofing contractor Bareilly, waterproofing company Bareilly, best waterproofing contractor in Bareilly, waterproofing services Bareilly, roof waterproofing contractor Bareilly, bathroom waterproofing contractor Bareilly, basement waterproofing Bareilly, water tank waterproofing Bareilly, external wall waterproofing Bareilly, leakage repair contractor Bareilly, waterproofing cost Bareilly, waterproofing quote Bareilly, building repair Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/waterproofing-contractor-bareilly",
  },
  openGraph: {
    title: "Waterproofing Contractor Bareilly | MTBOSS",
    description:
      "Looking for a waterproofing contractor in Bareilly? MTBOSS offers inspection, leak repair and sealing with clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/waterproofing-contractor-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-waterproofing-contractor-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Waterproofing Contractor in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waterproofing Contractor Bareilly | MTBOSS",
    description:
      "Looking for a waterproofing contractor in Bareilly? MTBOSS offers inspection, leak repair and sealing with clear quotes. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-waterproofing-contractor-bareilly.jpg"],
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
    url: "https://www.mtboss.in/waterproofing-contractor-bareilly",
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
      "Waterproofing Contractor Services",
      "Roof and Terrace Waterproofing",
      "Bathroom Waterproofing",
      "Basement Waterproofing",
      "Water Tank Waterproofing",
      "External Wall Waterproofing",
      "Leakage Repair",
      "Crack Repair",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Waterproofing Contractor in Bareilly",
    description:
      "MTBOSS provides waterproofing inspection, leak tracing, crack and joint repair, roof, bathroom, basement, tank and external wall waterproofing, water testing and handover services in Bareilly.",
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
    serviceType: "Waterproofing and Leakage Repair Services",
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