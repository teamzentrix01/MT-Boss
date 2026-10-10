// app/(moradabad_keywords)/gym-and-fitness-center-construction-in-moradabad/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Gym & Fitness Center Construction Moradabad | MTBOSS",

  description:
    "Planning gym or fitness center construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

  keywords:
    "gym or fitness center construction Moradabad, gym construction Moradabad, fitness center construction Moradabad, gym builder Moradabad, gym contractor Moradabad, gym interior and construction Moradabad, yoga studio construction Moradabad, health club construction Moradabad, gym building design Moradabad, gym construction cost Moradabad, commercial construction company Moradabad, construction company in Moradabad, MTBOSS Moradabad, MTBOSS Kanth Road, MTBOSS budget calculator, construction quote Moradabad",

  alternates: {
    canonical:
      "https://www.mtboss.in/gym-and-fitness-center-construction-in-moradabad",
  },

  openGraph: {
    title: "Gym & Fitness Center Construction Moradabad | MTBOSS",

    description:
      "Planning gym or fitness center construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    url: "https://www.mtboss.in/gym-and-fitness-center-construction-in-moradabad",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-gym-fitness-center-construction-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Gym and Fitness Center Construction in Moradabad - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Gym & Fitness Center Construction Moradabad | MTBOSS",

    description:
      "Planning gym or fitness center construction in Moradabad? MTBOSS offers design, quality materials and on-time handover. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-gym-fitness-center-construction-moradabad.jpg",
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
    url: "https://www.mtboss.in/gym-and-fitness-center-construction-in-moradabad",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-gym-fitness-center-construction-moradabad.jpg",
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
      "Gym Construction",
      "Fitness Center Construction",
      "Gym Builder",
      "Gym Contractor",
      "Gym Interior and Construction",
      "Yoga Studio Construction",
      "Health Club Construction",
      "Gym Building Design",
      "Gym Construction Cost Estimation",
      "Commercial Construction",
      "Building Renovation",
      "Building Extension",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Gym and Fitness Center Construction Services in Moradabad",
    description:
      "MTBOSS provides gym and fitness center construction in Moradabad for standalone gyms, fitness centers, yoga and aerobics studios, basement or upper-floor gyms and boutique studios, including design coordination, structure, floor preparation, facade, reception and lounge, studio spaces, changing rooms and washrooms, wellness provisions, services provisions, ventilation and cooling, waterproofing, flooring, finishing, interiors, outdoor works and final handover.",
    url: "https://www.mtboss.in/gym-and-fitness-center-construction-in-moradabad",
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
      "Gym Construction, Fitness Center Construction, Gym Builder, Gym Contractor, Gym Interior and Construction, Yoga Studio Construction, Health Club Construction and Gym Building Design",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is gym construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Gym construction is the planning and building of a fitness facility, including the workout zones, floors, changing rooms, services and finishing, from design to handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS build gyms and fitness centers in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS builds residential projects, from affordable housing to luxury villas, in Moradabad and Bareilly, and offers construction services for other buildings. Share your plan with the team to confirm the scope for your gym.",
        },
      },
      {
        "@type": "Question",
        name: "Can a gym be built on an upper floor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In many cases, yes, if the structure is designed for the load and local rules allow it. Heavy free-weight zones are usually better on the ground floor, and vibration and noise need careful planning. A site visit and structural assessment will show what is possible.",
        },
      },
      {
        "@type": "Question",
        name: "Can you convert a shop or house into a gym?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In many cases, yes, subject to the building's structure, permitted use and local rules. A site visit helps the team assess what is possible.",
        },
      },
      {
        "@type": "Question",
        name: "Do you supply gym equipment and flooring?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Equipment, specialist gym flooring and steam or sauna units are usually supplied and installed by specialist vendors. MTBOSS plans and builds the civil and services work, and coordinates with your vendors so provisions fit together.",
        },
      },
      {
        "@type": "Question",
        name: "How much does gym construction cost in Moradabad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Gym construction cost depends on built-up area, floor level, structural needs, air conditioning, flooring system, changing rooms and wellness areas, material and finish level, and site conditions. MTBOSS offers a free Budget Calculator and detailed quote option.",
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
        name: "Gym and Fitness Center Construction in Moradabad",
        item: "https://www.mtboss.in/gym-and-fitness-center-construction-in-moradabad",
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