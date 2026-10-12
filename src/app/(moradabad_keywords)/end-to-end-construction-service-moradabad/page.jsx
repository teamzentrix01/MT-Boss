// app/(moradabad_keywords)/end-to-end-construction-service-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "End to End Construction Service in Moradabad | MTBOSS",

  description:
    "Need end to end construction service in Moradabad? MTBOSS offers design, materials, building and handover. Call +91 94584 10866.",

  keywords:
    "end to end construction service Moradabad, turnkey construction Moradabad, turnkey house construction Moradabad, complete construction service Moradabad, design and build Moradabad, architect and builder Moradabad, construction with materials Moradabad, plot to possession construction Moradabad, construction company in Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/end-to-end-construction-service-in-moradabad",
  },

  openGraph: {
    title: "End to End Construction Service in Moradabad | MTBOSS",

    description:
      "Need end to end construction service in Moradabad? MTBOSS offers design, materials, building and handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/end-to-end-construction-service-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-end-to-end-construction-service-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "End to End Construction Service in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "End to End Construction Service in Moradabad | MTBOSS",

    description:
      "Need end to end construction service in Moradabad? MTBOSS offers design, materials, building and handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-end-to-end-construction-service-moradabad.jpg",
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
    url: "https://www.mtboss.in/end-to-end-construction-service-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-end-to-end-construction-service-moradabad.jpg",
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
      "End to End Construction Service",
      "Turnkey Construction",
      "Turnkey House Construction",
      "Complete Construction Service",
      "Design and Build",
      "Architect and Builder",
      "Construction with Materials",
      "Plot to Possession Construction",
      "Construction Company",
      "Building Renovation",
      "Building Extension",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "End to End Construction Service in Moradabad",
    description:
      "MTBOSS provides end to end construction services in Moradabad for houses, bungalows, duplex homes, farmhouses, multi storey buildings, commercial buildings, institutional buildings and specialist buildings, including plot and property guidance, design and planning, estimate and budgeting, specifications and agreement, material supply, structural construction, services and waterproofing, finishing, interiors, outdoor works, inspection and handover, and after-handover support.",
    url: "https://www.mtboss.in/end-to-end-construction-service-in-moradabad",
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
      "End to End Construction Service, Turnkey Construction, Turnkey House Construction, Complete Construction Service, Design and Build, Architect and Builder, Construction with Materials and Plot to Possession Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is an end to end construction service?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An end to end construction service is a service in which one company takes responsibility for the whole building journey, from design and planning to materials, construction, finishing and handover. It is also called turnkey construction.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer end to end construction in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS is an architect, interior designer and construction company that builds residential projects, from affordable housing to luxury villas, in Moradabad and Bareilly, and also supplies materials, property services and home services. Share your plan with the team to confirm the scope for your project.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between turnkey and regular contractor work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In a turnkey or end to end service, one team handles design, materials and construction under one agreement. In regular contractor work, you often coordinate several people and agreements yourself.",
        },
      },
      {
        "@type": "Question",
        name: "Are approvals included in the service?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS builds to the approved drawings and specifications. Approvals specific to your property are usually handled by the owner and their consultants, so confirm the details with the team.",
        },
      },
      {
        "@type": "Question",
        name: "Can I choose only some stages of the journey?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the level of service can be discussed. Share what you need at the first consultation, and the scope will be written down before work begins.",
        },
      },
      {
        "@type": "Question",
        name: "How much does end to end construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on built-up area, floors, design, material and finish level, interior scope, services scope and site conditions. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "End to End Construction Service in Moradabad",
        item: "https://www.mtboss.in/end-to-end-construction-service-in-moradabad",
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