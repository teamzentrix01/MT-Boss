// app/(moradabad_keywords)/construction-project-management-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Construction Project Management in Moradabad | MTBOSS",

  description:
    "Need construction project management in Moradabad? MTBOSS offers planning, quality checks and on-time handover. Call +91 94584 10866.",

  keywords:
    "construction project management Moradabad, project management services Moradabad, construction supervision Moradabad, site supervision Moradabad, construction planning Moradabad, building project manager Moradabad, construction quality control Moradabad, construction cost control Moradabad, project management for house construction Moradabad, construction company in Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/construction-project-management-in-moradabad",
  },

  openGraph: {
    title: "Construction Project Management in Moradabad | MTBOSS",

    description:
      "Need construction project management in Moradabad? MTBOSS offers planning, quality checks and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/construction-project-management-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-construction-project-management-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Construction Project Management in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Construction Project Management in Moradabad | MTBOSS",

    description:
      "Need construction project management in Moradabad? MTBOSS offers planning, quality checks and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-construction-project-management-moradabad.jpg",
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
    url: "https://www.mtboss.in/construction-project-management-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-construction-project-management-moradabad.jpg",
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
      "Construction Project Management",
      "Project Management Services",
      "Construction Supervision",
      "Site Supervision",
      "Construction Planning",
      "Building Project Manager",
      "Construction Quality Control",
      "Construction Cost Control",
      "Project Management for House Construction",
      "Construction Company",
      "Building Renovation",
      "Building Extension",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Construction Project Management Services in Moradabad",
    description:
      "MTBOSS provides construction project management services in Moradabad for houses, bungalows, duplex homes, farmhouses, multi storey buildings, commercial buildings, institutional buildings and specialist buildings, including project planning, scheduling, budget planning and tracking, material planning, site supervision, quality control, coordination of trades, services and waterproofing coordination, progress updates, change management and final inspection and handover.",
    url: "https://www.mtboss.in/construction-project-management-in-moradabad",
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
      "Construction Project Management, Project Management Services, Construction Supervision, Site Supervision, Construction Planning, Building Project Manager, Construction Quality Control, Construction Cost Control and Project Management for House Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is construction project management?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Construction project management is the planning, coordination and control of a building project, covering time, cost, quality, materials, people and safety, from the first plan to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer construction project management in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS builds residential projects, from affordable housing to luxury villas, in Moradabad and Bareilly, with stage-wise planning, milestones and regular engineer site visits. Share your project with the team to confirm the scope and level of support you need.",
        },
      },
      {
        "@type": "Question",
        name: "Can you supervise work done by my own contractor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Discuss this with the team at the first consultation. The scope, visit frequency and reporting can be agreed in writing based on your project.",
        },
      },
      {
        "@type": "Question",
        name: "Is project management only for big projects?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Even a single house benefits from a clear plan, schedule, budget and regular quality checks, especially if you cannot visit the site often.",
        },
      },
      {
        "@type": "Question",
        name: "How do I stay informed if I live outside Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Agree on how you want updates, such as photos, calls or visits, and how often. Regular reports and site visits help you follow progress from anywhere.",
        },
      },
      {
        "@type": "Question",
        name: "How much does project management cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on the size and type of project, duration, scope of support and frequency of visits and reporting. The team will give a clear written scope and quote after discussing your project, and you can use the free Budget Calculator for construction cost planning.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the MTBOSS office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The office is located at Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh.",
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
        name: "Construction Project Management in Moradabad",
        item: "https://www.mtboss.in/construction-project-management-in-moradabad",
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