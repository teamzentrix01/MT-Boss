// app/(moradabad_keywords)/school-construction-company-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "School Construction Company in Moradabad | MTBOSS",
  description:
    "Need a school construction company in Moradabad? MTBOSS offers design coordination, build and material supply together. Call +91 94584 10866.",
  keywords:
    "school construction company Moradabad, school building construction Moradabad, school construction contractor Moradabad, CBSE school building Moradabad, playschool construction Moradabad, coaching institute construction Moradabad, MTBOSS Moradabad, school building cost Moradabad, MTBOSS budget calculator, school construction materials Moradabad, MTBOSS Kanth Road, school infrastructure Moradabad, school construction quote Moradabad, MTBOSS institutional construction, education building contractor UP",
  alternates: {
    canonical: "https://www.mtboss.in/school-construction-company-in-moradabad",
  },
  openGraph: {
    title: "School Construction Company in Moradabad | MTBOSS",
    description:
      "Need a school construction company in Moradabad? MTBOSS offers design coordination, build and material supply together. Call +91 94584 10866.",
    url: "https://www.mtboss.in/school-construction-company-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-school-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "School Construction Company in Moradabad - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "School Construction Company in Moradabad | MTBOSS",
    description:
      "Need a school construction company in Moradabad? MTBOSS offers design coordination, build and material supply together. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-school-construction-moradabad.jpg"],
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
    url: "https://www.mtboss.in/school-construction-company-in-moradabad",
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
      "School Construction",
      "School Building Construction",
      "CBSE School Building",
      "Playschool Construction",
      "Coaching Institute Construction",
      "Educational Building Construction",
      "Construction Material Supply",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "School Construction Company in Moradabad",
    description:
      "MTBOSS provides architectural design coordination, school building planning, civil construction and material supply for school, playschool, coaching institute and educational building projects in Moradabad.",
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
    serviceType: "School and Educational Building Construction Services",
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