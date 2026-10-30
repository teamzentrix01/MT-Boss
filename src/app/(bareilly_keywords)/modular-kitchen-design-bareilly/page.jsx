// app/(bareilly_keywords)/modular-kitchen-design-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Modular Kitchen Design Bareilly | Layouts & Ideas | MTBOSS",
  description:
    "Modular kitchen design Bareilly by MTBOSS: layouts, storage, finishes and lighting planned for your space. Call +91 94584 10866.",
  keywords:
    "modular kitchen design Bareilly, modular kitchen design ideas Bareilly, small modular kitchen design Bareilly, L-shaped kitchen design Bareilly, U-shaped kitchen design Bareilly, open kitchen design Bareilly, island kitchen design Bareilly, kitchen layout planning Bareilly, kitchen storage design Bareilly, kitchen interior design Bareilly, modular kitchen cost Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS modular kitchen, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/modular-kitchen-design-bareilly",
  },
  openGraph: {
    title: "Modular Kitchen Design Bareilly | Layouts & Ideas | MTBOSS",
    description:
      "Modular kitchen design Bareilly by MTBOSS: layouts, storage, finishes and lighting planned for your space. Call +91 94584 10866.",
    url: "https://www.mtboss.in/modular-kitchen-design-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-modular-kitchen-design-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Modular Kitchen Design in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modular Kitchen Design Bareilly | Layouts & Ideas | MTBOSS",
    description:
      "Modular kitchen design Bareilly by MTBOSS: layouts, storage, finishes and lighting planned for your space. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-modular-kitchen-design-bareilly.jpg"],
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
    url: "https://www.mtboss.in/modular-kitchen-design-bareilly",
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
      "Kitchen Layout Planning",
      "Kitchen Storage Design",
      "Small Modular Kitchen Design",
      "L-Shaped Kitchen Design",
      "U-Shaped Kitchen Design",
      "Open Kitchen Design",
      "Island Kitchen Design",
      "Kitchen Interior Design",
      "Kitchen Renovation",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Modular Kitchen Design in Bareilly",
    description:
      "MTBOSS provides modular kitchen design in Bareilly, including room study, layout planning, work zones, storage design, 2D and 3D planning, finishes, colours, lighting, ventilation, plumbing, electrical, tile, false ceiling and renovation coordination.",
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
    serviceType: "Modular Kitchen Design and Interior Planning",
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