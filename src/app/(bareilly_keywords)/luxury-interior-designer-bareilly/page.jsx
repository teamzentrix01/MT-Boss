// app/(bareilly_keywords)/luxury-interior-designer-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Luxury Interior Designer Bareilly | MTBOSS",

  description:
    "Looking for a luxury interior designer Bareilly? MTBOSS plans premium villa, apartment and home interiors with fine finish. Call +91 94584 10866.",

  keywords:
    "luxury interior designer Bareilly, luxury home interior Bareilly, luxury villa interior Bareilly, premium interior design Bareilly, high-end interior designer Bareilly, luxury apartment interior Bareilly, luxury bedroom design Bareilly, luxury living room Bareilly, luxury kitchen design Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, luxury interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/luxury-interior-designer-in-bareilly",
  },

  openGraph: {
    title: "Luxury Interior Designer Bareilly | MTBOSS",

    description:
      "Looking for a luxury interior designer Bareilly? MTBOSS plans premium villa, apartment and home interiors with fine finish. Call +91 94584 10866.",

    url: "https://www.mtboss.in/luxury-interior-designer-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-luxury-interior-designer-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Luxury Interior Designer in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Luxury Interior Designer Bareilly | MTBOSS",

    description:
      "Looking for a luxury interior designer Bareilly? MTBOSS plans premium villa, apartment and home interiors with fine finish. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-luxury-interior-designer-bareilly.jpg",
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
    url: "https://www.mtboss.in/luxury-interior-designer-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-luxury-interior-designer-bareilly.jpg",
    priceRange: "₹₹₹",
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
      "Luxury Interior Designer",
      "Luxury Home Interior",
      "Luxury Villa Interior",
      "Premium Interior Design",
      "High-End Interior Designer",
      "Luxury Apartment Interior",
      "Luxury Bedroom Design",
      "Luxury Living Room",
      "Luxury Kitchen Design",
      "Home Interior Design",
      "Luxury Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Luxury Interior Design Services in Bareilly",
    description:
      "MTBOSS provides luxury interior design services in Bareilly. Services include complete luxury home interiors, luxury villa interiors, premium apartment interiors, living and dining spaces, master suites, premium modular kitchens, custom woodwork and panelling, stone and marble work, false ceiling and lighting design, home office and study, entertainment and media rooms, puja room and mandir, bathrooms and dressing areas, smart home provisions, and renovation and remodelling.",
    url: "https://www.mtboss.in/luxury-interior-designer-in-bareilly",
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
      "Luxury Interior Designer, Luxury Home Interior, Luxury Villa Interior, Premium Interior Design, High-End Interior Designer, Luxury Apartment Interior, Luxury Bedroom Design, Luxury Living Room, Luxury Kitchen Design and Luxury Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a luxury interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A luxury interior designer plans layouts, materials, lighting, furniture, finishes and details to a high standard, coordinates the trades and manages the work until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide luxury interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that builds residential projects from affordable housing to luxury villas and serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "Is luxury interior design only for big villas?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Apartments and smaller homes can also have luxury interiors through careful planning, quality materials, lighting and detailing.",
        },
      },
      {
        "@type": "Question",
        name: "How do I keep a luxury interior within budget?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Decide your priorities, invest in the rooms and features that matter most, agree specifications in writing and finalise the design before work begins.",
        },
      },
      {
        "@type": "Question",
        name: "Can you include smart home features?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The wiring and layout can be planned for lighting control, security, audio and other systems, while the specialist equipment is typically supplied by vendors.",
        },
      },
      {
        "@type": "Question",
        name: "How much does a luxury interior cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on home size, materials, design complexity, lighting, custom furniture, kitchen and wardrobe specifications, smart features and civil work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS also handle electrical work, waterproofing and painting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. These are part of the services offered, so you do not need to coordinate separate contractors.",
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
        name: "Luxury Interior Designer in Bareilly",
        item: "https://www.mtboss.in/luxury-interior-designer-in-bareilly",
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