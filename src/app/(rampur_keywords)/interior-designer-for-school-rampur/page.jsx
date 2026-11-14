// app/(bareilly_keywords)/school-interior-designer-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title:
    "School Interior Designer Rampur | Classroom & Campus – MTBOSS",
  description:
    "MTBOSS designs and builds school interiors Rampur: classrooms, labs, libraries, staff rooms and play areas with safe, durable and child-friendly design. Plan your school with us.",
  keywords:
    "school interior designer Rampur, school interior design Rampur, classroom interior design Rampur, school renovation Rampur, play school interior design Rampur, coaching institute interior design Rampur, school furniture design Rampur, school lab design Rampur, school library design Rampur, school campus design Rampur, MTBOSS Rampur",
  alternates: {
    canonical:
      "https://www.mtboss.in/school-interior-designer-rampur",
  },
  openGraph: {
    title:
      "School Interior Designer Rampur | Classroom & Campus – MTBOSS",
    description:
      "MTBOSS designs and builds school interiors Rampur: classrooms, labs, libraries, staff rooms and play areas with safe, durable and child-friendly design. Plan your school with us.",
    url:
      "https://www.mtboss.in/school-interior-designer-rampur",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url:
          "https://www.mtboss.in/og-school-interior-designer-rampur.jpg",
        width: 1200,
        height: 630,
        alt:
          "School Interior Designer in Rampur - Classroom and Campus Design - MTBOSS",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "School Interior Designer Rampur | Classroom & Campus – MTBOSS",
    description:
      "MTBOSS designs and builds school interiors Rampur: classrooms, labs, libraries, staff rooms and play areas with safe, durable and child-friendly design. Plan your school with us.",
    images: [
      "https://www.mtboss.in/og-school-interior-designer-rampur.jpg",
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
    url:
      "https://www.mtboss.in/school-interior-designer-rampur",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.mtboss.in/og-school-interior-designer-rampur.jpg",
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
        name: "Bareilly",
      },
      {
        "@type": "City",
        name: "Moradabad",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    serviceType: [
      "School Interior Design",
      "Classroom Interior Design",
      "School Renovation",
      "Play School Interior Design",
      "Coaching Institute Interior Design",
      "School Furniture Design",
      "School Lab Design",
      "School Library Design",
      "School Campus Design",
      "Interior Design Services",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "School Interior Designer in Rampur",
    description:
      "MTBOSS designs and builds school interiors in Rampur, including classrooms, science and computer labs, libraries, staff rooms, reception areas, activity rooms, play areas, washrooms, false ceilings, lighting, flooring, wall finishes, furniture, storage, electrical, plumbing and renovation work, with safe, durable and child-friendly design.",
    url:
      "https://www.mtboss.in/school-interior-designer-rampur",
    provider: {
      "@type": "InteriorDesignService",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "MTBOSS2016@gmail.com",
      url: "https://www.mtboss.in",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Rampur",
      },
      {
        "@type": "City",
        name: "Bareilly",
      },
      {
        "@type": "City",
        name: "Moradabad",
      },
    ],
    serviceType:
      "School Interior Design, Classroom Interior Design, School Renovation, Play School Interior Design, Coaching Institute Interior Design, School Furniture Design, School Lab Design, School Library Design and School Campus Design",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:
          "What school interior design services does MTBOSS offer in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "MTBOSS offers school interior design for classrooms, labs, libraries, staff rooms, reception areas, activity rooms, play areas, washrooms, false ceilings, lighting, flooring, wall finishes, furniture, storage, electrical, plumbing and renovation work.",
        },
      },
      {
        "@type": "Question",
        name:
          "Can MTBOSS design and build school interiors in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS provides design and construction support for school interiors, including classrooms, labs, libraries, staff rooms, play areas and renovation work, subject to the project scope and local requirements.",
        },
      },
      {
        "@type": "Question",
        name:
          "Can MTBOSS design play schools and coaching institutes?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS can design play schools, schools, coaching institutes and training centres, with layouts and finishes planned for safety, comfort and efficient use.",
        },
      },
      {
        "@type": "Question",
        name:
          "How much does school interior design cost in Rampur?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Cost depends on the size of the school, number of classrooms, finish level, furniture, lab and library requirements, lighting, washrooms, electrical and plumbing work. Request a consultation for a detailed estimate.",
        },
      },
      {
        "@type": "Question",
        name:
          "Can MTBOSS renovate a school during vacations?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS can plan major work during vacation periods and phase the remaining work around the academic calendar.",
        },
      },
      {
        "@type": "Question",
        name:
          "Does MTBOSS handle washrooms and waterproofing?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. MTBOSS can plan washrooms, plumbing coordination and waterproofing as part of the school interior project.",
        },
      },
      {
        "@type": "Question",
        name:
          "Where is the MTBOSS office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The office is located at Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh.",
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
        name: "School Interior Designer in Rampur",
        item:
          "https://www.mtboss.in/school-interior-designer-rampur",
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