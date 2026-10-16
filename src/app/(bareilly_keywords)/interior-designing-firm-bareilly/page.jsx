// app/(bareilly_keywords)/interior-designing-firm-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designing Firm in Bareilly | MTBOSS",

  description:
    "Interior designing firm in Bareilly: see how a project runs from brief to handover with MTBOSS. Call +91 94584 10866 for a quote.",

  keywords:
    "interior designing firm Bareilly, interior design firm Bareilly, interior project process Bareilly, interior design brief Bareilly, interior execution Bareilly, interior site supervision Bareilly, interior design timeline Bareilly, home interior firm Bareilly, interior firm for flats Bareilly, interior firm for offices Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, interior design quote Bareilly",

  alternates: {
    canonical: "https://www.mtboss.in/interior-designing-firm-bareilly",
  },

  openGraph: {
    title: "Interior Designing Firm in Bareilly | MTBOSS",

    description:
      "Interior designing firm in Bareilly: see how a project runs from brief to handover with MTBOSS. Call +91 94584 10866 for a quote.",

    url: "https://www.mtboss.in/interior-designing-firm-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designing-firm-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designing Firm in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designing Firm in Bareilly | MTBOSS",

    description:
      "Interior designing firm in Bareilly: see how a project runs from brief to handover with MTBOSS. Call +91 94584 10866 for a quote.",

    images: [
      "https://www.mtboss.in/og-interior-designing-firm-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-designing-firm-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-designing-firm-bareilly.jpg",
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
      "Interior Designing Firm",
      "Interior Design Firm",
      "Interior Project Planning",
      "Interior Design Brief",
      "Interior Execution",
      "Interior Site Supervision",
      "Interior Design Timeline",
      "Home Interior Design",
      "Interior Design for Flats",
      "Interior Design for Offices",
      "Interior Design Quote",
      "Interior Renovation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Designing Firm Services in Bareilly",
    description:
      "MTBOSS provides interior design services in Bareilly for flats, houses, villas, offices, shops and clinics. Services include project brief and planning, site study and measurement, layouts and 3D views, estimates and written scope, coordination of civil and services work, false ceilings, carpentry, modular kitchens, wardrobes, flooring, painting, lighting, quality checks, handover and aftercare.",
    url: "https://www.mtboss.in/interior-designing-firm-bareilly",
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
      "Interior Designing Firm, Interior Design Firm, Interior Project Process, Interior Design Brief, Interior Execution, Interior Site Supervision, Home Interior Firm, Interior Firm for Flats and Interior Firm for Offices",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior designing firm do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An interior designing firm plans the look and function of a space and, in many cases, also manages execution, including estimates, trades, materials, quality checks and handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your location.",
        },
      },
      {
        "@type": "Question",
        name: "What should I prepare before meeting an interior firm?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Prepare a simple brief covering who uses the space, what to keep and change, style references, storage needs, budget range and timeline. Floor plans and photos help too.",
        },
      },
      {
        "@type": "Question",
        name: "In what order should interior work happen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Typically, the sequence is brief, site study, design, costing, agreement, civil and services, ceilings and carpentry, finishing, handover and aftercare. Doing steps in the wrong order often leads to rework.",
        },
      },
      {
        "@type": "Question",
        name: "How will I know the work is on track?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Agree on an update method, such as photos, calls or visits, and ask for stage-wise approvals and a decision log. Regular site visits and clear milestones also help.",
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
        name: "Interior Designing Firm in Bareilly",
        item: "https://www.mtboss.in/interior-designing-firm-bareilly",
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