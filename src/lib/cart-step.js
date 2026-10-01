/**
 * cart-step.js
 * Shared utility to determine the quantity step for a product in the cart.
 *
 * Bricks (Concrete Brick, Red Clay Brick, etc.) are sold in bulk units of 100.
 * All other categories use a step of 1.
 */

/**
 * Returns the step size (and minimum quantity) for a given product.
 * @param {object} product - The product object from the shop catalog.
 * @returns {number} 100 for brick-type products, 1 for everything else.
 */
export function getCartStep(product) {
  if (!product) return 1;

  const catRaw =
    typeof product.category === 'object'
      ? product.category?.name || product.category?.title || ''
      : product.category || '';

  const cat = catRaw.trim().toLowerCase();
  const name = String(product.name || '').trim().toLowerCase();

  const isBrick = cat.includes('brick') || name.includes('brick');

  return isBrick ? 100 : 1;
}
