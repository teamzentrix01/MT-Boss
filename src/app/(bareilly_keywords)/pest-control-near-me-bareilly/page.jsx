// app/(bareilly_keywords)/pest-control-near-me-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Pest Control Near Me Bareilly | Local Service | MTBOSS",
  description:
    "Searching pest control near me in Bareilly? MTBOSS offers inspection and treatment for homes, shops and offices. Call +91 94584 10866.",
  keywords:
    "pest control near me Bareilly, pest control services near me Bareilly, local pest control Bareilly, home pest control near me Bareilly, termite control near me Bareilly, cockroach control near me Bareilly, bed bug treatment near me Bareilly, rodent control near me Bareilly, mosquito control near me Bareilly, pest control cost Bareilly, pest control services in Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS pest control",
  alternates: {
    canonical: "https://www.mtboss.in/pest-control-near-me-bareilly",
  },
  openGraph: {
    title: "Pest Control Near Me Bareilly | Local Service | MTBOSS",
    description:
      "Searching pest control near me in Bareilly? MTBOSS offers inspection and treatment for homes, shops and offices. Call +91 94584 10866.",
    url: "https://www.mtboss.in/pest-control-near-me-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-pest-control-near-me-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Pest Control Near Me in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pest Control Near Me Bareilly | Local Service | MTBOSS",
    description:
      "Searching pest control near me in Bareilly? MTBOSS offers inspection and treatment for homes, shops and offices. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-pest-control-near-me-bareilly.jpg"],
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
    url: "https://www.mtboss.in/pest-control-near-me-bareilly",
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
      "Pest Control Near Me",
      "Local Pest Control Services",
      "Home Pest Control",
      "Commercial Pest Control",
      "Termite Control",
      "Cockroach Control",
      "Bed Bug Treatment",
      "Rodent Control",
      "Mosquito Control",
      "Crack and Gap Sealing",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Pest Control Near Me in Bareilly",
    description:
      "MTBOSS provides local pest control services in Bareilly, including pest inspection, pest identification, general pest control, anti-termite treatment, bed bug treatment, rodent control, mosquito control, commercial pest control, crack and gap sealing, moisture correction and follow-up services.",
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
    serviceType: "Local Pest Control and Pest Management Services",
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