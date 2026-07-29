'use client';

import Link from 'next/link';
import JobApplicationsPanel from '@/app/components/JobApplicationsPanel';

export default function JobApplicationsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 font-serif sm:px-6">
      <div className="mx-auto mb-5 max-w-4xl">
        <Link href="/userdashboard" className="text-xs font-black uppercase tracking-wider text-blue-600">
          ← Customer Dashboard
        </Link>
      </div>
      <div className="mx-auto max-w-4xl">
        <JobApplicationsPanel />
      </div>
    </main>
  );
}
