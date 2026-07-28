export const QUICK_SERVICE_GST_PERCENT = 18;

export function getQuickServiceTax(basePrice) {
  return Math.round((Number(basePrice) * QUICK_SERVICE_GST_PERCENT) / 100);
}

export function getQuickServiceTotal(basePrice, visitFee = 0) {
  const price = Number(basePrice);
  return price + Number(visitFee) + getQuickServiceTax(price);
}
