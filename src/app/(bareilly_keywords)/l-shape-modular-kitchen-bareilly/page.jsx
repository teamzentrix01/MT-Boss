// app/(bareilly_keywords)/l-shape-modular-kitchen-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "L Shape Modular Kitchen Bareilly | MTBOSS",
  description:
    "Planning an L shape modular kitchen in Bareilly? MTBOSS offers site visit, 3D design, corner solutions and clear quotes. Call +91 94584 10866.",
  keywords:
    "L shape modular kitchen Bareilly, L shaped kitchen design Bareilly, L shape modular kitchen cost Bareilly, L shape kitchen designer Bareilly, L shape kitchen layout, L shaped kitchen with dining, small L shape modular kitchen, L shape kitchen corner unit, modular kitchen company Bareilly, kitchen interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/l-shape-modular-kitchen-bareilly",
  },
  openGraph: {
    title: "L Shape Modular Kitchen Bareilly | MTBOSS",
    description:
      "Planning an L shape modular kitchen in Bareilly? MTBOSS offers site visit, 3D design, corner solutions and clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/l-shape-modular-kitchen-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-l-shape-modular-kitchen-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "L Shape Modular Kitchen in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "L Shape Modular Kitchen Bareilly | MTBOSS",
    description:
      "Planning an L shape modular kitchen in Bareilly? MTBOSS offers site visit, 3D design, corner solutions and clear quotes. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-l-shape-modular-kitchen-bareilly.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/l-shape-modular-kitchen-bareilly",
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
      "L Shape Modular Kitchen",
      "L Shaped Kitchen Design",
      "L Shape Modular Kitchen Costing",
      "L Shape Kitchen Corner Unit",
      "Small L Shape Modular Kitchen",
      "L Shaped Kitchen with Dining",
      "Modular Kitchen Design",
      "Modular Kitchen Installation",
      "Kitchen Renovation",
      "Kitchen Interior Design",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "L Shape Modular Kitchen in Bareilly",
    description:
      "MTBOSS designs and installs L shape modular kitchens in Bareilly, including site measurement, work triangle planning, 3D design, corner solutions, carcass and shutter work, hardware, countertop, sink, backsplash, chimney planning, lighting, civil, plumbing and electrical work.",
    provider: {
      "@type": "LocalBusiness",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.mtboss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Bareilly",
    },
    serviceType: "L Shape Modular Kitchen Design and Installation",
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