import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const sizeClasses = {
  sm: 'h-9 w-9 rounded-lg',
  md: 'h-12 w-12 rounded-xl',
  lg: 'h-14 w-14 rounded-2xl',
};

interface IconBadgeProps {
  children: ReactNode;
  size?: keyof typeof sizeClasses;
  className?: string;
}

/**
 * Shared "icon in a box" treatment used for avatar/logo fallbacks, contact-method
 * icons, social buttons, and step badges — replaces the same flat square copy-pasted
 * across every section with one component that has real depth (inner highlight +
 * layered shadow) instead of a single flat border.
 */
export function IconBadge({ children, size = 'md', className }: IconBadgeProps) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center shrink-0',
        'bg-gradient-to-b from-[#1c1530] to-[#120d20]',
        'border border-white/10',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_6px_16px_rgba(93,33,218,0.18)]',
        'text-brand-lighter',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
