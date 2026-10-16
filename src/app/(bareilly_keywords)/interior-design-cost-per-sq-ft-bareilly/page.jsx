// app/(bareilly_keywords)/interior-design-cost-per-sq-ft-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Design Cost per Sq Ft Bareilly | MTBOSS",

  description:
    "Understand interior design cost per sq ft in Bareilly, what the rate covers and how to compare quotes. Call MTBOSS: +91 94584 10866.",

  keywords:
    "interior design cost per sq ft Bareilly, interior rate per sq ft Bareilly, home interior price per sq ft Bareilly, 2BHK interior cost per sq ft Bareilly, 3BHK interior cost per sq ft Bareilly, interior cost calculator Bareilly, carpet area vs built-up area interior, interior estimate Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, interior quote per sq ft Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-design-cost-per-sq-ft-in-bareilly",
  },

  openGraph: {
    title: "Interior Design Cost per Sq Ft Bareilly | MTBOSS",

    description:
      "Understand interior design cost per sq ft in Bareilly, what the rate covers and how to compare quotes. Call MTBOSS: +91 94584 10866.",

    url: "https://www.mtboss.in/interior-design-cost-per-sq-ft-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-design-cost-per-sq-ft-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Design Cost per Sq Ft in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Design Cost per Sq Ft Bareilly | MTBOSS",

    description:
      "Understand interior design cost per sq ft in Bareilly, what the rate covers and how to compare quotes. Call MTBOSS: +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-design-cost-per-sq-ft-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-design-cost-per-sq-ft-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-design-cost-per-sq-ft-bareilly.jpg",
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
      "Interior Design Cost Per Sq Ft",
      "Interior Rate Per Sq Ft",
      "Home Interior Price Per Sq Ft",
      "2BHK Interior Cost Per Sq Ft",
      "3BHK Interior Cost Per Sq Ft",
      "Interior Cost Calculator",
      "Carpet Area vs Built-Up Area Interior",
      "Interior Estimate",
      "Home Interior Design",
      "Interior Quote Per Sq Ft",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Design Cost per Sq Ft and Estimate Services in Bareilly",
    description:
      "MTBOSS provides interior design cost per sq ft and estimate services in Bareilly. Services include space planning and design, modular kitchen, wardrobes and storage, living and dining areas, bedrooms, bathrooms, false ceiling and lighting, painting, wallpaper and PVC panels, flooring and tiling, electrical and plumbing, doors, windows and woodwork, civil and renovation work, project supervision and handover.",
    url: "https://www.mtboss.in/interior-design-cost-per-sq-ft-in-bareilly",
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
      "Interior Design Cost Per Sq Ft, Interior Rate Per Sq Ft, Home Interior Price Per Sq Ft, 2BHK Interior Cost Per Sq Ft, 3BHK Interior Cost Per Sq Ft, Interior Cost Calculator, Interior Estimate and Interior Quote Per Sq Ft",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is interior design cost per sq ft calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It is usually the area multiplied by a rate per sq ft. The result depends on which area is used, what the rate includes and the specifications chosen, so always confirm these in writing.",
        },
      },
      {
        "@type": "Question",
        name: "Which area should I use: carpet, built-up or super built-up?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Carpet area is closest to the actual usable space and is generally the most useful basis for interior work. Whatever the basis, confirm it in the quotation so that you can compare rates fairly.",
        },
      },
      {
        "@type": "Question",
        name: "Why is the rate per sq ft higher for small homes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every home needs a kitchen and bathrooms, which are the costliest areas. In a small home, they make up a larger share of the total area, so the average rate per sq ft is higher.",
        },
      },
      {
        "@type": "Question",
        name: "Does the per sq ft rate include furniture and appliances?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not always. Many rates exclude loose furniture, curtains and appliances. Ask for a written list of inclusions and exclusions.",
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
        name: "Interior Design Cost per Sq Ft in Bareilly",
        item: "https://www.mtboss.in/interior-design-cost-per-sq-ft-in-bareilly",
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