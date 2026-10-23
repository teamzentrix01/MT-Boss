import Image from 'next/image';
import * as Lucide from 'lucide-react';

export function isQuickServiceIconImage(value) {
  return /^(https?:\/\/|data:image\/|blob:)/i.test(String(value || '').trim());
}

export default function QuickServiceIcon({
  value,
  label = '',
  className = '',
  imageClassName = '',
  service = null,
  size = 28,
}) {
  // If service object is passed or value looks like service or lucide icon name
  const iconType = service?.iconType || service?.icon_type;
  const iconName = service?.iconName || service?.icon_name || (!isQuickServiceIconImage(value) && Lucide[value] ? value : null);
  const iconUrl = service?.iconUrl || service?.icon_url || (isQuickServiceIconImage(value) ? value : null);

  if ((iconType === 'lucide' || iconName) && iconName && Lucide[iconName]) {
    const IconComponent = Lucide[iconName];
    return (
      <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconComponent size={size} />
      </span>
    );
  }

  const finalImgUrl = iconUrl || (isQuickServiceIconImage(value) ? value : null);
  if (finalImgUrl) {
    const dim = size || 28;
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${dim}px`,
          height: `${dim}px`,
          minWidth: `${dim}px`,
          minHeight: `${dim}px`,
          maxWidth: `${dim}px`,
          maxHeight: `${dim}px`,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <Image
          src={finalImgUrl}
          alt={label ? `${label} icon` : 'Service icon'}
          width={dim}
          height={dim}
          unoptimized
          loading="lazy"
          className={imageClassName || 'object-contain'}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: `${dim}px`,
            maxHeight: `${dim}px`,
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </span>
    );
  }

  return <span className={className}>{value || '🔧'}</span>;
}
