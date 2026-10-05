// app/(moradabad_keywords)/hospital-construction-cost-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Hospital Construction Cost in Moradabad | MTBOSS",
  description:
    "Planning a hospital in Moradabad? Understand construction cost factors and get a civil construction estimate from MTBOSS. Call +91 94584 10866.",
  keywords:
    "hospital construction cost Moradabad, hospital building cost per sq ft Moradabad, nursing home construction cost Moradabad, clinic construction cost Moradabad, hospital project cost India, MTBOSS Moradabad, hospital construction budget Moradabad, MTBOSS budget calculator, healthcare building cost Moradabad, MTBOSS Kanth Road, 20 bed hospital cost India, hospital civil construction cost, hospital construction quote Moradabad, MTBOSS construction materials, small hospital investment Moradabad",
  alternates: {
    canonical: "https://www.mtboss.in/hospital-construction-cost-in-moradabad",
  },
  openGraph: {
    title: "Hospital Construction Cost in Moradabad | MTBOSS",
    description:
      "Planning a hospital in Moradabad? Understand construction cost factors and get a civil construction estimate from MTBOSS. Call +91 94584 10866.",
    url: "https://www.mtboss.in/hospital-construction-cost-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-hospital-cost-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Hospital Construction Cost in Moradabad - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hospital Construction Cost in Moradabad | MTBOSS",
    description:
      "Planning a hospital in Moradabad? Understand construction cost factors and get a civil construction estimate from MTBOSS. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-hospital-cost-moradabad.jpg"],
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
    url: "https://www.mtboss.in/hospital-construction-cost-in-moradabad",
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
      "Hospital Construction Cost Estimation",
      "Nursing Home Construction",
      "Clinic Construction",
      "Healthcare Building Construction",
      "Construction Material Supply",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hospital Construction Cost in Moradabad",
    description:
      "MTBOSS provides civil construction cost estimation, structural build and wholesale material supply for hospital, nursing home, clinic and healthcare facility projects in Moradabad.",
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
    serviceType: "Hospital Construction Cost Estimation and Civil Construction Services",
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