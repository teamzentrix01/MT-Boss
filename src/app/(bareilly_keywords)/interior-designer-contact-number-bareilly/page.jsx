// app/(bareilly_keywords)/interior-designer-contact-number-in-bareilly/page.jsx

import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Interior Designer Contact Number Bareilly | MTBOSS",

  description:
    "Need an interior designer contact number Bareilly? Call or WhatsApp MTBOSS at +91 94584 10866 for home interior design and quotes.",

  keywords:
    "interior designer contact number Bareilly, interior designer phone number Bareilly, interior designer WhatsApp Bareilly, contact interior designer Bareilly, interior designer near me Bareilly, home interior enquiry Bareilly, interior design quote Bareilly, book interior designer Bareilly, home interior Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS contact number, MTBOSS budget calculator",

  alternates: {
    canonical:
      "https://www.MTBOSS.in/interior-designer-contact-number-in-bareilly",
  },

  openGraph: {
    title: "Interior Designer Contact Number Bareilly | MTBOSS",

    description:
      "Need an interior designer contact number Bareilly? Call or WhatsApp MTBOSS at +91 94584 10866 for home interior design and quotes.",

    url: "https://www.MTBOSS.in/interior-designer-contact-number-in-bareilly",

    siteName: "MTBOSS Construction Private Limited",

    images: [
      {
        url: "https://www.MTBOSS.in/og-interior-designer-contact-number-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Designer Contact Number in Bareilly - MTBOSS",
      },
    ],

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Interior Designer Contact Number Bareilly | MTBOSS",

    description:
      "Need an interior designer contact number Bareilly? Call or WhatsApp MTBOSS at +91 94584 10866 for home interior design and quotes.",

    images: [
      "https://www.MTBOSS.in/og-interior-designer-contact-number-bareilly.jpg",
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
    url: "https://www.MTBOSS.in/interior-designer-contact-number-in-bareilly",
    telephone: "+91-9458410866",
    email: "MTBOSS2016@gmail.com",
    image:
      "https://www.MTBOSS.in/og-interior-designer-contact-number-bareilly.jpg",
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
      "Interior Designer Contact Number",
      "Interior Designer Phone Number",
      "Interior Designer WhatsApp",
      "Contact Interior Designer",
      "Interior Designer Near Me",
      "Home Interior Enquiry",
      "Interior Design Quote",
      "Book Interior Designer",
      "Home Interior Design",
      "MTBOSS Contact Number",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Interior Design Contact and Quote Services in Bareilly",
    description:
      "MTBOSS provides interior design contact and quote services for Bareilly clients. You can call or WhatsApp +91 94584 10866 for apartment and flat interiors, villa and independent house interiors, modular kitchen, wardrobes and storage, living room and TV unit design, bedroom interiors, bathroom renovation, false ceiling and lighting, puja room and mandir, painting, wallpaper and PVC panels, electrical and plumbing, renovation and upgrades, building materials, and doorstep home services.",
    url: "https://www.MTBOSS.in/interior-designer-contact-number-in-bareilly",
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
      "Interior Designer Contact Number, Interior Designer Phone Number, Interior Designer WhatsApp, Contact Interior Designer, Home Interior Enquiry, Interior Design Quote and Book Interior Designer",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the contact number of MTBOSS for interior design in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can call or WhatsApp MTBOSS at +91 94584 10866, or email MTBOSS2016@gmail.com. You can also use the quote form on www.MTBOSS.in.",
        },
      },
      {
        "@type": "Question",
        name: "Does MTBOSS provide interior design services in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MTBOSS Construction Private Limited is an architect, interior designer and construction company that serves Moradabad and Bareilly. Share your locality and project details with the team to confirm the scope and arrangements for your home.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the MTBOSS office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Harthala, Kanth Road, Behind KR Collection, near Domino's, Moradabad, Uttar Pradesh. Please check with the team before visiting in person.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get a cost estimate before the site visit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Use the free Budget Calculator on the MTBOSS website for a starting estimate. A detailed, itemised quote follows after a site visit and design discussion.",
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
        name: "How much does interior design cost in Bareilly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cost depends on home size, scope, material and finish level, kitchen and wardrobe specifications, ceiling and lighting, custom furniture and civil work. Use the free Budget Calculator on the MTBOSS website, or request a detailed quote.",
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
        name: "How can I be sure I am contacting the right number?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Check the phone number and email on the official website, www.MTBOSS.in, before sharing documents or making any payment.",
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
        name: "Interior Designer Contact Number in Bareilly",
        item: "https://www.MTBOSS.in/interior-designer-contact-number-in-bareilly",
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