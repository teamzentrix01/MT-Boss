// app/(moradabad_keywords)/architect-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Architect in Moradabad | Design & Construction by MTBoss",
  description:
    "Looking for a trusted architect in Moradabad? MTBoss offers house design, commercial planning, construction and material supply under one roof. Call +91 94584 10866 for a free quote.",
  keywords:
    "architect in Moradabad, best architect in Moradabad, architect near me Moradabad, house design Moradabad, home architect Moradabad, commercial architect Moradabad, residential architect Moradabad, building plan Moradabad, house elevation design Moradabad, construction company Moradabad, architect and contractor Moradabad, MTBoss construction Moradabad, house construction cost Moradabad, 3D elevation Moradabad, vastu architect Moradabad",
  alternates: {
    canonical: "https://www.MTBoss.in/architect-in-moradabad",
  },
  openGraph: {
    title: "Architect in Moradabad | Design & Construction by MTBoss",
    description:
      "Looking for a trusted architect in Moradabad? MTBoss offers house design, commercial planning, construction and material supply under one roof. Call +91 94584 10866 for a free quote.",
    url: "https://www.MTBoss.in/architect-in-moradabad",
    siteName: "MTBoss Construction Private Limited",
    images: [
      {
        url: "https://www.MTBoss.in/og-architect-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Architect in Moradabad - MTBoss Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Architect in Moradabad | Design & Construction by MTBoss",
    description:
      "Looking for a trusted architect in Moradabad? MTBoss offers house design, commercial planning, construction and material supply under one roof. Call +91 94584 10866 for a free quote.",
    images: ["https://www.MTBoss.in/og-architect-moradabad.jpg"],
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
    name: "MTBoss Construction Private Limited",
    url: "https://www.MTBoss.in/architect-in-moradabad",
    telephone: "+91-9458410866",
    email: "MTBoss2016@gmail.com",
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
      "Architectural Design",
      "Residential Construction",
      "Commercial Construction",
      "Industrial Construction",
      "Hospitality Construction",
      "Construction Material Supply",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Architect and Construction Services in Moradabad",
    description:
      "MTBoss provides architectural design, floor planning, elevation design, construction execution and material supply for residential, commercial and industrial projects in Moradabad.",
    provider: {
      "@type": "GeneralContractor",
      name: "MTBoss Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.MTBoss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Moradabad",
    },
    serviceType: "Architectural and Construction Services",
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