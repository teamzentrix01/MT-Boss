// app/(bareilly_keywords)/modular-kitchen-near-me-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Modular Kitchen Near Me Bareilly | MTBOSS",
  description:
    "Searching modular kitchen near me in Bareilly? MTBOSS offers free site visit, 3D design and clear quotes for your kitchen. Call +91 94584 10866.",
  keywords:
    "modular kitchen near me Bareilly, modular kitchen Bareilly, modular kitchen designer near me, modular kitchen company Bareilly, modular kitchen showroom Bareilly, kitchen interior near me Bareilly, kitchen designer in Bareilly, modular kitchen installation Bareilly, kitchen renovation Bareilly, best modular kitchen Bareilly, modular kitchen quote Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/modular-kitchen-near-me-bareilly",
  },
  openGraph: {
    title: "Modular Kitchen Near Me Bareilly | MTBOSS",
    description:
      "Searching modular kitchen near me in Bareilly? MTBOSS offers free site visit, 3D design and clear quotes for your kitchen. Call +91 94584 10866.",
    url: "https://www.mtboss.in/modular-kitchen-near-me-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-modular-kitchen-near-me-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Modular Kitchen Near Me in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modular Kitchen Near Me Bareilly | MTBOSS",
    description:
      "Searching modular kitchen near me in Bareilly? MTBOSS offers free site visit, 3D design and clear quotes for your kitchen. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-modular-kitchen-near-me-bareilly.jpg"],
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
    url: "https://www.mtboss.in/modular-kitchen-near-me-bareilly",
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
      "Modular Kitchen Near Me",
      "Modular Kitchen Design",
      "Modular Kitchen Installation",
      "Kitchen Renovation",
      "Kitchen Interior Design",
      "Kitchen Cabinet Installation",
      "Countertop and Backsplash Installation",
      "Chimney and Hob Planning",
      "Plumbing and Electrical Work",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Modular Kitchen Near Me in Bareilly",
    description:
      "MTBOSS provides modular kitchen services in Bareilly, including free site visits, measurement, layout planning, 3D design, cabinets and shutters, hardware, countertop, sink, backsplash, chimney and hob planning, lighting, civil, plumbing and electrical work, installation and after-handover support.",
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
    serviceType: "Modular Kitchen Design, Installation and Renovation",
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