// app/(bareilly_keywords)/pest-control-cost-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Pest Control Cost Bareilly | Price Guide & Quote | MTBOSS",
  description:
    "Pest control cost Bareilly depends on pest, property size and visits. See price factors and get a clear MTBOSS quote. Call +91 94584 10866.",
  keywords:
    "pest control cost Bareilly, pest control charges Bareilly, pest control price Bareilly, termite control cost Bareilly, cockroach control cost Bareilly, bed bug treatment cost Bareilly, rodent control cost Bareilly, mosquito control cost Bareilly, pest control quote Bareilly, annual pest control plan Bareilly, pest control services in Bareilly, pest control near me Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS pest control",
  alternates: {
    canonical: "https://www.mtboss.in/pest-control-cost-bareilly",
  },
  openGraph: {
    title: "Pest Control Cost Bareilly | Price Guide & Quote | MTBOSS",
    description:
      "Pest control cost Bareilly depends on pest, property size and visits. See price factors and get a clear MTBOSS quote. Call +91 94584 10866.",
    url: "https://www.mtboss.in/pest-control-cost-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-pest-control-cost-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Pest Control Cost in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pest Control Cost Bareilly | Price Guide & Quote | MTBOSS",
    description:
      "Pest control cost Bareilly depends on pest, property size and visits. See price factors and get a clear MTBOSS quote. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-pest-control-cost-bareilly.jpg"],
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
    url: "https://www.mtboss.in/pest-control-cost-bareilly",
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
      "Pest Control Cost Estimation",
      "Pest Control Quote",
      "Pest Inspection",
      "Termite Control",
      "Cockroach Control",
      "Bed Bug Treatment",
      "Rodent Control",
      "Mosquito Control",
      "Annual Pest Control Plan",
      "Commercial Pest Control",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Pest Control Cost and Quote in Bareilly",
    description:
      "MTBOSS provides pest control cost estimation and itemised quotes in Bareilly, covering pest inspection, pest identification, cockroach control, termite treatment, bed bug treatment, rodent control, mosquito control, commercial pest control, annual plans, crack sealing and follow-up services.",
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
    serviceType: "Pest Control Cost Estimation and Pest Management Services",
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