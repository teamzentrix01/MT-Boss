// app/(moradabad_keywords)/commercial-construction-cost-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Commercial Construction Cost in Moradabad | MTBOSS",

  description:
    "Planning a commercial building? Understand commercial construction cost in Moradabad and get a free estimate from MTBOSS. Call +91 94584 10866.",

  keywords:
    "commercial construction cost Moradabad, commercial building cost Moradabad, cost of building a shop Moradabad, showroom construction cost Moradabad, office building construction cost Moradabad, commercial complex construction cost Moradabad, warehouse construction cost Moradabad, commercial construction budget Moradabad, commercial construction estimate Moradabad, commercial construction cost per sq ft Moradabad, commercial construction company Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/commercial-construction-cost-in-moradabad",
  },

  openGraph: {
    title: "Commercial Construction Cost in Moradabad | MTBOSS",

    description:
      "Planning a commercial building? Understand commercial construction cost in Moradabad and get a free estimate from MTBOSS. Call +91 94584 10866.",

    url: "https://www.mtboss.in/commercial-construction-cost-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-commercial-construction-cost-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Commercial Construction Cost in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Commercial Construction Cost in Moradabad | MTBOSS",

    description:
      "Planning a commercial building? Understand commercial construction cost in Moradabad and get a free estimate from MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-commercial-construction-cost-moradabad.jpg",
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

    url:
      "https://www.mtboss.in/commercial-construction-cost-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image:
      "https://www.mtboss.in/og-commercial-construction-cost-moradabad.jpg",

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
        "@type": "AdministrativeArea",
        name: "Moradabad District",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],

    serviceType: [
      "Commercial Construction Cost Estimation",
      "Commercial Building Cost Estimate",
      "Commercial Construction Budget Planning",
      "Commercial Construction Quote",
      "Commercial Construction Cost Per Square Foot",
      "Shop Construction Cost Estimate",
      "Showroom Construction Cost Estimate",
      "Office Building Cost Estimate",
      "Commercial Complex Cost Estimate",
      "Warehouse Construction Cost Estimate",
      "Commercial Construction Services",
      "Construction Material Supply",
      "Commercial Renovation Cost Estimate",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Commercial Construction Cost Estimate in Moradabad",

    description:
      "MTBOSS provides commercial construction cost estimation in Moradabad for shops, showrooms, offices, commercial complexes, schools, hotels, warehouses and industrial buildings based on built-up area, floors, structural requirements, material quality, finishing and site conditions.",

    url:
      "https://www.mtboss.in/commercial-construction-cost-in-moradabad",

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
      "Commercial Construction Cost Estimation, Commercial Building Budget Planning, Shop Construction Cost Estimate, Office Building Cost Estimate and Warehouse Construction Quote Services",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "How much does commercial construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Commercial construction cost depends on built-up area, number of floors, building type, structural requirements, electrical and plumbing scope, finishing level, facade, glazing, material quality and site conditions. MTBOSS provides a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "What is the biggest factor in commercial construction cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The total built-up area is generally the largest cost factor. Other major factors include the number of floors, building type, structural needs, services, facade requirements and finishing level.",
        },
      },
      {
        "@type": "Question",
        name: "Is interior fit-out included in commercial construction cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Furniture, counters, partitions, shelving, branding, specialised lighting and other fit-out items are often budgeted separately from the core construction quotation. Confirm all inclusions and exclusions before signing an agreement.",
        },
      },
      {
        "@type": "Question",
        name: "How can I reduce commercial construction cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can control commercial construction cost by finalising design early, using repeated layouts, aligning plumbing and service shafts, choosing durable materials, planning development in phases where suitable and avoiding shortcuts on structure and waterproofing.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer commercial construction in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Commercial construction is part of the MTBOSS service list, alongside hotel, school, college, mall, industrial, infrastructure and residential construction projects in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "What hidden costs should I plan for in a commercial project?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Commonly missed costs can include approvals, business licences, utility connections, electrical load enhancement, power backup, fire safety equipment, signage, fit-out, furniture, external development and contingency for design changes or price movement.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply building materials?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS supplies cement, TMT steel bars, bricks, tiles and paints through its material supply network, helping coordinate material availability during commercial construction.",
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
        name: "Commercial Construction Cost in Moradabad",
        item: "https://www.mtboss.in/commercial-construction-cost-in-moradabad",
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