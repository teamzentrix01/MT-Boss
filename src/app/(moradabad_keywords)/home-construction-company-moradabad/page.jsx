// app/(moradabad_keywords)/home-construction-company-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Home Construction Company in Moradabad | MTBOSS",

  description:
    "Looking for a home construction company in Moradabad? MTBOSS offers design, build and material supply together. Call +91 94584 10866 for a free quote.",

  keywords:
    "home construction company Moradabad, house construction Moradabad, residential construction company Moradabad, house builder Moradabad, home construction contractor Moradabad, duplex house construction Moradabad, MTBOSS Moradabad, house construction cost Moradabad, MTBOSS budget calculator, home construction materials Moradabad, MTBOSS Kanth Road, independent house construction Moradabad, house construction quote Moradabad, MTBOSS residential projects, Vastu house construction Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/home-construction-company-in-moradabad",
  },

  openGraph: {
    title: "Home Construction Company in Moradabad | MTBOSS",

    description:
      "Looking for a home construction company in Moradabad? MTBOSS offers design, build and material supply together. Call +91 94584 10866 for a free quote.",

    url: "https://www.mtboss.in/home-construction-company-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-home-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Home Construction Company in Moradabad - MTBOSS Construction",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Home Construction Company in Moradabad | MTBOSS",

    description:
      "Looking for a home construction company in Moradabad? MTBOSS offers design, build and material supply together. Call +91 94584 10866 for a free quote.",

    images: [
      "https://www.mtboss.in/og-home-construction-moradabad.jpg",
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

    url: "https://www.mtboss.in/home-construction-company-in-moradabad",

    telephone: "+91-9458410866",

    email: "mtboss2016@gmail.com",

    image: "https://www.mtboss.in/og-home-construction-moradabad.jpg",

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

    priceRange: "₹₹",

    serviceType: [
      "Home Construction",
      "Independent House Construction",
      "Duplex House Construction",
      "Residential Building Construction",
      "House Design and Planning",
      "Civil Construction Services",
      "Construction Material Supply",
      "Home Construction Cost Estimation",
      "Vastu House Planning",
      "Property Services",
      "Doorstep Home Maintenance Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: "Home Construction Services in Moradabad",

    description:
      "MTBOSS provides home design coordination, civil construction, independent house construction, duplex construction, wholesale building materials and cost estimation services in Moradabad.",

    url: "https://www.mtboss.in/home-construction-company-in-moradabad",

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
      "Home Construction, House Construction, Duplex Construction and Residential Civil Construction Services",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",

    mainEntity: [
      {
        "@type": "Question",
        name: "Does MTBOSS build homes in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Home construction is a specifically listed MTBOSS service category, combining design coordination with full civil construction.",
        },
      },
      {
        "@type": "Question",
        name: "What other residential projects does MTBOSS handle?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS handles independent houses, duplex homes and multi-storey family residences, alongside commercial and institutional construction.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get a free quote for my home construction project?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can request a quote through the Get a Construction Quote option on the MTBOSS website, or by calling or messaging the team on WhatsApp.",
        },
      },
      {
        "@type": "Question",
        name: "How can I estimate my home construction budget before contacting MTBOSS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can use the free online MTBOSS Budget Calculator to get an initial estimate before contacting the team for a detailed consultation.",
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
      {
        "@type": "Question",
        name: "Can I see examples of MTBOSS completed home construction projects?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The MTBOSS website includes a project gallery and blog section where prospective clients can review completed work.",
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
        name: "Home Construction Company in Moradabad",
        item: "https://www.mtboss.in/home-construction-company-in-moradabad",
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