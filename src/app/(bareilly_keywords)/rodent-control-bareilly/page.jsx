// app/(bareilly_keywords)/rodent-control-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Rodent Control Bareilly | Rat & Mouse Treatment | MTBOSS",
  description:
    "Rodent control Bareilly by MTBOSS: inspection, trapping, baiting and gap sealing for homes, shops and godowns. Call +91 94584 10866.",
  keywords:
    "rodent control Bareilly, rat control Bareilly, mouse control Bareilly, rat pest control Bareilly, rodent proofing Bareilly, rat trapping Bareilly, rodent control for godown Bareilly, rodent control for restaurant Bareilly, rodent control cost Bareilly, pest control services in Bareilly, cockroach control Bareilly, termite control Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS pest control",
  alternates: {
    canonical: "https://www.mtboss.in/rodent-control-bareilly",
  },
  openGraph: {
    title: "Rodent Control Bareilly | Rat & Mouse Treatment | MTBOSS",
    description:
      "Rodent control Bareilly by MTBOSS: inspection, trapping, baiting and gap sealing for homes, shops and godowns. Call +91 94584 10866.",
    url: "https://www.mtboss.in/rodent-control-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-rodent-control-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Rodent Control in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rodent Control Bareilly | Rat & Mouse Treatment | MTBOSS",
    description:
      "Rodent control Bareilly by MTBOSS: inspection, trapping, baiting and gap sealing for homes, shops and godowns. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-rodent-control-bareilly.jpg"],
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
    url: "https://www.mtboss.in/rodent-control-bareilly",
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
      "Rodent Control",
      "Rat Control",
      "Mouse Control",
      "Rodent Proofing",
      "Rat Trapping",
      "Rodent Baiting",
      "Godown Rodent Control",
      "Restaurant Rodent Control",
      "Commercial Rodent Control",
      "Pest Control Services",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Rodent Control in Bareilly",
    description:
      "MTBOSS provides rodent inspection, activity tracking, rodent identification, trapping, baiting in secured stations, burrow and outdoor treatment, entry point sealing, ceiling and roof space checks, commercial rodent control, sanitation advice and follow-up services in Bareilly.",
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
    serviceType: "Rodent Control and Pest Control Services",
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