// app/(moradabad_keywords)/showroom-construction-company-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Showroom Construction Company in Moradabad | MTBOSS",

  description:
    "Build your showroom with MTBOSS, a showroom construction company in Moradabad. Design, build and fit-out. Call +91 94584 10866 for a free quote.",

  keywords:
    "showroom construction company Moradabad, showroom construction Moradabad, showroom builder Moradabad, showroom contractor Moradabad, showroom building design Moradabad, showroom interior Moradabad, showroom facade Moradabad, car showroom construction Moradabad, furniture showroom construction Moradabad, showroom construction cost Moradabad, commercial construction company Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/showroom-construction-company-in-moradabad",
  },

  openGraph: {
    title: "Showroom Construction Company in Moradabad | MTBOSS",

    description:
      "Build your showroom with MTBOSS, a showroom construction company in Moradabad. Design, build and fit-out. Call +91 94584 10866 for a free quote.",

    url: "https://www.mtboss.in/showroom-construction-company-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-showroom-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Showroom Construction Company in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Showroom Construction Company in Moradabad | MTBOSS",

    description:
      "Build your showroom with MTBOSS, a showroom construction company in Moradabad. Design, build and fit-out. Call +91 94584 10866 for a free quote.",

    images: [
      "https://www.mtboss.in/og-showroom-construction-moradabad.jpg",
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
    "@type": "GeneralContractor",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/showroom-construction-company-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-showroom-construction-moradabad.jpg",
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
        name: "Moradabad",
      },
      {
        "@type": "City",
        name: "Bareilly",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    serviceType: [
      "Showroom Construction Company",
      "Showroom Construction",
      "Showroom Builder",
      "Showroom Contractor",
      "Showroom Building Design",
      "Showroom Interior",
      "Showroom Facade",
      "Car Showroom Construction",
      "Furniture Showroom Construction",
      "Commercial Construction",
      "Retail Showroom Construction",
      "Multi-Storey Showroom Construction",
      "Showroom Renovation",
      "Showroom Extension",
      "Construction Material Supply",
      "Showroom Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Showroom Construction Services in Moradabad",
    description:
      "MTBOSS provides showroom construction in Moradabad for vehicle, furniture, electronics, clothing, jewellery and multi-brand showrooms, including planning, structure, facade, flooring, finishing, services provisions, interior coordination and final handover.",
    url: "https://www.mtboss.in/showroom-construction-company-in-moradabad",
    provider: {
      "@type": "GeneralContractor",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "mtboss2016@gmail.com",
      url: "https://www.mtboss.in",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Moradabad",
      },
      {
        "@type": "City",
        name: "Bareilly",
      },
    ],
    serviceType:
      "Showroom Construction, Showroom Building Design, Showroom Interior, Showroom Facade, Car Showroom Construction, Furniture Showroom Construction and Commercial Showroom Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a showroom construction company do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A showroom construction company plans and builds showroom buildings, handling structure, facade, flooring, finishing, services provisions and handover. Work is often coordinated with interior planning and fit-out so the space supports display, customer flow and brand identity.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS offer showroom construction in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Commercial construction is part of the MTBOSS service list. MTBOSS also works as an architect and interior designer, so showroom building and interiors can be coordinated within one company.",
        },
      },
      {
        "@type": "Question",
        name: "What types of showrooms can MTBOSS build?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS can discuss construction scope for vehicle showrooms, furniture and home decor showrooms, electronics and appliance showrooms, clothing and lifestyle showrooms, jewellery and premium retail showrooms, building materials and hardware showrooms and multi-brand or multi-floor showrooms.",
        },
      },
      {
        "@type": "Question",
        name: "How much does showroom construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Showroom construction cost depends on built-up area, number of floors, facade design and glazing, structural needs, finishing level, services scope, interior and fit-out, parking and external development and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS supply building materials?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS supplies cement, TMT steel bars, bricks, tiles and paints through its wholesale material supply network, helping coordinate key materials during showroom construction.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS renovate an existing showroom or change its facade?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS offers renovation, repair, waterproofing and extension work for existing buildings, including facade upgrades and showroom makeovers. Share your requirements for a site assessment.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the MTBOSS office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The MTBOSS office is located at Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh.",
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
        name: "Construction Services",
        item: "https://www.mtboss.in/construction-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Showroom Construction Company in Moradabad",
        item: "https://www.mtboss.in/showroom-construction-company-in-moradabad",
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