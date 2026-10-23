// app/(moradabad_keywords)/apartment-construction-company-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Apartment Construction Company in Moradabad | MTBoss",

  description:
    "Looking for an apartment construction company in Moradabad? MTBoss plans, builds and hands over multi-storey homes. Call +91 94584 10866.",

  keywords:
    "apartment construction company Moradabad, apartment building construction Moradabad, flat construction Moradabad, multi-storey residential building Moradabad, apartment builder Moradabad, apartment contractor Moradabad, residential apartment construction Moradabad, builder floor construction Moradabad, apartment construction cost Moradabad, housing project construction Moradabad, residential construction company Moradabad, MTBoss Moradabad, MTBoss Kanth Road, MTBoss budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.MTBoss.in/apartment-construction-company-in-moradabad",
  },

  openGraph: {
    title: "Apartment Construction Company in Moradabad | MTBoss",

    description:
      "Looking for an apartment construction company in Moradabad? MTBoss plans, builds and hands over multi-storey homes. Call +91 94584 10866.",

    url: "https://www.MTBoss.in/apartment-construction-company-in-moradabad",

    siteName: "MTBoss Construction Private Limited",

    images: [
      {
        url: "https://www.MTBoss.in/og-apartment-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Apartment Construction Company in Moradabad - MTBoss",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Apartment Construction Company in Moradabad | MTBoss",

    description:
      "Looking for an apartment construction company in Moradabad? MTBoss plans, builds and hands over multi-storey homes. Call +91 94584 10866.",

    images: [
      "https://www.MTBoss.in/og-apartment-construction-moradabad.jpg",
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
    name: "MTBoss Construction Private Limited",
    url: "https://www.MTBoss.in/apartment-construction-company-in-moradabad",
    telephone: "+91-9458410866",
    email: "MTBoss2016@gmail.com",
    image:
      "https://www.MTBoss.in/og-apartment-construction-moradabad.jpg",
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
      "Apartment Construction Company",
      "Apartment Building Construction",
      "Flat Construction",
      "Multi-Storey Residential Building",
      "Apartment Builder",
      "Apartment Contractor",
      "Residential Apartment Construction",
      "Builder Floor Construction",
      "Housing Project Construction",
      "Residential Construction",
      "Apartment Renovation",
      "Apartment Extension",
      "Construction Material Supply",
      "Apartment Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Apartment Construction Services in Moradabad",
    description:
      "MTBoss provides apartment construction in Moradabad for landowners, developers and investors, including unit planning, structure, masonry, services provisions, waterproofing, flooring, finishing, facade, common areas and final handover.",
    url: "https://www.MTBoss.in/apartment-construction-company-in-moradabad",
    provider: {
      "@type": "GeneralContractor",
      name: "MTBoss Construction Private Limited",
      telephone: "+91-9458410866",
      email: "MTBoss2016@gmail.com",
      url: "https://www.MTBoss.in",
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
      "Apartment Construction, Apartment Building Construction, Flat Construction, Multi-Storey Residential Building, Builder Floor Construction and Housing Project Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an apartment construction company do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An apartment construction company plans and builds multi-storey residential buildings, handling design coordination, structure, services, finishing, common areas and handover. Work may include unit layouts, lifts, parking, waterproofing and facade.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBoss build apartments in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBoss builds residential projects, including multi-storey residential buildings, in Moradabad and Bareilly. Share your plan with the team to confirm the scope for your apartment project.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBoss build builder floors or small flat buildings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, multi-storey residential buildings and builder-floor style projects can be discussed with the team based on your plot and plan.",
        },
      },
      {
        "@type": "Question",
        name: "Should I plan a lift in my apartment building?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For taller buildings, planning lift shafts, pits and access early is far cheaper than adding them later, even if lift installation happens in a later phase.",
        },
      },
      {
        "@type": "Question",
        name: "What approvals does an apartment building need?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Requirements usually include a sanctioned building plan, fire safety provisions, utility connections and, depending on the project, real estate registration and other clearances. Rules vary, so confirm with relevant authorities and your consultants.",
        },
      },
      {
        "@type": "Question",
        name: "How much does apartment construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Apartment construction cost depends on built-up area, number of floors, number and size of flats, structural design, lift and common systems, parking, finishing level, facade, common area finish, site conditions and material quality. MTBoss offers a free Budget Calculator and detailed quote option.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBoss supply building materials?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBoss supplies cement, TMT steel bars, bricks, tiles and paints through its wholesale material supply network, helping coordinate key materials during apartment construction.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the MTBoss office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The MTBoss office is located at Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh.",
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
        item: "https://www.MTBoss.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Construction Services",
        item: "https://www.MTBoss.in/construction-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Apartment Construction Company in Moradabad",
        item: "https://www.MTBoss.in/apartment-construction-company-in-moradabad",
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