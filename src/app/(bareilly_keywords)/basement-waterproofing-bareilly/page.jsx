// app/(bareilly_keywords)/basement-waterproofing-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Basement Waterproofing Bareilly | MTBOSS",
  description:
    "Need basement waterproofing Bareilly? MTBOSS inspects, treats and seals basements with the right system and clear costs. Call +91 94584 10866.",
  keywords:
    "basement waterproofing Bareilly, basement waterproofing service Bareilly, basement leakage repair Bareilly, basement seepage treatment Bareilly, basement damp proofing Bareilly, parking basement waterproofing Bareilly, injection grouting Bareilly, crystalline waterproofing Bareilly, sump pit and drainage Bareilly, basement waterproofing cost Bareilly, waterproofing contractor Bareilly, building repair Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, basement waterproofing quote Bareilly",
  alternates: {
    canonical: "https://www.mtboss.in/basement-waterproofing-bareilly",
  },
  openGraph: {
    title: "Basement Waterproofing Bareilly | MTBOSS",
    description:
      "Need basement waterproofing Bareilly? MTBOSS inspects, treats and seals basements with the right system and clear costs. Call +91 94584 10866.",
    url: "https://www.mtboss.in/basement-waterproofing-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-basement-waterproofing-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Basement Waterproofing in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Basement Waterproofing Bareilly | MTBOSS",
    description:
      "Need basement waterproofing Bareilly? MTBOSS inspects, treats and seals basements with the right system and clear costs. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-basement-waterproofing-bareilly.jpg"],
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
    url: "https://www.mtboss.in/basement-waterproofing-bareilly",
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
      "Basement Waterproofing",
      "Basement Leakage Repair",
      "Basement Seepage Treatment",
      "Basement Damp Proofing",
      "Parking Basement Waterproofing",
      "Injection Grouting",
      "Crystalline Waterproofing",
      "Sump Pit and Drainage Services",
      "Waterproofing Contractor Services",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Basement Waterproofing in Bareilly",
    description:
      "MTBOSS provides basement inspection, leak tracing, crack and joint repair, PU and epoxy injection grouting, crystalline and cementitious waterproofing, membrane waterproofing, sump and drainage services, water testing and handover in Bareilly.",
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
    serviceType: "Basement Waterproofing and Leakage Repair Services",
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