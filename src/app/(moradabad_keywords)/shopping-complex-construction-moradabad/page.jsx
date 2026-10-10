// app/(moradabad_keywords)/shopping-complex-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Shopping Complex Construction in Moradabad | MTBOSS",

  description:
    "Planning shopping complex construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "shopping complex construction Moradabad, shopping complex builder Moradabad, shopping complex contractor Moradabad, shopping complex design Moradabad, commercial complex construction Moradabad, shop building construction Moradabad, showroom building Moradabad, mall construction Moradabad, shopping complex construction cost Moradabad, commercial construction company Moradabad, construction company in Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/shopping-complex-construction-in-moradabad",
  },

  openGraph: {
    title: "Shopping Complex Construction in Moradabad | MTBOSS",

    description:
      "Planning shopping complex construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/shopping-complex-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-shopping-complex-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Shopping Complex Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Shopping Complex Construction in Moradabad | MTBOSS",

    description:
      "Planning shopping complex construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-shopping-complex-construction-moradabad.jpg",
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
    url: "https://www.mtboss.in/shopping-complex-construction-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-shopping-complex-construction-moradabad.jpg",
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
      "Shopping Complex Construction",
      "Shopping Complex Builder",
      "Shopping Complex Contractor",
      "Shopping Complex Design",
      "Commercial Complex Construction",
      "Shop Building Construction",
      "Showroom Building",
      "Mall Construction",
      "Shopping Complex Construction Cost Estimation",
      "Commercial Construction",
      "Building Renovation",
      "Building Extension",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Shopping Complex Construction Services in Moradabad",
    description:
      "MTBOSS provides shopping complex construction in Moradabad for small shop rows, multi-floor shopping complexes, showroom buildings, mixed-use commercial buildings and mall-style complexes, including design coordination, structure, basement or stilt parking, lift and staircase provisions, facade, services provisions, shop shutters and doors, common washrooms, waterproofing, flooring, finishing, interiors, outdoor works and final handover.",
    url: "https://www.mtboss.in/shopping-complex-construction-in-moradabad",
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
      "Shopping Complex Construction, Shopping Complex Builder, Shopping Complex Contractor, Shopping Complex Design, Commercial Complex Construction, Shop Building Construction, Showroom Building and Mall Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is shopping complex construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Shopping complex construction is the planning and building of a commercial building with multiple shops, showrooms or offices, including its structure, parking, services and finishing, from design to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS build shopping complexes in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS builds residential projects, from affordable housing to luxury villas, in Moradabad and Bareilly, and offers construction services for other buildings. Share your plan with the team to confirm the scope for your shopping complex.",
        },
      },
      {
        "@type": "Question",
        name: "How many floors can I build on my plot?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on your plot size, road width, local building rules and the sanctioned map. Confirm the permitted height with the relevant authorities and your consultants before finalising the design.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need parking in a shopping complex?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Parking is usually required by building rules and is also important for attracting customers. The requirement depends on the size and use of the building, so confirm it with the relevant authorities and discuss the options with the team.",
        },
      },
      {
        "@type": "Question",
        name: "Can I add more floors later?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, if the foundation, columns and staircase are designed for the extra load from the start. Tell the team about this plan at the first consultation.",
        },
      },
      {
        "@type": "Question",
        name: "How much does shopping complex construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Shopping complex construction cost depends on built-up area, number of floors, structural requirements, parking type, lift, material and finish level, services scope and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
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
        name: "Shopping Complex Construction in Moradabad",
        item: "https://www.mtboss.in/shopping-complex-construction-in-moradabad",
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