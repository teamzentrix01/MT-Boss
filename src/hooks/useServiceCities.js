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
    Promise.all([
      fetch('/api/service-cities', { cache: 'no-store' }),
      fetch('/api/cities', { cache: 'no-store' }),
    ])
      .then(async ([coverageResponse, citiesResponse]) => {
        const [data, cityData] = await Promise.all([coverageResponse.json(), citiesResponse.json()]);
        if (!coverageResponse.ok || !data.success) throw new Error(data.error || 'Could not load service cities');
        if (!citiesResponse.ok || !cityData.success) throw new Error(cityData.error || 'Could not load cities');
        if (!active) return;
        setCities(cityData.cities || []);
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
