// app/(moradabad_keywords)/bank-building-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Bank Building Construction in Moradabad | MTBOSS",

  description:
    "Planning bank building construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "bank building construction Moradabad, bank branch construction Moradabad, bank building contractor Moradabad, bank building design Moradabad, commercial building construction Moradabad, bank branch interior Moradabad, ATM and bank building Moradabad, strong room construction provision Moradabad, bank building construction cost Moradabad, commercial construction company Moradabad, construction company in Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/bank-building-construction-in-moradabad",
  },

  openGraph: {
    title: "Bank Building Construction in Moradabad | MTBOSS",

    description:
      "Planning bank building construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/bank-building-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-bank-building-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Bank Building Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Bank Building Construction in Moradabad | MTBOSS",

    description:
      "Planning bank building construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-bank-building-construction-moradabad.jpg",
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
    url: "https://www.mtboss.in/bank-building-construction-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-bank-building-construction-moradabad.jpg",
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
      "Bank Building Construction",
      "Bank Branch Construction",
      "Bank Building Contractor",
      "Bank Building Design",
      "Commercial Building Construction",
      "Bank Branch Interior",
      "ATM and Bank Building",
      "Strong Room Construction Provision",
      "Bank Building Construction Cost Estimation",
      "Commercial Construction",
      "Building Renovation",
      "Building Extension",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bank Building Construction Services in Moradabad",
    description:
      "MTBOSS provides bank building construction in Moradabad for new branches, leased bank buildings and ATM units, including design coordination, structure, strong room and vault provisions, facade, services provisions, security-related provisions, waterproofing, flooring, finishing, interiors, parking, outdoor works and final handover.",
    url: "https://www.mtboss.in/bank-building-construction-in-moradabad",
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
      "Bank Building Construction, Bank Branch Construction, Commercial Building Construction, Bank Building Design, ATM and Bank Building and Strong Room Construction Provision",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is bank building construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bank building construction is the planning and building of a branch or bank office building, including its structure, security provisions, services and finishing, from design to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS build bank buildings in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS builds residential projects, from affordable housing to luxury villas, in Moradabad and Bareilly, and offers construction services for other buildings. Share your plan with the team to confirm the scope for your bank building.",
        },
      },
      {
        "@type": "Question",
        name: "Can you build to a bank's own specifications?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, as long as the specifications are shared early. The team reviews layout, security and finish requirements at the planning stage so they can be built into the design and estimate.",
        },
      },
      {
        "@type": "Question",
        name: "Who provides the strong room or vault?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Strong rooms and vaults are usually supplied and installed by specialist vendors as per the bank's requirements. MTBOSS plans the civil and structural provisions for these areas in coordination with the bank and the vendor.",
        },
      },
      {
        "@type": "Question",
        name: "Can I build a building and lease it to a bank?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, many owners do. Get the bank's requirements and timeline before design begins, so the building matches what the bank needs.",
        },
      },
      {
        "@type": "Question",
        name: "How much does bank building construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bank building construction cost depends on built-up area, floors, the bank's specifications, strong room provisions, material and finish level, services scope and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
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
        name: "Bank Building Construction in Moradabad",
        item: "https://www.mtboss.in/bank-building-construction-in-moradabad",
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