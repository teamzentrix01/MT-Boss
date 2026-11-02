// app/(bareilly_keywords)/flat-renovation-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Flat Renovation in Bareilly | MTBOSS",
  description:
    "Planning flat renovation in Bareilly? MTBOSS handles society rules, waterproofing, interiors and finishing with clear quotes. Call +91 94584 10866.",
  keywords:
    "flat renovation Bareilly, apartment renovation Bareilly, flat renovation in Bareilly, flat interior renovation Bareilly, flat makeover Bareilly, flat renovation cost Bareilly, flat renovation contractor Bareilly, society rules for renovation, flat bathroom and kitchen renovation Bareilly, flat waterproofing Bareilly, home renovation Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/flat-renovation-in-bareilly",
  },
  openGraph: {
    title: "Flat Renovation in Bareilly | MTBOSS",
    description:
      "Planning flat renovation in Bareilly? MTBOSS handles society rules, waterproofing, interiors and finishing with clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/flat-renovation-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-flat-renovation-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Flat Renovation in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flat Renovation in Bareilly | MTBOSS",
    description:
      "Planning flat renovation in Bareilly? MTBOSS handles society rules, waterproofing, interiors and finishing with clear quotes. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-flat-renovation-in-bareilly.jpg",
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
    url: "https://www.mtboss.in/flat-renovation-in-bareilly",
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
      "Flat Renovation",
      "Flat Renovation in Bareilly",
      "Apartment Renovation",
      "Flat Interior Renovation",
      "Flat Makeover",
      "Flat Renovation Cost",
      "Flat Renovation Contractor",
      "Society Rules for Renovation",
      "Flat Bathroom and Kitchen Renovation",
      "Flat Waterproofing",
      "Home Renovation in Bareilly",
      "Waterproofing",
      "Interior Design",
      "Modular Kitchen",
      "Carpentry",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Flat Renovation in Bareilly",
    description:
      "MTBOSS provides flat renovation in Bareilly with society rule planning, site inspection, waterproofing, plumbing, electrical work, flooring, bathroom and kitchen renovation, false ceilings, carpentry, interiors, painting, site supervision and handover.",
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
      "Flat Renovation, Apartment Renovation, Waterproofing, Interior Renovation, Bathroom and Kitchen Renovation",
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