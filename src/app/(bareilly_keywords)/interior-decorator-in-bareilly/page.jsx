// app/(bareilly_keywords)/interior-decorator-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Decorator in Bareilly | MTBOSS",

  description:
    "Need an interior decorator in Bareilly? MTBOSS helps with paint, lighting, styling and finishing touches. Call +91 94584 10866.",

  keywords:
    "interior decorator in Bareilly, interior decorator Bareilly, home decorator Bareilly, home decor Bareilly, home styling Bareilly, wall decor Bareilly, paint and wall finishes Bareilly, lighting design Bareilly, home makeover Bareilly, room decoration Bareilly, interior decorator vs interior designer, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, interior quote Bareilly",

  alternates: {
    canonical: "https://www.mtboss.in/interior-decorator-in-bareilly",
  },

  openGraph: {
    title: "Interior Decorator in Bareilly | MTBOSS",

    description:
      "Need an interior decorator in Bareilly? MTBOSS helps with paint, lighting, styling and finishing touches. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-decorator-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-decorator-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Decorator in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Decorator in Bareilly | MTBOSS",

    description:
      "Need an interior decorator in Bareilly? MTBOSS helps with paint, lighting, styling and finishing touches. Call +91 94584 10866.",

    images: ["https://www.mtboss.in/og-interior-decorator-bareilly.jpg"],
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
    url: "https://www.mtboss.in/interior-decorator-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image: "https://www.mtboss.in/og-interior-decorator-bareilly.jpg",
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
      "Interior Decorator in Bareilly",
      "Interior Decoration",
      "Home Decor",
      "Home Styling",
      "Wall Decor",
      "Paint and Wall Finishes",
      "Lighting Design",
      "Home Makeover",
      "Room Decoration",
      "Interior Design",
      "Interior Renovation",
      "Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Decoration Services in Bareilly",
    description:
      "MTBOSS provides interior decoration and finishing support for homes and workspaces in Bareilly, including decor planning and styling advice, paint and wall finishes, lighting plans, ceiling and wall detailing, flooring and tile choices, woodwork and carpentry, painting services, interior design coordination, renovation and remodelling.",
    url: "https://www.mtboss.in/interior-decorator-in-bareilly",
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
      "Interior Decorator, Home Decor, Home Styling, Wall Decor, Paint and Wall Finishes, Lighting Design, Home Makeover, Room Decoration and Interior Design",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior decorator do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An interior decorator styles a space using colours, paint, lighting, furniture placement, soft furnishings, wall decor and accessories, usually without changing the structure or layout.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between an interior decorator and an interior designer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A decorator focuses on look, feel and styling, while a designer also plans layouts, storage, ceilings, kitchens, wardrobes and civil changes. Many projects use both.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide interior decoration in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your location.",
        },
      },
      {
        "@type": "Question",
        name: "Can I decorate only one room?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can start with a single room, such as the living room or bedroom, and extend later. Planning a colour and style direction for the whole home helps rooms stay consistent.",
        },
      },
      {
        "@type": "Question",
        name: "Can you refresh a home without major construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Often, yes. Repainting, new lighting, rearranged furniture, new soft furnishings and small woodwork can change a home's look without structural work. A site visit helps the team recommend what is worth doing.",
        },
      },
      {
        "@type": "Question",
        name: "How much does interior decoration cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on the number and size of rooms, scope of work, paint and finish level, lighting plan, wall treatments, woodwork and the condition of surfaces. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "Interior Decorator in Bareilly",
        item: "https://www.mtboss.in/interior-decorator-in-bareilly",
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