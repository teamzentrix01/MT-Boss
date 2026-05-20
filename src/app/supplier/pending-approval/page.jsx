'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PendingApprovalPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .pa-root {
          min-height: 100vh;
          background: ${dark ? '#0a0a0a' : '#f5f5f7'};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .pa-card {
          width: 100%;
          max-width: 520px;
          background: ${dark ? '#111' : '#fff'};
          border: 1px solid ${dark ? '#222' : '#e5e5ea'};
          border-radius: 16px;
          padding: 3rem 2.5rem;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
        }

        .pa-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          display: block;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .pa-logo {
          font-size: 0.9rem;
          font-weight: 800;
          color: ${dark ? '#fff' : '#111'};
          letter-spacing: -0.02em;
          margin-bottom: 2rem;
          display: block;
        }
        .pa-logo span { color: #10b981; }

        .pa-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: ${dark ? '#fff' : '#111'};
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .pa-subtitle {
          font-size: 0.9rem;
          color: ${dark ? '#888' : '#666'};
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .pa-steps {
          background: ${dark ? '#1a1a1a' : '#f9f9f9'};
          border: 1px solid ${dark ? '#2a2a2a' : '#efefef'};
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          text-align: left;
        }

        .pa-steps-title {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: ${dark ? '#555' : '#aaa'};
          margin-bottom: 1rem;
        }

        .pa-step {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          margin-bottom: 0.875rem;
        }
        .pa-step:last-child { margin-bottom: 0; }

        .pa-step-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .pa-step-dot.done {
          background: #10b981;
          color: #fff;
        }
        .pa-step-dot.pending {
          background: ${dark ? '#2a2a2a' : '#e5e5ea'};
          color: ${dark ? '#666' : '#aaa'};
        }

        .pa-step-text {
          font-size: 0.85rem;
          color: ${dark ? '#ccc' : '#444'};
          line-height: 1.5;
        }
        .pa-step-text strong {
          display: block;
          color: ${dark ? '#fff' : '#111'};
          font-weight: 600;
          margin-bottom: 0.1rem;
        }

        .pa-btn {
          display: inline-block;
          padding: 0.875rem 2rem;
          background: #10b981;
          color: #fff;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.875rem;
          text-decoration: none;
          transition: opacity 0.2s;
          letter-spacing: 0.02em;
        }
        .pa-btn:hover { opacity: 0.88; }

        .pa-back {
          display: block;
          margin-top: 1rem;
          font-size: 0.82rem;
          color: ${dark ? '#555' : '#aaa'};
          text-decoration: none;
          transition: color 0.2s;
        }
        .pa-back:hover { color: #10b981; }
      `}</style>

      <div className="pa-root">
        <div className="pa-card">

          <span className="pa-logo">SUPPLIER<span>HUB</span></span>

          <span className="pa-icon">⏳</span>

          <div className="pa-title">Application Submitted!</div>
          <div className="pa-subtitle">
            Thank you for registering. Your supplier account is currently under review by our admin team. This usually takes 1–2 business days.
          </div>

          <div className="pa-steps">
            <div className="pa-steps-title">Application Status</div>

            <div className="pa-step">
              <div className="pa-step-dot done">✓</div>
              <div className="pa-step-text">
                <strong>Registration Complete</strong>
                Your details have been submitted successfully.
              </div>
            </div>

            <div className="pa-step">
              <div className="pa-step-dot pending">2</div>
              <div className="pa-step-text">
                <strong>Admin Review</strong>
                Our team is verifying your business information.
              </div>
            </div>

            <div className="pa-step">
              <div className="pa-step-dot pending">3</div>
              <div className="pa-step-text">
                <strong>Account Activated</strong>
                You will be notified once your account is approved.
              </div>
            </div>
          </div>

          <Link href="/supplier/login" className="pa-btn">
            Go to Login →
          </Link>

          <Link href="/" className="pa-back">
            ← Back to Home
          </Link>

        </div>
      </div>
    </>
  );
}