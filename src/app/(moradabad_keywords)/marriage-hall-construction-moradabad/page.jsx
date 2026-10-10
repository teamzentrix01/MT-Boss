// app/(moradabad_keywords)/marriage-hall-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Marriage Hall Construction in Moradabad | MTBOSS",

  description:
    "Planning marriage hall construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "marriage hall construction Moradabad, marriage hall builder Moradabad, marriage hall contractor Moradabad, marriage hall design Moradabad, banquet hall construction Moradabad, wedding lawn construction Moradabad, function hall construction Moradabad, community hall construction Moradabad, marriage hall construction cost Moradabad, commercial construction company Moradabad, construction company in Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/marriage-hall-construction-in-moradabad",
  },

  openGraph: {
    title: "Marriage Hall Construction in Moradabad | MTBOSS",

    description:
      "Planning marriage hall construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/marriage-hall-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-marriage-hall-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Marriage Hall Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Marriage Hall Construction in Moradabad | MTBOSS",

    description:
      "Planning marriage hall construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-marriage-hall-construction-moradabad.jpg",
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
    url: "https://www.mtboss.in/marriage-hall-construction-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-marriage-hall-construction-moradabad.jpg",
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
      "Marriage Hall Construction",
      "Marriage Hall Builder",
      "Marriage Hall Contractor",
      "Marriage Hall Design",
      "Banquet Hall Construction",
      "Wedding Lawn Construction",
      "Function Hall Construction",
      "Community Hall Construction",
      "Marriage Hall Construction Cost Estimation",
      "Commercial Construction",
      "Building Renovation",
      "Building Extension",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Marriage Hall Construction Services in Moradabad",
    description:
      "MTBOSS provides marriage hall construction in Moradabad for covered banquet halls, wedding lawns, hall-with-lawn complexes, community halls and resort-style venues, including design coordination, structure, stage and mandap area, dining area planning, kitchen and catering provisions, bridal and groom rooms, facade, services provisions, washrooms, waterproofing, flooring, finishing, interiors, outdoor works and final handover.",
    url: "https://www.mtboss.in/marriage-hall-construction-in-moradabad",
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
      "Marriage Hall Construction, Marriage Hall Builder, Marriage Hall Contractor, Marriage Hall Design, Banquet Hall Construction, Wedding Lawn Construction, Function Hall Construction and Community Hall Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is marriage hall construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Marriage hall construction is the planning and building of a venue for weddings and other celebrations, including the hall, lawn, kitchen, rooms, parking, services and finishing, from design to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS build marriage halls in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS builds residential projects, from affordable housing to luxury villas, in Moradabad and Bareilly, and offers construction services for other buildings. Share your plan with the team to confirm the scope for your marriage hall.",
        },
      },
      {
        "@type": "Question",
        name: "Should I build a covered hall, a lawn, or both?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on your plot, budget and the events you want to host. A covered hall works in all weather, a lawn adds an open-air option, and a combination offers the most flexibility. The team can help you compare the options after a site visit.",
        },
      },
      {
        "@type": "Question",
        name: "How much parking does a marriage hall need?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Requirements depend on the size and capacity of the venue and on local rules. Confirm the norms with the relevant authorities and discuss the layout with the team early, since parking affects the plot plan.",
        },
      },
      {
        "@type": "Question",
        name: "Can I build the hall in phases?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can start with the main hall and essential services, then add the lawn, rooms or a second hall later, as long as the structure and services are planned for the full venue from the start.",
        },
      },
      {
        "@type": "Question",
        name: "How much does marriage hall construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Marriage hall construction cost depends on built-up area, roof span, guest capacity, design, material and finish level, cooling, services scope and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
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
        name: "Marriage Hall Construction in Moradabad",
        item: "https://www.mtboss.in/marriage-hall-construction-in-moradabad",
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