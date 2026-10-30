// app/(bareilly_keywords)/house-renovation-cost-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "House Renovation Cost in Bareilly | MTBOSS",
  description:
    "Planning house renovation in Bareilly? See cost by scope, area-wise ranges and hidden charges. Get a free site visit and fixed quote from MTBOSS.",
  keywords:
    "house renovation cost Bareilly, home renovation cost in Bareilly, renovation cost per sq ft Bareilly, house renovation price Bareilly, old house renovation cost Bareilly, flat renovation cost Bareilly, bathroom renovation cost Bareilly, kitchen renovation cost Bareilly, renovation budget Bareilly, renovation estimate Bareilly, renovation company Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical:
      "https://www.mtboss.in/house-renovation-cost-in-bareilly",
  },
  openGraph: {
    title: "House Renovation Cost in Bareilly | MTBOSS",
    description:
      "Planning house renovation in Bareilly? See cost by scope, area-wise ranges and hidden charges. Get a free site visit and fixed quote from MTBOSS.",
    url: "https://www.mtboss.in/house-renovation-cost-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-house-renovation-cost-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "House Renovation Cost in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "House Renovation Cost in Bareilly | MTBOSS",
    description:
      "Planning house renovation in Bareilly? See cost by scope, area-wise ranges and hidden charges. Get a free site visit and fixed quote from MTBOSS.",
    images: [
      "https://www.mtboss.in/og-house-renovation-cost-in-bareilly.jpg",
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
    url: "https://www.mtboss.in/house-renovation-cost-in-bareilly",
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
      "House Renovation Cost",
      "Home Renovation Cost in Bareilly",
      "Renovation Cost Per Sq Ft",
      "House Renovation Price",
      "Old House Renovation Cost",
      "Flat Renovation Cost",
      "Bathroom Renovation Cost",
      "Kitchen Renovation Cost",
      "Renovation Budget",
      "Renovation Estimate",
      "Renovation Company",
      "Waterproofing Cost",
      "Interior Renovation",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "House Renovation Cost in Bareilly",
    description:
      "MTBOSS provides house renovation cost guidance in Bareilly with site inspection, budget planning, item-wise estimates, renovation by scope and area, waterproofing, plumbing, electrical work, flooring, bathroom and kitchen renovation, carpentry, false ceilings, painting and handover.",
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
      "House Renovation Costing, Renovation Estimate, Waterproofing, Interior Renovation and Building Repair",
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