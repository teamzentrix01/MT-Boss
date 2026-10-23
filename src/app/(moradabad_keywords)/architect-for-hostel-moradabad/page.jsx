// app/(moradabad_keywords)/architect-for-hostel-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Architect for Hostel Moradabad | MTBoss",
  description:
    "Need an architect for hostel construction in Moradabad? MTBoss offers design, build and material supply together. Call +91 94584 10866 for a quote.",
  keywords:
    "architect for hostel Moradabad, hostel construction Moradabad, PG hostel builder Moradabad, student hostel architect Moradabad, hostel building design Moradabad, working women hostel construction Moradabad, hostel contractor Moradabad, MTBoss Moradabad, hostel building cost Moradabad, MTBoss budget calculator, hostel construction materials Moradabad, MTBoss Kanth Road, boys hostel construction Moradabad, hostel construction quote Moradabad, MTBoss commercial projects",
  alternates: {
    canonical: "https://www.MTBoss.in/architect-for-hostel-moradabad",
  },
  openGraph: {
    title: "Architect for Hostel Moradabad | MTBoss",
    description:
      "Need an architect for hostel construction in Moradabad? MTBoss offers design, build and material supply together. Call +91 94584 10866 for a quote.",
    url: "https://www.MTBoss.in/architect-for-hostel-moradabad",
    siteName: "MTBoss Construction Private Limited",
    images: [
      {
        url: "https://www.MTBoss.in/og-hostel-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Architect for Hostel in Moradabad - MTBoss Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Architect for Hostel Moradabad | MTBoss",
    description:
      "Need an architect for hostel construction in Moradabad? MTBoss offers design, build and material supply together. Call +91 94584 10866 for a quote.",
    images: ["https://www.MTBoss.in/og-hostel-moradabad.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: "MTBoss Construction Private Limited",
    url: "https://www.MTBoss.in/architect-for-hostel-moradabad",
    telephone: "+91-9458410866",
    email: "MTBoss2016@gmail.com",
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
        name: "Moradabad",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    priceRange: "₹₹",
    serviceType: [
      "Hostel Construction",
      "PG Hostel Building",
      "Student Hostel Design",
      "Working Women Hostel Construction",
      "Construction Material Supply",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Architect for Hostel Construction in Moradabad",
    description:
      "MTBoss provides architectural design coordination, hostel layout planning, civil construction and material supply for hostel and PG accommodation projects in Moradabad.",
    provider: {
      "@type": "GeneralContractor",
      name: "MTBoss Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.MTBoss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Moradabad",
    },
    serviceType: "Hostel and PG Building Architectural and Construction Services",
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