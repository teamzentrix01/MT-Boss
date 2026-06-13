'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

function getAbsoluteUrl(url) {
  if (!url) return '';
  if (typeof window === 'undefined') return '';
  try {
    return new URL(url, window.location.origin).href;
  } catch {
    return '';
  }
}

function getExtension(name, url) {
  const source = name || url || '';
  return source.split('?')[0].split('.').pop()?.toLowerCase() || '';
}

function getDocxPreviewUrl(url) {
  try {
    const { pathname } = new URL(url, window.location.origin);
    const marker = '/api/career-enquiries/resume/';

    if (!pathname.startsWith(marker)) return '';

    return `/api/career-enquiries/resume-preview/${pathname.slice(marker.length)}`;
  } catch {
    return '';
  }
}

function ResumeViewerContent() {
  const searchParams = useSearchParams();
  const rawUrl = searchParams.get('url') || '';
  const name = searchParams.get('name') || 'Resume';

  const fileUrl = useMemo(() => getAbsoluteUrl(rawUrl), [rawUrl]);
  const extension = getExtension(name, fileUrl);
  const isPdf = extension === 'pdf';
  const isDocx = extension === 'docx';
  const viewerUrl = isDocx ? getDocxPreviewUrl(fileUrl) : fileUrl;

  return (
    <main style={{ minHeight: '100vh', background: '#111', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '0.85rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.12)', display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-blue)', fontWeight: 800 }}>Resume Preview</div>
          <h1 style={{ margin: '0.15rem 0 0', fontSize: '0.95rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</h1>
        </div>
        {fileUrl && (
          <a
            href={fileUrl.replace('mode=view', 'mode=download')}
            style={{ flexShrink: 0, background: 'var(--brand-blue)', color: '#111', padding: '0.55rem 0.85rem', borderRadius: 6, textDecoration: 'none', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}
          >
            Download
          </a>
        )}
      </header>

      <section style={{ flex: 1, minHeight: 0 }}>
        {fileUrl && (isPdf || isDocx) ? (
          <iframe
            src={viewerUrl}
            title={name}
            style={{ width: '100%', height: '100%', minHeight: 'calc(100vh - 65px)', border: 0, background: '#fff' }}
          />
        ) : (
          <div style={{ padding: '2rem', color: '#ddd' }}>
            This resume format cannot be previewed in the browser. Please use Download.
          </div>
        )}
      </section>
    </main>
  );
}

export default function ResumeViewerPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: '100vh', background: '#111', color: '#fff', padding: '2rem' }}>Loading resume...</main>}>
      <ResumeViewerContent />
    </Suspense>
  );
}
