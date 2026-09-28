// app/(moradabad_keywords)/architect-for-showroom-in-moradabad/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Architect for Showroom in Moradabad | MTBOSS Construction",
  description:
    "Looking for an experienced architect for showroom construction in Moradabad? MTBOSS offers complete design, facade planning, interior layout and material supply.",
  keywords:
    "architect for showroom Moradabad, showroom construction Moradabad, showroom architect near me, showroom design company Moradabad, commercial showroom architect India, showroom interior design Moradabad, showroom facade design, car showroom architect Moradabad, furniture showroom construction, MTBOSS construction Moradabad, showroom construction cost Moradabad, best architect Moradabad, commercial building contractor Moradabad, retail showroom builder UP",
  alternates: {
    canonical: "https://www.mtboss.in/architect-for-showroom-in-moradabad",
  },
  openGraph: {
    title: "Architect for Showroom in Moradabad | MTBOSS Construction",
    description:
      "Looking for an experienced architect for showroom construction in Moradabad? MTBOSS offers complete design, facade planning, interior layout and material supply.",
    url: "https://www.mtboss.in/architect-for-showroom-in-moradabad",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-architect-showroom-moradabad.jpg",
        width: 1200,
        height: 630,
        alt: "Architect for Showroom Construction in Moradabad - MTBOSS",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Architect for Showroom in Moradabad | MTBOSS Construction",
    description:
      "Looking for an experienced architect for showroom construction in Moradabad? MTBOSS offers complete design, facade planning, interior layout and material supply.",
    images: [
      "https://www.mtboss.in/og-architect-showroom-moradabad.jpg",
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
    "@type": "GeneralContractor",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/architect-for-showroom-in-moradabad",
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
        name: "Moradabad",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
    ],
    priceRange: "₹₹₹",
    serviceType: [
      "Showroom Construction",
      "Showroom Design and Layout Planning",
      "Commercial Construction",
      "Facade Design",
      "Interior Fit-Out",
      "Construction Material Supply",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Showroom Design and Construction in Moradabad",
    description:
      "MTBOSS provides showroom layout planning, facade design, civil construction, interior fit-out coordination, and material supply in Moradabad.",
    provider: {
      "@type": "GeneralContractor",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.mtboss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Moradabad",
    },
    serviceType: "Showroom Construction",
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