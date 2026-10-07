import * as Lucide from 'lucide-react';

export function ServiceIcon({ service, size = 40, className = '', imageClassName = '' }) {
  if (!service) return null;

  // Determine iconType, iconName, iconUrl
  const iconType = service.iconType || service.icon_type;
  const iconName = service.iconName || service.icon_name;
  const iconUrl = service.iconUrl || service.icon_url || (service.icon && /^(https?:\/\/|data:image\/|blob:)/i.test(String(service.icon).trim()) ? service.icon : '');

  // 1. Lucide mode
  if ((iconType === 'lucide' || (!iconType && iconName)) && iconName) {
    const IconComponent = Lucide[iconName];
    if (IconComponent) {
      return (
        <span
          className={className}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <IconComponent size={size} />
        </span>
      );
    }
  }

  // 2. Image mode (or fallback to legacy image)
  if (iconUrl) {
    return (
      <span
        className={className}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
      >
        <img
          src={iconUrl}
          alt={service.label || service.name || 'Service icon'}
          width={size}
          height={size}
          className={imageClassName}
          style={{ width: size, height: size, objectFit: 'contain' }}
        />
      </span>
    );
  }

  // 3. Fallback for legacy emojis or string icon in service.icon
  if (service.icon) {
    return (
      <span
        className={className}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: typeof size === 'number' ? `${size * 0.75}px` : undefined }}
      >
        {service.icon}
      </span>
    );
  }

  return null;
}

export default ServiceIcon;
