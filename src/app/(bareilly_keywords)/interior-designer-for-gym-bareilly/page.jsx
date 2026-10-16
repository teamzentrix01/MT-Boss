// app/(bareilly_keywords)/interior-designer-for-gym-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Gym in Bareilly | MTBOSS",

  description:
    "Need an interior designer for your gym in Bareilly? Plan zones, flooring, lighting and branding with MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior designer for gym Bareilly, gym interior design Bareilly, fitness center interior Bareilly, gym design Bareilly, gym flooring Bareilly, gym lighting design Bareilly, yoga studio interior Bareilly, zumba studio interior Bareilly, crossfit gym interior Bareilly, gym renovation Bareilly, commercial interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, gym interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-gym-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Gym in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your gym in Bareilly? Plan zones, flooring, lighting and branding with MTBOSS. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-designer-for-gym-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-gym-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Gym in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Gym in Bareilly | MTBOSS",

    description:
      "Need an interior designer for your gym in Bareilly? Plan zones, flooring, lighting and branding with MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-designer-gym-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-designer-for-gym-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-interior-designer-gym-bareilly.jpg",
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
      "Interior Designer for Gym",
      "Gym Interior Design",
      "Fitness Center Interior",
      "Gym Design",
      "Gym Flooring",
      "Gym Lighting Design",
      "Yoga Studio Interior",
      "Zumba Studio Interior",
      "CrossFit Gym Interior",
      "Gym Renovation",
      "Commercial Interior Design",
      "Gym Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Gym Interior Design Services in Bareilly",
    description:
      "MTBOSS provides gym interior design services in Bareilly for commercial gyms, boutique studios, personal training studios, functional and CrossFit-style gyms, yoga and Zumba studios, ladies-only gyms, hotel and society fitness zones, and franchise gyms. Services include space planning, facade and entrance design, reception and lounge design, workout zone design, flooring planning, studio spaces, changing rooms and washrooms, ceiling and lighting design, wall and branding design, services provisions, wellness provisions, construction coordination, material supply, renovation and gym conversion.",
    url: "https://www.mtboss.in/interior-designer-for-gym-in-bareilly",
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
      "Interior Designer for Gym, Gym Interior Design, Fitness Center Interior, Gym Design, Gym Flooring, Gym Lighting Design, Yoga Studio Interior, Zumba Studio Interior, CrossFit Gym Interior and Gym Renovation",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a gym interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A gym interior designer plans the zones, flooring layout, lighting, changing rooms, reception and branding so the gym is safe, comfortable and motivating, and coordinates the work until opening.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide gym interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your gym.",
        },
      },
      {
        "@type": "Question",
        name: "Can you design a small gym or studio?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the planning approach applies to small gyms, studios and larger fitness clubs alike. Smart zoning, mirrors and good lighting help a compact space work well. Share your area and equipment list, and the team can suggest options.",
        },
      },
      {
        "@type": "Question",
        name: "Do you supply gym equipment and flooring?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Equipment, specialist flooring, sound systems and steam or sauna units are usually supplied and installed by specialist vendors. MTBOSS plans and builds the interior and civil work, and coordinates with your vendors so provisions fit together.",
        },
      },
      {
        "@type": "Question",
        name: "Can a gym be set up on an upper floor or in a basement?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In many cases, yes, if the structure suits the load and local rules allow it, though vibration, noise, ventilation and safe access need careful planning. A site visit and structural assessment will show what is possible.",
        },
      },
      {
        "@type": "Question",
        name: "Can an existing shop or hall be converted into a gym?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In many cases, yes, subject to the building's structure, permitted use and local rules. A site visit helps the team assess what is possible.",
        },
      },
      {
        "@type": "Question",
        name: "How much does gym interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on area, number of zones, flooring system, finish level, changing rooms and wellness areas, lighting, cooling and the condition of the premises. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Interior Designer for Gym in Bareilly",
        item: "https://www.mtboss.in/interior-designer-for-gym-in-bareilly",
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