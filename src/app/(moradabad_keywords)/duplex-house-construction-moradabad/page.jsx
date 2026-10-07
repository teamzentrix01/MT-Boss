// app/(moradabad_keywords)/duplex-house-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Duplex House Construction in Moradabad | MTBOSS",

  description:
    "Planning duplex house construction in Moradabad? MTBOSS offers custom design, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "duplex house construction Moradabad, duplex house builder Moradabad, duplex house design Moradabad, duplex house contractor Moradabad, duplex house construction cost Moradabad, two floor house construction Moradabad, G+1 house construction Moradabad, duplex elevation design Moradabad, small plot duplex Moradabad, independent house construction Moradabad, residential construction company Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/duplex-house-construction-in-moradabad",
  },

  openGraph: {
    title: "Duplex House Construction in Moradabad | MTBOSS",

    description:
      "Planning duplex house construction in Moradabad? MTBOSS offers custom design, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/duplex-house-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-duplex-house-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Duplex House Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Duplex House Construction in Moradabad | MTBOSS",

    description:
      "Planning duplex house construction in Moradabad? MTBOSS offers custom design, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-duplex-house-construction-moradabad.jpg",
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
    url: "https://www.mtboss.in/duplex-house-construction-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-duplex-house-construction-moradabad.jpg",
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
      "Duplex House Construction",
      "Duplex House Builder",
      "Duplex House Design",
      "Duplex House Contractor",
      "Two Floor House Construction",
      "G+1 House Construction",
      "Duplex Elevation Design",
      "Small Plot Duplex",
      "Independent House Construction",
      "Residential Construction",
      "Duplex Renovation",
      "Duplex Extension",
      "Construction Material Supply",
      "Duplex House Construction Cost Estimation",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Duplex House Construction Services in Moradabad",
    description:
      "MTBOSS provides duplex house construction in Moradabad for two-floor independent homes, including design coordination, structure, staircase, facade, services provisions, waterproofing, flooring, finishing, modular kitchen, interiors, outdoor works and final handover.",
    url: "https://www.mtboss.in/duplex-house-construction-in-moradabad",
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
      "Duplex House Construction, Two Floor House Construction, G+1 House Construction, Duplex Elevation Design, Small Plot Duplex and Independent House Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is duplex house construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Duplex house construction is the planning and building of a two-floor independent home, with an internal staircase connecting the levels, from design to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS build duplex houses in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS builds residential projects, including independent houses and luxury villas, in Moradabad and Bareilly. Share your plan with the team to confirm the scope for your duplex.",
        },
      },
      {
        "@type": "Question",
        name: "Can a duplex be built on a small plot?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. With careful planning of the staircase, room sizes and open areas, a duplex can work well even on a compact plot. A site visit and design discussion will show what fits.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between a duplex and a bungalow?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A duplex is a two-floor home that makes the most of a smaller plot, while a bungalow usually suggests a spacious home with open areas such as a verandah and garden. Your plot and budget matter more than the label.",
        },
      },
      {
        "@type": "Question",
        name: "Can I build one floor now and add the second later?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, if the foundation, columns and staircase provision are designed for it from the start. Tell the team about this plan at the first consultation.",
        },
      },
      {
        "@type": "Question",
        name: "How much does duplex house construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Duplex house construction cost depends on built-up area, design complexity, material and finish level, interior scope and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
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
        name: "Duplex House Construction in Moradabad",
        item: "https://www.mtboss.in/duplex-house-construction-in-moradabad",
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