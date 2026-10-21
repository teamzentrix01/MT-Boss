// app/(bareilly_keywords)/vastu-interior-designer-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Vastu Interior Designer Bareilly | MTBOSS",

  description:
    "Need a Vastu interior designer Bareilly? MTBOSS plans layouts around your Vastu preferences where the structure allows. Call +91 94584 10866.",

  keywords:
    "Vastu interior designer Bareilly, Vastu friendly interior Bareilly, Vastu home design Bareilly, Vastu kitchen layout Bareilly, Vastu bedroom design Bareilly, Vastu puja room Bareilly, Vastu compliant interior Bareilly, Vastu flat interior Bareilly, Vastu villa interior Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, Vastu interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/vastu-interior-designer-in-bareilly",
  },

  openGraph: {
    title: "Vastu Interior Designer Bareilly | MTBOSS",

    description:
      "Need a Vastu interior designer Bareilly? MTBOSS plans layouts around your Vastu preferences where the structure allows. Call +91 94584 10866.",

    url: "https://www.mtboss.in/vastu-interior-designer-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-vastu-interior-designer-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Vastu Interior Designer in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Vastu Interior Designer Bareilly | MTBOSS",

    description:
      "Need a Vastu interior designer Bareilly? MTBOSS plans layouts around your Vastu preferences where the structure allows. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-vastu-interior-designer-bareilly.jpg",
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
    url: "https://www.mtboss.in/vastu-interior-designer-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-vastu-interior-designer-bareilly.jpg",
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
      "Vastu Interior Designer",
      "Vastu Friendly Interior",
      "Vastu Home Design",
      "Vastu Kitchen Layout",
      "Vastu Bedroom Design",
      "Vastu Puja Room",
      "Vastu Compliant Interior",
      "Vastu Flat Interior",
      "Vastu Villa Interior",
      "Home Interior Design",
      "Vastu Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Vastu-Aware Interior Design Services in Bareilly",
    description:
      "MTBOSS provides Vastu-aware interior design services in Bareilly. Services include preference discussion, site visit and measurement, layout planning, concept and 3D views, modular kitchen, puja room or mandir, bedrooms and wardrobes, living and dining interiors, colour and finish selection, false ceiling and lighting, bathrooms, electrical, plumbing and waterproofing, renovation and remodelling, material supply and home services.",
    url: "https://www.mtboss.in/vastu-interior-designer-in-bareilly",
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
      "Vastu Interior Designer, Vastu Friendly Interior, Vastu Home Design, Vastu Kitchen Layout, Vastu Bedroom Design, Vastu Puja Room, Vastu Compliant Interior, Vastu Flat Interior, Vastu Villa Interior and Vastu Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a Vastu interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Vastu interior designer plans the layout, furniture placement, colours and finishes around your Vastu preferences, within the structure and safety of your home, and coordinates the work until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide Vastu-aware interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. The team plans layouts around the Vastu preferences you share, as far as the structure allows. Share your project details to confirm the scope and arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "Can you work with my Vastu consultant?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Share the consultant's notes or a marked plan, and the team can discuss what is practical and plan the interior accordingly.",
        },
      },
      {
        "@type": "Question",
        name: "Can a flat be made Vastu-friendly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Within a fixed structure, many preferences can be respected through room use, furniture placement, colours and kitchen and puja planning. Some changes, such as moving structural walls or plumbing shafts, may not be possible.",
        },
      },
      {
        "@type": "Question",
        name: "Do you guarantee results from following Vastu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Vastu is a traditional belief system, and MTBOSS does not make claims about outcomes. The team plans the layout around your preferences and focuses on good design, safety and quality work.",
        },
      },
      {
        "@type": "Question",
        name: "How much does interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on home size, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting, custom furniture and civil work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS also handle electrical work, plumbing and waterproofing?",
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
        name: "Vastu Interior Designer in Bareilly",
        item: "https://www.mtboss.in/vastu-interior-designer-in-bareilly",
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