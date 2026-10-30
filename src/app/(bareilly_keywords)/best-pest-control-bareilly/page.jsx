// app/(bareilly_keywords)/best-pest-control-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Best Pest Control Bareilly | How to Choose | MTBOSS",
  description:
    "Looking for the best pest control Bareilly? Learn what to check, then get inspection-based treatment from MTBOSS. Call +91 94584 10866.",
  keywords:
    "best pest control Bareilly, best pest control services in Bareilly, top pest control company Bareilly, reliable pest control Bareilly, best termite control Bareilly, best cockroach control Bareilly, best bed bug treatment Bareilly, pest control near me Bareilly, pest control cost Bareilly, home pest control Bareilly, commercial pest control Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS pest control",
  alternates: {
    canonical: "https://www.mtboss.in/best-pest-control-bareilly",
  },
  openGraph: {
    title: "Best Pest Control Bareilly | How to Choose | MTBOSS",
    description:
      "Looking for the best pest control Bareilly? Learn what to check, then get inspection-based treatment from MTBOSS. Call +91 94584 10866.",
    url: "https://www.mtboss.in/best-pest-control-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-best-pest-control-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Best Pest Control in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Pest Control Bareilly | How to Choose | MTBOSS",
    description:
      "Looking for the best pest control Bareilly? Learn what to check, then get inspection-based treatment from MTBOSS. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-best-pest-control-bareilly.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "PestControlService",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/best-pest-control-bareilly",
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
      "Pest Control Services",
      "Termite Control",
      "Anti-Termite Treatment",
      "Cockroach Control",
      "Bed Bug Treatment",
      "Rodent Control",
      "Ant Control",
      "Mosquito Control",
      "Home Pest Control",
      "Commercial Pest Control",
      "Pest Inspection",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Best Pest Control in Bareilly",
    description:
      "MTBOSS provides inspection-led pest control in Bareilly, including pest identification, cockroach control, anti-termite treatment, pre-construction soil treatment, bed bug treatment, rodent control, mosquito and fly control, crack and gap sealing, follow-up visits and prevention advice.",
    provider: {
      "@type": "PestControlService",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.mtboss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Bareilly",
    },
    serviceType: "Residential and Commercial Pest Control Services",
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