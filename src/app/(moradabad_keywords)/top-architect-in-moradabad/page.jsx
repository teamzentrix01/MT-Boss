// app/(moradabad_keywords)/top-architect-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Top Architect in Moradabad: Design Trends & Services | MTBOSS",
  description:
    "Discover what sets a top architect in Moradabad apart: modern design, smart planning and reliable construction. Explore MTBOSS services and call +91 94584 10866 for a free quote.",
  keywords:
    "top architect in Moradabad, top architects Moradabad, leading architect Moradabad, modern house design Moradabad, 3D elevation Moradabad, smart home design Moradabad, sustainable building design Moradabad, architect and contractor Moradabad, luxury home architect Moradabad, commercial building design Moradabad, house design trends 2026, construction company Moradabad, MTBOSS construction Moradabad, architectural consultant Moradabad, building planning Moradabad",
  alternates: {
    canonical: "https://www.mtboss.in/top-architect-in-moradabad",
  },
  openGraph: {
    title: "Top Architect in Moradabad: Design Trends & Services | MTBOSS",
    description:
      "Discover what sets a top architect in Moradabad apart: modern design, smart planning and reliable construction. Explore MTBOSS services and call +91 94584 10866 for a free quote.",
    url: "https://www.mtboss.in/top-architect-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-top-architect-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Top Architect in Moradabad - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Architect in Moradabad: Design Trends & Services | MTBOSS",
    description:
      "Discover what sets a top architect in Moradabad apart: modern design, smart planning and reliable construction. Explore MTBOSS services and call +91 94584 10866 for a free quote.",
    images: ["https://www.mtboss.in/og-top-architect-moradabad.jpg"],
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
    url: "https://www.mtboss.in/top-architect-in-moradabad",
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
    name: "Top Architect and Construction Services in Moradabad",
    description:
      "MTBOSS provides architectural design coordination, modern design trends guidance, construction execution and material supply for residential, commercial and industrial projects in Moradabad.",
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