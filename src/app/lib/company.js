export const COMPANY_NAME = "Mtboss construction private limited";

const phoneDigits = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "").replace(/\D/g, "");

function formatIndianPhone(value) {
  const localNumber = value.startsWith("91") && value.length === 12 ? value.slice(2) : value;
  if (localNumber.length !== 10) return value ? `+${value}` : "";
  return `+91 ${localNumber.slice(0, 5)} ${localNumber.slice(5)}`;
}

export const COMPANY_CONTACT = {
  address: "Harthala Kanth Road Behind Kr Collection, near Domino's, Uttar Pradesh, India",
  email: "mtboss2016@gmail.com",
  phone: formatIndianPhone(phoneDigits),
  phoneDigits,
  telHref: phoneDigits ? `tel:+${phoneDigits}` : "",
  whatsappHref: phoneDigits ? `https://wa.me/${phoneDigits}` : "",
};
