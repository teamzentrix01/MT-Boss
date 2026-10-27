// app/(bareilly_keywords)/interior-designer-for-apartment-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Apartment Bareilly | MTBOSS",

  description:
    "Need an interior designer for apartment Bareilly? Get 2BHK and 3BHK apartment interiors, modular kitchen and wardrobes with MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior designer for apartment Bareilly, apartment interior design Bareilly, apartment interior designer Bareilly, 2BHK apartment interior Bareilly, 3BHK apartment interior Bareilly, modular kitchen for apartment Bareilly, apartment renovation Bareilly, new apartment interior Bareilly, home interior Bareilly, false ceiling Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, apartment interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/interior-designer-for-apartment-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Apartment Bareilly | MTBOSS",

    description:
      "Need an interior designer for apartment Bareilly? Get 2BHK and 3BHK apartment interiors, modular kitchen and wardrobes with MTBOSS. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/interior-designer-for-apartment-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-designer-apartment-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Apartment in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Apartment Bareilly | MTBOSS",

    description:
      "Need an interior designer for apartment Bareilly? Get 2BHK and 3BHK apartment interiors, modular kitchen and wardrobes with MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-interior-designer-apartment-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/interior-designer-for-apartment-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.MTBOSS.in/og-interior-designer-apartment-bareilly.jpg",
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
      "Interior Designer for Apartment",
      "Apartment Interior Design",
      "Apartment Interior Designer",
      "2BHK Apartment Interior",
      "3BHK Apartment Interior",
      "Modular Kitchen for Apartment",
      "Apartment Renovation",
      "New Apartment Interior",
      "Home Interior Design",
      "False Ceiling",
      "Apartment Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Apartment Interior Design Services in Bareilly",
    description:
      "MTBOSS provides apartment interior design services in Bareilly for new, ready-to-move, resale, builder floor, under-construction and rental apartments. Services include full apartment interiors, living and dining areas, modular kitchens, bedrooms and wardrobes, kids and guest rooms, puja units, false ceiling and lighting, PVC panels and louvers, wallpaper and painting, tile and marble work, doors, windows and carpentry, electrical and plumbing, waterproofing, AC and HVAC provisions, renovation and remodelling.",
    url: "https://www.MTBOSS.in/interior-designer-for-apartment-in-bareilly",
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
      "Interior Designer for Apartment, Apartment Interior Design, 2BHK Apartment Interior, 3BHK Apartment Interior, Modular Kitchen for Apartment, Apartment Renovation, New Apartment Interior, Home Interior Design and False Ceiling",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior designer for an apartment do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An apartment interior designer plans layouts, storage, lighting, finishes and furniture, coordinates the trades and manages the work until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide apartment interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your apartment.",
        },
      },
      {
        "@type": "Question",
        name: "Can I design the interiors of a 2BHK or 3BHK apartment within a fixed budget?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Share your budget at the start, and the team can focus on the essentials first, such as the kitchen, wardrobes and lighting, and suggest phases for the rest.",
        },
      },
      {
        "@type": "Question",
        name: "Is it better to start interiors before or after possession?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Early planning is often best, because wiring, AC and plumbing points can be set before finishing. Share the builder's floor plan, and the team can start the design.",
        },
      },
      {
        "@type": "Question",
        name: "Can you renovate an older or resale apartment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS handles repairs, waterproofing, repainting, kitchen and wardrobe upgrades and fresh interiors for existing apartments.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to take society permission for interior work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Many apartment complexes require approval and have rules on timings and material movement. Check with your society before starting, and share the rules with the team so the schedule can follow them.",
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
        name: "How much does apartment interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on apartment size, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting design, custom furniture and existing fittings. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS also handle electrical, plumbing and waterproofing?",
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
        name: "Interior Designer for Apartment in Bareilly",
        item: "https://www.MTBOSS.in/interior-designer-for-apartment-in-bareilly",
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