export function isQuickServiceIconImage(value) {
  return /^(https?:\/\/|data:image\/|blob:)/i.test(String(value || '').trim());
}

export default function QuickServiceIcon({ value, label = '', className = '', imageClassName = '' }) {
  if (isQuickServiceIconImage(value)) {
    return (
      <span className={className}>
        <img
          src={value}
          alt={label ? `${label} icon` : 'Service icon'}
          className={imageClassName || 'h-full w-full object-contain'}
        />
      </span>
    );
  }

  return <span className={className}>{value || '🔧'}</span>;
}
