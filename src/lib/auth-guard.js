// ════════════════════════════════════════════════════════════════════════════════
// FILE: lib/auth-guard.js
// PROTECT ROUTES - Redirect to login if not authenticated
// ════════════════════════════════════════════════════════════════════════════════
 
import { useRouter } from "next/navigation";
import { useEffect } from "react";
 
export function useAuthGuard(userType = "user") {
  const router = useRouter();
 
  useEffect(() => {
    const token = localStorage.getItem(
      userType === "vendor" ? "vendorToken" : "userToken"
    );
 
    if (!token) {
      const redirectUrl =
        userType === "vendor"
          ? "/vendor/login"
          : `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      router.push(redirectUrl);
    }
  }, [router, userType]);
}
 