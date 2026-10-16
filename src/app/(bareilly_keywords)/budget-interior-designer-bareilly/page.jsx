// app/(bareilly_keywords)/budget-interior-designer-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Budget Interior Designer Bareilly | MTBOSS",

  description:
    "Need a budget interior designer Bareilly? MTBOSS helps you plan, estimate and control home interior costs. Call +91 94584 10866.",

  keywords:
    "budget interior designer Bareilly, interior design budget Bareilly, home interior budget planning Bareilly, interior cost estimate Bareilly, interior quotation Bareilly, 2BHK interior budget Bareilly, 3BHK interior budget Bareilly, interior budget calculator Bareilly, interior payment schedule Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, budget interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/budget-interior-designer-in-bareilly",
  },

  openGraph: {
    title: "Budget Interior Designer Bareilly | MTBOSS",

    description:
      "Need a budget interior designer Bareilly? MTBOSS helps you plan, estimate and control home interior costs. Call +91 94584 10866.",

    url: "https://www.mtboss.in/budget-interior-designer-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-budget-interior-designer-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Budget Interior Designer in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Budget Interior Designer Bareilly | MTBOSS",

    description:
      "Need a budget interior designer Bareilly? MTBOSS helps you plan, estimate and control home interior costs. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-budget-interior-designer-bareilly.jpg",
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
    url: "https://www.mtboss.in/budget-interior-designer-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-budget-interior-designer-bareilly.jpg",
    priceRange: "₹",
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
      "Budget Interior Designer",
      "Interior Design Budget",
      "Home Interior Budget Planning",
      "Interior Cost Estimate",
      "Interior Quotation",
      "2BHK Interior Budget",
      "3BHK Interior Budget",
      "Interior Budget Calculator",
      "Interior Payment Schedule",
      "Home Interior Design",
      "Budget Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Budget Interior Design Services in Bareilly",
    description:
      "MTBOSS provides budget interior design services in Bareilly. Services include free Budget Calculator, site visit and measurement, priority and scope planning, itemised estimates, material and specification options, space planning and 3D views, modular kitchen and wardrobes, living room, bedroom and bathroom interiors, false ceiling and lighting, civil, electrical, plumbing and waterproofing, painting and finishing, renovation and upgrades, phase-wise execution, and stage-wise payment planning.",
    url: "https://www.mtboss.in/budget-interior-designer-in-bareilly",
    provider: {
      "@type": "InteriorDesignService",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "mtboss2016@gmail.com",
      url: "https://www.mtboss.in",
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
      "Budget Interior Designer, Interior Design Budget, Home Interior Budget Planning, Interior Cost Estimate, Interior Quotation, 2BHK Interior Budget, 3BHK Interior Budget, Interior Budget Calculator, Interior Payment Schedule and Budget Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a budget interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A budget interior designer helps you set a realistic budget, prioritise rooms and features, choose suitable materials, prepare a clear quotation and manage the work so that costs stay under control until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide budget interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that builds residential projects from affordable housing to luxury villas and serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "How do I set a realistic interior budget?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Decide the maximum you can spend, include a reserve for surprises, list your must-haves and nice-to-haves, and share the real figure with your designer so the plan fits it.",
        },
      },
      {
        "@type": "Question",
        name: "Can I do my interior in phases to manage the budget?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Complete the essentials first, such as civil work, kitchen, wardrobes and lighting, and add the rest later. A single design plan keeps everything consistent.",
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
        name: "Can MTBOSS also handle electrical work, plumbing and painting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. These are part of the services offered, so you do not need to coordinate separate contractors.",
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
        name: "Interior Design Services",
        item: "https://www.mtboss.in/interior-design-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Budget Interior Designer in Bareilly",
        item: "https://www.mtboss.in/budget-interior-designer-in-bareilly",
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