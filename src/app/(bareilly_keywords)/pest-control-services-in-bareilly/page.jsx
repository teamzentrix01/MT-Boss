// app/(bareilly_keywords)/pest-control-services-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Pest Control Services in Bareilly | Home & Office | MTBOSS",
  description:
    "Pest control services in Bareilly by MTBOSS for cockroaches, termites, bed bugs, ants and rodents. Clear scope and costs. Call +91 94584 10866.",
  keywords:
    "pest control services in Bareilly, pest control Bareilly, termite treatment Bareilly, anti-termite treatment Bareilly, cockroach control Bareilly, bed bug treatment Bareilly, rodent control Bareilly, ant control Bareilly, mosquito control Bareilly, home pest control Bareilly, office pest control Bareilly, pest control cost Bareilly, pest control near me Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/pest-control-services-bareilly",
  },
  openGraph: {
    title: "Pest Control Services in Bareilly | Home & Office | MTBOSS",
    description:
      "Pest control services in Bareilly by MTBOSS for cockroaches, termites, bed bugs, ants and rodents. Clear scope and costs. Call +91 94584 10866.",
    url: "https://www.mtboss.in/pest-control-services-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-pest-control-services-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Pest Control Services in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pest Control Services in Bareilly | Home & Office | MTBOSS",
    description:
      "Pest control services in Bareilly by MTBOSS for cockroaches, termites, bed bugs, ants and rodents. Clear scope and costs. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-pest-control-services-bareilly.jpg"],
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
    url: "https://www.mtboss.in/pest-control-services-bareilly",
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
      "Termite Treatment",
      "Anti-Termite Treatment",
      "Pre-Construction Anti-Termite Treatment",
      "Cockroach Control",
      "Bed Bug Treatment",
      "Rodent Control",
      "Ant Control",
      "Mosquito Control",
      "Fly Control",
      "Home Pest Control",
      "Office Pest Control",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Pest Control Services in Bareilly",
    description:
      "MTBOSS provides pest inspection, pest identification, cockroach control, anti-termite treatment, pre-construction soil treatment, bed bug treatment, rodent control, mosquito and fly control, crack and gap sealing, follow-up visits and prevention advice in Bareilly.",
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