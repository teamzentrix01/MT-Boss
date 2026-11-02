// app/(bareilly_keywords)/kitchen-renovation-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Kitchen Renovation in Bareilly | MTBOSS",
  description:
    "Planning kitchen renovation in Bareilly? MTBOSS handles layout, plumbing, tiles, cabinets and finishing with clear quotes. Call +91 94584 10866.",
  keywords:
    "kitchen renovation Bareilly, kitchen renovation in Bareilly, old kitchen renovation Bareilly, kitchen remodelling Bareilly, kitchen makeover Bareilly, kitchen renovation cost Bareilly, kitchen tiles and platform renovation Bareilly, kitchen upgrade Bareilly, kitchen repair Bareilly, modular kitchen renovation Bareilly, home renovation Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/kitchen-renovation-in-bareilly",
  },
  openGraph: {
    title: "Kitchen Renovation in Bareilly | MTBOSS",
    description:
      "Planning kitchen renovation in Bareilly? MTBOSS handles layout, plumbing, tiles, cabinets and finishing with clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/kitchen-renovation-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-kitchen-renovation-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Kitchen Renovation in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitchen Renovation in Bareilly | MTBOSS",
    description:
      "Planning kitchen renovation in Bareilly? MTBOSS handles layout, plumbing, tiles, cabinets and finishing with clear quotes. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-kitchen-renovation-in-bareilly.jpg",
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
    url: "https://www.mtboss.in/kitchen-renovation-in-bareilly",
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
      "Kitchen Renovation",
      "Kitchen Renovation in Bareilly",
      "Old Kitchen Renovation",
      "Kitchen Remodelling",
      "Kitchen Makeover",
      "Kitchen Renovation Cost",
      "Kitchen Tiles and Platform Renovation",
      "Kitchen Upgrade",
      "Kitchen Repair",
      "Modular Kitchen Renovation",
      "Home Renovation in Bareilly",
      "Waterproofing",
      "Plumbing",
      "Electrical Work",
      "Carpentry",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Kitchen Renovation in Bareilly",
    description:
      "MTBOSS provides kitchen renovation in Bareilly with site inspection, layout and design planning, demolition, platform work, waterproofing, plumbing, electrical work, tiling, backsplash, modular kitchen cabinets, countertop, sink, chimney and ventilation planning, false ceiling, lighting, painting and handover.",
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
      "Kitchen Renovation, Modular Kitchen, Waterproofing, Plumbing, Electrical Work, Tiling and Carpentry",
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