// app/(bareilly_keywords)/affordable-interior-designer-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Affordable Interior Designer Bareilly | MTBOSS",

  description:
    "Looking for an affordable interior designer Bareilly? MTBOSS plans budget-friendly home interiors with clear pricing. Call +91 94584 10866.",

  keywords:
    "affordable interior designer Bareilly, budget interior designer Bareilly, low cost home interior Bareilly, budget-friendly interior design Bareilly, cheap interior designer Bareilly, affordable 2BHK interior Bareilly, budget modular kitchen Bareilly, interior design cost Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, affordable interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/affordable-interior-designer-in-bareilly",
  },

  openGraph: {
    title: "Affordable Interior Designer Bareilly | MTBOSS",

    description:
      "Looking for an affordable interior designer Bareilly? MTBOSS plans budget-friendly home interiors with clear pricing. Call +91 94584 10866.",

    url: "https://www.mtboss.in/affordable-interior-designer-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-affordable-interior-designer-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Affordable Interior Designer in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Affordable Interior Designer Bareilly | MTBOSS",

    description:
      "Looking for an affordable interior designer Bareilly? MTBOSS plans budget-friendly home interiors with clear pricing. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-affordable-interior-designer-bareilly.jpg",
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
    url: "https://www.mtboss.in/affordable-interior-designer-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-affordable-interior-designer-bareilly.jpg",
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
      "Affordable Interior Designer",
      "Budget Interior Designer",
      "Low Cost Home Interior",
      "Budget-Friendly Interior Design",
      "Affordable 2BHK Interior",
      "Budget Modular Kitchen",
      "Interior Design Cost",
      "Home Interior Design",
      "Affordable Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Affordable Interior Design Services in Bareilly",
    description:
      "MTBOSS provides affordable interior design services in Bareilly. Services include budget planning and estimates, space planning, modular kitchen, wardrobes and storage, TV unit and living room design, bedroom interiors, false ceiling and lighting, painting, wallpaper and PVC panels, tile and flooring work, electrical and plumbing, waterproofing, renovation and upgrades, doors, windows and woodwork, and phase-wise interior plans.",
    url: "https://www.mtboss.in/affordable-interior-designer-in-bareilly",
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
      "Affordable Interior Designer, Budget Interior Designer, Low Cost Home Interior, Budget-Friendly Interior Design, Affordable 2BHK Interior, Budget Modular Kitchen, Interior Design Cost and Affordable Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an affordable interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An affordable interior designer plans your home around your budget, helps you prioritise, recommends suitable materials, coordinates the work and manages the project until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide affordable interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that builds residential projects from affordable housing to luxury villas and serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "Does affordable mean low quality?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Affordable means spending wisely, with good quality where it matters, such as waterproofing, wiring, hardware and boards in damp areas, and simpler choices where it does not.",
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
        name: "Can you work within a fixed budget?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Share your budget at the start, and the team plans the scope and specifications around it, with options for what to include now and what to add later.",
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
        name: "Affordable Interior Designer in Bareilly",
        item: "https://www.mtboss.in/affordable-interior-designer-in-bareilly",
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