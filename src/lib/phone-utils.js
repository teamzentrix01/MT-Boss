/**
 * Cleanly formats Indian mobile phone numbers for display.
 *
 * Rules:
 * 1. Strip everything except digits (spaces, dashes, brackets, +).
 * 2. If starts with 91 and has 12 digits, drop the 91.
 * 3. If starts with 0 and has 11 digits, drop the leading 0.
 * 4. If the remaining number has exactly 10 digits, return: +91 XXXXX XXXXX (5 digits, space, 5 digits).
 * 5. If it does not fit (missing, too short, too long, or a landline), return original value unchanged.
 * 6. If empty, null, or undefined, return —.
 * 7. Never throws an error and never hides a number that cannot be formatted.
 */
export function formatIndianPhone(value) {
  if (value === null || value === undefined) return '—';
  const rawStr = String(value).trim();
  if (
    !rawStr ||
    rawStr === '—' ||
    rawStr === '-' ||
    rawStr.toLowerCase() === 'n/a' ||
    rawStr.toLowerCase() === 'null' ||
    rawStr.toLowerCase() === 'undefined'
  ) {
    return '—';
  }

  const digits = rawStr.replace(/\D/g, '');

  let normalized = digits;
  if (normalized.length === 12 && normalized.startsWith('91')) {
    normalized = normalized.slice(2);
  } else if (normalized.length === 11 && normalized.startsWith('0')) {
    normalized = normalized.slice(1);
  }

  if (normalized.length === 10) {
    return `+91 ${normalized.slice(0, 5)} ${normalized.slice(5)}`;
  }

  // Does not fit standard 10-digit mobile, return original string unchanged
  return rawStr;
}

/**
 * Returns raw tel: link URI (e.g. "tel:+917307939550")
 */
export function toIndianPhoneTel(value) {
  if (value === null || value === undefined) return '';
  const rawStr = String(value).trim();
  if (
    !rawStr ||
    rawStr === '—' ||
    rawStr === '-' ||
    rawStr.toLowerCase() === 'n/a' ||
    rawStr.toLowerCase() === 'null' ||
    rawStr.toLowerCase() === 'undefined'
  ) {
    return '';
  }

  let digits = rawStr.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (digits.length === 10) {
    return `tel:+91${digits}`;
  }
  if (digits.length > 0) {
    return `tel:${digits}`;
  }
  return '';
}

/**
 * Normalizes a phone search input to digits for flexible database matching
 */
export function normalizePhoneSearch(value) {
  if (!value) return '';
  let digits = String(value).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits || String(value).trim();
}
