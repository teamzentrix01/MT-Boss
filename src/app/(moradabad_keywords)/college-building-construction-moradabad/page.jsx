// app/(moradabad_keywords)/college-building-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "College Building Construction in Moradabad | MTBOSS",

  description:
    "Planning college building construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "college building construction Moradabad, college campus construction Moradabad, college building contractor Moradabad, college building design Moradabad, educational building construction Moradabad, classroom block construction Moradabad, hostel building construction Moradabad, institutional building construction Moradabad, college building construction cost Moradabad, commercial construction company Moradabad, construction company in Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/college-building-construction-in-moradabad",
  },

  openGraph: {
    title: "College Building Construction in Moradabad | MTBOSS",

    description:
      "Planning college building construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/college-building-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-college-building-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "College Building Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "College Building Construction in Moradabad | MTBOSS",

    description:
      "Planning college building construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-college-building-construction-moradabad.jpg",
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
    url: "https://www.mtboss.in/college-building-construction-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-college-building-construction-moradabad.jpg",
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
      "College Building Construction",
      "College Campus Construction",
      "College Building Contractor",
      "College Building Design",
      "Educational Building Construction",
      "Classroom Block Construction",
      "Hostel Building Construction",
      "Institutional Building Construction",
      "College Building Construction Cost Estimation",
      "Commercial Construction",
      "Building Renovation",
      "Building Extension",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "College Building Construction Services in Moradabad",
    description:
      "MTBOSS provides college building construction in Moradabad for academic blocks, laboratory and library blocks, auditoriums, hostels, canteens and full campuses, including design coordination, structure, facade, services provisions, laboratory provisions, waterproofing, flooring, finishing, interiors, outdoor works and final handover.",
    url: "https://www.mtboss.in/college-building-construction-in-moradabad",
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
      "College Building Construction, College Campus Construction, Educational Building Construction, Classroom Block Construction, Hostel Building Construction, Institutional Building Construction and College Building Design",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is college building construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "College building construction is the planning and building of academic, hostel or campus buildings, including structure, services and finishing, from design to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS build college buildings in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS builds residential projects, from affordable housing to luxury villas, in Moradabad and Bareilly, and offers construction services for other buildings. Share your plan with the team to confirm the scope for your college building.",
        },
      },
      {
        "@type": "Question",
        name: "Can a college be built in phases?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can start with the main academic block and essential services, then add labs, library, auditorium or hostel in later phases, as long as the master plan and services are designed for the full campus from the start.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to follow any special norms for a college building?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Educational institutions may need to meet infrastructure norms set by their affiliating university or regulatory body, in addition to local building rules. Confirm the requirements with the relevant authorities and your consultants before design begins.",
        },
      },
      {
        "@type": "Question",
        name: "Can you build a hostel along with the college?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, hostels can be planned as part of the campus. Share the number of students and facilities you want so the team can plan rooms, washrooms, mess areas and services.",
        },
      },
      {
        "@type": "Question",
        name: "How much does college building construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "College building construction cost depends on built-up area, number of floors, type of blocks, structural requirements, material and finish level, services scope and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
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
        name: "College Building Construction in Moradabad",
        item: "https://www.mtboss.in/college-building-construction-in-moradabad",
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