// app/(moradabad_keywords)/office-building-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Office Building Construction in Moradabad | MTBOSS",

  description:
    "Planning office building construction in Moradabad? MTBOSS offers smart design, quality build and on-time handover. Call +91 94584 10866.",

  keywords:
    "office building construction Moradabad, office construction company Moradabad, office building contractor Moradabad, commercial office construction Moradabad, office complex construction Moradabad, corporate office building Moradabad, office building design Moradabad, office building construction cost Moradabad, office space construction Moradabad, commercial construction company Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/office-building-construction-in-moradabad",
  },

  openGraph: {
    title: "Office Building Construction in Moradabad | MTBOSS",

    description:
      "Planning office building construction in Moradabad? MTBOSS offers smart design, quality build and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/office-building-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-office-building-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Office Building Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Office Building Construction in Moradabad | MTBOSS",

    description:
      "Planning office building construction in Moradabad? MTBOSS offers smart design, quality build and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-office-building-construction-moradabad.jpg",
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
    url: "https://www.mtboss.in/office-building-construction-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-office-building-construction-moradabad.jpg",
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
      "Office Building Construction",
      "Office Construction Company",
      "Office Building Contractor",
      "Commercial Office Construction",
      "Office Complex Construction",
      "Corporate Office Building",
      "Office Building Design",
      "Office Space Construction",
      "Multi-Storey Office Building",
      "Commercial Construction",
      "Office Renovation",
      "Office Extension",
      "Construction Material Supply",
      "Office Building Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Office Building Construction Services in Moradabad",
    description:
      "MTBOSS provides office building construction in Moradabad for own-use offices, rental office complexes and corporate offices, including planning, structure, facade, services provisions, waterproofing, flooring, finishing, interior coordination and final handover.",
    url: "https://www.mtboss.in/office-building-construction-in-moradabad",
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
      "Office Building Construction, Office Complex Construction, Commercial Office Construction, Corporate Office Building and Office Space Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does office building construction include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Office building construction includes planning, foundation, structure, facade, services provisions, waterproofing, flooring, finishing and handover. Work is often coordinated with interior planning for reception, cabins, meeting rooms and workstations.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer office building construction in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Commercial construction is part of the MTBOSS service list, along with hotel, school, college, mall, industrial and residential projects in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS design an office building for rental income?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS can plan flexible floor plates, adequate parking and neutral, durable finishes suited to multiple tenants. Share your rental or mixed-use plan with the team to confirm the scope.",
        },
      },
      {
        "@type": "Question",
        name: "Should I plan for a lift in an office building?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For multi-storey buildings, planning lift shafts, machine room provisions and access early is far cheaper than adding them later, even if the lift is installed in a later phase.",
        },
      },
      {
        "@type": "Question",
        name: "Can I add a floor later?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, if planned from the start. Tell the team about expansion plans so the foundation and structure can allow for additional floors where feasible.",
        },
      },
      {
        "@type": "Question",
        name: "How much does office building construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Office building cost depends on built-up area, number of floors, structural design, lift and special systems, facade and glazing, services scope, finishing level, interior and fit-out, parking, external development and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply building materials?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS supplies cement, TMT steel bars, bricks, tiles and paints through its wholesale material supply network, helping coordinate key materials during office building construction.",
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
        name: "Office Building Construction in Moradabad",
        item: "https://www.mtboss.in/office-building-construction-in-moradabad",
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