// app/(bareilly_keywords)/interior-designer-for-puja-room-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer for Puja Room Bareilly | MTBOSS",

  description:
    "Need an interior designer for puja room Bareilly? MTBOSS designs peaceful mandirs with marble, wood, lighting and smart storage. Call +91 94584 10866.",

  keywords:
    "interior designer for puja room Bareilly, puja room design Bareilly, mandir design for home Bareilly, pooja unit design Bareilly, temple design for home Bareilly, wall mounted mandir Bareilly, marble mandir Bareilly, small puja room design Bareilly, wooden mandir Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, puja room interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-designer-for-puja-room-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer for Puja Room Bareilly | MTBOSS",

    description:
      "Need an interior designer for puja room Bareilly? MTBOSS designs peaceful mandirs with marble, wood, lighting and smart storage. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-designer-for-puja-room-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-designer-puja-room-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer for Puja Room in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer for Puja Room Bareilly | MTBOSS",

    description:
      "Need an interior designer for puja room Bareilly? MTBOSS designs peaceful mandirs with marble, wood, lighting and smart storage. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-designer-puja-room-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-designer-for-puja-room-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-designer-puja-room-bareilly.jpg",
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
      "Interior Designer for Puja Room",
      "Puja Room Design",
      "Mandir Design for Home",
      "Pooja Unit Design",
      "Temple Design for Home",
      "Wall Mounted Mandir",
      "Marble Mandir",
      "Small Puja Room Design",
      "Wooden Mandir",
      "Home Interior Design",
      "Puja Room Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Puja Room Interior Design and Mandir Services in Bareilly",
    description:
      "MTBOSS provides puja room interior design and mandir services in Bareilly. Services include puja room planning, dedicated puja room design, puja corner design, wall-mounted mandir, mandir platform or base unit, marble and stone work, wooden mandir and woodwork, backlit panels and jaali work, false ceiling and lighting, flooring and wall finishes, doors and partition options, storage solutions, electrical and ventilation planning, puja room renovation and full home interiors.",
    url: "https://www.mtboss.in/interior-designer-for-puja-room-in-bareilly",
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
      "Interior Designer for Puja Room, Puja Room Design, Mandir Design for Home, Pooja Unit Design, Temple Design for Home, Wall Mounted Mandir, Marble Mandir, Small Puja Room Design, Wooden Mandir and Puja Room Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does an interior designer for a puja room do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A puja room designer plans the layout, mandir, materials, lighting, ventilation, storage and safety based on your family's customs and your space, coordinates the work and manages it until handover.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide puja room design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your puja space.",
        },
      },
      {
        "@type": "Question",
        name: "Can a puja space be designed in a small flat?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. A wall-mounted mandir, a slim cabinet or a corner niche can create a peaceful prayer space without taking much floor area.",
        },
      },
      {
        "@type": "Question",
        name: "Can you follow our Vastu or family customs while designing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Share your preferences at the start, and the layout can be planned around them as far as your home's structure allows.",
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
        name: "How much does a puja room cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on the size of the space, materials, design complexity, lighting and ceiling, doors, storage and custom work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS also handle electrical work, ceiling and painting for the puja room?",
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
        name: "Interior Designer for Puja Room in Bareilly",
        item: "https://www.mtboss.in/interior-designer-for-puja-room-in-bareilly",
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