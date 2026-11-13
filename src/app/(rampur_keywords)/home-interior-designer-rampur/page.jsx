// app/(bareilly_keywords)/home-interior-designer-rampur/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Home Interior Designer Rampur | Design to Handover – MTBOSS",

  description:
    "Work with MTBOSS, a home interior designer Rampur, for 3D design, modular kitchens, wardrobes and complete execution. See our process, timeline and clear pricing approach.",

  keywords:
    "home interior designer Rampur, home interior designer in Rampur, home interior design Rampur, home interiors Rampur, interior designer for home Rampur, interior designer in Rampur, interior design services Rampur, complete home interior Rampur, full home interior Rampur, flat interior design Rampur, house interior design Rampur, villa interior design Rampur, modular kitchen Rampur, wardrobe design Rampur, false ceiling Rampur, home renovation Rampur, 3D interior design Rampur, interior design company Rampur, MTBOSS Rampur, MTBOSS Moradabad, MTBOSS Bareilly, home interior consultation Rampur",

  alternates: {
    canonical:
      "https://www.mtboss.in/home-interior-designer-rampur",
  },

  openGraph: {
    title: "Home Interior Designer Rampur | Design to Handover – MTBOSS",

    description:
      "Work with MTBOSS, a home interior designer Rampur, for 3D design, modular kitchens, wardrobes and complete execution. See our process, timeline and clear pricing approach.",

    url: "https://www.mtboss.in/home-interior-designer-rampur",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.mtboss.in/og-home-interior-designer-rampur.jpg",
        width: 1200,
        height: 630,
        alt: "Home Interior Designer Rampur - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Home Interior Designer Rampur | Design to Handover – MTBOSS",

    description:
      "Work with MTBOSS, a home interior designer Rampur, for 3D design, modular kitchens, wardrobes and complete execution. See our process, timeline and clear pricing approach.",

    images: [
      "https://www.mtboss.in/og-home-interior-designer-rampur.jpg",
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
    url: "https://www.mtboss.in/home-interior-designer-rampur",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    image:
      "https://www.mtboss.in/og-home-interior-designer-rampur.jpg",
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
        name: "Rampur",
      },
      {
        "@type": "City",
        name: "Moradabad",
      },
      {
        "@type": "City",
        name: "Bareilly",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    serviceType: [
      "Home Interior Design",
      "Home Interior Designer",
      "Home Interior Services",
      "Complete Home Interior",
      "Full Home Interior",
      "Interior Designer for Home",
      "Modular Kitchen Service",
      "Wardrobe and Storage Design",
      "False Ceiling Service",
      "Bathroom Renovation",
      "Interior Renovation",
      "Home Interior Services Quote",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Home Interior Designer in Rampur",
    description:
      "Work with MTBOSS, a home interior designer in Rampur, for 3D design, modular kitchens, wardrobes and complete execution. Services include space planning, 3D design, modular kitchen design and installation, wardrobes, TV units and custom furniture, false ceilings and lighting plans, flooring, tiles and marble, painting, wallpaper and wall panelling, doors, windows and carpentry, bathroom and utility planning, civil changes, waterproofing and rewiring, renovation of existing homes, and support after handover.",
    url: "https://www.mtboss.in/home-interior-designer-rampur",
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
        name: "Rampur",
      },
      {
        "@type": "City",
        name: "Moradabad",
      },
      {
        "@type": "City",
        name: "Bareilly",
      },
    ],
    serviceType:
      "Home Interior Design, Home Interior Designer, Home Interior Services, Complete Home Interior, Full Home Interior, Interior Designer for Home, Modular Kitchen Service, Wardrobe and Storage Design, False Ceiling Service, Bathroom Renovation, Interior Renovation and Home Interior Services Quote",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a home interior designer do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A home interior designer plans layouts, storage, lighting and materials, prepares designs and 3D visuals and manages the execution of the work.",
        },
      },
      {
        "@type": "Question",
        name: "How should I prepare for the first meeting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bring your floor plan, photos of styles you like, your budget range and a list of needs. If you do not have everything, MTBOSS will help.",
        },
      },
      {
        "@type": "Question",
        name: "Can MTBOSS do only the kitchen and wardrobes first?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS can plan a phased project so that you complete key areas first and finish the rest later.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide 3D designs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can review visuals before work begins.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS handle civil work, waterproofing and electrical changes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. These can be managed together with interior work.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a home interior project take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on size and scope. MTBOSS gives a schedule with the quotation after reviewing your home.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS serve Rampur and nearby cities?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. MTBOSS serves Rampur, Moradabad and Bareilly and can discuss nearby locations.",
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
        name: "Home Interior Designer Rampur",
        item: "https://www.mtboss.in/home-interior-designer-rampur",
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