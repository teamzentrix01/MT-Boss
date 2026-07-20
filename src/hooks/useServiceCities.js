'use client';

import { useEffect, useState } from 'react';

export function useServiceCities() {
  const [cities, setCities] = useState([]);
  const [services, setServices] = useState([]);
  const [mapping, setMapping] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/service-cities', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || 'Could not load service cities');
        if (!active) return;
        setCities(data.cities || []);
        setServices(data.services || []);
        setMapping(data.mapping || []);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return { cities, services, mapping, loading, error };
}
