// app/(bareilly_keywords)/old-house-renovation-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Old House Renovation in Bareilly | MTBOSS",
  description:
    "Planning old house renovation in Bareilly? MTBOSS inspects structure, damp, wiring and plumbing, then plans repairs with clear quotes. Call +91 94584 10866.",
  keywords:
    "old house renovation Bareilly, old house renovation in Bareilly, renovate old house Bareilly, old building renovation Bareilly, purana ghar renovation Bareilly, old house repair Bareilly, ancestral house renovation Bareilly, old house waterproofing Bareilly, old house rewiring Bareilly, old house renovation cost Bareilly, renovation contractor Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/old-house-renovation-in-bareilly",
  },
  openGraph: {
    title: "Old House Renovation in Bareilly | MTBOSS",
    description:
      "Planning old house renovation in Bareilly? MTBOSS inspects structure, damp, wiring and plumbing, then plans repairs with clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/old-house-renovation-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-old-house-renovation-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Old House Renovation in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Old House Renovation in Bareilly | MTBOSS",
    description:
      "Planning old house renovation in Bareilly? MTBOSS inspects structure, damp, wiring and plumbing, then plans repairs with clear quotes. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-old-house-renovation-in-bareilly.jpg",
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
    url: "https://www.mtboss.in/old-house-renovation-in-bareilly",
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
      "Old House Renovation",
      "Old House Renovation in Bareilly",
      "Renovate Old House",
      "Old Building Renovation",
      "Purana Ghar Renovation",
      "Old House Repair",
      "Ancestral House Renovation",
      "Old House Waterproofing",
      "Old House Rewiring",
      "Old House Renovation Cost",
      "Renovation Contractor in Bareilly",
      "Waterproofing",
      "Damp and Seepage Treatment",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Old House Renovation in Bareilly",
    description:
      "MTBOSS provides old house renovation in Bareilly with full inspection, structural assessment, damp and seepage treatment, waterproofing, termite treatment, rewiring, plumbing replacement, plaster repair, flooring, bathroom and kitchen renovation, carpentry, painting, site supervision and handover.",
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
      "Old House Renovation, Waterproofing, Damp Treatment, Rewiring, Plumbing Replacement and Building Repair",
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