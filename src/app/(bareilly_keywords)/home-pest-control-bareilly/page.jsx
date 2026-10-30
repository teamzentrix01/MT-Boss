// app/(bareilly_keywords)/home-pest-control-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Home Pest Control Bareilly | Room by Room | MTBOSS",
  description:
    "Home pest control Bareilly by MTBOSS: kitchen, bedroom and bathroom treatment for cockroaches, ants, termites and bed bugs. Call +91 94584 10866.",
  keywords:
    "home pest control Bareilly, house pest control Bareilly, residential pest control Bareilly, flat pest control Bareilly, kitchen pest control Bareilly, bedroom pest control Bareilly, bathroom pest control Bareilly, home pest control cost Bareilly, pest control services in Bareilly, pest control near me Bareilly, termite control Bareilly, cockroach control Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS pest control",
  alternates: {
    canonical: "https://www.mtboss.in/home-pest-control-bareilly",
  },
  openGraph: {
    title: "Home Pest Control Bareilly | Room by Room | MTBOSS",
    description:
      "Home pest control Bareilly by MTBOSS: kitchen, bedroom and bathroom treatment for cockroaches, ants, termites and bed bugs. Call +91 94584 10866.",
    url: "https://www.mtboss.in/home-pest-control-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-home-pest-control-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Home Pest Control in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Pest Control Bareilly | Room by Room | MTBOSS",
    description:
      "Home pest control Bareilly by MTBOSS: kitchen, bedroom and bathroom treatment for cockroaches, ants, termites and bed bugs. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-home-pest-control-bareilly.jpg"],
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
    url: "https://www.mtboss.in/home-pest-control-bareilly",
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
      "Home Pest Control",
      "House Pest Control",
      "Residential Pest Control",
      "Flat Pest Control",
      "Kitchen Pest Control",
      "Bedroom Pest Control",
      "Bathroom Pest Control",
      "Anti-Termite Treatment",
      "Bed Bug Treatment",
      "Rodent Control",
      "Mosquito Control",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Home Pest Control in Bareilly",
    description:
      "MTBOSS provides room-by-room home pest control in Bareilly, covering kitchen, bedroom, bathroom, living room, store room, wardrobes, balcony, terrace and roof spaces. Services include pest inspection, identification, general pest control, anti-termite treatment, bed bug treatment, rodent control, mosquito control, drain treatment, crack sealing, moisture correction and follow-up.",
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
    serviceType: "Residential Pest Control and Pest Management Services",
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