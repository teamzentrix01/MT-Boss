// app/(bareilly_keywords)/home-interior-renovation-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Home Interior Renovation Bareilly | MTBOSS",
  description:
    "Planning home interior renovation in Bareilly? MTBOSS handles design, ceilings, flooring, carpentry and painting with clear quotes. Call +91 94584 10866.",
  keywords:
    "home interior renovation Bareilly, interior renovation Bareilly, home interior makeover Bareilly, house interior renovation Bareilly, interior design and renovation Bareilly, flat interior renovation Bareilly, living room renovation Bareilly, bedroom renovation Bareilly, false ceiling and flooring Bareilly, interior renovation cost Bareilly, interior designer Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/home-interior-renovation-in-bareilly",
  },
  openGraph: {
    title: "Home Interior Renovation Bareilly | MTBOSS",
    description:
      "Planning home interior renovation in Bareilly? MTBOSS handles design, ceilings, flooring, carpentry and painting with clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/home-interior-renovation-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url:
          "https://www.mtboss.in/og-home-interior-renovation-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Home Interior Renovation in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Interior Renovation Bareilly | MTBOSS",
    description:
      "Planning home interior renovation in Bareilly? MTBOSS handles design, ceilings, flooring, carpentry and painting with clear quotes. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-home-interior-renovation-in-bareilly.jpg",
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
    url: "https://www.mtboss.in/home-interior-renovation-in-bareilly",
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
      "Home Interior Renovation",
      "Home Interior Renovation in Bareilly",
      "Interior Renovation",
      "Home Interior Makeover",
      "House Interior Renovation",
      "Interior Design and Renovation",
      "Flat Interior Renovation",
      "Living Room Renovation",
      "Bedroom Renovation",
      "False Ceiling and Flooring",
      "Interior Renovation Cost",
      "Interior Designer in Bareilly",
      "Carpentry",
      "Painting",
      "Modular Kitchen",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Home Interior Renovation in Bareilly",
    description:
      "MTBOSS provides home interior renovation in Bareilly with site assessment, space planning, interior design, 3D or layout visuals, flooring, false ceiling and lighting, wall preparation and painting, wall panels, carpentry and storage, doors and windows, electrical and plumbing adjustments, kitchen and bathroom upgrades, and handover.",
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
      "Home Interior Renovation, Interior Design, False Ceiling, Flooring, Carpentry, Painting and Modular Kitchen",
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