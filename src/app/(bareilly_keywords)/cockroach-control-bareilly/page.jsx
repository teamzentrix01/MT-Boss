// app/(bareilly_keywords)/cockroach-control-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Cockroach Control Bareilly | Home & Kitchen | MTBOSS",
  description:
    "Cockroach control Bareilly by MTBOSS: inspection, gel baiting and drain treatment for kitchens, homes and offices. Call +91 94584 10866.",
  keywords:
    "cockroach control Bareilly, cockroach treatment Bareilly, cockroach pest control Bareilly, gel baiting cockroach Bareilly, kitchen cockroach control Bareilly, restaurant cockroach control Bareilly, cockroach control for home Bareilly, cockroach control cost Bareilly, pest control services in Bareilly, termite control Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS pest control, MTBOSS budget calculator",
  alternates: {
    canonical: "https://www.mtboss.in/cockroach-control-bareilly",
  },
  openGraph: {
    title: "Cockroach Control Bareilly | Home & Kitchen | MTBOSS",
    description:
      "Cockroach control Bareilly by MTBOSS: inspection, gel baiting and drain treatment for kitchens, homes and offices. Call +91 94584 10866.",
    url: "https://www.mtboss.in/cockroach-control-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-cockroach-control-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Cockroach Control in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cockroach Control Bareilly | Home & Kitchen | MTBOSS",
    description:
      "Cockroach control Bareilly by MTBOSS: inspection, gel baiting and drain treatment for kitchens, homes and offices. Call +91 94584 10866.",
    images: ["https://www.mtboss.in/og-cockroach-control-bareilly.jpg"],
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
    url: "https://www.mtboss.in/cockroach-control-bareilly",
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
      "Cockroach Control",
      "Cockroach Treatment",
      "Gel Baiting Cockroach Control",
      "Kitchen Cockroach Control",
      "Restaurant Cockroach Control",
      "Commercial Pest Control",
      "Drain and Floor Trap Treatment",
      "Crack and Crevice Treatment",
      "Pest Control Services",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Cockroach Control in Bareilly",
    description:
      "MTBOSS provides cockroach inspection, activity mapping, gel baiting, crack and crevice treatment, drain and floor trap treatment, kitchen and bathroom treatment, commercial cockroach control, entry-point sealing, moisture correction and follow-up services in Bareilly.",
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
    serviceType: "Cockroach Control and Pest Control Services",
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