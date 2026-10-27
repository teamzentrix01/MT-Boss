// app/(bareilly_keywords)/interior-design-consultant-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Design Consultant Bareilly | MTBOSS",

  description:
    "Looking for an interior design consultant Bareilly? Get expert planning, budget and material advice from MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior design consultant Bareilly, interior consultant Bareilly, home interior consultation Bareilly, interior design advice Bareilly, interior planning Bareilly, interior quote review Bareilly, interior design consultation Bareilly, space planning consultant Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, interior consultant quote Bareilly",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/interior-design-consultant-in-bareilly",
  },

  openGraph: {
    title: "Interior Design Consultant Bareilly | MTBOSS",

    description:
      "Looking for an interior design consultant Bareilly? Get expert planning, budget and material advice from MTBOSS. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/interior-design-consultant-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-design-consultant-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Design Consultant in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Design Consultant Bareilly | MTBOSS",

    description:
      "Looking for an interior design consultant Bareilly? Get expert planning, budget and material advice from MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-interior-design-consultant-bareilly.jpg",
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
    "@type": "InteriorDesignService",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.MTBOSS.in/interior-design-consultant-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.MTBOSS.in/og-interior-design-consultant-bareilly.jpg",
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
        name: "Bareilly",
      },
      {
        "@type": "City",
        name: "Moradabad",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    serviceType: [
      "Interior Design Consultant",
      "Interior Consultant",
      "Home Interior Consultation",
      "Interior Design Advice",
      "Interior Planning",
      "Interior Quote Review",
      "Interior Design Consultation",
      "Space Planning Consultant",
      "Home Interior Design",
      "Interior Consultant Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Design Consultation and Planning Services in Bareilly",
    description:
      "MTBOSS provides interior design consultation and planning services in Bareilly. Services include requirement discussion, site visit and measurement, space planning advice, budget guidance, material and finish advice, design concepts and 3D views, quotation review, priority and phase planning, services planning, execution support, renovation planning, handover and after-handover support.",
    url: "https://www.MTBOSS.in/interior-design-consultant-in-bareilly",
    provider: {
      "@type": "InteriorDesignService",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "MTBOSS2016@gmail.com",
      url: "https://www.MTBOSS.in",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Bareilly",
      },
      {
        "@type": "City",
        name: "Moradabad",
      },
    ],
    serviceType:
      "Interior Design Consultant, Interior Consultant, Home Interior Consultation, Interior Design Advice, Interior Planning, Interior Quote Review, Interior Design Consultation, Space Planning Consultant and Interior Consultant Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior design consultant do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An interior design consultant listens to your needs, reviews your home, advises on layouts, budget, materials and priorities, helps you compare options and quotes and guides you on the next steps.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between an interior consultant and an interior designer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A consultant mainly gives advice and decision support, while a designer creates and details the design. Many professionals, including MTBOSS, offer both, along with execution.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide interior design consultation in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the consultation options, scope and terms for your home.",
        },
      },
      {
        "@type": "Question",
        name: "What should I prepare before the first meeting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A floor plan, photos of each room, your priorities, a budget range, reference images and a list of questions.",
        },
      },
      {
        "@type": "Question",
        name: "Will I see the design before work starts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Layouts and designs are shared and refined with your feedback before execution begins, and scope and specifications are written down before work starts.",
        },
      },
      {
        "@type": "Question",
        name: "How much does interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on home size, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting, custom furniture and civil work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS also handle execution after the consultation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, where you choose to proceed. Civil, electrical, plumbing, carpentry, ceiling, painting and finishing can be coordinated by one team.",
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
        item: "https://www.MTBOSS.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Interior Design Services",
        item: "https://www.MTBOSS.in/interior-design-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Interior Design Consultant in Bareilly",
        item: "https://www.MTBOSS.in/interior-design-consultant-in-bareilly",
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