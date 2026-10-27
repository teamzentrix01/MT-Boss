// app/(bareilly_keywords)/interior-designer-for-flat-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Flat in Bareilly | MTBOSS",

  description:
    "Need an interior designer for your flat in Bareilly? Plan 1BHK, 2BHK and 3BHK interiors with MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior designer for flat Bareilly, flat interior design Bareilly, apartment interior design Bareilly, 1BHK interior design Bareilly, 2BHK interior design Bareilly, 3BHK interior design Bareilly, builder floor interior Bareilly, modular kitchen for flat Bareilly, small flat interior Bareilly, flat renovation Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, flat interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/interior-designer-for-flat-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Flat in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your flat in Bareilly? Plan 1BHK, 2BHK and 3BHK interiors with MTBOSS. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/interior-designer-for-flat-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-designer-flat-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Flat in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Flat in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your flat in Bareilly? Plan 1BHK, 2BHK and 3BHK interiors with MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-interior-designer-flat-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/interior-designer-for-flat-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image: "https://www.MTBOSS.in/og-interior-designer-flat-bareilly.jpg",
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
      "Interior Designer for Flat",
      "Flat Interior Design",
      "Apartment Interior Design",
      "1BHK Interior Design",
      "2BHK Interior Design",
      "3BHK Interior Design",
      "Builder Floor Interior",
      "Modular Kitchen for Flat",
      "Small Flat Interior",
      "Flat Renovation",
      "Home Interior Design",
      "Flat Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Flat Interior Design Services in Bareilly",
    description:
      "MTBOSS provides flat interior design services in Bareilly for 1BHK, 2BHK, 3BHK apartments, builder floors and penthouses. Services include space planning, living and dining interiors, modular kitchens, bedrooms and wardrobes, storage solutions, puja units, false ceiling and lighting, flooring and wall finishes, woodwork and custom furniture, bathroom interiors, balcony and utility areas, services provisions, society coordination support, material supply, renovation and remodelling.",
    url: "https://www.MTBOSS.in/interior-designer-for-flat-in-bareilly",
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
      "Interior Designer for Flat, Flat Interior Design, Apartment Interior Design, 1BHK Interior Design, 2BHK Interior Design, 3BHK Interior Design, Builder Floor Interior, Modular Kitchen for Flat, Small Flat Interior and Flat Renovation",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a flat interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A flat interior designer plans layouts, storage, lighting, finishes and furniture for an apartment, working within its fixed structure and society rules, and coordinates the work until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide flat interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your flat.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need society permission for interior work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Many societies require approval, set working hours and have rules on material movement and debris. Check with your society before you start, and share the rules with the team so the schedule can follow them.",
        },
      },
      {
        "@type": "Question",
        name: "Can walls be removed in a flat?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Load-bearing walls, beams and columns cannot be removed, and some partition changes also need approval. A site visit and your society's rules will show what is possible.",
        },
      },
      {
        "@type": "Question",
        name: "How can I make a small flat look bigger?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use light colours, mirrors, multi-use furniture, loft and hidden storage, good lighting and clutter-free surfaces. Share your flat size, and the team can suggest a plan.",
        },
      },
      {
        "@type": "Question",
        name: "Can I plan interiors before getting possession?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, and early planning is often best, because wiring, AC and plumbing points can be set before finishing. Share the builder's floor plan, and the team can start the design.",
        },
      },
      {
        "@type": "Question",
        name: "How much does flat interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on flat size, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting design, custom furniture, existing fittings and society requirements. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Interior Designer for Flat in Bareilly",
        item: "https://www.MTBOSS.in/interior-designer-for-flat-in-bareilly",
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