// app/(bareilly_keywords)/mosquito-control-services-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Mosquito Control Services Bareilly | Home & Garden | MTBOSS",
  description:
    "Mosquito control services Bareilly by MTBOSS: inspection, larvae control and spray for homes, gardens and societies. Call +91 94584 10866.",
  keywords:
    "mosquito control services Bareilly, mosquito control Bareilly, mosquito treatment Bareilly, mosquito spray Bareilly, mosquito fogging Bareilly, larvicide treatment Bareilly, mosquito control for society Bareilly, mosquito control for garden Bareilly, mosquito control cost Bareilly, pest control services in Bareilly, cockroach control Bareilly, bed bug treatment Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS pest control",
  alternates: {
    canonical: "https://www.mtboss.in/mosquito-control-services-bareilly",
  },
  openGraph: {
    title: "Mosquito Control Services Bareilly | Home & Garden | MTBOSS",
    description:
      "Mosquito control services Bareilly by MTBOSS: inspection, larvae control and spray for homes, gardens and societies. Call +91 94584 10866.",
    url: "https://www.mtboss.in/mosquito-control-services-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-mosquito-control-services-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Mosquito Control Services in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mosquito Control Services Bareilly | Home & Garden | MTBOSS",
    description:
      "Mosquito control services Bareilly by MTBOSS: inspection, larvae control and spray for homes, gardens and societies. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-mosquito-control-services-bareilly.jpg",
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
    "@type": "PestControlService",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/mosquito-control-services-bareilly",
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
      "Mosquito Control Services",
      "Mosquito Treatment",
      "Mosquito Spray",
      "Mosquito Fogging",
      "Larvicide Treatment",
      "Society Mosquito Control",
      "Garden Mosquito Control",
      "Commercial Mosquito Control",
      "Drain and Sump Treatment",
      "Pest Control Services",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Mosquito Control Services in Bareilly",
    description:
      "MTBOSS provides mosquito inspection, breeding source mapping, larvae control, residual treatment of resting areas, garden and open-area treatment, drain and sump treatment, terrace and water tank checks, society and commercial mosquito control, drainage correction and follow-up services in Bareilly.",
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
    serviceType: "Mosquito Control and Pest Control Services",
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