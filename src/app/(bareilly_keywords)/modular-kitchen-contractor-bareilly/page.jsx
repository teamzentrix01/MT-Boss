// app/(bareilly_keywords)/modular-kitchen-contractor-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Modular Kitchen Contractor Bareilly | MTBOSS",
  description:
    "Need a modular kitchen contractor in Bareilly? MTBOSS handles design, civil work, installation and handover with clear quotes. Call +91 94584 10866.",
  keywords:
    "modular kitchen contractor Bareilly, modular kitchen contractors in Bareilly, kitchen contractor Bareilly, kitchen interior contractor Bareilly, modular kitchen installation Bareilly, kitchen renovation contractor Bareilly, kitchen work contractor Bareilly, modular kitchen company Bareilly, kitchen turnkey contractor Bareilly, kitchen civil work Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical:
      "https://www.mtboss.in/modular-kitchen-contractor-bareilly",
  },
  openGraph: {
    title: "Modular Kitchen Contractor Bareilly | MTBOSS",
    description:
      "Need a modular kitchen contractor in Bareilly? MTBOSS handles design, civil work, installation and handover with clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/modular-kitchen-contractor-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-modular-kitchen-contractor-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Modular Kitchen Contractor in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modular Kitchen Contractor Bareilly | MTBOSS",
    description:
      "Need a modular kitchen contractor in Bareilly? MTBOSS handles design, civil work, installation and handover with clear quotes. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-modular-kitchen-contractor-bareilly.jpg",
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
    url: "https://www.mtboss.in/modular-kitchen-contractor-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Harthala Kanth Road, Behind KR Collection, near Domino's",
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
      "Modular Kitchen Contractor",
      "Kitchen Contractor",
      "Kitchen Interior Contractor",
      "Modular Kitchen Installation",
      "Kitchen Renovation Contractor",
      "Kitchen Work Contractor",
      "Modular Kitchen Company",
      "Kitchen Turnkey Contractor",
      "Kitchen Civil Work",
      "Kitchen Plumbing Work",
      "Kitchen Electrical Work",
      "Kitchen Tiling Work",
      "Kitchen Interior Design",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Modular Kitchen Contractor in Bareilly",
    description:
      "MTBOSS provides modular kitchen contracting in Bareilly with site inspection, design, demolition, civil work, plumbing, electrical work, tiling, cabinets, shutters, hardware, countertop, sink, backsplash, chimney planning, installation, finishing and handover under one team.",
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
    serviceType:
      "Modular Kitchen Contracting, Installation and Handover",
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