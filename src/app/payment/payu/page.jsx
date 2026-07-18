import Link from 'next/link';

export default async function PayUResultPage({ searchParams }) {
  const params = await searchParams;
  const success = params.status === 'success';
  const returnTo = typeof params.returnTo === 'string'
    && params.returnTo.startsWith('/')
    && !params.returnTo.startsWith('//')
    ? params.returnTo
    : '/userdashboard';

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <section className="w-full max-w-lg border border-zinc-800 bg-zinc-900 p-8 text-center shadow-2xl">
        <div className="text-5xl mb-5" aria-hidden="true">{success ? '✓' : '!'}</div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400 mb-3">
          PayU Payment
        </p>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4">
          {success ? 'Payment successful' : 'Payment unsuccessful'}
        </h1>
        <p className="text-sm text-zinc-400 leading-6 mb-3">
          {success
            ? params.message || 'Your booking is confirmed and nearby vendors have been notified.'
            : params.message || 'Your payment was not completed. No successful payment was recorded.'}
        </p>
        {params.booking && (
          <p className="text-sm font-bold mb-7">Booking reference: {params.booking}</p>
        )}
        <div className="flex gap-3 justify-center">
          <Link href={returnTo} className="px-5 py-3 bg-yellow-400 text-black text-xs font-black uppercase tracking-wider">
            Continue
          </Link>
          {!success && (
            <Link href="/quick" className="px-5 py-3 border border-zinc-700 text-xs font-black uppercase tracking-wider">
              Try again
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
