'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    const user = params.get('user');
    const redirect = params.get('redirect') || '/userdashboard';

    if (token) {
      localStorage.setItem('token', token);

      if (user) {
        localStorage.setItem('user', user);
      }

      document.cookie = `auth-token=${token}; path=/; max-age=604800`;
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