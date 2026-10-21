// app/(bareilly_keywords)/interior-design-services-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Design Services Bareilly | MTBOSS",

  description:
    "Explore interior design services Bareilly by MTBOSS: kitchens, wardrobes, ceilings, bathrooms and full homes. Call +91 94584 10866.",

  keywords:
    "interior design services Bareilly, home interior services Bareilly, interior design company Bareilly, full home interior Bareilly, turnkey interior Bareilly, modular kitchen service Bareilly, false ceiling service Bareilly, bathroom renovation Bareilly, interior renovation Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator, interior services quote Bareilly",

  alternates: {
    canonical:
      "https://www.mtboss.in/interior-design-services-in-bareilly",
  },

  openGraph: {
    title: "Interior Design Services Bareilly | MTBOSS",

    description:
      "Explore interior design services Bareilly by MTBOSS: kitchens, wardrobes, ceilings, bathrooms and full homes. Call +91 94584 10866.",

    url: "https://www.mtboss.in/interior-design-services-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-interior-design-services-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Design Services in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Design Services Bareilly | MTBOSS",

    description:
      "Explore interior design services Bareilly by MTBOSS: kitchens, wardrobes, ceilings, bathrooms and full homes. Call +91 94584 10866.",

    images: [
      "https://www.mtboss.in/og-interior-design-services-bareilly.jpg",
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
    url: "https://www.mtboss.in/interior-design-services-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-interior-design-services-bareilly.jpg",
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
      "Interior Design Services",
      "Home Interior Services",
      "Interior Design Company",
      "Full Home Interior",
      "Turnkey Interior",
      "Modular Kitchen Service",
      "False Ceiling Service",
      "Bathroom Renovation",
      "Interior Renovation",
      "Home Interior Design",
      "Interior Services Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Design Services in Bareilly",
    description:
      "MTBOSS provides interior design services in Bareilly. Services include design and space planning, modular kitchen, wardrobes and storage, living room and dining area, bedrooms and kids' rooms, puja room and mandir, false ceiling and lighting, painting, wallpaper and wall panels, flooring and tiling, bathrooms, electrical, plumbing and waterproofing, renovation and remodelling, building materials, doorstep home services, and construction and property services.",
    url: "https://www.mtboss.in/interior-design-services-in-bareilly",
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
      "Interior Design Services, Home Interior Services, Interior Design Company, Full Home Interior, Turnkey Interior, Modular Kitchen Service, False Ceiling Service, Bathroom Renovation, Interior Renovation and Interior Services Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What interior design services does MTBOSS offer in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS offers design and space planning, modular kitchens, wardrobes, living and bedroom interiors, false ceilings, bathrooms, puja rooms, painting, flooring, electrical, plumbing, waterproofing, renovation, building materials and doorstep home services.",
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
        name: "Can I hire MTBOSS for only one room or one service?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, depending on the project. Share your requirement with the team to confirm what can be taken up, such as a kitchen, wardrobes, a ceiling or a bathroom.",
        },
      },
      {
        "@type": "Question",
        name: "How much do interior design services cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on home size, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting, custom furniture and civil work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS also supply materials such as tiles and paints?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Construction materials, including tiles and paints, are available through the Shop Now section of the website.",
        },
      },
      {
        "@type": "Question",
        name: "What support is available after handover?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Doorstep home services, such as electrician, plumber, AC repair, pest control, painter and carpenter, are available, along with renovation support when you need it.",
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
        name: "Interior Design Services in Bareilly",
        item: "https://www.mtboss.in/interior-design-services-in-bareilly",
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