// app/(bareilly_keywords)/bed-bug-treatment-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Bed Bug Treatment Bareilly | Home & Mattress | MTBOSS",
  description:
    "Bed bug treatment Bareilly by MTBOSS: inspection, targeted treatment and follow-up for beds, sofas and rooms. Call +91 94584 10866.",
  keywords:
    "bed bug treatment Bareilly, bed bug control Bareilly, bed bug removal Bareilly, bed bug pest control Bareilly, mattress bed bug treatment Bareilly, sofa bed bug treatment Bareilly, bed bug treatment for hostel Bareilly, bed bug treatment cost Bareilly, pest control services in Bareilly, cockroach control Bareilly, termite control Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS pest control",
  alternates: {
    canonical: "https://www.mtboss.in/bed-bug-treatment-bareilly",
  },
  openGraph: {
    title: "Bed Bug Treatment Bareilly | Home & Mattress | MTBOSS",
    description:
      "Bed bug treatment Bareilly by MTBOSS: inspection, targeted treatment and follow-up for beds, sofas and rooms. Call +91 94584 10866.",
    url: "https://www.mtboss.in/bed-bug-treatment-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-bed-bug-treatment-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Bed Bug Treatment in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bed Bug Treatment Bareilly | Home & Mattress | MTBOSS",
    description:
      "Bed bug treatment Bareilly by MTBOSS: inspection, targeted treatment and follow-up for beds, sofas and rooms. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-bed-bug-treatment-bareilly.jpg"],
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
    url: "https://www.mtboss.in/bed-bug-treatment-bareilly",
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
      "Bed Bug Treatment",
      "Bed Bug Control",
      "Bed Bug Removal",
      "Mattress Bed Bug Treatment",
      "Sofa Bed Bug Treatment",
      "Hostel Bed Bug Treatment",
      "Hotel Bed Bug Treatment",
      "Crack and Crevice Treatment",
      "Pest Control Services",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bed Bug Treatment in Bareilly",
    description:
      "MTBOSS provides bed bug inspection, infestation confirmation, mattress and bed frame treatment, sofa and upholstery treatment, crack and crevice treatment, room-by-room treatment, hostel and hotel treatment, preparation guidance, crack sealing, furniture repair support and follow-up services in Bareilly.",
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
    serviceType: "Bed Bug Treatment and Pest Control Services",
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