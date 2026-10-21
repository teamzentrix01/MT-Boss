// app/(bareilly_keywords)/2bhk-interior-design-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "2 BHK Interior Design Bareilly | MTBOSS",

  description:
    "Planning 2 BHK interior design Bareilly? MTBOSS plans kitchens, wardrobes, ceilings and full 2BHK homes with clear costs. Call +91 94584 10866.",

  keywords:
    "2 BHK interior design Bareilly, 2BHK interior design Bareilly, 2BHK flat interior Bareilly, 2BHK apartment interior Bareilly, 2BHK home interior Bareilly, 2BHK interior cost Bareilly, 2BHK modular kitchen Bareilly, 2BHK wardrobe design Bareilly, 2BHK false ceiling Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, 2BHK interior quote Bareilly",

  alternates: {
    canonical: "https://www.mtboss.in/2bhk-interior-design-in-bareilly",
  },

  openGraph: {
    title: "2 BHK Interior Design Bareilly | MTBOSS",

    description:
      "Planning 2 BHK interior design Bareilly? MTBOSS plans kitchens, wardrobes, ceilings and full 2BHK homes with clear costs. Call +91 94584 10866.",

    url: "https://www.mtboss.in/2bhk-interior-design-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-2bhk-interior-design-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "2 BHK Interior Design in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "2 BHK Interior Design Bareilly | MTBOSS",

    description:
      "Planning 2 BHK interior design Bareilly? MTBOSS plans kitchens, wardrobes, ceilings and full 2BHK homes with clear costs. Call +91 94584 10866.",

    images: ["https://www.mtboss.in/og-2bhk-interior-design-bareilly.jpg"],
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
    url: "https://www.mtboss.in/2bhk-interior-design-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-2bhk-interior-design-bareilly.jpg",
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
      "2 BHK Interior Design",
      "2BHK Flat Interior",
      "2BHK Apartment Interior",
      "2BHK Home Interior",
      "2BHK Interior Cost",
      "2BHK Modular Kitchen",
      "2BHK Wardrobe Design",
      "2BHK False Ceiling",
      "Home Interior Design",
      "2BHK Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "2 BHK Interior Design Services in Bareilly",
    description:
      "MTBOSS provides 2 BHK interior design services in Bareilly. Services include site visit and measurement, 2 BHK space planning, concept and 3D views, modular kitchen, wardrobes for both bedrooms, living and dining interiors, second bedroom solutions, bathroom interiors, false ceiling and lighting, painting, wallpaper and PVC panels, flooring and tiling, electrical, plumbing and waterproofing, puja unit, renovation of existing 2 BHK homes, material supply and home services.",
    url: "https://www.mtboss.in/2bhk-interior-design-in-bareilly",
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
      "2 BHK Interior Design, 2BHK Flat Interior, 2BHK Apartment Interior, 2BHK Home Interior, 2BHK Modular Kitchen, 2BHK Wardrobe Design, 2BHK False Ceiling and 2BHK Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does 2 BHK interior design include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It usually covers space planning, kitchen, wardrobes, living and dining interiors, bedrooms, bathrooms, ceilings, lighting, painting and flooring, along with the civil and services work needed to support them. The exact scope is written in the agreement.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide 2 BHK interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "How can I make a 2 BHK feel bigger?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use light colours, an open living and dining layout, sliding wardrobes, lofts, closed storage, good lighting and furniture sized to the room.",
        },
      },
      {
        "@type": "Question",
        name: "Should I start interiors before taking possession?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Early planning is helpful, because wiring, AC and plumbing points can be set before finishing. Share the builder's floor plan, and the team can start the design.",
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
        name: "How much does 2 BHK interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on the size and layout of the home, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting, custom furniture and civil work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS also handle electrical work, plumbing and waterproofing?",
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
        name: "2 BHK Interior Design in Bareilly",
        item: "https://www.mtboss.in/2bhk-interior-design-in-bareilly",
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