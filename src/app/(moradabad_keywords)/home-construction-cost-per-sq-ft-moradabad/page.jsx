// app/(moradabad_keywords)/home-construction-cost-per-sq-ft-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Home Construction Cost Per Sq Ft in Moradabad | MTBOSS",

  description:
    "Planning your home budget in Moradabad? Understand construction cost per sq ft and get an estimate from MTBOSS. Call +91 94584 10866 for a quote.",

  keywords:
    "home construction cost per sq ft Moradabad, house construction cost Moradabad, construction rate per square feet Moradabad, house building cost Uttar Pradesh, 1000 sq ft house cost Moradabad, home construction budget Moradabad, MTBOSS Moradabad, MTBOSS budget calculator, building material cost Moradabad, MTBOSS Kanth Road, house construction cost calculator, home construction quote Moradabad, MTBOSS construction materials, duplex house cost Moradabad, construction cost estimate Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/home-construction-cost-per-sq-ft-in-moradabad",
  },

  openGraph: {
    title: "Home Construction Cost Per Sq Ft in Moradabad | MTBOSS",

    description:
      "Planning your home budget in Moradabad? Understand construction cost per sq ft and get an estimate from MTBOSS. Call +91 94584 10866 for a quote.",

    url: "https://www.mtboss.in/home-construction-cost-per-sq-ft-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-home-construction-cost-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Home Construction Cost Per Sq Ft in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Home Construction Cost Per Sq Ft in Moradabad | MTBOSS",

    description:
      "Planning your home budget in Moradabad? Understand construction cost per sq ft and get an estimate from MTBOSS. Call +91 94584 10866 for a quote.",

    images: [
      "https://www.mtboss.in/og-home-construction-cost-moradabad.jpg",
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

    url: "https://www.mtboss.in/home-construction-cost-per-sq-ft-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image:
      "https://www.mtboss.in/og-home-construction-cost-moradabad.jpg",

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
        "@type": "AdministrativeArea",
        name: "Moradabad District",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],

    serviceType: [
      "Home Construction Cost Estimation",
      "House Construction Cost Per Square Foot",
      "Residential Construction Budget Planning",
      "Independent House Cost Estimation",
      "Duplex House Cost Estimation",
      "Construction Budget Calculator",
      "Home Construction Material Supply",
      "Civil Construction Services",
      "Residential Construction Services",
      "Construction Quote Services",
      "Property Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Home Construction Cost Per Sq Ft Estimate in Moradabad",

    description:
      "MTBOSS provides home construction cost estimation in Moradabad, including per-square-foot budget planning, civil construction, wholesale building material supply and residential construction quotes.",

    url: "https://www.mtboss.in/home-construction-cost-per-sq-ft-in-moradabad",

    provider: {
      "@type": "GeneralContractor",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "mtboss2016@gmail.com",
      url: "https://www.mtboss.in",
    },

    areaServed: {
      "@type": "City",
      name: "Moradabad",
    },

    serviceType:
      "Home Construction Cost Estimation, House Construction Budget Planning and Per Square Foot Construction Cost Estimates",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "What is the typical home construction cost per sq ft in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Regional Uttar Pradesh benchmarks broadly range from around ₹1,500 to ₹2,800 per sq ft depending on finish level, design complexity, material choices and location. Smaller UP cities often fall toward the lower-to-middle end of this range.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide a per-sq-ft cost estimate for home construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS provides home construction cost estimates using its free Budget Calculator, based on your plot, planned built-up area, number of floors and selected finish level.",
        },
      },
      {
        "@type": "Question",
        name: "How much does finish level affect home construction cost per sq ft?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Industry benchmarks suggest that each step up in finish level, from basic to standard to premium, can add roughly ₹200 to ₹400 per sq ft to the overall home construction rate.",
        },
      },
      {
        "@type": "Question",
        name: "Does the MTBOSS estimate include modular kitchens and interiors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Modular kitchens, wardrobes, premium furnishings, detailed false ceilings and specialised interiors are typically discussed and budgeted as separate line items from the core civil construction rate.",
        },
      },
      {
        "@type": "Question",
        name: "How much would a 1000 sq ft house cost to build in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "General Uttar Pradesh benchmarks estimate approximately ₹18 to ₹22 lakh for a basic 1,000 sq ft house, while a premium finish can range from around ₹27 to ₹32 lakh. A plot-specific MTBOSS estimate can provide a more accurate figure.",
        },
      },
      {
        "@type": "Question",
        name: "How can I get a precise construction cost estimate for my home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use the free MTBOSS Budget Calculator or contact the team directly with your plot size, built-up area, number of floors, finish-level preference and interior requirements.",
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
        name: "Home Construction Cost Per Sq Ft in Moradabad",
        item: "https://www.mtboss.in/home-construction-cost-per-sq-ft-in-moradabad",
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