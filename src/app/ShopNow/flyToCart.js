'use client';

/**
 * Trigger a delightful "fly-to-cart" floating popup animation from the clicked
 * "+ Add to cart" button toward the cart icon/button in the navbar.
 *
 * @param {Event} e - Click event or mouse event
 * @param {Object} product - The product object being added
 */
export function triggerFlyToCart(e, product) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 1. Determine starting coordinates (from button/click)
  let startX = window.innerWidth / 2;
  let startY = window.innerHeight / 2;

  if (e?.currentTarget) {
    const rect = e.currentTarget.getBoundingClientRect();
    startX = rect.left + rect.width / 2;
    startY = rect.top + rect.height / 2;
  } else if (e?.clientX && e?.clientY) {
    startX = e.clientX;
    startY = e.clientY;
  }

  // 2. Locate visible Cart button target
  const cartBtn = document.querySelector(
    '.store-cart-button:not([hidden]), .mobile-cart-btn:not([hidden]), #detail-page-cart-btn, button[aria-label*="cart" i], a[aria-label*="cart" i]'
  );

  let endX = window.innerWidth - 60;
  let endY = 32;

  if (cartBtn) {
    const destRect = cartBtn.getBoundingClientRect();
    if (destRect.width > 0 && destRect.height > 0) {
      endX = destRect.left + destRect.width / 2;
      endY = destRect.top + destRect.height / 2;
    }
  }

  // 3. Resolve product image & title
  const rawImg =
    product?.image_url ||
    product?.image ||
    product?.category_image ||
    (Array.isArray(product?.images) && product.images[0]) ||
    '';

  let imgUrl = '';
  if (rawImg && typeof rawImg === 'string') {
    const trimmed = rawImg.trim();
    if (/^(?:https?:|data:image\/|blob:|\/)/i.test(trimmed)) {
      imgUrl = trimmed;
    } else {
      imgUrl = `/${trimmed}`;
    }
  }

  const prodName = String(product?.name || 'Material').trim();

  // 4. Create floating popup DOM element
  const flyer = document.createElement('div');
  flyer.className = 'fly-to-cart-bubble';
  flyer.innerHTML = `
    <div class="fly-to-cart-inner">
      ${imgUrl ? `<img src="${imgUrl}" class="fly-img" alt="" />` : `<span class="fly-icon">📦</span>`}
      <div class="fly-text">
        <span class="fly-title">${prodName}</span>
        <span class="fly-badge">+1 Added</span>
      </div>
    </div>
  `;

  document.body.appendChild(flyer);

  // 5. Quadratic Bezier Curve fling animation via requestAnimationFrame
  const duration = 650; // ms
  const startTime = performance.now();
  // Arc peak: curve upward above the straight line path
  const peakY = Math.min(startY, endY) - Math.max(90, Math.abs(startX - endX) * 0.22);
  const midX = (startX + endX) / 2;

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const t = progress;
    const invT = 1 - t;

    // Quadratic Bezier Formula: P(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
    const currentX = invT * invT * startX + 2 * invT * t * midX + t * t * endX;
    const currentY = invT * invT * startY + 2 * invT * t * peakY + t * t * endY;

    // Slight scale expansion on start, then fling shrink into cart
    const scale = t < 0.2 ? 1 + t * 0.4 : Math.max(0.18, 1.08 - (t - 0.2) * 1.12);
    const opacity = t > 0.85 ? 1 - (t - 0.85) / 0.15 : 1;
    const rotation = (startX > endX ? -1 : 1) * t * 20;

    flyer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
    flyer.style.opacity = `${opacity}`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      flyer.remove();
      // Target Cart Bounce Feedback
      if (cartBtn) {
        cartBtn.classList.remove('cart-bounce-pop');
        void cartBtn.offsetWidth;
        cartBtn.classList.add('cart-bounce-pop');
        setTimeout(() => {
          cartBtn.classList.remove('cart-bounce-pop');
        }, 600);
      }
    }
  }

  requestAnimationFrame(animate);
}
