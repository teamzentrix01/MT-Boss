// app/(moradabad_keywords)/cold-storage-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Cold Storage Construction in Moradabad | MTBOSS",

  description:
    "Planning cold storage construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "cold storage construction Moradabad, cold storage builder Moradabad, cold storage contractor Moradabad, cold storage building design Moradabad, cold room construction Moradabad, potato cold storage construction Moradabad, agri cold storage Moradabad, warehouse construction Moradabad, cold storage construction cost Moradabad, industrial construction company Moradabad, construction company in Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/cold-storage-construction-in-moradabad",
  },

  openGraph: {
    title: "Cold Storage Construction in Moradabad | MTBOSS",

    description:
      "Planning cold storage construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/cold-storage-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-cold-storage-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Cold Storage Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Cold Storage Construction in Moradabad | MTBOSS",

    description:
      "Planning cold storage construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-cold-storage-construction-moradabad.jpg",
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
    url: "https://www.mtboss.in/cold-storage-construction-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-cold-storage-construction-moradabad.jpg",
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
      "Cold Storage Construction",
      "Cold Storage Builder",
      "Cold Storage Contractor",
      "Cold Storage Building Design",
      "Cold Room Construction",
      "Potato Cold Storage Construction",
      "Agri Cold Storage",
      "Warehouse Construction",
      "Cold Storage Construction Cost Estimation",
      "Industrial Construction",
      "Building Renovation",
      "Building Extension",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Cold Storage Construction Services in Moradabad",
    description:
      "MTBOSS provides cold storage construction in Moradabad for bulk cold storage, cold rooms, frozen storage, pharma cold chain and warehouses with cold sections, including design coordination, structure, floor planning, chamber construction, loading dock, plant room, services provisions, power backup provisions, waterproofing, flooring, finishing, office areas, outdoor works and final handover.",
    url: "https://www.mtboss.in/cold-storage-construction-in-moradabad",
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
      "Cold Storage Construction, Cold Storage Builder, Cold Storage Contractor, Cold Storage Building Design, Cold Room Construction, Potato Cold Storage Construction, Agri Cold Storage and Warehouse Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is cold storage construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cold storage construction is the planning and building of an insulated facility that keeps products at controlled low temperatures, including the structure, floors, loading area, plant room, services and finishing, from design to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS build cold storage in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS builds residential projects, from affordable housing to luxury villas, in Moradabad and Bareilly, and offers construction services for other buildings. Share your plan with the team to confirm the scope for your cold storage.",
        },
      },
      {
        "@type": "Question",
        name: "Do you supply the refrigeration plant and insulation panels?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "These are usually supplied and installed by specialist vendors. MTBOSS plans and builds the civil and structural work, and coordinates with your vendors so provisions fit together.",
        },
      },
      {
        "@type": "Question",
        name: "Can a cold storage be built in phases?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can start with the core chambers, plant room and loading area, then add chambers later, as long as the site layout, power and services are planned for the full capacity from the start.",
        },
      },
      {
        "@type": "Question",
        name: "Are there government schemes for cold storage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Various schemes may exist for cold storage and cold chain projects, each with its own eligibility and technical conditions. Confirm current details with the relevant authorities and your consultants before planning your budget.",
        },
      },
      {
        "@type": "Question",
        name: "How much does cold storage construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cold storage construction cost depends on built-up area, capacity, number of chambers, structural system, insulation and refrigeration, floor requirements, power provisions and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
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
        name: "Cold Storage Construction in Moradabad",
        item: "https://www.mtboss.in/cold-storage-construction-in-moradabad",
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