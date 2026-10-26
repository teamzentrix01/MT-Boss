// app/(bareilly_keywords)/residential-interior-designer-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Residential Interior Designer Bareilly | MTBOSS",

  description:
    "Looking for a residential interior designer Bareilly? MTBOSS designs flats, villas and houses around your family. Call +91 94584 10866.",

  keywords:
    "residential interior designer Bareilly, residential interior design Bareilly, home interior designer Bareilly, house interior design Bareilly, flat interior Bareilly, villa interior Bareilly, builder floor interior Bareilly, independent house interior Bareilly, family home interior Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, residential interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/residential-interior-designer-in-bareilly",
  },

  openGraph: {
    title: "Residential Interior Designer Bareilly | MTBOSS",

    description:
      "Looking for a residential interior designer Bareilly? MTBOSS designs flats, villas and houses around your family. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/residential-interior-designer-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-residential-interior-designer-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Residential Interior Designer in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Residential Interior Designer Bareilly | MTBOSS",

    description:
      "Looking for a residential interior designer Bareilly? MTBOSS designs flats, villas and houses around your family. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-residential-interior-designer-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/residential-interior-designer-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.MTBOSS.in/og-residential-interior-designer-bareilly.jpg",
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
      "Residential Interior Designer",
      "Residential Interior Design",
      "Home Interior Designer",
      "House Interior Design",
      "Flat Interior",
      "Villa Interior",
      "Builder Floor Interior",
      "Independent House Interior",
      "Family Home Interior",
      "Home Interior Design",
      "Residential Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Residential Interior Design Services in Bareilly",
    description:
      "MTBOSS provides residential interior design services in Bareilly. Services include family and lifestyle discussion, site visit and measurement, space planning, concept and 3D views, living and dining interiors, modular kitchen, bedrooms and kids' rooms, bathrooms, puja room or mandir, false ceiling and lighting, painting, wallpaper and PVC panels, flooring and tiling, electrical, plumbing and waterproofing, renovation and remodelling, material supply and home services.",
    url: "https://www.MTBOSS.in/residential-interior-designer-in-bareilly",
    provider: {
      "@type": "InteriorDesignService",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      email: "MTBOSS2016@gmail.com",
      url: "https://www.MTBOSS.in",
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
      "Residential Interior Designer, Residential Interior Design, Home Interior Designer, House Interior Design, Flat Interior, Villa Interior, Builder Floor Interior, Independent House Interior, Family Home Interior and Residential Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a residential interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A residential interior designer plans the layout, storage, lighting, ceilings, finishes and furniture of a home around the family's needs, coordinates the trades and manages the work until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide residential interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that builds residential projects from affordable housing to luxury villas and serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "What types of homes can be designed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Apartments, flats, builder floors, independent houses, villas, row houses, new homes, resale homes and rental or investment properties. Share your home details with the team to confirm the arrangements.",
        },
      },
      {
        "@type": "Question",
        name: "How do you plan a home for children and elders?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "By focusing on safety, comfort and ease of use, with non-slip flooring, rounded edges, good lighting, safe bathrooms, easy-to-reach storage and quiet zones for study and rest.",
        },
      },
      {
        "@type": "Question",
        name: "Will I see the design before work starts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Layouts and designs are shared and refined with your feedback before execution begins, and scope and specifications are written down before work starts.",
        },
      },
      {
        "@type": "Question",
        name: "How much does residential interior design cost in Bareilly?",
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
        item: "https://www.MTBOSS.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Interior Design Services",
        item: "https://www.MTBOSS.in/interior-design-services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Residential Interior Designer in Bareilly",
        item: "https://www.MTBOSS.in/residential-interior-designer-in-bareilly",
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