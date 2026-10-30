// app/(bareilly_keywords)/home-renovation-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Home Renovation in Bareilly | MTBOSS",
  description:
    "Planning home renovation in Bareilly? MTBOSS handles repairs, remodelling, waterproofing and interiors with clear quotes. Call +91 94584 10866.",
  keywords:
    "home renovation in Bareilly, house renovation Bareilly, home renovation contractor Bareilly, home remodelling Bareilly, house repair and renovation Bareilly, renovation cost Bareilly, old house renovation Bareilly, flat renovation Bareilly, home makeover Bareilly, interior renovation Bareilly, renovation company Bareilly, construction company Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical:
      "https://www.mtboss.in/home-renovation-in-bareilly",
  },
  openGraph: {
    title: "Home Renovation in Bareilly | MTBOSS",
    description:
      "Planning home renovation in Bareilly? MTBOSS handles repairs, remodelling, waterproofing and interiors with clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/home-renovation-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-home-renovation-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Home Renovation in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Renovation in Bareilly | MTBOSS",
    description:
      "Planning home renovation in Bareilly? MTBOSS handles repairs, remodelling, waterproofing and interiors with clear quotes. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-home-renovation-in-bareilly.jpg",
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
    url: "https://www.mtboss.in/home-renovation-in-bareilly",
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
      "Home Renovation in Bareilly",
      "House Renovation",
      "Home Renovation Contractor",
      "Home Remodelling",
      "House Repair and Renovation",
      "Renovation Cost",
      "Old House Renovation",
      "Flat Renovation",
      "Home Makeover",
      "Interior Renovation",
      "Renovation Company",
      "Construction Company",
      "Waterproofing",
      "Bathroom Renovation",
      "Kitchen Renovation",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Home Renovation in Bareilly",
    description:
      "MTBOSS provides home renovation in Bareilly with site inspection, renovation planning, civil and structural repair, waterproofing, plumbing, electrical work, flooring, bathroom and kitchen renovation, doors and windows, carpentry, false ceilings, painting, exterior work and handover.",
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
      "Home Renovation, House Remodelling, Waterproofing, Interior Renovation and Building Repair",
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