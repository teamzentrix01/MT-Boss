'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function VendorPendingPage() {
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
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .pending-root {
          min-height: 100vh;
          background: ${dark ? '#0a0a0a' : '#f0ede8'};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.4s;
        }

        .pending-wrap {
          width: 100%;
          max-width: 480px;
        }

        .pending-card {
          background: ${dark ? '#111' : '#fff'};
          border: 1px solid ${dark ? '#222' : '#e5e0d8'};
          border-radius: 16px;
          padding: 2.5rem;
          text-align: center;
          box-shadow: ${dark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 4px 40px rgba(0,0,0,0.06)'};
        }

        .pending-icon {
          font-size: 3.5rem;
          margin-bottom: 1.25rem;
          animation: pendingBounce 2s ease-in-out infinite;
        }

        @keyframes pendingBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .pending-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: ${dark ? '#fff' : '#111'};
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .pending-subtitle {
          font-size: 0.9rem;
          color: ${dark ? '#999' : '#666'};
          margin-bottom: 1.75rem;
          line-height: 1.6;
        }

        .pending-checklist {
          background: ${dark ? '#0a0a0a' : '#fafaf8'};
          border: 1px solid ${dark ? '#2a2a2a' : '#e0dbd2'};
          border-radius: 10px;
          padding: 1.5rem;
          margin-bottom: 1.75rem;
          text-align: left;
        }

        .check-item {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.875rem;
          font-size: 0.875rem;
          color: ${dark ? '#ddd' : '#333'};
        }

        .check-item:last-child { margin-bottom: 0; }

        .check-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          background: #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .check-text { line-height: 1.5; }

        .pending-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .btn {
          padding: 0.875rem 1.25rem;
          border-radius: 9px;
          font-size: 0.875rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.05em;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary {
          background: #22c55e;
          color: #fff;
        }

        .btn-primary:hover {
          background: #16a34a;
        }

        .btn-secondary {
          background: transparent;
          border: 1.5px solid ${dark ? '#2a2a2a' : '#ddd'};
          color: ${dark ? '#888' : '#666'};
        }

        .btn-secondary:hover {
          border-color: ${dark ? '#444' : '#bbb'};
          color: ${dark ? '#fff' : '#111'};
        }

        .pending-footer {
          font-size: 0.8rem;
          color: ${dark ? '#444' : '#aaa'};
          margin-top: 1.5rem;
        }

        .pending-footer a {
          color: #22c55e;
          text-decoration: none;
          font-weight: 600;
        }

        .pending-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="pending-root">
        <div className="pending-wrap">
          <div className="pending-card">
            <div className="pending-icon">⏳</div>
            
            <h1 className="pending-title">Approval Pending</h1>
            <p className="pending-subtitle">
              Your vendor account has been successfully registered. Our admin team is reviewing your details.
            </p>

            <div className="pending-checklist">
              <div className="check-item">
                <div className="check-icon">✓</div>
                <div className="check-text">Account created successfully</div>
              </div>
              <div className="check-item">
                <div className="check-icon">✓</div>
                <div className="check-text">Identity documents received</div>
              </div>
              <div className="check-item">
                <div className="check-icon">✓</div>
                <div className="check-text">Verification in progress</div>
              </div>
              <div className="check-item">
                <div className="check-icon">⏱</div>
                <div className="check-text"><strong>Approval typically takes 24-48 hours</strong></div>
              </div>
            </div>

            <p className="pending-subtitle">
              We'll send you an email notification as soon as your account is approved. You can then log in and start using your vendor dashboard.
            </p>

            <div className="pending-buttons">
              <Link href="/vendor/login" className="btn btn-primary">
                Back to Login
              </Link>
              <Link href="/" className="btn btn-secondary">
                Return Home
              </Link>
            </div>

            <div className="pending-footer">
              Questions? <Link href="/contact">Contact Support</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}