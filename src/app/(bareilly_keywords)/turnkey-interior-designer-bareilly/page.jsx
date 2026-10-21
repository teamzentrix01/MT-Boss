// app/(bareilly_keywords)/turnkey-interior-designer-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Turnkey Interior Designer Bareilly | MTBOSS",

  description:
    "Hire a turnkey interior designer Bareilly for design, execution and handover under one team. Get a free quote. MTBOSS: +91 94584 10866.",

  keywords:
    "turnkey interior designer Bareilly, turnkey interior Bareilly, turnkey home interior Bareilly, full home interior Bareilly, design and build interior Bareilly, interior contractor Bareilly, one team interior Bareilly, turnkey 2BHK interior Bareilly, turnkey 3BHK interior Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, turnkey interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/turnkey-interior-designer-in-bareilly",
  },

  openGraph: {
    title: "Turnkey Interior Designer Bareilly | MTBOSS",

    description:
      "Hire a turnkey interior designer Bareilly for design, execution and handover under one team. Get a free quote. MTBOSS: +91 94584 10866.",

    url: "https://www.mtboss.in/turnkey-interior-designer-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-turnkey-interior-designer-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Turnkey Interior Designer in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Turnkey Interior Designer Bareilly | MTBOSS",

    description:
      "Hire a turnkey interior designer Bareilly for design, execution and handover under one team. Get a free quote. MTBOSS: +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-turnkey-interior-designer-bareilly.jpg",
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
    url: "https://www.mtboss.in/turnkey-interior-designer-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-turnkey-interior-designer-bareilly.jpg",
    priceRange: "₹₹₹",
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
      "Turnkey Interior Designer",
      "Turnkey Interior",
      "Turnkey Home Interior",
      "Full Home Interior",
      "Design and Build Interior",
      "Interior Contractor",
      "One Team Interior",
      "Turnkey 2BHK Interior",
      "Turnkey 3BHK Interior",
      "Home Interior Design",
      "Turnkey Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Turnkey Interior Design Services in Bareilly",
    description:
      "MTBOSS provides turnkey interior design services in Bareilly. Services include site visit and measurement, space planning and design, budget planning, specifications and agreement, civil and repair work, electrical and plumbing, waterproofing, false ceiling and lighting, modular kitchen and wardrobes, living, dining and bedroom interiors, bathrooms and puja rooms, flooring, tiling and painting, material supply, supervision and handover, and after-handover support.",
    url: "https://www.mtboss.in/turnkey-interior-designer-in-bareilly",
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
      "Turnkey Interior Designer, Turnkey Interior, Turnkey Home Interior, Full Home Interior, Design and Build Interior, Interior Contractor, One Team Interior, Turnkey 2BHK Interior, Turnkey 3BHK Interior and Turnkey Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a turnkey interior designer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A turnkey interior designer takes responsibility for the whole project, including design, civil and services work, carpentry, finishing and handover, so you receive a home that is ready to move into without coordinating separate contractors.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide turnkey interior services in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "What is included in a turnkey interior project?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Typically design and drawings, civil and services work, ceilings, carpentry and modular units, painting, flooring, lighting, supervision and handover. The exact inclusions and exclusions are written in the agreement.",
        },
      },
      {
        "@type": "Question",
        name: "What is usually not included?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Appliances, loose furniture, soft furnishings, decor, society permissions and specialist systems, unless they are specifically agreed in the scope.",
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
        name: "How much does a turnkey interior cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on home size, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting, custom furniture and civil work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "What is my role in a turnkey project?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You share your needs and budget, approve designs and specifications, choose finishes, confirm appliance details, make stage-wise payments and walk through the home at handover.",
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
        name: "Turnkey Interior Designer in Bareilly",
        item: "https://www.mtboss.in/turnkey-interior-designer-in-bareilly",
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