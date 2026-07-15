import LegalPage from "../components/LegalPage";
import { COMPANY_CONTACT, COMPANY_NAME } from "../lib/company";

const sections = [
  {
    title: "Acceptance of terms",
    body: [
      `By accessing or using this website, enquiry forms, booking flows, calculator tools, dashboards, or any service made available by ${COMPANY_NAME}, you agree to these Terms and Conditions.`,
      "If you do not agree with these terms, please do not use the website or submit any service request.",
    ],
  },
  {
    title: "Nature of our services",
    body: [
      `${COMPANY_NAME} provides construction-related services and digital support for project enquiries, budget estimation, construction services, professional services, quick services, property-related enquiries, material supplier coordination, vendor onboarding, contractor support, franchise operations, and related customer assistance.`,
      "Service availability, scope, pricing, timelines, site feasibility, and execution responsibilities may vary depending on location, project requirements, third-party partner availability, inspection, quotation approval, and written confirmation.",
    ],
  },
  {
    title: "User responsibilities",
    body: [
      "You agree to provide accurate, current, and complete information while submitting enquiries, creating an account, making a booking, requesting a quotation, or communicating with our team.",
      [
        "Do not submit false, misleading, abusive, unlawful, or unauthorised information.",
        "Do not misuse the website, payment system, admin panels, vendor panels, supplier panels, or enquiry forms.",
        "Keep your login credentials confidential and notify us if you suspect unauthorised access.",
      ],
    ],
  },
  {
    title: "Estimates, quotations, and project scope",
    body: [
      "Any calculator output, indicative estimate, package amount, displayed pricing, or preliminary quotation is for general guidance unless expressly confirmed in writing by our authorised team.",
      "Final prices may change after site inspection, technical review, material selection, labour requirements, taxes, travel, government approvals, design changes, or other project-specific conditions.",
    ],
  },
  {
    title: "Payments",
    body: [
      "Payments may be collected online or offline for eligible services, bookings, packages, subscriptions, project milestones, vendor/supplier/franchise services, or other agreed charges.",
      "By making a payment, you confirm that you are authorised to use the selected payment method and that the transaction information provided by you is accurate.",
      "Payment confirmation does not automatically guarantee final project acceptance unless the relevant service scope has also been confirmed by our team.",
    ],
  },
  {
    title: "Cancellations, refunds, and disputes",
    body: [
      "Cancellation and refund eligibility depends on the service type, project stage, partner commitment, material procurement, site visit status, work already performed, and the written terms shared at the time of confirmation.",
      "Where a refund is approved, it will be processed to the original payment method or another approved method within a reasonable business timeline, subject to banking/payment gateway processing time.",
      "For payment disputes, please contact us with your name, mobile number, payment reference, service details, and issue description.",
    ],
  },
  {
    title: "Third-party partners and services",
    body: [
      "We may work with vendors, suppliers, contractors, agents, franchises, professionals, payment gateways, logistics providers, or other third-party service providers.",
      "Although we aim to coordinate responsibly, third-party services may be governed by their own terms, licences, warranties, policies, timelines, and statutory obligations.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "All website content, brand material, logos, layout, text, graphics, software, service flows, and digital assets are owned by or licensed to Mtboss construction private limited unless otherwise stated.",
      "You may not copy, reproduce, sell, modify, distribute, or commercially exploit our content without prior written permission.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      "To the maximum extent permitted by law, Mtboss construction private limited will not be liable for indirect, incidental, consequential, punitive, or special losses arising from website use, delayed communication, third-party service issues, force majeure events, or information submitted by users.",
      "Nothing in these terms limits liability where such limitation is not permitted under applicable law.",
    ],
  },
  {
    title: "Contact",
    body: [
      `For questions about these Terms and Conditions, payments, bookings, service requests, or construction-related support, contact us at ${COMPANY_CONTACT.email} or ${COMPANY_CONTACT.phone}.`,
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms and Conditions"
      updated="7 July 2026"
      intro={`These Terms and Conditions explain how customers, partners, vendors, suppliers, agents, franchises, and visitors may use the website and services of ${COMPANY_NAME}.`}
      sections={sections}
    />
  );
}
