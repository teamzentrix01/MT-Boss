'use client';

export default function SubmitToast({ toast, onDismiss }) {
  if (!toast) return null;
  const success = toast.type === 'success';
  return (
    <div
      role="status"
      aria-live="polite"
      onClick={onDismiss}
      style={{
        position: 'fixed', top: 20, right: 20, zIndex: 10000, maxWidth: 420,
        padding: '12px 16px', borderRadius: 8, cursor: 'pointer',
        background: success ? '#14532d' : '#7f1d1d', color: '#fff',
        border: `1px solid ${success ? '#4ade80' : '#fca5a5'}`,
        boxShadow: '0 10px 30px rgba(0,0,0,.35)', fontWeight: 600,
      }}
    >
      {success ? '✓ ' : '⚠ '}{toast.message}
    </div>
  );
}
