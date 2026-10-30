// app/(bareilly_keywords)/termite-control-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Termite Control Bareilly | Anti-Termite Treatment | MTBOSS",
  description:
    "Termite control Bareilly by MTBOSS: inspection, anti-termite treatment for homes, offices and new builds. Clear scope. Call +91 94584 10866.",
  keywords:
    "termite control Bareilly, anti-termite treatment Bareilly, termite treatment Bareilly, pre-construction anti-termite treatment Bareilly, post-construction termite control Bareilly, termite inspection Bareilly, termite damage repair Bareilly, wood termite treatment Bareilly, termite control cost Bareilly, pest control services in Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS pest control, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/termite-control-bareilly",
  },
  openGraph: {
    title: "Termite Control Bareilly | Anti-Termite Treatment | MTBOSS",
    description:
      "Termite control Bareilly by MTBOSS: inspection, anti-termite treatment for homes, offices and new builds. Clear scope. Call +91 94584 10866.",
    url: "https://www.mtboss.in/termite-control-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-termite-control-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Termite Control in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Termite Control Bareilly | Anti-Termite Treatment | MTBOSS",
    description:
      "Termite control Bareilly by MTBOSS: inspection, anti-termite treatment for homes, offices and new builds. Clear scope. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-termite-control-bareilly.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "PestControlService",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/termite-control-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Harthala Kanth Road, Behind KR Collection, near Domino's",
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
    priceRange: "₹₹",
    serviceType: [
      "Termite Control",
      "Anti-Termite Treatment",
      "Pre-Construction Anti-Termite Treatment",
      "Post-Construction Termite Control",
      "Termite Inspection",
      "Wood Termite Treatment",
      "Termite Damage Repair",
      "Pest Control Services",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Termite Control in Bareilly",
    description:
      "MTBOSS provides termite inspection, activity mapping, pre-construction soil treatment, post-construction drilling and injection, wood and furniture treatment, termite nest and perimeter treatment, moisture correction, crack sealing, damage assessment and follow-up services in Bareilly.",
    provider: {
      "@type": "PestControlService",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.mtboss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Bareilly",
    },
    serviceType: "Termite Control and Anti-Termite Treatment Services",
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

      <Banner />
      <Content />
      <QuickServices />
      <Services />
      <CalculatorCTA />
    </>
  );
}