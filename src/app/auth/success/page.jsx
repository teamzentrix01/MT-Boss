'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthSuccess() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    const user = params.get('user');
    const redirect = params.get('redirect') || '/userdashboard';

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);
      document.cookie = `auth-token=${token}; path=/; max-age=604800`;
    }
    router.replace(redirect);
  }, []);

  return <p style={{ padding: '2rem', textAlign: 'center' }}>Signing you in…</p>;
}