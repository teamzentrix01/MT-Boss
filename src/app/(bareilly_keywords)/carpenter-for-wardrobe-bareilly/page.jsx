// app/(bareilly_keywords)/wardrobe-carpenter-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Wardrobe Carpenter in Bareilly | MTBOSS",
  description:
    "Need a carpenter for wardrobe in Bareilly? MTBOSS makes custom hinged and sliding wardrobes with clear quotes. Call +91 94584 10866 for a site visit.",
  keywords:
    "carpenter for wardrobe Bareilly, wardrobe carpenter Bareilly, custom wardrobe Bareilly, sliding wardrobe Bareilly, hinged wardrobe Bareilly, wardrobe design Bareilly, wardrobe with loft Bareilly, walk-in wardrobe Bareilly, wardrobe maker Bareilly, modular wardrobe Bareilly, wardrobe cost Bareilly, carpenter services Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical:
      "https://www.mtboss.in/wardrobe-carpenter-in-bareilly",
  },
  openGraph: {
    title: "Wardrobe Carpenter in Bareilly | MTBOSS",
    description:
      "Need a carpenter for wardrobe in Bareilly? MTBOSS makes custom hinged and sliding wardrobes with clear quotes. Call +91 94584 10866 for a site visit.",
    url: "https://www.mtboss.in/wardrobe-carpenter-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-wardrobe-carpenter-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Wardrobe Carpenter in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wardrobe Carpenter in Bareilly | MTBOSS",
    description:
      "Need a carpenter for wardrobe in Bareilly? MTBOSS makes custom hinged and sliding wardrobes with clear quotes. Call +91 94584 10866 for a site visit.",
    images: [
      "https://www.mtboss.in/og-wardrobe-carpenter-in-bareilly.jpg",
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
    url: "https://www.mtboss.in/wardrobe-carpenter-in-bareilly",
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
      "Carpenter for Wardrobe",
      "Wardrobe Carpenter",
      "Custom Wardrobe",
      "Sliding Wardrobe",
      "Hinged Wardrobe",
      "Wardrobe Design",
      "Wardrobe with Loft",
      "Walk-in Wardrobe",
      "Wardrobe Maker",
      "Modular Wardrobe",
      "Wardrobe Cost",
      "Carpenter Services",
      "Wardrobe Repair",
      "Wardrobe Installation",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Wardrobe Carpenter in Bareilly",
    description:
      "MTBOSS provides wardrobe carpentry in Bareilly with site visits, wall measurement, custom wardrobe design, hinged and sliding wardrobes, wall-to-wall units, lofts, corner wardrobes, kids' wardrobes, internal fittings, mirror and finish options, repair, installation and handover.",
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
      "Custom Wardrobe Carpentry, Wardrobe Design, Installation and Repair",
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