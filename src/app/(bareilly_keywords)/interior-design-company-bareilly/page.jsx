// app/(bareilly_keywords)/interior-design-company-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Design Company in Bareilly | MTBOSS",

  description:
    "Choosing an interior design company in Bareilly? MTBOSS offers design, execution, materials and support under one roof. Call +91 94584 10866.",

  keywords:
    "interior design company Bareilly, interior design firm Bareilly, interior designing company Bareilly, residential interior company Bareilly, commercial interior company Bareilly, turnkey interior Bareilly, interior contractor Bareilly, interior design and execution Bareilly, interior company vs freelancer Bareilly, MTBOSS Construction Private Limited, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, interior design quote Bareilly",

  alternates: {
    canonical: "https://www.mtboss.in/interior-design-company-bareilly",
  },

  openGraph: {
    title: "Interior Design Company in Bareilly | MTBOSS",

    description:
      "Choosing an interior design company in Bareilly? MTBOSS offers design, execution, materials and support under one roof. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-design-company-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-design-company-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Design Company in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Design Company in Bareilly | MTBOSS",

    description:
      "Choosing an interior design company in Bareilly? MTBOSS offers design, execution, materials and support under one roof. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-design-company-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-design-company-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-design-company-bareilly.jpg",
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
      "Interior Design Company",
      "Interior Design Firm",
      "Interior Designing Company",
      "Residential Interior Design",
      "Commercial Interior Design",
      "Turnkey Interior",
      "Interior Contractor",
      "Interior Design and Execution",
      "Interior Design Consultation",
      "Interior Renovation",
      "Interior Design Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Design Services in Bareilly",
    description:
      "MTBOSS provides interior design services in Bareilly for homes, flats, offices, showrooms and clinics, including full home interiors, living and dining areas, modular kitchens, bedrooms and wardrobes, puja room design, false ceilings and lighting, flooring and wall finishes, woodwork and custom furniture, bathroom interiors, commercial interiors, coordination with construction, material supply, renovation and remodelling.",
    url: "https://www.mtboss.in/interior-design-company-bareilly",
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
      "Interior Design Company, Interior Design Firm, Residential Interior Design, Commercial Interior Design, Turnkey Interior, Interior Contractor and Interior Design and Execution",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior design company do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An interior design company plans and delivers interior work, including design, estimates, coordination of trades, material supply, execution and handover, usually under one agreement.",
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
        name: "What is the difference between an interior design company and a freelancer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A company usually handles design and execution together and provides written terms and a defined process, while a freelancer may focus on design and leave execution to others. The right choice depends on your project and how much coordination you want to manage.",
        },
      },
      {
        "@type": "Question",
        name: "Do you handle both homes and commercial spaces?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS plans residential interiors and can discuss commercial spaces such as offices, showrooms and clinics. Share your requirements to confirm the scope.",
        },
      },
      {
        "@type": "Question",
        name: "What documents will I receive?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Expect a written scope, itemised estimate, material specifications, design drawings, timeline, payment schedule and a handover checklist. Confirm the details with the team before work begins.",
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
        name: "Interior Design Company in Bareilly",
        item: "https://www.mtboss.in/interior-design-company-bareilly",
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