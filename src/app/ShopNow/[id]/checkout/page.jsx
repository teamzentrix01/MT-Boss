"use client";

import { use, Suspense } from "react";
import CheckoutView from "../../CheckoutView";

export default function ProductCheckoutPage({ params }) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-sm">Loading checkout...</div>}>
      <CheckoutView productId={resolvedParams?.id} />
    </Suspense>
  );
}
