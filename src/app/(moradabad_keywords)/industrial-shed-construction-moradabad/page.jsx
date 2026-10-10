// app/(moradabad_keywords)/industrial-shed-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Industrial Shed Construction in Moradabad | MTBOSS",

  description:
    "Planning industrial shed construction in Moradabad? MTBOSS offers clear scope, quality materials and on-time delivery. Call +91 94584 10866.",

  keywords:
    "industrial shed construction Moradabad, industrial shed builder Moradabad, factory shed construction Moradabad, warehouse shed construction Moradabad, shed contractor Moradabad, industrial shed cost Moradabad, industrial shed design Moradabad, roofing shed construction Moradabad, godown shed construction Moradabad, workshop shed construction Moradabad, industrial construction company Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/industrial-shed-construction-in-moradabad",
  },

  openGraph: {
    title: "Industrial Shed Construction in Moradabad | MTBOSS",

    description:
      "Planning industrial shed construction in Moradabad? MTBOSS offers clear scope, quality materials and on-time delivery. Call +91 94584 10866.",

    url: "https://www.mtboss.in/industrial-shed-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-industrial-shed-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Industrial Shed Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Industrial Shed Construction in Moradabad | MTBOSS",

    description:
      "Planning industrial shed construction in Moradabad? MTBOSS offers clear scope, quality materials and on-time delivery. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-industrial-shed-construction-moradabad.jpg",
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
    url: "https://www.mtboss.in/industrial-shed-construction-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-industrial-shed-construction-moradabad.jpg",
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
      "Industrial Shed Construction",
      "Industrial Shed Builder",
      "Factory Shed Construction",
      "Warehouse Shed Construction",
      "Godown Shed Construction",
      "Workshop Shed Construction",
      "Industrial Shed Contractor",
      "Industrial Shed Design",
      "Industrial Roofing",
      "Industrial Flooring",
      "Industrial Shed Extension",
      "Industrial Shed Repair",
      "Construction Material Supply",
      "Industrial Shed Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Industrial Shed Construction Services in Moradabad",
    description:
      "MTBOSS provides industrial shed construction in Moradabad for factories, workshops, warehouses and godowns, including site preparation, foundations, structural framing, roofing, flooring, ventilation, drainage, external works, material supply and final handover.",
    url: "https://www.mtboss.in/industrial-shed-construction-in-moradabad",
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
      "Industrial Shed Construction, Factory Shed Construction, Warehouse Shed Construction, Godown Shed Construction and Workshop Shed Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is industrial shed construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Industrial shed construction is the planning and building of large covered structures for manufacturing, workshops, storage and warehousing. It can include site development, foundations, structural framing, roofing, flooring, drainage, ventilation and handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer industrial shed construction in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Industrial and warehousing construction is part of the MTBOSS service list, alongside commercial, hotel, school, college, mall and residential construction projects in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "What size of industrial shed can be built?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Industrial shed size depends on plot dimensions, intended use, required span, clear height, machinery, storage needs, vehicle movement and budget. Share your length, width and height requirements with MTBOSS to discuss project scope.",
        },
      },
      {
        "@type": "Question",
        name: "How can I keep an industrial shed cool in summer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Adequate shed height, roof ventilation, ridge vents, side openings, planned daylight, appropriate roofing material and airflow planning can help reduce heat build-up. Discuss these requirements during the design stage.",
        },
      },
      {
        "@type": "Question",
        name: "Why do industrial shed roofs leak?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Common causes of roof leakage include poor joints, weak fastening, insufficient slope, damaged sheets, poor detailing around openings and blocked gutters. Roofing installation quality matters as much as material selection.",
        },
      },
      {
        "@type": "Question",
        name: "Can an industrial shed be extended later?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, expansion can be easier when planned from the beginning. Share future expansion plans so the layout, structure, open side and external development can allow additional bays where feasible.",
        },
      },
      {
        "@type": "Question",
        name: "How much does industrial shed construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Industrial shed cost depends on covered area, span, height, structural system, roofing, wall enclosure, flooring, drainage, ventilation, office areas, external works, material quality and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply building materials?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS supplies cement, TMT steel bars, bricks, tiles and paints through its wholesale material supply network, helping coordinate key materials during industrial shed construction.",
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
        name: "Industrial Shed Construction in Moradabad",
        item: "https://www.mtboss.in/industrial-shed-construction-in-moradabad",
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