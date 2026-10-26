// app/(bareilly_keywords)/top-interior-designer-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Top Interior Designer Bareilly | Home & Office | MTBOSS",

  description:
    "Explore top interior design ideas for Bareilly homes and offices. MTBOSS plans kitchens, wardrobes, ceilings and full interiors. Call +91 94584 10866.",

  keywords:
    "top interior designer Bareilly, interior design ideas Bareilly, home interior ideas Bareilly, 2BHK interior design Bareilly, 3BHK interior design Bareilly, villa interior design Bareilly, living room design Bareilly, modular kitchen ideas Bareilly, bedroom design ideas Bareilly, office interior design Bareilly, false ceiling ideas Bareilly, interior design trends Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, interior design quote Bareilly",

  alternates: {
    canonical: "https://www.MTBOSS.in/top-interior-designer-bareilly",
  },

  openGraph: {
    title: "Top Interior Designer Bareilly | Home & Office | MTBOSS",

    description:
      "Explore top interior design ideas for Bareilly homes and offices. MTBOSS plans kitchens, wardrobes, ceilings and full interiors. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/top-interior-designer-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-top-interior-designer-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Top Interior Designer Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Top Interior Designer Bareilly | Home & Office | MTBOSS",

    description:
      "Explore top interior design ideas for Bareilly homes and offices. MTBOSS plans kitchens, wardrobes, ceilings and full interiors. Call +91 94584 10866.",

    images: ["https://www.MTBOSS.in/og-top-interior-designer-bareilly.jpg"],
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
    url: "https://www.MTBOSS.in/top-interior-designer-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image: "https://www.MTBOSS.in/og-top-interior-designer-bareilly.jpg",
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
      "Top Interior Designer Bareilly",
      "Interior Design Ideas",
      "Home Interior Ideas",
      "2BHK Interior Design",
      "3BHK Interior Design",
      "Villa Interior Design",
      "Living Room Design",
      "Modular Kitchen Ideas",
      "Bedroom Design Ideas",
      "Office Interior Design",
      "False Ceiling Ideas",
      "Interior Design Trends",
      "Interior Design Quote",
      "Interior Renovation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Top Interior Design Services in Bareilly",
    description:
      "MTBOSS provides top interior design services in Bareilly for 1BHK, 2BHK and 3BHK flats, independent houses, villas, offices, shops and clinics, including full home interiors, living and dining areas, modular kitchens, bedrooms and wardrobes, puja room design, false ceiling and lighting plans, flooring and wall finishes, woodwork and custom furniture, bathroom interiors, commercial interiors, coordination with construction, material supply and renovation and remodelling.",
    url: "https://www.MTBOSS.in/top-interior-designer-bareilly",
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
      "Top Interior Designer Bareilly, Interior Design Ideas, Home Interior Ideas, 2BHK Interior Design, 3BHK Interior Design, Villa Interior Design, Living Room Design, Modular Kitchen Ideas, Bedroom Design Ideas, Office Interior Design and False Ceiling Ideas",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What makes an interior designer a top choice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Look for a clear portfolio, written estimates and specifications, a realistic schedule, regular site supervision and support after handover, rather than relying on rankings or titles alone.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your location.",
        },
      },
      {
        "@type": "Question",
        name: "Can you design interiors for a small flat?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Compact homes benefit most from smart layouts, loft and hidden storage, light colours and multi-use furniture. Share your plan, and the team can suggest options.",
        },
      },
      {
        "@type": "Question",
        name: "Do interior trends matter?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Trends can inspire, but proportion, lighting, storage and durable materials matter most. A good designer helps you choose what suits your home and will still look right years from now.",
        },
      },
      {
        "@type": "Question",
        name: "Can I start with one room and add more later?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Many clients start with the kitchen or bedroom and extend later. Planning the overall style at the beginning keeps later rooms consistent.",
        },
      },
      {
        "@type": "Question",
        name: "How much does interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on area, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting design, custom furniture and site conditions. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Top Interior Designer Bareilly",
        item: "https://www.MTBOSS.in/top-interior-designer-bareilly",
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