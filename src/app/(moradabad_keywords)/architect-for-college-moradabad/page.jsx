// app/(moradabad_keywords)/architect-for-college-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Architect for College Moradabad | MTBOSS",
  description:
    "Need an architect for college building construction in Moradabad? MTBOSS offers design, build and material supply together. Call +91 94584 10866.",
  keywords:
    "architect for college Moradabad, college building construction Moradabad, educational institute architect Moradabad, college campus design Moradabad, school and college construction Moradabad, institutional building contractor Moradabad, MTBOSS Moradabad, college building cost Moradabad, MTBOSS budget calculator, college construction materials Moradabad, MTBOSS Kanth Road, coaching institute construction Moradabad, educational building architect UP, college construction quote Moradabad, MTBOSS institutional projects",
  alternates: {
    canonical: "https://www.mtboss.in/architect-for-college-moradabad",
  },
  openGraph: {
    title: "Architect for College Moradabad | MTBOSS",
    description:
      "Need an architect for college building construction in Moradabad? MTBOSS offers design, build and material supply together. Call +91 94584 10866.",
    url: "https://www.mtboss.in/architect-for-college-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-college-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Architect for College in Moradabad - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Architect for College Moradabad | MTBOSS",
    description:
      "Need an architect for college building construction in Moradabad? MTBOSS offers design, build and material supply together. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-college-moradabad.jpg"],
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
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/architect-for-college-moradabad",
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
        name: "Moradabad",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    priceRange: "₹₹",
    serviceType: [
      "College Building Construction",
      "Educational Institute Design",
      "College Campus Planning",
      "School and College Construction",
      "Construction Material Supply",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Architect for College Building Construction in Moradabad",
    description:
      "MTBOSS provides architectural design coordination, college campus planning, civil construction and material supply for college and educational building projects in Moradabad.",
    provider: {
      "@type": "GeneralContractor",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.mtboss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Moradabad",
    },
    serviceType: "College and Educational Building Architectural and Construction Services",
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