// app/(bareilly_keywords)/bathroom-waterproofing-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Bathroom Waterproofing Bareilly | MTBOSS",
  description:
    "Bathroom leaking? MTBOSS offers bathroom waterproofing Bareilly with leak tracing, slab treatment, flood test and clear costs. Call +91 94584 10866.",
  keywords:
    "bathroom waterproofing Bareilly, bathroom leakage repair Bareilly, toilet waterproofing Bareilly, bathroom seepage solution Bareilly, bathroom waterproofing cost Bareilly, bathroom tile leakage Bareilly, shower area waterproofing Bareilly, bathroom renovation Bareilly, waterproofing contractor Bareilly, plumber Bareilly, building repair Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, bathroom waterproofing quote Bareilly",
  alternates: {
    canonical: "https://www.mtboss.in/bathroom-waterproofing-bareilly",
  },
  openGraph: {
    title: "Bathroom Waterproofing Bareilly | MTBOSS",
    description:
      "Bathroom leaking? MTBOSS offers bathroom waterproofing Bareilly with leak tracing, slab treatment, flood test and clear costs. Call +91 94584 10866.",
    url: "https://www.mtboss.in/bathroom-waterproofing-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-bathroom-waterproofing-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Bathroom Waterproofing in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bathroom Waterproofing Bareilly | MTBOSS",
    description:
      "Bathroom leaking? MTBOSS offers bathroom waterproofing Bareilly with leak tracing, slab treatment, flood test and clear costs. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-bathroom-waterproofing-bareilly.jpg"],
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
    url: "https://www.mtboss.in/bathroom-waterproofing-bareilly",
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
      "Bathroom Waterproofing",
      "Bathroom Leakage Repair",
      "Toilet Waterproofing",
      "Bathroom Seepage Solution",
      "Bathroom Tile Leakage Repair",
      "Shower Area Waterproofing",
      "Bathroom Renovation",
      "Plumbing Services",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bathroom Waterproofing in Bareilly",
    description:
      "MTBOSS provides bathroom leak tracing, slab and wall waterproofing, pipe and junction sealing, flood testing, retiling, plumbing repair and bathroom renovation services in Bareilly.",
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
    serviceType: "Bathroom Waterproofing and Leakage Repair Services",
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