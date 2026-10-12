// app/(moradabad_keywords)/nursing-home-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Nursing Home Construction in Moradabad | MTBOSS",

  description:
    "Planning nursing home construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "nursing home construction Moradabad, nursing home building construction Moradabad, nursing home contractor Moradabad, nursing home design Moradabad, small hospital construction Moradabad, healthcare building construction Moradabad, maternity home construction Moradabad, nursing home construction cost Moradabad, nursing home builder Moradabad, commercial construction company Moradabad, construction company in Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/nursing-home-construction-in-moradabad",
  },

  openGraph: {
    title: "Nursing Home Construction in Moradabad | MTBOSS",

    description:
      "Planning nursing home construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/nursing-home-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-nursing-home-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Nursing Home Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Nursing Home Construction in Moradabad | MTBOSS",

    description:
      "Planning nursing home construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-nursing-home-construction-moradabad.jpg",
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
    url: "https://www.mtboss.in/nursing-home-construction-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-nursing-home-construction-moradabad.jpg",
    priceRange: "₹₹",
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
        name: "Moradabad",
      },
      {
        "@type": "City",
        name: "Bareilly",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    serviceType: [
      "Nursing Home Construction",
      "Nursing Home Building Construction",
      "Nursing Home Contractor",
      "Nursing Home Design",
      "Small Hospital Construction",
      "Healthcare Building Construction",
      "Maternity Home Construction",
      "Nursing Home Construction Cost Estimation",
      "Nursing Home Builder",
      "Commercial Construction",
      "Building Renovation",
      "Building Extension",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Nursing Home Construction Services in Moradabad",
    description:
      "MTBOSS provides nursing home construction in Moradabad for small private hospitals, maternity homes, speciality nursing homes and elder care homes, including design coordination, structure, lift and ramp provisions, facade, services provisions, specialist room provisions for OT, ICU and labour room, washroom planning, waterproofing, flooring, finishing, interiors, outdoor works and final handover.",
    url: "https://www.mtboss.in/nursing-home-construction-in-moradabad",
    provider: {
      "@type": "GeneralContractor",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "mtboss2016@gmail.com",
      url: "https://www.mtboss.in",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Moradabad",
      },
      {
        "@type": "City",
        name: "Bareilly",
      },
    ],
    serviceType:
      "Nursing Home Construction, Nursing Home Building Construction, Nursing Home Contractor, Nursing Home Design, Small Hospital Construction, Healthcare Building Construction, Maternity Home Construction and Nursing Home Builder",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is nursing home construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nursing home construction is the planning and building of a small healthcare facility with inpatient beds, which may include OPD, wards, operation theatre, ICU and labour room, from design to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS build nursing homes in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS builds residential projects, from affordable housing to luxury villas, in Moradabad and Bareilly, and offers construction services for other buildings. Share your plan with the team to confirm the scope for your nursing home.",
        },
      },
      {
        "@type": "Question",
        name: "Can you plan the operation theatre and ICU?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The team plans the civil, structural and services provisions for these areas in coordination with your doctors, equipment suppliers and specialist vendors. Share your equipment and layout needs early so they can be built into the design.",
        },
      },
      {
        "@type": "Question",
        name: "Can an existing building be converted into a nursing home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In many cases, yes, subject to the building's structure, permitted use and local rules. A site visit helps the team assess what is possible.",
        },
      },
      {
        "@type": "Question",
        name: "What approvals does a nursing home need?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Beyond the building map, nursing homes usually need fire-safety clearance, healthcare registrations, biomedical waste arrangements and, for certain equipment, extra permissions. Confirm the requirements with the relevant authorities and your professional council.",
        },
      },
      {
        "@type": "Question",
        name: "How much does nursing home construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nursing home construction cost depends on built-up area, number of beds and departments, specialist rooms, services scope, material and finish level and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the MTBOSS office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The MTBOSS office is located at Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.mtboss.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Construction Services",
        item: "https://www.mtboss.in/construction-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Nursing Home Construction in Moradabad",
        item: "https://www.mtboss.in/nursing-home-construction-in-moradabad",
      },
    ],
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
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