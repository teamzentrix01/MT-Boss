// app/(moradabad_keywords)/multi-storey-building-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Multi Storey Building Construction in Moradabad | MTBOSS",

  description:
    "Planning multi storey building construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "multi storey building construction Moradabad, multi storey building contractor Moradabad, G+3 building construction Moradabad, apartment building construction Moradabad, commercial building construction Moradabad, residential building construction Moradabad, multi storey building cost Moradabad, high rise construction Moradabad, building with lift Moradabad, RCC building construction Moradabad, construction company in Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/multi-storey-building-construction-in-moradabad",
  },

  openGraph: {
    title: "Multi Storey Building Construction in Moradabad | MTBOSS",

    description:
      "Planning multi storey building construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/multi-storey-building-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-multi-storey-building-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Multi Storey Building Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Multi Storey Building Construction in Moradabad | MTBOSS",

    description:
      "Planning multi storey building construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-multi-storey-building-moradabad.jpg",
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
    url: "https://www.mtboss.in/multi-storey-building-construction-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-multi-storey-building-moradabad.jpg",
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
      "Multi Storey Building Construction",
      "Multi Storey Building Contractor",
      "G+3 Building Construction",
      "Apartment Building Construction",
      "Commercial Building Construction",
      "Residential Building Construction",
      "High Rise Construction",
      "Building with Lift",
      "RCC Building Construction",
      "Multi Storey Building Cost Estimation",
      "Building Renovation",
      "Building Extension",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Multi Storey Building Construction Services in Moradabad",
    description:
      "MTBOSS provides multi storey building construction in Moradabad for residential, commercial and mixed-use buildings, including design coordination, structure, staircase, lift provisions, facade, services provisions, waterproofing, flooring, finishing, interiors, parking, outdoor works and final handover.",
    url: "https://www.mtboss.in/multi-storey-building-construction-in-moradabad",
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
      "Multi Storey Building Construction, G+3 Building Construction, Apartment Building Construction, Commercial Building Construction, Residential Building Construction, High Rise Construction and RCC Building Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is multi storey building construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Multi storey building construction is the planning and building of a structure with several floors above ground, including its foundation, RCC frame, staircase, services and finishing, from design to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS build multi storey buildings in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS builds residential projects, from affordable housing to luxury villas, in Moradabad and Bareilly. Share your plan with the team to confirm the scope for your building.",
        },
      },
      {
        "@type": "Question",
        name: "How many floors can I build on my plot?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on your plot size, road width, local building rules and the sanctioned map. Confirm the permitted height with the relevant authorities and your consultants before finalising the design.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a lift in my building?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Buildings with more floors usually benefit from a lift, and requirements can depend on height and use. Discuss this with the team at the planning stage so the shaft and structure are designed correctly.",
        },
      },
      {
        "@type": "Question",
        name: "Can I add more floors later?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, if the foundation, columns and staircase are designed for the extra load from the start. Tell the team about this plan at the first consultation.",
        },
      },
      {
        "@type": "Question",
        name: "How much does multi storey building construction cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Multi storey building construction cost depends on built-up area, number of floors, structural requirements, lift, material and finish level, services scope and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
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
        name: "Multi Storey Building Construction in Moradabad",
        item: "https://www.mtboss.in/multi-storey-building-construction-in-moradabad",
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