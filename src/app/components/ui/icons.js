'use client';

import React, { useState } from 'react';

// Re-export all Lucide React icons used across MT-Boss
export {
  LayoutDashboard,
  UserCog,
  Calculator,
  FileText,
  Briefcase,
  BriefcaseBusiness,
  ClipboardList,
  MapPin,
  Building,
  Building2,
  Mail,
  Store,
  CalendarClock,
  CalendarDays,
  MessageSquare,
  MessageSquareText,
  Users,
  IdCard,
  BarChart3,
  History,
  TrendingUp,
  FolderKanban,
  House,
  Home,
  Zap,
  Wrench,
  CircleDollarSign,
  BadgeIndianRupee,
  Tags,
  ShoppingCart,
  PlusCircle,
  Truck,
  HardHat,
  Eye,
  Pencil,
  Trash2,
  EyeOff,
  Ban,
  ShieldCheck,
  Download,
  Receipt,
  Copy,
  Search,
  X,
  Check,
  RefreshCw,
  Plus,
  Save,
  Phone,
  Tag,
  User,
  CircleUser,
  CircleUserRound,
  Lock,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Filter,
  Package,
  PackageCheck,
  AlertCircle,
  Hourglass,
  Circle,
  Printer,
  HelpCircle,
  Star,
  Image,
  ImageIcon,
  Image as LucideImageIcon,
  Newspaper,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  ExternalLink,
  LogOut,
  SlidersHorizontal,
  Layers,
  Settings,
  Menu,
} from 'lucide-react';

/**
 * ActionIconButton: 32px square icon-only button for table actions and toolbars.
 * Features:
 * - 32px square hit area
 * - Tooltip via title attribute and aria-label
 * - Grey outline icon by default, subtle hover background
 * - Danger variant (red hover) and success variant (green hover)
 */
export function ActionIconButton({
  icon: Icon,
  label,
  title,
  onClick,
  variant = 'default', // 'default' | 'danger' | 'success' | 'primary'
  size = 16,
  strokeWidth = 1.75,
  disabled = false,
  className = '',
  style = {},
  type = 'button',
  ...rest
}) {
  const [isHovered, setIsHovered] = useState(false);

  const tooltip = title || label || 'Action';

  // Base styling tokens matching reference screenshots: clean black outline, NO blue
  let color = '#0f172a';
  let bg = '#ffffff';
  let border = '1px solid #e2e8f0';

  if (variant === 'danger') {
    if (isHovered && !disabled) {
      color = '#dc2626';
      bg = '#fee2e2';
      border = '1px solid #fca5a5';
    } else {
      color = '#ef4444';
      bg = 'transparent';
      border = '1px solid #fecaca';
    }
  } else if (variant === 'success') {
    if (isHovered && !disabled) {
      color = '#16a34a';
      bg = '#dcfce7';
      border = '1px solid #86efac';
    } else {
      color = '#22c55e';
      bg = 'transparent';
      border = '1px solid #bbf7d0';
    }
  } else {
    // default neutral action button: crisp black icon
    if (isHovered && !disabled) {
      color = '#000000';
      bg = '#f1f5f9';
      border = '1px solid #94a3b8';
    } else {
      color = '#0f172a';
      bg = '#ffffff';
      border = '1px solid #e2e8f0';
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      aria-label={tooltip}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        minWidth: '32px',
        minHeight: '32px',
        padding: 0,
        borderRadius: '6px',
        border,
        backgroundColor: bg,
        color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 0.15s ease',
        boxSizing: 'border-box',
        ...style,
      }}
      className={`action-icon-btn ${className}`}
      {...rest}
    >
      {Icon ? <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" /> : null}
    </button>
  );
}

/**
 * IconLabel: reusable inline-flex wrapper for icon + text label
 */
export function IconLabel({
  icon: Icon,
  text,
  size = 16,
  strokeWidth = 1.75,
  gap = 8,
  style = {},
  className = '',
  iconPosition = 'left',
  ...rest
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${gap}px`,
        ...style,
      }}
      className={`icon-label ${className}`}
      {...rest}
    >
      {iconPosition === 'left' && Icon && <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" />}
      {text !== undefined && text !== null && <span>{text}</span>}
      {iconPosition === 'right' && Icon && <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" />}
    </span>
  );
}
