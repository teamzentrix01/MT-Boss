// app/(bareilly_keywords)/best-home-renovation-company-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Best Home Renovation Company in Bareilly | MTBOSS",
  description:
    "How to choose the best home renovation company in Bareilly? Use our checklist, then get a free site visit and clear quote from MTBOSS. Call +91 94584 10866.",
  keywords:
    "best home renovation company Bareilly, home renovation company Bareilly, top renovation company Bareilly, renovation contractors in Bareilly, house renovation company Bareilly, how to choose renovation company, renovation company near me Bareilly, home remodelling company Bareilly, interior and renovation company Bareilly, construction and renovation Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical:
      "https://www.mtboss.in/best-home-renovation-company-in-bareilly",
  },
  openGraph: {
    title: "Best Home Renovation Company in Bareilly | MTBOSS",
    description:
      "How to choose the best home renovation company in Bareilly? Use our checklist, then get a free site visit and clear quote from MTBOSS. Call +91 94584 10866.",
    url: "https://www.mtboss.in/best-home-renovation-company-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url:
          "https://www.mtboss.in/og-best-home-renovation-company-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Best Home Renovation Company in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Home Renovation Company in Bareilly | MTBOSS",
    description:
      "How to choose the best home renovation company in Bareilly? Use our checklist, then get a free site visit and clear quote from MTBOSS. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-best-home-renovation-company-in-bareilly.jpg",
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
    url: "https://www.mtboss.in/best-home-renovation-company-in-bareilly",
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
      "Best Home Renovation Company",
      "Home Renovation Company",
      "Top Renovation Company",
      "Renovation Contractors",
      "House Renovation Company",
      "Home Remodelling Company",
      "Interior and Renovation Company",
      "Construction and Renovation",
      "Home Renovation in Bareilly",
      "Waterproofing",
      "Bathroom Renovation",
      "Kitchen Renovation",
      "Interior Renovation",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Best Home Renovation Company in Bareilly",
    description:
      "MTBOSS provides home renovation in Bareilly with site inspection, renovation planning, written scope, itemised quotes, civil and structural repair, waterproofing, plumbing, electrical work, flooring, bathroom and kitchen renovation, carpentry, false ceilings, painting, supervision and handover.",
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