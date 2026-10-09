'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Receipt,
  RotateCcw,
} from 'lucide-react';

export default function WalletPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState({ balance: 0, pending_balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark-mode'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/wallet');
      return;
    }

    const fetchWalletData = async () => {
      try {
        const [walletRes, txRes] = await Promise.all([
          fetch('/api/wallet', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/wallet/transactions', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [walletData, txData] = await Promise.all([walletRes.json(), txRes.json()]);

        if (walletRes.status === 401 || txRes.status === 401) {
          router.push('/login?redirect=/wallet');
          return;
        }

        if (walletData.success) {
          setWallet(walletData.data);
        } else {
          setError(walletData.error || 'Failed to load wallet balance');
        }

        if (txData.success) {
          setTransactions(txData.data || []);
        }
      } catch (err) {
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [router]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'AVAILABLE') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={12} /> Available
        </span>
      );
    }
    if (s === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock size={12} /> Pending
        </span>
      );
    }
    if (s === 'REVERSED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <RotateCcw size={12} /> Reversed
        </span>
      );
    }
    if (s === 'EXPIRED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
          <AlertCircle size={12} /> Expired
        </span>
      );
    }
    return <span className="text-xs font-semibold text-zinc-500">{status}</span>;
  };

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-zinc-900'}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <Link href="/ShopNow" className="hover:underline">Shop Now</Link>
              <span>/</span>
              <span className="text-[#12283F] font-bold">Cashback Wallet</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-[#12283F]">
              My Cashback Wallet
            </h1>
          </div>
          <Link
            href="/ShopNow"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#E4572E] text-white hover:bg-[#d04a22] transition-colors shadow-sm"
          >
            Order Materials <ArrowRight size={14} />
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Balance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Spendable Balance Card */}
          <div className={`p-6 rounded-2xl border shadow-sm transition-all ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Available Balance
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Wallet size={20} />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">
              ₹{Number(wallet.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Ready to be used as discount credit on your future material orders.
            </p>
          </div>

          {/* Pending Cashback Card */}
          <div className={`p-6 rounded-2xl border shadow-sm transition-all ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pending Cashback
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock size={20} />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-amber-600">
              ₹{Number(wallet.pending_balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Unlocks after the delivery return window expires and moves to Available Balance.
            </p>
          </div>
        </div>

        {/* Info Strip */}
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${isDark ? 'bg-zinc-900/60 border-zinc-800 text-slate-400' : 'bg-[#e3f3f3]/60 border-[#c4e6e6] text-[#12283F]'}`}>
          <TrendingUp size={18} className="text-[#0D9488] shrink-0" />
          <span>
            <strong>How Cashback Works:</strong> Place orders on MT Boss to earn dynamic cashback. Once delivered, cashback is credited to your wallet according to store policy.
          </span>
        </div>

        {/* Transactions Table Section */}
        <div className={`rounded-2xl border shadow-sm overflow-hidden ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#12283F]">Transaction History</h2>
            <span className="text-xs text-slate-500">{transactions.length} entries</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading your transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <Receipt size={36} className="mx-auto text-slate-300" />
              <p className="text-sm font-semibold">No cashback transactions yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Start shopping building materials on Shop Now to earn instant cashback on your orders!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b font-bold uppercase tracking-wider text-[10px] ${isDark ? 'border-zinc-800 text-slate-400' : 'border-slate-100 text-slate-500 bg-slate-50/50'}`}>
                    <th className="py-3 px-4">Type / Source</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Available Date</th>
                    <th className="py-3 px-4">Expiry Date</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-slate-100'}`}>
                  {transactions.map((tx) => {
                    const isCredit = tx.type === 'CREDIT';
                    return (
                      <tr key={tx.id} className={isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-slate-50/60'}>
                        <td className="py-3.5 px-4 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <span className={isCredit ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                              {isCredit ? '+' : '-'}
                            </span>
                            <span>{tx.note || tx.source}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                            {formatDate(tx.created_at)}
                          </span>
                        </td>
                        <td className={`py-3.5 px-4 font-extrabold ${isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
                          ₹{Number(tx.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                          {tx.order_reference || (tx.order_id ? `#${tx.order_id}` : '—')}
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(tx.status)}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {tx.status === 'PENDING' ? formatDate(tx.available_at) : (tx.status === 'AVAILABLE' ? 'Immediate' : '—')}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {tx.expires_at ? formatDate(tx.expires_at) : 'Never'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
