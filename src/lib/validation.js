export function cleanText(value) {
  return String(value ?? '').trim();
}

export function normalizePhone(value) {
  return cleanText(value).replace(/\D/g, '').slice(0, 10);
}

export function isValidIndianMobile(value) {
  return /^[6-9]\d{9}$/.test(normalizePhone(value));
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanText(value));
}

export function isValidPersonName(value) {
  const name = cleanText(value);
  return name.length >= 2 && /^[A-Za-z][A-Za-z\s'.-]*$/.test(name) && !/\d/.test(name);
}

export function validationError(error) {
  return { success: false, error };
}

export function validateContactFields({ name, email, phone, nameLabel = 'Name', phoneRequired = true, emailRequired = true }) {
  if (name !== undefined && !isValidPersonName(name)) {
    return `${nameLabel} must contain letters only, no digits.`;
  }
  if ((phoneRequired || cleanText(phone)) && !isValidIndianMobile(phone)) {
    return 'Phone number must be 10 digits and start with 6, 7, 8 or 9.';
  }
  if ((emailRequired || cleanText(email)) && !isValidEmail(email)) {
    return 'Enter a valid email address.';
  }
  return '';
}
