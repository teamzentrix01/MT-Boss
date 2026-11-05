'use client';

import { useCities } from '@/hooks/useCities';

/**
 * Dropdown of active managed cities (same list used by /api/agents and signup validation).
 */
export default function ManagedCitySelect({
  value,
  onChange,
  name = 'city',
  required = false,
  disabled = false,
  className,
  style,
  placeholder = 'Select city',
}) {
  const { cities, cityRecords, loading, error } = useCities();

  const handleChange = (event) => {
    const city = event.target.value;
    const record = cityRecords.find((row) => row.name === city);
    onChange(city, record?.state || '');
  };

  return (
    <>
      <select
        name={name}
        required={required}
        value={value}
        disabled={disabled || loading}
        onChange={handleChange}
        className={className}
        style={style}
      >
        <option value="">{loading ? 'Loading cities…' : placeholder}</option>
        {cities.map((cityName) => (
          <option key={cityName} value={cityName}>
            {cityName}
          </option>
        ))}
      </select>
      {error ? (
        <p style={{ marginTop: 6, fontSize: '0.75rem', color: '#dc2626' }}>{error}</p>
      ) : null}
    </>
  );
}
