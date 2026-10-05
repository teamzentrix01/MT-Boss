// app/(moradabad_keywords)/hospital-building-contractor-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Hospital Building Contractor in Moradabad | MTBOSS",
  description:
    "Need a hospital building contractor in Moradabad for clinics or nursing homes? MTBOSS handles civil execution and materials. Call +91 94584 10866.",
  keywords:
    "hospital building contractor Moradabad, nursing home construction contractor Moradabad, clinic building contractor Moradabad, small hospital contractor Moradabad, diagnostic center construction Moradabad, healthcare contractor Moradabad, MTBOSS Moradabad, hospital contractor cost Moradabad, MTBOSS budget calculator, nursing home building materials Moradabad, MTBOSS Kanth Road, polyclinic construction Moradabad, hospital contractor quote Moradabad, MTBOSS civil contractor, healthcare building execution Moradabad",
  alternates: {
    canonical: "https://www.mtboss.in/hospital-building-contractor-in-moradabad",
  },
  openGraph: {
    title: "Hospital Building Contractor in Moradabad | MTBOSS",
    description:
      "Need a hospital building contractor in Moradabad for clinics or nursing homes? MTBOSS handles civil execution and materials. Call +91 94584 10866.",
    url: "https://www.mtboss.in/hospital-building-contractor-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-hospital-contractor-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Hospital Building Contractor in Moradabad - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hospital Building Contractor in Moradabad | MTBOSS",
    description:
      "Need a hospital building contractor in Moradabad for clinics or nursing homes? MTBOSS handles civil execution and materials. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-hospital-contractor-moradabad.jpg",
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
    "@type": "GeneralContractor",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/hospital-building-contractor-in-moradabad",
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
      "Hospital Building Contractor",
      "Nursing Home Construction",
      "Clinic Building Construction",
      "Small Hospital Construction",
      "Diagnostic Center Construction",
      "Polyclinic Construction",
      "Construction Material Supply",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hospital Building Contractor in Moradabad",
    description:
      "MTBOSS provides civil execution, structural build and wholesale material supply for nursing homes, clinics, polyclinics, diagnostic centers and smaller healthcare facility projects in Moradabad.",
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
    serviceType: "Hospital and Healthcare Building Contractor Services",
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