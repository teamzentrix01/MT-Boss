// app/(bareilly_keywords)/best-modular-kitchen-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Best Modular Kitchen Bareilly | How to Choose | MTBOSS",
  description:
    "Looking for the best modular kitchen Bareilly? Learn what to check, then plan your kitchen with MTBOSS. Call +91 94584 10866.",
  keywords:
    "best modular kitchen Bareilly, best modular kitchen designers in Bareilly, top modular kitchen company Bareilly, modular kitchen manufacturer Bareilly, modular kitchen quality Bareilly, modular kitchen warranty Bareilly, modular kitchen cost Bareilly, modular kitchen design Bareilly, kitchen interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS modular kitchen, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/best-modular-kitchen-bareilly",
  },
  openGraph: {
    title: "Best Modular Kitchen Bareilly | How to Choose | MTBOSS",
    description:
      "Looking for the best modular kitchen Bareilly? Learn what to check, then plan your kitchen with MTBOSS. Call +91 94584 10866.",
    url: "https://www.mtboss.in/best-modular-kitchen-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-best-modular-kitchen-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Best Modular Kitchen in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Modular Kitchen Bareilly | How to Choose | MTBOSS",
    description:
      "Looking for the best modular kitchen Bareilly? Learn what to check, then plan your kitchen with MTBOSS. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-best-modular-kitchen-bareilly.jpg"],
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
    url: "https://www.mtboss.in/best-modular-kitchen-bareilly",
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
      "Modular Kitchen Design",
      "Modular Kitchen Installation",
      "Kitchen Renovation",
      "Kitchen Interior Design",
      "Kitchen Cabinet Installation",
      "Countertop and Backsplash Installation",
      "Chimney and Hob Planning",
      "Plumbing and Electrical Work",
      "Tile and Marble Work",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Best Modular Kitchen in Bareilly",
    description:
      "MTBOSS helps homeowners in Bareilly plan, compare and choose a durable modular kitchen. Services include site measurement, layout planning, 2D or 3D design, material selection, custom cabinets, countertop and backsplash installation, chimney and appliance planning, plumbing, electrical, tile, false ceiling and renovation work.",
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