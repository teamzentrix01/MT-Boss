// app/(moradabad_keywords)/school-construction-cost-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "School Construction Cost in Moradabad | MTBOSS",
  description:
    "Planning a school in Moradabad? Understand construction cost factors and get a civil construction estimate from MTBOSS. Call +91 94584 10866.",
  keywords:
    "school construction cost Moradabad, school building cost per sq ft Moradabad, CBSE school construction cost India, playschool construction cost Moradabad, school construction budget Moradabad, MTBOSS Moradabad, school building materials cost Moradabad, MTBOSS budget calculator, school infrastructure cost Moradabad, MTBOSS Kanth Road, school construction quote Moradabad, school building investment Moradabad, MTBOSS school construction, education building cost UP, school civil construction rate",
  alternates: {
    canonical: "https://www.mtboss.in/school-construction-cost-in-moradabad",
  },
  openGraph: {
    title: "School Construction Cost in Moradabad | MTBOSS",
    description:
      "Planning a school in Moradabad? Understand construction cost factors and get a civil construction estimate from MTBOSS. Call +91 94584 10866.",
    url: "https://www.mtboss.in/school-construction-cost-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-school-cost-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "School Construction Cost in Moradabad - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "School Construction Cost in Moradabad | MTBOSS",
    description:
      "Planning a school in Moradabad? Understand construction cost factors and get a civil construction estimate from MTBOSS. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-school-cost-moradabad.jpg"],
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
    url: "https://www.mtboss.in/school-construction-cost-in-moradabad",
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
      "School Construction Cost Estimation",
      "School Building Construction",
      "CBSE School Construction",
      "Playschool Construction",
      "Educational Building Construction",
      "Construction Material Supply",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "School Construction Cost in Moradabad",
    description:
      "MTBOSS provides civil construction cost estimation, structural build and wholesale material supply for school, playschool, CBSE school and educational building projects in Moradabad.",
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
    serviceType: "School Construction Cost Estimation and Civil Construction Services",
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