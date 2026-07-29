'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MaterialOrdersPanel from '@/app/components/MaterialOrdersPanel';

const ROLE_CONFIG = {
  user: { back: '/userdashboard', label: 'Customer Dashboard' },
  supplier: { back: '/supplier/dashboard', label: 'Supplier Dashboard' },
  vendor: { back: '/vendor/dashboard', label: 'Vendor Dashboard' },
  franchise: { back: '/franchise/dashboard', label: 'Franchise Dashboard' },
  admin: { back: '/dashboard?tab=suppliers', label: 'Admin Dashboard' },
};

function MaterialOrdersContent() {
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get('role') || 'user';
  const role = ROLE_CONFIG[requestedRole] ? requestedRole : 'user';
  const config = ROLE_CONFIG[role];

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 font-serif sm:px-6">
      <div className="mx-auto mb-5 max-w-5xl">
        <Link href={config.back} className="text-xs font-black uppercase tracking-wider text-blue-600">
          ← {config.label}
        </Link>
      </div>
      <MaterialOrdersPanel role={role} />
    </main>
  );
}

export default function MaterialOrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 p-10 text-center">Loading orders…</div>}>
      <MaterialOrdersContent />
    </Suspense>
  );
}
