// app/(bareilly_keywords)/interior-designer-for-school-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for School in Bareilly | MTBOSS",

  description:
    "Need an interior designer for your school in Bareilly? Plan safe classrooms, labs, libraries and play areas with MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior designer for school Bareilly, school interior design Bareilly, classroom interior design Bareilly, preschool interior design Bareilly, play school interior Bareilly, school library design Bareilly, school lab interior Bareilly, school renovation Bareilly, educational interior Bareilly, coaching centre interior Bareilly, commercial interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, school interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-school-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for School in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your school in Bareilly? Plan safe classrooms, labs, libraries and play areas with MTBOSS. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-designer-for-school-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-school-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for School in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for School in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your school in Bareilly? Plan safe classrooms, labs, libraries and play areas with MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-designer-school-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-designer-for-school-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-interior-designer-school-bareilly.jpg",
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
      "Interior Designer for School",
      "School Interior Design",
      "Classroom Interior Design",
      "Preschool Interior Design",
      "Play School Interior",
      "School Library Design",
      "School Lab Interior",
      "School Renovation",
      "Educational Interior Design",
      "Coaching Centre Interior",
      "Commercial Interior Design",
      "School Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "School Interior Design Services in Bareilly",
    description:
      "MTBOSS provides school interior design services in Bareilly for preschools, primary and secondary schools, coaching centres, activity centres and hostels. Services include space planning, classroom design, preschool and play areas, laboratory interiors, libraries, reception and administration areas, corridors and staircases, washrooms, canteens, ceiling and lighting design, flooring and wall finishes, furniture and woodwork, services provisions, construction coordination, material supply, renovation and remodelling.",
    url: "https://www.mtboss.in/interior-designer-for-school-in-bareilly",
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
        name: "Bareilly",
      },
      {
        "@type": "City",
        name: "Moradabad",
      },
    ],
    serviceType:
      "Interior Designer for School, School Interior Design, Classroom Interior Design, Preschool Interior Design, Play School Interior, School Library Design, School Lab Interior, School Renovation, Educational Interior Design and Coaching Centre Interior",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a school interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A school interior designer plans classrooms, labs, library, reception, washrooms and common areas, including layouts, lighting, furniture, finishes and safety, and coordinates the work until the school is ready.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide school interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your school.",
        },
      },
      {
        "@type": "Question",
        name: "Can you design a preschool or play school?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the planning approach applies to preschools, primary schools and larger institutions. Preschool spaces focus on safety, soft finishes, bright colours and child-height fittings. Share your size and age group, and the team can suggest options.",
        },
      },
      {
        "@type": "Question",
        name: "Can the work be done during school vacations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In many cases, yes, and it is often the best time for major work. The team can plan phases around your academic calendar, exams and events.",
        },
      },
      {
        "@type": "Question",
        name: "Do you supply smart boards, lab equipment and school furniture?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Smart boards, lab equipment and specialist items are usually supplied by specialist vendors. MTBOSS plans and builds the interior and civil work, and coordinates with your vendors so provisions fit together.",
        },
      },
      {
        "@type": "Question",
        name: "How can a school keep costs under control?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Approve one model classroom first, standardise furniture and finishes, plan services together, choose durable materials and keep a contingency for changes.",
        },
      },
      {
        "@type": "Question",
        name: "How much does school interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on total area, number and type of spaces, finish level, flooring, washrooms, lighting and ventilation, furniture and building condition. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the MTBOSS office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The office is located at Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh.",
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
        name: "Interior Designer for School in Bareilly",
        item: "https://www.mtboss.in/interior-designer-for-school-in-bareilly",
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