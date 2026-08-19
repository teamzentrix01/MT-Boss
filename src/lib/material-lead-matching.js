export function materialCategorySignature(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 2)
    .map((word) => (word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word))
    .sort()
    .join(' ');
}

export function materialCategoryMatches(enquiryCategory, supplierCategories = []) {
  const enquirySignature = materialCategorySignature(enquiryCategory);
  if (!enquirySignature) return false;
  return supplierCategories.some((category) => (
    materialCategorySignature(category) === enquirySignature
  ));
}

export function materialLeadStartAt(row = {}) {
  if (row.package_starts_at) return row.package_starts_at;
  if (row.package_purchased_at) return row.package_purchased_at;

  if (row.package_expires_at && Number(row.package_duration_months) > 0) {
    const startDate = new Date(row.package_expires_at);
    if (!Number.isNaN(startDate.getTime())) {
      startDate.setMonth(startDate.getMonth() - Number(row.package_duration_months));
      return startDate;
    }
  }

  return row.created_at || new Date(0);
}
