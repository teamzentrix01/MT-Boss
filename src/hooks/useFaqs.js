'use client';
import { useEffect, useState } from 'react';
import { faqDefaults } from '@/lib/faq-defaults.mjs';

export function useFaqs(page) {
  const [faqs, setFaqs] = useState(faqDefaults[page] || []);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/faqs?page=${encodeURIComponent(page)}`, { cache: 'no-store', signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(result => {
        if (result?.success && Array.isArray(result.data)) setFaqs(result.data);
      }).catch(() => {});
    return () => controller.abort();
  }, [page]);
  return faqs;
}
