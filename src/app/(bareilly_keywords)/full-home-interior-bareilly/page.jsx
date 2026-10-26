// app/(bareilly_keywords)/full-home-interior-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Full Home Interior Bareilly | MTBOSS",

  description:
    "Planning full home interior Bareilly? MTBOSS designs every room as one connected plan with clear costs. Call +91 94584 10866.",

  keywords:
    "full home interior Bareilly, complete home interior Bareilly, whole house interior design Bareilly, full flat interior Bareilly, full villa interior Bareilly, 2BHK full interior Bareilly, 3BHK full interior Bareilly, home interior planning Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, full home interior quote Bareilly",

  alternates: {
    canonical: "https://www.MTBOSS.in/full-home-interior-in-bareilly",
  },

  openGraph: {
    title: "Full Home Interior Bareilly | MTBOSS",

    description:
      "Planning full home interior Bareilly? MTBOSS designs every room as one connected plan with clear costs. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/full-home-interior-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-full-home-interior-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Full Home Interior in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Full Home Interior Bareilly | MTBOSS",

    description:
      "Planning full home interior Bareilly? MTBOSS designs every room as one connected plan with clear costs. Call +91 94584 10866.",

    images: ["https://www.MTBOSS.in/og-full-home-interior-bareilly.jpg"],
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
    url: "https://www.MTBOSS.in/full-home-interior-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image: "https://www.MTBOSS.in/og-full-home-interior-bareilly.jpg",
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
      "Full Home Interior",
      "Complete Home Interior",
      "Whole House Interior Design",
      "Full Flat Interior",
      "Full Villa Interior",
      "2BHK Full Interior",
      "3BHK Full Interior",
      "Home Interior Planning",
      "Home Interior Design",
      "Full Home Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Full Home Interior Design Services in Bareilly",
    description:
      "MTBOSS provides full home interior design services in Bareilly. Services include whole-home design brief, site visit and measurement, home-wide space planning, concept and 3D views, entrance and living areas, modular kitchen, bedrooms and kids' rooms, bathrooms, puja room or mandir, false ceiling and lighting, flooring, tiling and painting, electrical, plumbing and waterproofing, doors, windows and woodwork, material supply, handover and after-handover support.",
    url: "https://www.MTBOSS.in/full-home-interior-in-bareilly",
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
      "Full Home Interior, Complete Home Interior, Whole House Interior Design, Full Flat Interior, Full Villa Interior, 2BHK Full Interior, 3BHK Full Interior, Home Interior Planning and Full Home Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is included in a full home interior?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A full home interior usually covers design and planning, civil and services work, ceilings, carpentry and modular units, painting, flooring, lighting, bathrooms, supervision and handover for all rooms. The exact scope is written in the agreement.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide full home interior services in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "Can I do a full home interior in phases?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can complete the essential rooms first and add others later. A single design plan for the whole home keeps everything consistent.",
        },
      },
      {
        "@type": "Question",
        name: "Can I stay in the home during a full interior project?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It is possible with careful phasing, but moving out, even temporarily, usually makes the work faster and less stressful. The team can discuss options after the site visit.",
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
        name: "How much does a full home interior cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on home size, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting, custom furniture and civil work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Full Home Interior in Bareilly",
        item: "https://www.MTBOSS.in/full-home-interior-in-bareilly",
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