// app/(bareilly_keywords)/3bhk-interior-design-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "3 BHK Interior Design Bareilly | MTBOSS",

  description:
    "Planning 3 BHK interior design Bareilly? MTBOSS plans spacious, storage-smart 3BHK homes with clear costs. Call +91 94584 10866.",

  keywords:
    "3 BHK interior design Bareilly, 3BHK interior design Bareilly, 3BHK flat interior Bareilly, 3BHK apartment interior Bareilly, 3BHK home interior Bareilly, 3BHK interior cost Bareilly, 3BHK modular kitchen Bareilly, 3BHK wardrobe design Bareilly, 3BHK false ceiling Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, 3BHK interior quote Bareilly",

  alternates: {
    canonical: "https://www.mtboss.in/3bhk-interior-design-in-bareilly",
  },

  openGraph: {
    title: "3 BHK Interior Design Bareilly | MTBOSS",

    description:
      "Planning 3 BHK interior design Bareilly? MTBOSS plans spacious, storage-smart 3BHK homes with clear costs. Call +91 94584 10866.",

    url: "https://www.mtboss.in/3bhk-interior-design-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-3bhk-interior-design-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "3 BHK Interior Design in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "3 BHK Interior Design Bareilly | MTBOSS",

    description:
      "Planning 3 BHK interior design Bareilly? MTBOSS plans spacious, storage-smart 3BHK homes with clear costs. Call +91 94584 10866.",

    images: ["https://www.mtboss.in/og-3bhk-interior-design-bareilly.jpg"],
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
    url: "https://www.mtboss.in/3bhk-interior-design-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-3bhk-interior-design-bareilly.jpg",
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
      "3 BHK Interior Design",
      "3BHK Flat Interior",
      "3BHK Apartment Interior",
      "3BHK Home Interior",
      "3BHK Interior Cost",
      "3BHK Modular Kitchen",
      "3BHK Wardrobe Design",
      "3BHK False Ceiling",
      "Home Interior Design",
      "3BHK Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "3 BHK Interior Design Services in Bareilly",
    description:
      "MTBOSS provides 3 BHK interior design services in Bareilly. Services include site visit and measurement, whole-home space planning, concept and 3D views, modular kitchen, wardrobes for three bedrooms, living and dining interiors, third bedroom solutions, bathroom interiors, false ceiling and lighting, puja room or mandir, painting, wallpaper and PVC panels, flooring and tiling, electrical, plumbing and waterproofing, renovation of existing 3 BHK homes, material supply and home services.",
    url: "https://www.mtboss.in/3bhk-interior-design-in-bareilly",
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
      "3 BHK Interior Design, 3BHK Flat Interior, 3BHK Apartment Interior, 3BHK Home Interior, 3BHK Modular Kitchen, 3BHK Wardrobe Design, 3BHK False Ceiling and 3BHK Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does 3 BHK interior design include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It usually covers space planning, kitchen, wardrobes, living and dining interiors, three bedrooms, bathrooms, ceilings, lighting, painting and flooring, along with the civil and services work needed to support them. The exact scope is written in the agreement.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide 3 BHK interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "How do I plan the third bedroom?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Decide how you will use it now and later, such as a guest room, study, home office or second child's room, and choose flexible furniture like a storage bed, sofa-bed or foldable desk.",
        },
      },
      {
        "@type": "Question",
        name: "How do I keep a 3 BHK consistent across so many rooms?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Choose one core style, a limited colour palette and a few repeating materials and details, and plan flooring, lighting and hardware for the whole home together.",
        },
      },
      {
        "@type": "Question",
        name: "Can I do my 3 BHK interior in phases?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Complete the essentials and core rooms first, and add other rooms and features later. A single design plan keeps everything consistent.",
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
        name: "How much does 3 BHK interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on the size and layout of the home, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting, custom furniture and civil work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "3 BHK Interior Design in Bareilly",
        item: "https://www.mtboss.in/3bhk-interior-design-in-bareilly",
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