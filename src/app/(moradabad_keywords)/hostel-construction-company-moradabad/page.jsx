// app/(moradabad_keywords)/hostel-construction-company-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Hostel Construction Company in Moradabad | MTBoss",

  description:
    "Looking for a hostel construction company in Moradabad? MTBoss offers design, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "hostel construction company Moradabad, hostel building construction Moradabad, hostel contractor Moradabad, hostel building design Moradabad, student hostel construction Moradabad, PG building construction Moradabad, boys hostel construction Moradabad, girls hostel construction Moradabad, hostel construction cost Moradabad, commercial construction company Moradabad, construction company in Moradabad, MTBoss Moradabad, MTBoss Kanth Road, MTBoss budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.MTBoss.in/hostel-construction-company-in-moradabad",
  },

  openGraph: {
    title: "Hostel Construction Company in Moradabad | MTBoss",

    description:
      "Looking for a hostel construction company in Moradabad? MTBoss offers design, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.MTBoss.in/hostel-construction-company-in-moradabad",

    siteName: "MTBoss Construction Private Limited",

    images: [
      {
        url: "https://www.MTBoss.in/og-hostel-construction-company-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Hostel Construction Company in Moradabad - MTBoss",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Hostel Construction Company in Moradabad | MTBoss",

    description:
      "Looking for a hostel construction company in Moradabad? MTBoss offers design, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.MTBoss.in/og-hostel-construction-company-moradabad.jpg",
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
    url: "https://www.MTBoss.in/hostel-construction-company-in-moradabad",
    telephone: "+91-9458410866",
    email: "MTBoss2016@gmail.com",
    image:
      "https://www.MTBoss.in/og-hostel-construction-company-moradabad.jpg",
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
      "Hostel Construction Company",
      "Hostel Building Construction",
      "Hostel Contractor",
      "Hostel Building Design",
      "Student Hostel Construction",
      "PG Building Construction",
      "Boys Hostel Construction",
      "Girls Hostel Construction",
      "Hostel Construction Cost Estimation",
      "Commercial Construction",
      "Building Renovation",
      "Building Extension",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hostel Construction Services in Moradabad",
    description:
      "MTBoss provides hostel construction in Moradabad for boys hostels, girls hostels, PG buildings and institutional hostels, including design coordination, structure, staircase and lift provisions, facade, services provisions, washroom planning, mess and kitchen provisions, waterproofing, flooring, finishing, interiors, security-related provisions, outdoor works and final handover.",
    url: "https://www.MTBoss.in/hostel-construction-company-in-moradabad",
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
      "Hostel Construction Company, Hostel Building Construction, Hostel Contractor, Hostel Building Design, Student Hostel Construction, PG Building Construction, Boys Hostel Construction and Girls Hostel Construction",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is hostel construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hostel construction is the planning and building of a residential building for students or working people, including rooms, washrooms, common areas, services and finishing, from design to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBoss build hostels in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBoss builds residential projects, from affordable housing to luxury villas, in Moradabad and Bareilly, and offers construction services for other buildings. Share your plan with the team to confirm the scope for your hostel.",
        },
      },
      {
        "@type": "Question",
        name: "Can you build separate hostels for boys and girls?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Separate wings or buildings can be planned with their own entries, common areas and security provisions. Share your requirements so the team can design the right layout.",
        },
      },
      {
        "@type": "Question",
        name: "Should hostel rooms have attached washrooms?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Attached washrooms are popular with residents and add cost, while common washrooms save money but need enough fixtures and good ventilation. The right choice depends on your budget and the kind of residents you want.",
        },
      },
      {
        "@type": "Question",
        name: "Can I add more rooms or floors later?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, if the foundation, columns and staircase are designed for the extra load from the start. Tell the team about this plan at the first consultation.",
        },
      },
      {
        "@type": "Question",
        name: "How much does hostel construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hostel construction cost depends on built-up area, number of floors, room types, washrooms, material and finish level, services scope and site conditions. MTBoss offers a free Budget Calculator and detailed quote option.",
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
        name: "Hostel Construction Company in Moradabad",
        item: "https://www.MTBoss.in/hostel-construction-company-in-moradabad",
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