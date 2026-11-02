// app/(bareilly_keywords)/wall-waterproofing-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Wall Waterproofing Bareilly | Damp & Seepage Fix | MTBOSS",
  description:
    "Wall waterproofing Bareilly by MTBOSS: crack repair, damp treatment and protective coats for walls with clear costs. Call +91 94584 10866.",
  keywords:
    "wall waterproofing Bareilly, external wall waterproofing Bareilly, wall dampness treatment Bareilly, wall seepage repair Bareilly, rising damp treatment Bareilly, wall crack repair Bareilly, exterior wall coating Bareilly, boundary wall waterproofing Bareilly, wall waterproofing cost Bareilly, waterproofing contractor Bareilly, building repair Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, wall waterproofing quote Bareilly",
  alternates: {
    canonical: "https://www.mtboss.in/wall-waterproofing-bareilly",
  },
  openGraph: {
    title: "Wall Waterproofing Bareilly | Damp & Seepage Fix | MTBOSS",
    description:
      "Wall waterproofing Bareilly by MTBOSS: crack repair, damp treatment and protective coats for walls with clear costs. Call +91 94584 10866.",
    url: "https://www.mtboss.in/wall-waterproofing-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-wall-waterproofing-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Wall Waterproofing in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wall Waterproofing Bareilly | Damp & Seepage Fix | MTBOSS",
    description:
      "Wall waterproofing Bareilly by MTBOSS: crack repair, damp treatment and protective coats for walls with clear costs. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-wall-waterproofing-bareilly.jpg"],
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
    url: "https://www.mtboss.in/wall-waterproofing-bareilly",
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
      "Wall Waterproofing",
      "External Wall Waterproofing",
      "Wall Dampness Treatment",
      "Wall Seepage Repair",
      "Rising Damp Treatment",
      "Wall Crack Repair",
      "Exterior Wall Coating",
      "Boundary Wall Waterproofing",
      "Basement Wall Waterproofing",
      "Waterproofing Contractor Services",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Wall Waterproofing in Bareilly",
    description:
      "MTBOSS provides wall inspection, damp diagnosis, crack and plaster repair, rising damp treatment, external wall coating, parapet and junction sealing, basement and retaining wall waterproofing, restoration and handover services in Bareilly.",
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
    serviceType: "Wall Waterproofing and Damp Repair Services",
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