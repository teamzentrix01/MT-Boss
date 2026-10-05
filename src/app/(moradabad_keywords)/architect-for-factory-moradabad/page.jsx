// app/(moradabad_keywords)/architect-for-factory-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Architect for Factory Moradabad | MTBOSS",
  description:
    "Need an architect for factory construction in Moradabad? MTBOSS offers design, build and material supply together. Call +91 94584 10866 for a quote.",
  keywords:
    "architect for factory Moradabad, factory construction Moradabad, industrial building architect Moradabad, factory shed construction Moradabad, warehouse construction Moradabad, industrial construction company Moradabad, MTBOSS Moradabad, factory building cost Moradabad, MTBOSS budget calculator, factory building materials Moradabad, MTBOSS Kanth Road, manufacturing unit construction Moradabad, industrial architect UP, factory construction quote Moradabad, MTBOSS industrial projects",
  alternates: {
    canonical: "https://www.mtboss.in/architect-for-factory-moradabad",
  },
  openGraph: {
    title: "Architect for Factory Moradabad | MTBOSS",
    description:
      "Need an architect for factory construction in Moradabad? MTBOSS offers design, build and material supply together. Call +91 94584 10866 for a quote.",
    url: "https://www.mtboss.in/architect-for-factory-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-factory-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Architect for Factory in Moradabad - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Architect for Factory Moradabad | MTBOSS",
    description:
      "Need an architect for factory construction in Moradabad? MTBOSS offers design, build and material supply together. Call +91 94584 10866 for a quote.",
    images: ["https://www.mtboss.in/og-factory-moradabad.jpg"],
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
    url: "https://www.mtboss.in/architect-for-factory-moradabad",
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
        name: "Moradabad",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    priceRange: "₹₹",
    serviceType: [
      "Factory Construction",
      "Industrial Building Design",
      "Warehouse Construction",
      "Manufacturing Unit Construction",
      "Construction Material Supply",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Architect for Factory Construction in Moradabad",
    description:
      "MTBOSS provides architectural design coordination, factory layout planning, civil construction and material supply for factory and industrial building projects in Moradabad.",
    provider: {
      "@type": "GeneralContractor",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.mtboss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Moradabad",
    },
    serviceType: "Factory and Industrial Building Architectural and Construction Services",
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