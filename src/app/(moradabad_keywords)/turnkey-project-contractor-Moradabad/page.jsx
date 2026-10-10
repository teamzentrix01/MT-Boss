// app/(moradabad_keywords)/turnkey-project-contractor-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Turnkey Project Contractor in Moradabad | MTBOSS",

  description:
    "Hire a trusted turnkey project contractor in Moradabad. MTBOSS handles design, construction, materials and handover.",

  keywords:
    "turnkey project contractor Moradabad, turnkey contractor Moradabad, turnkey building contractor Moradabad, turnkey project Moradabad, building contractor Moradabad, civil contractor Moradabad, construction contractor Moradabad, residential contractor Moradabad, commercial contractor Moradabad, design and build contractor Moradabad, contractor near me Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad, construction cost Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/turnkey-project-contractor-in-moradabad",
  },

  openGraph: {
    title: "Turnkey Project Contractor in Moradabad | MTBOSS",

    description:
      "Hire a trusted turnkey project contractor in Moradabad. MTBOSS handles design, construction, materials and handover.",

    url: "https://www.mtboss.in/turnkey-project-contractor-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-turnkey-project-contractor-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Turnkey Project Contractor in Moradabad - MTBOSS Construction",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Turnkey Project Contractor in Moradabad | MTBOSS",

    description:
      "Hire a trusted turnkey project contractor in Moradabad. MTBOSS handles design, construction, materials and handover.",

    images: [
      "https://www.mtboss.in/og-turnkey-project-contractor-moradabad.jpg",
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

    url: "https://www.mtboss.in/turnkey-project-contractor-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image:
      "https://www.mtboss.in/og-turnkey-project-contractor-moradabad.jpg",

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
      "Turnkey Project Contractor",
      "Turnkey Construction Contractor",
      "Turnkey Building Contractor",
      "Design and Build Contractor",
      "Civil Construction Contractor",
      "Residential Construction Contractor",
      "Commercial Construction Contractor",
      "Independent House Construction",
      "Duplex House Construction",
      "Villa Construction",
      "Hotel Construction",
      "Industrial Construction",
      "Warehouse Construction",
      "Architecture and Design Coordination",
      "Interior Design Services",
      "Construction Material Supply",
      "Construction Cost Estimation",
      "Building Renovation and Repair",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Turnkey Project Contractor Services in Moradabad",

    description:
      "MTBOSS is a turnkey project contractor in Moradabad providing design coordination, civil construction, building material supply, electrical work, plumbing, waterproofing, flooring, finishing, interiors and final handover for residential, commercial, hospitality and industrial projects.",

    url: "https://www.mtboss.in/turnkey-project-contractor-in-moradabad",

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
      "Turnkey Project Contractor, Turnkey Building Construction, Design and Build Contractor, Residential and Commercial Construction Services",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What is a turnkey project contractor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A turnkey project contractor manages the complete project, including design coordination, materials, civil construction, electrical work, plumbing, finishing and handover. The client receives a finished, ready-to-use building.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS work as a turnkey project contractor in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS combines design coordination, civil construction, material supply, finishing and handover under one company for projects in Moradabad and Bareilly.",
        },
      },
      {
        "@type": "Question",
        name: "How is a turnkey contractor different from a regular contractor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A regular contractor often handles only one part of the project, such as civil work. A turnkey contractor is responsible for the complete project and coordinates design, materials, construction, services, finishing and handover.",
        },
      },
      {
        "@type": "Question",
        name: "What types of projects can MTBOSS handle?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS handles independent houses, duplexes, villas, commercial buildings, shops, offices, showrooms, hotels, hospitality projects, industrial buildings, warehouse projects, godowns and renovation work.",
        },
      },
      {
        "@type": "Question",
        name: "What should I check before hiring a turnkey project contractor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Check completed projects, written scope of work, material specifications, payment stages, project timeline, quality checks, communication process and how design or scope changes will be handled.",
        },
      },
      {
        "@type": "Question",
        name: "How much does a turnkey project cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Turnkey project cost depends on built-up area, building type, number of floors, material quality, design complexity, interior scope, finishing level and site conditions. MTBOSS offers a free Budget Calculator and detailed construction quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get a free construction quote from MTBOSS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can use the Get a Construction Quote option on the MTBOSS website or contact the MTBOSS team directly by phone or WhatsApp.",
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
        name: "Turnkey Project Contractor in Moradabad",
        item: "https://www.mtboss.in/turnkey-project-contractor-in-moradabad",
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