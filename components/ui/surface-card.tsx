import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

/**
 * Flat-card replacement: layered shadow + a faint top inner highlight (the classic
 * "perceived depth" trick) instead of a single border-color-swap-on-hover.
 */
export function SurfaceCard({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-white/10 bg-slate-900/60',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.4),0_16px_32px_-12px_rgba(0,0,0,0.6)]',
        'transition-[transform,box-shadow,border-color] duration-300',
        'hover:-translate-y-1 hover:border-brand/40',
        'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.4),0_24px_48px_-16px_rgba(93,33,218,0.35)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
