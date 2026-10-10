// app/(moradabad_keywords)/warehouse-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Warehouse Construction in Moradabad | MTBOSS",

  description:
    "Planning warehouse construction in Moradabad? MTBOSS builds godowns and storage facilities with clear scope. Call +91 94584 10866 for a quote.",

  keywords:
    "warehouse construction Moradabad, warehouse construction company Moradabad, godown construction Moradabad, warehouse builder Moradabad, storage facility construction Moradabad, warehouse contractor Moradabad, warehouse construction cost Moradabad, warehouse design Moradabad, distribution warehouse construction, warehouse shed construction Moradabad, industrial construction company Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/warehouse-construction-in-moradabad",
  },

  openGraph: {
    title: "Warehouse Construction in Moradabad | MTBOSS",

    description:
      "Planning warehouse construction in Moradabad? MTBOSS builds godowns and storage facilities with clear scope. Call +91 94584 10866 for a quote.",

    url: "https://www.mtboss.in/warehouse-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-warehouse-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Warehouse Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Warehouse Construction in Moradabad | MTBOSS",

    description:
      "Planning warehouse construction in Moradabad? MTBOSS builds godowns and storage facilities with clear scope. Call +91 94584 10866 for a quote.",

    images: [
      "https://www.mtboss.in/og-warehouse-construction-moradabad.jpg",
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
    url: "https://www.mtboss.in/warehouse-construction-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-warehouse-construction-moradabad.jpg",
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
      "Warehouse Construction",
      "Warehouse Construction Company",
      "Godown Construction",
      "Warehouse Builder",
      "Storage Facility Construction",
      "Warehouse Contractor",
      "Warehouse Design",
      "Distribution Warehouse Construction",
      "Warehouse Shed Construction",
      "Industrial Flooring",
      "Industrial Roofing",
      "Warehouse Extension",
      "Warehouse Renovation",
      "Construction Material Supply",
      "Warehouse Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Warehouse Construction Services in Moradabad",
    description:
      "MTBOSS provides warehouse construction in Moradabad for godowns, distribution centres and storage facilities, including site development, foundations, structural framing, roofing, warehouse flooring, loading areas, drainage, offices, amenities, external works, material supply and final handover.",
    url: "https://www.mtboss.in/warehouse-construction-in-moradabad",
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
      "Warehouse Construction, Godown Construction, Storage Facility Construction, Distribution Warehouse Construction and Warehouse Shed Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is warehouse construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Warehouse construction is the planning and building of storage buildings for receiving, storing and dispatching goods. It can include site development, foundations, structure, roof, flooring, loading areas, drainage, offices and handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer warehouse construction in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Industrial and warehousing construction is part of the MTBOSS service list, alongside commercial, hotel, school, college, mall and residential construction projects in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between a warehouse and a godown?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In everyday use the terms overlap. A godown usually means a simple storage building, while a warehouse often suggests a larger, more organised facility with loading areas, handling systems and dispatch provisions.",
        },
      },
      {
        "@type": "Question",
        name: "How high should a warehouse be?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Clear height depends on stacking or racking plans and the handling equipment you will use. Share your stacking height and racking layout with MTBOSS to decide the right clear height for your warehouse.",
        },
      },
      {
        "@type": "Question",
        name: "How can I protect stock from moisture and heat?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Good drainage, well-finished floors and walls, a suitable roof, proper ventilation and careful detailing around openings all help protect stock. Discuss your goods and storage conditions during the design stage.",
        },
      },
      {
        "@type": "Question",
        name: "How much does warehouse construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Warehouse construction cost depends on covered area, clear height, span, floor specification, roof and wall system, loading provisions, ventilation, lighting, fire provisions, office areas, external development and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply building materials?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS supplies cement, TMT steel bars, bricks, tiles and paints through its wholesale material supply network, helping coordinate key materials during warehouse construction.",
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
        name: "Warehouse Construction in Moradabad",
        item: "https://www.mtboss.in/warehouse-construction-in-moradabad",
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