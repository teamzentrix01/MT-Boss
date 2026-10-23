// app/(moradabad_keywords)/school-building-contractor-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "School Building Contractor in Moradabad | MTBoss",
  description:
    "Need a school building contractor in Moradabad for new blocks or renovation? MTBoss handles civil execution and materials. Call +91 94584 10866.",
  keywords:
    "school building contractor Moradabad, school renovation contractor Moradabad, school expansion construction Moradabad, playschool building contractor Moradabad, school civil contractor Moradabad, school construction execution Moradabad, MTBoss Moradabad, school contractor cost Moradabad, MTBoss budget calculator, school building materials Moradabad, MTBoss Kanth Road, school classroom block construction Moradabad, school contractor quote Moradabad, MTBoss civil contractor, education building execution Moradabad",
  alternates: {
    canonical: "https://www.MTBoss.in/school-building-contractor-in-moradabad",
  },
  openGraph: {
    title: "School Building Contractor in Moradabad | MTBoss",
    description:
      "Need a school building contractor in Moradabad for new blocks or renovation? MTBoss handles civil execution and materials. Call +91 94584 10866.",
    url: "https://www.MTBoss.in/school-building-contractor-in-moradabad",
    siteName: "MTBoss Construction Private Limited",
    images: [
      {
        url: "https://www.MTBoss.in/og-school-contractor-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "School Building Contractor in Moradabad - MTBoss Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "School Building Contractor in Moradabad | MTBoss",
    description:
      "Need a school building contractor in Moradabad for new blocks or renovation? MTBoss handles civil execution and materials. Call +91 94584 10866.",
    images: ["https://www.MTBoss.in/og-school-contractor-moradabad.jpg"],
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
    url: "https://www.MTBoss.in/school-building-contractor-in-moradabad",
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
      "School Building Contractor",
      "School Renovation",
      "School Expansion Construction",
      "Playschool Building Construction",
      "School Civil Construction",
      "Classroom Block Construction",
      "Construction Material Supply",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "School Building Contractor in Moradabad",
    description:
      "MTBoss provides civil execution, structural build and wholesale material supply for school building construction, renovation, expansion, playschool and classroom block projects in Moradabad.",
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
    serviceType: "School Building Contractor and Civil Execution Services",
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