// app/(bareilly_keywords)/interior-designer-for-office-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Office in Bareilly | MTBOSS",

  description:
    "Need an interior designer for your office in Bareilly? Plan workstations, cabins, lighting and branding with MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior designer for office Bareilly, office interior design Bareilly, office design Bareilly, corporate office interior Bareilly, small office interior Bareilly, workstation design Bareilly, office renovation Bareilly, co-working space interior Bareilly, CA and law office interior Bareilly, commercial interior Bareilly, office false ceiling Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, office interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-office-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Office in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your office in Bareilly? Plan workstations, cabins, lighting and branding with MTBOSS. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-designer-for-office-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-office-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Office in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Office in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your office in Bareilly? Plan workstations, cabins, lighting and branding with MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-designer-office-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-designer-for-office-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-designer-office-bareilly.jpg",
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
      "Interior Designer for Office",
      "Office Interior Design",
      "Office Design",
      "Corporate Office Interior",
      "Small Office Interior",
      "Workstation Design",
      "Office Renovation",
      "Co-working Space Interior",
      "CA and Law Office Interior",
      "Commercial Interior Design",
      "Office False Ceiling",
      "Office Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Office Interior Design Services in Bareilly",
    description:
      "MTBOSS provides office interior design services in Bareilly for small businesses, startups, professional offices, corporate offices, customer-facing offices, coaching centres, co-working spaces and clinics. Services include space planning, reception and waiting areas, workstations and cabins, meeting rooms, pantry areas, ceiling and lighting design, partitions, flooring and wall finishes, furniture and woodwork, electrical and data provisions, branding, construction coordination, material supply, renovation and remodelling.",
    url: "https://www.mtboss.in/interior-designer-for-office-in-bareilly",
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
      "Interior Designer for Office, Office Interior Design, Corporate Office Interior, Small Office Interior, Workstation Design, Office Renovation, Co-working Space Interior, CA and Law Office Interior and Commercial Interior Design",
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
          text: "An office interior designer plans the workspace, including layout, workstations, cabins, meeting rooms, lighting, finishes and branding, and coordinates the work until the office is ready.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide office interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your office.",
        },
      },
      {
        "@type": "Question",
        name: "Can you design a small office or startup space?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the planning approach applies to small offices, startups, professional practices and larger workplaces alike. Share your team size, space and budget, and the team can suggest options.",
        },
      },
      {
        "@type": "Question",
        name: "Can the work be done while we keep working?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In many cases, yes, by phasing the work zone by zone and scheduling noisy work outside working hours. Share your working pattern, and the team can plan accordingly.",
        },
      },
      {
        "@type": "Question",
        name: "Do you supply IT equipment, furniture and ACs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Specialist items such as network equipment, central air conditioning and branded furniture are usually supplied by specialist vendors. MTBOSS plans and builds the interior and civil work, and coordinates with your vendors so provisions fit together.",
        },
      },
      {
        "@type": "Question",
        name: "What if I rent my office?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Check your lease for rules on alterations, and plan removable or reusable elements where needed. The team can suggest options that suit a rented space.",
        },
      },
      {
        "@type": "Question",
        name: "How much does office interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on area, number of workstations, finish level, partitions and cabins, furniture, lighting, air conditioning and the condition of the premises. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Interior Designer for Office in Bareilly",
        item: "https://www.mtboss.in/interior-designer-for-office-in-bareilly",
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