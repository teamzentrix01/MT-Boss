'use client';
import ForgotPasswordForm from '@/app/components/ForgotPasswordForm';
export default function Page() {
  return <ForgotPasswordForm userType="vendor" loginHref="/vendor/login" accentColor="#facc15" />;
}
