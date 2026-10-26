// app/(bareilly_keywords)/interior-design-cost-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Design Cost in Bareilly | MTBOSS",

  description:
    "Wondering about interior design cost in Bareilly? See what affects pricing and get a clear estimate from MTBOSS. Call +91 94584 10866.",

  keywords:
    "interior design cost in Bareilly, interior cost Bareilly, home interior cost Bareilly, 2BHK interior cost Bareilly, 3BHK interior cost Bareilly, interior design price per sq ft Bareilly, modular kitchen cost Bareilly, wardrobe cost Bareilly, false ceiling cost Bareilly, interior estimate Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, interior quote Bareilly",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/interior-design-cost-in-bareilly",
  },

  openGraph: {
    title: "Interior Design Cost in Bareilly | MTBOSS",

    description:
      "Wondering about interior design cost in Bareilly? See what affects pricing and get a clear estimate from MTBOSS. Call +91 94584 10866.",

    url: "https://www.MTBOSS.in/interior-design-cost-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-design-cost-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Design Cost in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Design Cost in Bareilly | MTBOSS",

    description:
      "Wondering about interior design cost in Bareilly? See what affects pricing and get a clear estimate from MTBOSS. Call +91 94584 10866.",

    images: [
      "https://www.MTBOSS.in/og-interior-design-cost-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/interior-design-cost-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.MTBOSS.in/og-interior-design-cost-bareilly.jpg",
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
      "Interior Design Cost",
      "Interior Cost",
      "Home Interior Cost",
      "2BHK Interior Cost",
      "3BHK Interior Cost",
      "Interior Design Price Per Sq Ft",
      "Modular Kitchen Cost",
      "Wardrobe Cost",
      "False Ceiling Cost",
      "Interior Estimate",
      "Home Interior Design",
      "Interior Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Design Cost and Estimate Services in Bareilly",
    description:
      "MTBOSS provides interior design cost and estimate services in Bareilly. Services include space planning and design, modular kitchen, wardrobes and storage, living room, bedrooms, bathrooms, false ceiling and lighting, painting, wallpaper and PVC panels, flooring and tiling, electrical and plumbing, doors, windows and woodwork, civil and renovation work, project supervision and handover.",
    url: "https://www.MTBOSS.in/interior-design-cost-in-bareilly",
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
      "Interior Design Cost, Interior Cost, Home Interior Cost, 2BHK Interior Cost, 3BHK Interior Cost, Interior Design Price Per Sq Ft, Modular Kitchen Cost, Wardrobe Cost, False Ceiling Cost, Interior Estimate and Interior Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The cost depends on home size, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting, custom furniture and civil work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote after a site visit.",
        },
      },
      {
        "@type": "Question",
        name: "Is interior design charged per square foot?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Some projects are estimated per square foot for a rough idea, but a detailed estimate is usually item-wise, based on measurements and specifications, so you can see what each part costs.",
        },
      },
      {
        "@type": "Question",
        name: "Why do two quotes for the same home differ so much?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Differences usually come from scope, board and hardware quality, finishes, included services and design detail. Compare quotes line by line before deciding.",
        },
      },
      {
        "@type": "Question",
        name: "Can I reduce the cost without lowering quality?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Set priorities, finalise the design early, phase the work, keep existing items that still work and invest in hardware, boards and waterproofing where they matter most.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide interior design services in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your project with the team to confirm the scope and arrangements for your home.",
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
        name: "Can MTBOSS also handle electrical work, plumbing and painting?",
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
        name: "Interior Design Cost in Bareilly",
        item: "https://www.MTBOSS.in/interior-design-cost-in-bareilly",
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