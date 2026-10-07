// app/(moradabad_keywords)/farmhouse-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Farmhouse Construction in Moradabad | MTBOSS",

  description:
    "Planning farmhouse construction in Moradabad? MTBOSS offers custom design, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "farmhouse construction Moradabad, farmhouse builder Moradabad, farmhouse design Moradabad, farmhouse contractor Moradabad, farmhouse construction cost Moradabad, weekend home Moradabad, farm house on agricultural land Moradabad, farmhouse boundary wall Moradabad, farmhouse with garden Moradabad, luxury farmhouse Moradabad, residential construction company Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical: "https://www.mtboss.in/farmhouse-construction-in-moradabad",
  },

  openGraph: {
    title: "Farmhouse Construction in Moradabad | MTBOSS",

    description:
      "Planning farmhouse construction in Moradabad? MTBOSS offers custom design, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/farmhouse-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-farmhouse-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Farmhouse Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Farmhouse Construction in Moradabad | MTBOSS",

    description:
      "Planning farmhouse construction in Moradabad? MTBOSS offers custom design, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-farmhouse-construction-moradabad.jpg",
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
    url: "https://www.mtboss.in/farmhouse-construction-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-farmhouse-construction-moradabad.jpg",
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
      "Farmhouse Construction",
      "Farmhouse Builder",
      "Farmhouse Design",
      "Farmhouse Contractor",
      "Weekend Home",
      "Farm House on Agricultural Land",
      "Farmhouse Boundary Wall",
      "Farmhouse with Garden",
      "Luxury Farmhouse",
      "Residential Construction",
      "Farmhouse Renovation",
      "Farmhouse Extension",
      "Construction Material Supply",
      "Farmhouse Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Farmhouse Construction Services in Moradabad",
    description:
      "MTBOSS provides farmhouse construction in Moradabad for weekend homes and permanent countryside residences, including site layout, design coordination, structure, facade, services provisions, waterproofing, flooring, finishing, modular kitchen, interiors, boundary wall, gate, outdoor works and final handover.",
    url: "https://www.mtboss.in/farmhouse-construction-in-moradabad",
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
      "Farmhouse Construction, Farmhouse Design, Weekend Home, Farm House on Agricultural Land, Farmhouse with Garden and Luxury Farmhouse",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is farmhouse construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Farmhouse construction is the planning and building of a home on larger open or agricultural land, including the house itself and related works such as boundary wall, gate, water and drainage provisions, from design to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS build farmhouses in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS builds residential projects, including independent houses and luxury villas, in Moradabad and Bareilly. Share your land details with the team to confirm the scope for your farmhouse.",
        },
      },
      {
        "@type": "Question",
        name: "Can I build a farmhouse on agricultural land?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rules depend on the land classification, location and current regulations. Confirm permitted use and any required permissions with the relevant authorities and your consultants before construction begins.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between a farmhouse and a bungalow?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A farmhouse is usually built on larger open or agricultural land with a focus on outdoor living, water, power and access, while a bungalow is a spacious home on a residential plot. Your land and lifestyle matter more than the label.",
        },
      },
      {
        "@type": "Question",
        name: "How much does farmhouse construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Farmhouse construction cost depends on built-up area, design, material and finish level, site access, utilities and outdoor development. MTBOSS offers a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Can the farmhouse be built in phases?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can complete the core house, boundary and utilities first, and add guest rooms, a gazebo or extra outdoor features later.",
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
        name: "Farmhouse Construction in Moradabad",
        item: "https://www.mtboss.in/farmhouse-construction-in-moradabad",
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