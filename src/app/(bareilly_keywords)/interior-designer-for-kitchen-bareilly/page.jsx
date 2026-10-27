// app/(bareilly_keywords)/interior-designer-for-kitchen-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Kitchen Bareilly | MTBOSS",

  description:
    "Need an interior designer for kitchen Bareilly? MTBOSS plans modular kitchens with smart storage, durable materials and clean finishing. Call +91 94584 10866.",

  keywords:
    "interior designer for kitchen Bareilly, kitchen interior design Bareilly, modular kitchen Bareilly, modular kitchen designer Bareilly, kitchen interior designer Bareilly, small kitchen design Bareilly, L-shaped kitchen Bareilly, kitchen renovation Bareilly, kitchen cabinets Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, kitchen interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/interior-designer-for-kitchen-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Kitchen Bareilly | MTBOSS",

    description:
      "Need an interior designer for kitchen Bareilly? MTBOSS plans modular kitchens with smart storage, durable materials and clean finishing. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/interior-designer-for-kitchen-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-designer-kitchen-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Kitchen in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Kitchen Bareilly | MTBOSS",

    description:
      "Need an interior designer for kitchen Bareilly? MTBOSS plans modular kitchens with smart storage, durable materials and clean finishing. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-interior-designer-kitchen-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/interior-designer-for-kitchen-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.MTBOSS.in/og-interior-designer-kitchen-bareilly.jpg",
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
      "Interior Designer for Kitchen",
      "Kitchen Interior Design",
      "Modular Kitchen",
      "Modular Kitchen Designer",
      "Kitchen Interior Designer",
      "Small Kitchen Design",
      "L-shaped Kitchen",
      "Kitchen Renovation",
      "Kitchen Cabinets",
      "Home Interior Design",
      "Kitchen Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Kitchen Interior Design and Modular Kitchen Services in Bareilly",
    description:
      "MTBOSS provides kitchen interior design and modular kitchen services in Bareilly. Services include modular kitchen design, cabinets and shutters, countertop and backsplash, storage solutions, chimney and hob provisions, appliance integration, kitchen lighting, flooring and wall tiles, plumbing and drainage, electrical work, waterproofing, false ceiling and painting, wash area and utility space, kitchen renovation and full home interiors.",
    url: "https://www.MTBOSS.in/interior-designer-for-kitchen-in-bareilly",
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
      "Interior Designer for Kitchen, Kitchen Interior Design, Modular Kitchen, Modular Kitchen Designer, Small Kitchen Design, L-shaped Kitchen, Kitchen Renovation, Kitchen Cabinets and Kitchen Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior designer for a kitchen do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A kitchen interior designer plans the layout, storage, cabinets, countertop, lighting, ventilation and finishes, coordinates plumbing and electrical work and manages the project until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide kitchen interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your kitchen.",
        },
      },
      {
        "@type": "Question",
        name: "Which kitchen layout is best for a small kitchen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Straight and L-shaped layouts usually work well in small kitchens. A site visit and measurements will show which option suits your space and cooking style.",
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
        name: "How long does a modular kitchen project take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The timeline depends on the size, scope and condition of the kitchen. The team shares a clear schedule after the site visit.",
        },
      },
      {
        "@type": "Question",
        name: "How much does kitchen interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on kitchen size and layout, cabinet board and finish, countertop, hardware, appliances, tiling, plumbing and electrical work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS also handle plumbing, electrical and waterproofing for the kitchen?",
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
        name: "Interior Designer for Kitchen in Bareilly",
        item: "https://www.MTBOSS.in/interior-designer-for-kitchen-in-bareilly",
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