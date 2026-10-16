// app/(bareilly_keywords)/interior-designer-for-salon-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Salon in Bareilly | MTBOSS",

  description:
    "Need an interior designer for your salon in Bareilly? Plan stations, wash area, lighting and branding with MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior designer for salon Bareilly, salon interior design Bareilly, beauty parlour interior Bareilly, unisex salon interior Bareilly, ladies salon interior Bareilly, gents salon interior Bareilly, spa interior design Bareilly, bridal makeup studio interior Bareilly, salon renovation Bareilly, salon lighting design Bareilly, commercial interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, salon interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-salon-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Salon in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your salon in Bareilly? Plan stations, wash area, lighting and branding with MTBOSS. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-designer-for-salon-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-salon-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Salon in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Salon in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your salon in Bareilly? Plan stations, wash area, lighting and branding with MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-designer-salon-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-designer-for-salon-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-interior-designer-salon-bareilly.jpg",
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
      "Interior Designer for Salon",
      "Salon Interior Design",
      "Beauty Parlour Interior",
      "Unisex Salon Interior",
      "Ladies Salon Interior",
      "Gents Salon Interior",
      "Spa Interior Design",
      "Bridal Makeup Studio Interior",
      "Salon Renovation",
      "Salon Lighting Design",
      "Commercial Interior Design",
      "Salon Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Salon Interior Design Services in Bareilly",
    description:
      "MTBOSS provides salon interior design services in Bareilly for ladies salons, gents salons, unisex salons, beauty parlours, spas, wellness studios, bridal and makeup studios, nail and skin clinics, and franchise salons. Services include space planning, facade and entrance design, reception and waiting areas, styling stations, wash areas, treatment and makeup rooms, colour and chemical service areas, ceiling and lighting design, wall and decor design, flooring and finishes, washrooms, services provisions, branding, construction coordination, material supply, renovation and salon conversion.",
    url: "https://www.mtboss.in/interior-designer-for-salon-in-bareilly",
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
      "Interior Designer for Salon, Salon Interior Design, Beauty Parlour Interior, Unisex Salon Interior, Ladies Salon Interior, Gents Salon Interior, Spa Interior Design, Bridal Makeup Studio Interior, Salon Renovation and Salon Lighting Design",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a salon interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A salon interior designer plans the reception, stations, wash area, treatment rooms, lighting, finishes and branding so the salon is stylish, hygienic and efficient, and coordinates the work until opening.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide salon interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your salon.",
        },
      },
      {
        "@type": "Question",
        name: "Can you design a small parlour?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the planning approach applies to small parlours as well as large salons and spas. Smart layouts, good mirror lighting and easy-clean finishes help a compact space work well. Share your area and services, and the team can suggest options.",
        },
      },
      {
        "@type": "Question",
        name: "Do you supply salon chairs and wash units?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Salon chairs, wash units, equipment and water heaters are usually supplied and installed by specialist vendors. MTBOSS plans and builds the interior and civil work, and coordinates with your vendors so provisions fit together.",
        },
      },
      {
        "@type": "Question",
        name: "Can you plan separate areas for ladies and gents?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, separate zones or wings can be planned with their own entries, waiting areas and privacy arrangements. Share your requirements, and the team can design the right layout.",
        },
      },
      {
        "@type": "Question",
        name: "Can an existing shop be converted into a salon?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In many cases, yes, subject to the building's structure, permitted use and local rules. A site visit helps the team assess what is possible, including water supply and drainage.",
        },
      },
      {
        "@type": "Question",
        name: "How much does salon interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on area, number of stations, finish level, wash area and plumbing, treatment rooms, lighting, furniture, facade and the condition of the premises. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Interior Designer for Salon in Bareilly",
        item: "https://www.mtboss.in/interior-designer-for-salon-in-bareilly",
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