"use client";

import { Suspense } from "react";
import CheckoutView from "../CheckoutView";

export default function ShopCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-sm">Loading checkout...</div>}>
      <CheckoutView />
    </Suspense>
  );
}
