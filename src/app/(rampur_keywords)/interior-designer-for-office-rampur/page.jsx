// app/(bareilly_keywords)/office-interior-designer-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Office Interior Designer Rampur | Workspace Design – MTBOSS",

  description:
    "MTBOSS designs and builds office interiors Rampur: workstations, cabins, meeting rooms, reception and branding, with clear pricing and on-time handover. Request a free consultation.",

  keywords:
    "office interior designer Rampur, office interior designer in Rampur, office interior design Rampur, workspace interior design Rampur, office design Rampur, office renovation Rampur, workstation design Rampur, office cabin design Rampur, meeting room design Rampur, reception design Rampur, office branding Rampur, office partition design Rampur, false ceiling Rampur, office furniture Rampur, office electrical planning Rampur, office data points Rampur, office AC planning Rampur, corporate office interior Rampur, startup office interior Rampur, MTBOSS Rampur, MTBOSS Moradabad, MTBOSS Bareilly, office interior consultation Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/office-interior-designer-rampur",
  },

  openGraph: {
    title: "Office Interior Designer Rampur | Workspace Design – MTBOSS",

    description:
      "MTBOSS designs and builds office interiors Rampur: workstations, cabins, meeting rooms, reception and branding, with clear pricing and on-time handover. Request a free consultation.",

    url: "https://www.mtboss.in/office-interior-designer-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-office-interior-designer-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Office Interior Designer Rampur - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Office Interior Designer Rampur | Workspace Design – MTBOSS",

    description:
      "MTBOSS designs and builds office interiors Rampur: workstations, cabins, meeting rooms, reception and branding, with clear pricing and on-time handover. Request a free consultation.",

    images: [
      "https://www.mtboss.in/og-office-interior-designer-rampur.jpg",
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
    url: "https://www.mtboss.in/office-interior-designer-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-office-interior-designer-rampur.jpg",
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
        name: "Rampur",
      },
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
      "Office Interior Design",
      "Workspace Interior Design",
      "Office Interior Designer",
      "Workstation Design",
      "Office Cabin Design",
      "Meeting Room Design",
      "Reception Design",
      "Office Branding",
      "Office Partition Design",
      "False Ceiling Service",
      "Office Renovation",
      "Office Interior Services Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Office Interior Designer in Rampur",
    description:
      "MTBOSS designs and builds office interiors in Rampur: workstations, cabins, meeting rooms, reception and branding, with clear pricing and on-time handover. Services include space planning and workstation layout, cabin and meeting room design, reception and waiting area design, conference room design, pantry and break area planning, server, storage and records room planning, false ceiling and lighting design, partition systems in glass, wood or gypsum, flooring, wall finishes and painting, and custom furniture and storage units.",
    url: "https://www.mtboss.in/office-interior-designer-rampur",
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
        name: "Rampur",
      },
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
      "Office Interior Design, Workspace Interior Design, Office Interior Designer, Workstation Design, Office Cabin Design, Meeting Room Design, Reception Design, Office Branding, Office Partition Design, False Ceiling Service, Office Renovation and Office Interior Services Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an office interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An office interior designer plans layouts, workstations, cabins, meeting rooms, lighting, finishes and branding, and manages execution until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS design a small office?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS handles offices of all sizes, from a single room to a larger workspace.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS plan electrical and data points?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS plans power, data and AC provisions as part of the design and execution.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS renovate while my team continues to work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS can plan phased work and schedules to reduce disruption, depending on the scope.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide 3D designs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can review visuals before work begins.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS follow my company's branding?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS can include logos, colours and signage in the design.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS serve Rampur and nearby cities?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS serves Rampur, Moradabad and Bareilly and can discuss nearby locations.",
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
        name: "Office Interior Designer Rampur",
        item: "https://www.mtboss.in/office-interior-designer-rampur",
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