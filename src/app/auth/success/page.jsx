'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = params.get('code');
    if (!code) {
      router.replace('/login?error=oauth_failed');
      return;
    }

    let active = true;
    fetch('/api/auth/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Google login failed');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.replace(data.redirectTo || '/userdashboard');
      })
      .catch((err) => {
        if (active) setError(err.message || 'Google login failed');
      });

    return () => { active = false; };
  }, [params, router]);

  return (
    <p style={{ padding: '2rem', textAlign: 'center' }}>
      {error || 'Signing you in…'}
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
