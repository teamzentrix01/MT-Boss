'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Keeps submit feedback consistent while also guarding the synchronous gap
 * before React has had a chance to disable a button.
 */
export function useSubmitAction() {
  const inFlight = useRef(new Set());
  const [submitting, setSubmitting] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const submit = useCallback(async (key, action, { successMessage, onError } = {}) => {
    if (inFlight.current.has(key)) return false;
    inFlight.current.add(key);
    setSubmitting((previous) => ({ ...previous, [key]: true }));
    try {
      await action();
      if (successMessage) setToast({ type: 'success', message: successMessage });
      return true;
    } catch (error) {
      const message = error?.message || 'Something went wrong. Please try again.';
      if (onError) onError(message);
      setToast({ type: 'error', message });
      return false;
    } finally {
      inFlight.current.delete(key);
      setSubmitting((previous) => ({ ...previous, [key]: false }));
    }
  }, []);

  return { isSubmitting: (key) => Boolean(submitting[key]), submit, toast, dismissToast: () => setToast(null) };
}
