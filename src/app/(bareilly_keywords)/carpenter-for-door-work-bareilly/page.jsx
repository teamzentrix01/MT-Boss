// app/(bareilly_keywords)/door-work-carpenter-in-bareilly/page.jsx
import Banner from "./Banner";
import Content from "./Content";
import QuickServices from "../../components/QuickServices";
import CalculatorCTA from "../../components/CalculatorCTA";
import Services from "../../components/Services";

export const metadata = {
  title: "Door Work Carpenter in Bareilly | MTBOSS",
  description:
    "Need a carpenter for door work in Bareilly? MTBOSS handles new doors, frames, fitting and repairs with clear quotes. Call +91 94584 10866.",
  keywords:
    "carpenter for door work Bareilly, door carpenter Bareilly, door fitting Bareilly, wooden door work Bareilly, door frame carpenter Bareilly, main door carpenter Bareilly, door repair Bareilly, door installation Bareilly, flush door Bareilly, panel door Bareilly, door and window carpenter Bareilly, carpenter services Bareilly, MTBOSS Bareilly, MTBOSS Moradabad, MTBOSS budget calculator",
  alternates: {
    canonical:
      "https://www.mtboss.in/door-work-carpenter-in-bareilly",
  },
  openGraph: {
    title: "Door Work Carpenter in Bareilly | MTBOSS",
    description:
      "Need a carpenter for door work in Bareilly? MTBOSS handles new doors, frames, fitting and repairs with clear quotes. Call +91 94584 10866.",
    url: "https://www.mtboss.in/door-work-carpenter-in-bareilly",
    siteName: "MTBOSS Construction Private Limited",
    images: [
      {
        url: "https://www.mtboss.in/og-door-work-carpenter-in-bareilly.jpg",
        width: 1200,
        height: 630,
        alt: "Door Work Carpenter in Bareilly - MTBOSS Construction",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Door Work Carpenter in Bareilly | MTBOSS",
    description:
      "Need a carpenter for door work in Bareilly? MTBOSS handles new doors, frames, fitting and repairs with clear quotes. Call +91 94584 10866.",
    images: [
      "https://www.mtboss.in/og-door-work-carpenter-in-bareilly.jpg",
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
    "@type": "LocalBusiness",
    name: "MTBOSS Construction Private Limited",
    url: "https://www.mtboss.in/door-work-carpenter-in-bareilly",
    telephone: "+91-9458410866",
    email: "mtboss2016@gmail.com",
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
    priceRange: "₹₹",
    serviceType: [
      "Carpenter for Door Work",
      "Door Carpenter",
      "Door Fitting",
      "Wooden Door Work",
      "Door Frame Carpenter",
      "Main Door Carpenter",
      "Door Repair",
      "Door Installation",
      "Flush Door",
      "Panel Door",
      "Door and Window Carpenter",
      "Carpenter Services",
      "Lock and Handle Fitting",
      "Mosquito and Safety Doors",
      "Building Repair",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Door Work Carpenter in Bareilly",
    description:
      "MTBOSS provides door work in Bareilly with site visits, measurement, new door supply and fitting, door frames, hinges, locks, handles, latches, door repair, moisture and termite protection, sliding and folding doors, mosquito and safety doors, polish, paint and installation handover.",
    provider: {
      "@type": "LocalBusiness",
      name: "MTBOSS Construction Private Limited",
      telephone: "+91-9458410866",
      url: "https://www.mtboss.in",
    },
    areaServed: {
      "@type": "City",
      name: "Bareilly",
    },
    serviceType:
      "Door Carpentry, Door Frame Work, Door Fitting, Lock Installation and Door Repair",
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