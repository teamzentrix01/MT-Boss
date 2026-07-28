'use client';

import { useEffect, useState } from 'react';

export function useCities() {
  const [cities, setCities] = useState([]);
  const [cityRecords, setCityRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/cities', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || 'Could not load cities');
        if (!active) return;
        setCities(data.cities || []);
        setCityRecords(data.data || []);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { cities, cityRecords, loading, error };
}
