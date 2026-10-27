// app/(bareilly_keywords)/commercial-interior-designer-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Commercial Interior Designer Bareilly | MTBOSS",

  description:
    "Need a commercial interior designer Bareilly? MTBOSS plans offices, shops, clinics and showrooms with clear costs. Call +91 94584 10866.",

  keywords:
    "commercial interior designer Bareilly, commercial interior design Bareilly, office interior design Bareilly, shop interior design Bareilly, showroom interior Bareilly, clinic interior design Bareilly, restaurant interior Bareilly, salon interior Bareilly, commercial fit-out Bareilly, office interior cost Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, commercial interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/commercial-interior-designer-in-bareilly",
  },

  openGraph: {
    title: "Commercial Interior Designer Bareilly | MTBOSS",

    description:
      "Need a commercial interior designer Bareilly? MTBOSS plans offices, shops, clinics and showrooms with clear costs. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/commercial-interior-designer-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-commercial-interior-designer-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Commercial Interior Designer in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Commercial Interior Designer Bareilly | MTBOSS",

    description:
      "Need a commercial interior designer Bareilly? MTBOSS plans offices, shops, clinics and showrooms with clear costs. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-commercial-interior-designer-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/commercial-interior-designer-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.MTBOSS.in/og-commercial-interior-designer-bareilly.jpg",
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
      "Commercial Interior Designer",
      "Commercial Interior Design",
      "Office Interior Design",
      "Shop Interior Design",
      "Showroom Interior",
      "Clinic Interior Design",
      "Restaurant Interior",
      "Salon Interior",
      "Commercial Fit-Out",
      "Office Interior Cost",
      "Commercial Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Commercial Interior Design Services in Bareilly",
    description:
      "MTBOSS provides commercial interior design services in Bareilly. Services include requirement study, site visit and measurement, space planning, concept and 3D views, reception and waiting areas, work areas and cabins, display and shop fittings, false ceiling and lighting, flooring and wall finishes, furniture and woodwork, washrooms and pantry, electrical, data and plumbing, AC and ventilation planning, painting, panels and signage provisions, renovation and refurbishment, project supervision and handover.",
    url: "https://www.MTBOSS.in/commercial-interior-designer-in-bareilly",
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
      "Commercial Interior Designer, Commercial Interior Design, Office Interior Design, Shop Interior Design, Showroom Interior, Clinic Interior Design, Restaurant Interior, Salon Interior, Commercial Fit-Out and Commercial Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a commercial interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A commercial interior designer plans the layout, customer and staff flow, lighting, ceilings, materials, furniture, services and branding for a business space, coordinates the trades and manages the work until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide commercial interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the types of commercial projects and the scope available for your requirement.",
        },
      },
      {
        "@type": "Question",
        name: "What types of commercial spaces can be designed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Common examples include offices, shops, showrooms, clinics, restaurants, salons and training centres. Please share your requirement with the team to confirm what can be taken up.",
        },
      },
      {
        "@type": "Question",
        name: "How is commercial interior different from home interior?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It focuses on business performance, customer flow, durability, services load, branding and tighter timelines, and it often involves landlord, licensing and safety requirements.",
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
        name: "How much does a commercial interior cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on the size and type of space, scope, material and finish level, services load, ceiling and lighting, custom furniture and branding. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Commercial Interior Designer in Bareilly",
        item: "https://www.MTBOSS.in/commercial-interior-designer-in-bareilly",
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