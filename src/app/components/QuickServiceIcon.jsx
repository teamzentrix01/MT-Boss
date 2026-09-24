import Image from 'next/image';

export function isQuickServiceIconImage(value) {
  return /^(https?:\/\/|data:image\/|blob:)/i.test(String(value || '').trim());
}

export default function QuickServiceIcon({ value, label = '', className = '', imageClassName = '' }) {
  if (isQuickServiceIconImage(value)) {
    return (
      <span className={className}>
        <Image
          src={value}
          alt={label ? `${label} icon` : 'Service icon'}
          width={64}
          height={64}
          unoptimized
          className={imageClassName || 'h-full w-full object-contain'}
        />
      </span>
    );
  }

  return <span className={className}>{value || '🔧'}</span>;
}
