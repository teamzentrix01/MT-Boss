// app/(bareilly_keywords)/modular-kitchen-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Modular Kitchen in Bareilly | Design & Fitting | MTBOSS",
  description:
    "Modular kitchen in Bareilly by MTBOSS: custom design, layout planning and installation for homes and apartments. Clear quotes. Call +91 94584 10866.",
  keywords:
    "modular kitchen in Bareilly, modular kitchen Bareilly, modular kitchen design Bareilly, modular kitchen installation Bareilly, L-shaped modular kitchen Bareilly, U-shaped modular kitchen Bareilly, island kitchen Bareilly, modular kitchen cost Bareilly, kitchen renovation Bareilly, kitchen interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS modular kitchen, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/modular-kitchen-in-bareilly",
  },
  openGraph: {
    title: "Modular Kitchen in Bareilly | Design & Fitting | MTBOSS",
    description:
      "Modular kitchen in Bareilly by MTBOSS: custom design, layout planning and installation for homes and apartments. Clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/modular-kitchen-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-modular-kitchen-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Modular Kitchen in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modular Kitchen in Bareilly | Design & Fitting | MTBOSS",
    description:
      "Modular kitchen in Bareilly by MTBOSS: custom design, layout planning and installation for homes and apartments. Clear quotes. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-modular-kitchen-in-bareilly.jpg"],
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
    url: "https://www.mtboss.in/modular-kitchen-in-bareilly",
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
      "L-Shaped Modular Kitchen",
      "U-Shaped Modular Kitchen",
      "Island Kitchen Design",
      "Kitchen Cabinet Installation",
      "Countertop and Backsplash Installation",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Modular Kitchen in Bareilly",
    description:
      "MTBOSS provides modular kitchen design, layout planning, material selection, custom cabinets, countertop and backsplash installation, chimney and appliance planning, plumbing, electrical, tile, false ceiling and renovation services for homes and apartments in Bareilly.",
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
    serviceType: "Modular Kitchen Design and Installation",
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