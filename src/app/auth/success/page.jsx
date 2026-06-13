'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const user = params.get('user');
    const redirect = params.get('redirect') || '/userdashboard';

    if (user) {
      localStorage.setItem('user', user);
    }

    router.replace(redirect);
  }, [params, router]);

  return (
    <p style={{ padding: '2rem', textAlign: 'center' }}>
      Signing you in…
    </p>
  );
}

export default function AuthSuccess() {
  return (
    <Suspense fallback={<p style={{ padding: '2rem', textAlign: 'center' }}>Loading...</p>}>
      <AuthSuccessContent />
    </Suspense>
  );
}
