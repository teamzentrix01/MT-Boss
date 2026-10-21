// app/(bareilly_keywords)/interior-and-exterior-designer-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior and Exterior Designer Bareilly | MTBOSS",

  description:
    "Looking for an interior and exterior designer Bareilly? MTBOSS plans homes inside and out with 3D views and clear costs. Call +91 94584 10866.",

  keywords:
    "interior and exterior designer Bareilly, interior exterior design Bareilly, home exterior design Bareilly, building elevation design Bareilly, house front design Bareilly, exterior painting Bareilly, boundary wall design Bareilly, interior designer Bareilly, architect Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, interior exterior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-and-exterior-designer-in-bareilly",
  },

  openGraph: {
    title: "Interior and Exterior Designer Bareilly | MTBOSS",

    description:
      "Looking for an interior and exterior designer Bareilly? MTBOSS plans homes inside and out with 3D views and clear costs. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-and-exterior-designer-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-exterior-designer-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior and Exterior Designer in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior and Exterior Designer Bareilly | MTBOSS",

    description:
      "Looking for an interior and exterior designer Bareilly? MTBOSS plans homes inside and out with 3D views and clear costs. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-exterior-designer-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-and-exterior-designer-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-exterior-designer-bareilly.jpg",
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
      "Interior and Exterior Designer",
      "Interior Exterior Design",
      "Home Exterior Design",
      "Building Elevation Design",
      "House Front Design",
      "Exterior Painting",
      "Boundary Wall Design",
      "Interior Designer",
      "Architect",
      "Home Interior Design",
      "Interior Exterior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior and Exterior Design Services in Bareilly",
    description:
      "MTBOSS provides interior and exterior design services in Bareilly. Interior services include space planning, modular kitchen and wardrobes, living and dining interiors, false ceiling and lighting, wall finishes, flooring, tile and marble, bathroom interiors, and door and window installation. Exterior services include building elevation design, exterior painting and finishes, boundary wall and gate, balcony and terrace finishing, entrance and porch design, waterproofing, building repair and renovation, and outdoor lighting.",
    url: "https://www.mtboss.in/interior-and-exterior-designer-in-bareilly",
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
      "Interior and Exterior Designer, Interior Exterior Design, Home Exterior Design, Building Elevation Design, House Front Design, Exterior Painting, Boundary Wall Design, Interior Designer, Architect, Home Interior and Interior Exterior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does interior and exterior design include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It usually covers space planning, kitchen, wardrobes, ceilings, lighting and finishes inside, along with elevation, painting, entrance, gate and waterproofing outside. The exact scope is written in the agreement.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide interior and exterior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "Why hire one team for both interior and exterior?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "One team keeps colours, materials, lighting and quality consistent, coordinates the work order and gives you a single point of responsibility.",
        },
      },
      {
        "@type": "Question",
        name: "Can I do only the exterior or only the interior?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can choose interior only, exterior only or both. If you start with one, a single design plan keeps the other consistent for later.",
        },
      },
      {
        "@type": "Question",
        name: "What is building elevation design?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It is the design of the front and visible sides of a building, including the facade, windows, balconies, colours and materials, so the exterior looks attractive and stays protected.",
        },
      },
      {
        "@type": "Question",
        name: "Will I see the design before work starts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Layouts, facade concepts and 3D views are shared and refined with your feedback before execution begins, and scope and specifications are written down before work starts.",
        },
      },
      {
        "@type": "Question",
        name: "How much does interior and exterior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on the size of the building, scope, facade complexity, material and finish level, waterproofing needs and custom work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Interior and Exterior Designer in Bareilly",
        item:
          "https://www.mtboss.in/interior-and-exterior-designer-in-bareilly",
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