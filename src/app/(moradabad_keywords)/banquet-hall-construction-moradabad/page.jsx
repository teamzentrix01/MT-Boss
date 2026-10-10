// app/(moradabad_keywords)/banquet-hall-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Banquet Hall Construction in Moradabad | MTBOSS",

  description:
    "Planning banquet hall construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "banquet hall construction Moradabad, banquet hall builder Moradabad, banquet hall contractor Moradabad, banquet hall design Moradabad, event venue construction Moradabad, party hall construction Moradabad, conference hall construction Moradabad, rooftop banquet construction Moradabad, hotel banquet construction Moradabad, banquet hall construction cost Moradabad, commercial construction company Moradabad, construction company in Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/banquet-hall-construction-in-moradabad",
  },

  openGraph: {
    title: "Banquet Hall Construction in Moradabad | MTBOSS",

    description:
      "Planning banquet hall construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/banquet-hall-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-banquet-hall-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Banquet Hall Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Banquet Hall Construction in Moradabad | MTBOSS",

    description:
      "Planning banquet hall construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-banquet-hall-construction-moradabad.jpg",
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
    url: "https://www.mtboss.in/banquet-hall-construction-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-banquet-hall-construction-moradabad.jpg",
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
      "Banquet Hall Construction",
      "Banquet Hall Builder",
      "Banquet Hall Contractor",
      "Banquet Hall Design",
      "Event Venue Construction",
      "Party Hall Construction",
      "Conference Hall Construction",
      "Rooftop Banquet Construction",
      "Hotel Banquet Construction",
      "Banquet Hall Construction Cost Estimation",
      "Commercial Construction",
      "Building Renovation",
      "Building Extension",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Banquet Hall Construction Services in Moradabad",
    description:
      "MTBOSS provides banquet hall construction in Moradabad for stand-alone banquet halls, partitioned halls, rooftop banquets, hotel or restaurant banquets and conference halls, including design coordination, structure, pre-function foyer, stage and AV provisions, acoustic planning, air conditioning provisions, kitchen and pantry, green rooms and VIP rooms, facade, services provisions, washrooms, waterproofing, flooring, finishing, interiors, outdoor works and final handover.",
    url: "https://www.mtboss.in/banquet-hall-construction-in-moradabad",
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
      "Banquet Hall Construction, Banquet Hall Builder, Banquet Hall Contractor, Banquet Hall Design, Event Venue Construction, Party Hall Construction, Conference Hall Construction, Rooftop Banquet Construction and Hotel Banquet Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is banquet hall construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Banquet hall construction is the planning and building of an indoor event venue, including the hall, foyer, kitchen, rooms, parking, services and finishing, from design to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS build banquet halls in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS builds residential projects, from affordable housing to luxury villas, in Moradabad and Bareilly, and offers construction services for other buildings. Share your plan with the team to confirm the scope for your banquet hall.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between a banquet hall and a marriage hall?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The terms overlap. A banquet hall usually means an enclosed, air-conditioned venue for many kinds of events, while a marriage hall often includes open lawns and focuses on weddings. Your plot and event plan matter more than the name.",
        },
      },
      {
        "@type": "Question",
        name: "Can one banquet hall be divided into smaller halls?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, movable partitions can split a large hall for smaller events, though they need careful planning for sound separation and services. Discuss this with the team at the design stage.",
        },
      },
      {
        "@type": "Question",
        name: "Can I build a banquet hall on a rooftop?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In some cases, yes, if the structure is designed for the load and local rules allow it. A site visit and structural assessment will show what is possible.",
        },
      },
      {
        "@type": "Question",
        name: "How much does banquet hall construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Banquet hall construction cost depends on built-up area, roof span, number of halls, air conditioning, design, material and finish level, services scope and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
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
        name: "Banquet Hall Construction in Moradabad",
        item: "https://www.mtboss.in/banquet-hall-construction-in-moradabad",
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