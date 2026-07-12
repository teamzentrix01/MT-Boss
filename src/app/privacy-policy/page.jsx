import LegalPage from "../components/LegalPage";
import { COMPANY_NAME } from "../lib/company";

const sections = [
  {
    title: "Scope of this policy",
    body: [
      `This Privacy Policy explains how ${COMPANY_NAME} collects, uses, stores, shares, and protects personal information submitted through our website, forms, dashboards, booking flows, enquiry pages, contact channels, and construction-related services.`,
      "By using our website or services, you agree to the collection and use of information as described in this policy.",
    ],
  },
  {
    title: "Information we collect",
    body: [
      "We may collect information directly from you when you submit a contact form, request a quotation, book a service, create an account, apply as a vendor/supplier/franchise/agent, upload documents, make a payment, or communicate with us.",
      [
        "Name, mobile number, email address, address, city, pincode, and project location.",
        "Construction requirements, service category, budget details, property details, project documents, images, resumes, or uploaded files.",
        "Account credentials, role information, booking history, enquiry history, and support communication.",
        "Payment reference, transaction status, invoice-related details, and limited payment metadata provided by payment partners.",
      ],
    ],
  },
  {
    title: "How we use information",
    body: [
      "We use collected information to respond to enquiries, prepare quotations, coordinate construction services, manage bookings, verify users and partners, process payments, provide customer support, improve website functionality, and comply with legal or regulatory obligations.",
      "We may also use contact details to send service updates, booking confirmations, OTPs, payment updates, project communication, and important policy notices.",
    ],
  },
  {
    title: "Sharing of information",
    body: [
      "We may share relevant information with internal teams, authorised vendors, suppliers, contractors, agents, franchises, professional service providers, payment gateways, hosting providers, email/SMS/WhatsApp service providers, and legal or regulatory authorities where required.",
      "We do not sell personal information. Information is shared only where it is required to deliver services, process payments, verify users, support customers, or comply with law.",
    ],
  },
  {
    title: "Payments and financial data",
    body: [
      "Online payments may be processed through authorised third-party payment gateways. We do not store full card numbers, CVV, UPI PIN, net-banking password, or other sensitive payment authentication credentials on our website.",
      "Payment partners may process transaction information under their own security standards and policies.",
    ],
  },
  {
    title: "Cookies and website data",
    body: [
      "Our website may use cookies, local storage, session storage, analytics tools, and similar technologies to maintain login sessions, remember preferences, improve performance, prevent misuse, and understand website usage.",
      "You can manage cookies through your browser settings, but disabling some storage features may affect website functionality.",
    ],
  },
  {
    title: "Data retention",
    body: [
      "We retain information for as long as reasonably necessary to provide services, maintain business records, resolve disputes, comply with legal obligations, prevent fraud, and support ongoing customer or partner relationships.",
      "Uploaded files and enquiry records may be retained for operational, audit, customer support, and compliance purposes unless deletion is required by applicable law.",
    ],
  },
  {
    title: "Security",
    body: [
      "We use reasonable technical and organisational measures to protect information against unauthorised access, misuse, loss, alteration, or disclosure.",
      "No internet-based service can be guaranteed to be completely secure. Users are responsible for keeping passwords, OTPs, and account access details confidential.",
    ],
  },
  {
    title: "Your choices and rights",
    body: [
      "You may contact us to request access, correction, update, or deletion of your personal information, subject to identity verification, business record requirements, legal obligations, and technical limitations.",
      "You may also opt out of non-essential promotional communication by contacting us. We may still send necessary service, payment, security, and policy communications.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For privacy questions, data requests, account support, or complaints, contact Mtboss construction private limited at mtboss2016@gmail.com, +91 94584 10866, or +91 70888 11999.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      updated="7 July 2026"
      intro={`This policy describes how ${COMPANY_NAME} handles personal information for construction enquiries, bookings, payments, partner onboarding, and website operations.`}
      sections={sections}
    />
  );
}
