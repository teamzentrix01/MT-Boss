// app/(bareilly_keywords)/modular-kitchen-manufacturer-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Modular Kitchen Manufacturer Bareilly | MTBOSS",
  description:
    "Looking for a modular kitchen manufacturer in Bareilly? MTBOSS offers custom design, quality materials, installation and clear quotes. Call +91 94584 10866.",
  keywords:
    "modular kitchen manufacturer Bareilly, modular kitchen manufacturers in Bareilly, modular kitchen maker Bareilly, custom modular kitchen Bareilly, modular kitchen supplier Bareilly, modular kitchen factory Bareilly, modular kitchen company Bareilly, kitchen cabinet manufacturer Bareilly, modular kitchen for builders Bareilly, modular kitchen installation Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/modular-kitchen-manufacturer-bareilly",
  },
  openGraph: {
    title: "Modular Kitchen Manufacturer Bareilly | MTBOSS",
    description:
      "Looking for a modular kitchen manufacturer in Bareilly? MTBOSS offers custom design, quality materials, installation and clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/modular-kitchen-manufacturer-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-modular-kitchen-manufacturer-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Modular Kitchen Manufacturer in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modular Kitchen Manufacturer Bareilly | MTBOSS",
    description:
      "Looking for a modular kitchen manufacturer in Bareilly? MTBOSS offers custom design, quality materials, installation and clear quotes. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-modular-kitchen-manufacturer-bareilly.jpg",
    ],
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
    url: "https://www.mtboss.in/modular-kitchen-manufacturer-bareilly",
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
      "Modular Kitchen Manufacturing",
      "Custom Modular Kitchen",
      "Modular Kitchen Supplier",
      "Kitchen Cabinet Manufacturer",
      "Modular Kitchen for Builders",
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
    name: "Modular Kitchen Manufacturer in Bareilly",
    description:
      "MTBOSS provides custom modular kitchen manufacturing in Bareilly, including site measurement, design and drawing approval, cabinet production, edge banding, shutter finishes, hardware fitting, countertop and sink installation, chimney planning, civil, plumbing and electrical work, installation and after-handover support.",
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
    serviceType: "Custom Modular Kitchen Manufacturing and Installation",
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