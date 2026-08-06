'use client';

import ForgotPasswordForm from '@/app/components/ForgotPasswordForm';

export default function Page() {
  return <ForgotPasswordForm userType="agent" loginHref="/agent/login" accentColor="var(--brand-blue)" />;
}
