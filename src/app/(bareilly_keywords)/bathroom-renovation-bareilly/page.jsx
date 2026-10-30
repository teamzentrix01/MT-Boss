// app/(bareilly_keywords)/bathroom-renovation-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Bathroom Renovation in Bareilly | MTBOSS",
  description:
    "Planning bathroom renovation in Bareilly? MTBOSS handles waterproofing, plumbing, tiles and fittings with clear quotes. Call +91 94584 10866.",
  keywords:
    "bathroom renovation Bareilly, bathroom renovation in Bareilly, bathroom remodelling Bareilly, bathroom makeover Bareilly, old bathroom renovation Bareilly, bathroom waterproofing Bareilly, bathroom tiles replacement Bareilly, bathroom plumbing Bareilly, bathroom renovation cost Bareilly, toilet renovation Bareilly, home renovation Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/bathroom-renovation-in-bareilly",
  },
  openGraph: {
    title: "Bathroom Renovation in Bareilly | MTBOSS",
    description:
      "Planning bathroom renovation in Bareilly? MTBOSS handles waterproofing, plumbing, tiles and fittings with clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/bathroom-renovation-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-bathroom-renovation-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Bathroom Renovation in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bathroom Renovation in Bareilly | MTBOSS",
    description:
      "Planning bathroom renovation in Bareilly? MTBOSS handles waterproofing, plumbing, tiles and fittings with clear quotes. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-bathroom-renovation-in-bareilly.jpg",
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
    url: "https://www.mtboss.in/bathroom-renovation-in-bareilly",
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
      "Bathroom Renovation",
      "Bathroom Renovation in Bareilly",
      "Bathroom Remodelling",
      "Bathroom Makeover",
      "Old Bathroom Renovation",
      "Bathroom Waterproofing",
      "Bathroom Tiles Replacement",
      "Bathroom Plumbing",
      "Bathroom Renovation Cost",
      "Toilet Renovation",
      "Home Renovation in Bareilly",
      "Waterproofing",
      "Plumbing",
      "Tiling",
      "Sanitaryware and Fittings",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bathroom Renovation in Bareilly",
    description:
      "MTBOSS provides bathroom renovation in Bareilly with site inspection, layout planning, demolition, waterproofing, floor slope and drainage correction, plumbing, electrical work, tiling, sanitaryware, vanity and storage, doors, ventilation, painting and handover.",
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
      "Bathroom Renovation, Waterproofing, Plumbing, Tiling, Sanitaryware and Home Renovation",
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