import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  className?: string;
  align?: 'left' | 'center';
}

/**
 * Kicker label + solid heading — an alternative to the gradient-text headline
 * that was repeated identically across every section. Gradient treatment is kept
 * exclusive to the hero so it reads as a highlight, not a template stamp.
 */
export function SectionHeading({ kicker, title, className, align = 'center' }: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', className)}>
      {kicker && (
        <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand-lighter">
          <span className="h-px w-6 bg-brand-lighter/60" />
          {kicker}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl font-bold text-white">{title}</h2>
    </div>
  );
}
