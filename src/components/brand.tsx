import type { ReactNode } from 'react';
import { cx } from '../lib/utils';

/** Four-point sparkle from the banner. */
export function Sparkle({ className, twinkle }: { className?: string; twinkle?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={cx(className, twinkle && 'animate-twinkle')} aria-hidden>
      <path fill="currentColor" d="M12 0c.7 6.4 5.6 11.3 12 12-6.4.7-11.3 5.6-12 12-.7-6.4-5.6-11.3-12-12C6.4 11.3 11.3 6.4 12 0z" />
    </svg>
  );
}

/** Navy diamond with a yellow sparkle: the banner's emblem. */
export function Emblem({ className }: { className?: string }) {
  return (
    <span className={cx('relative inline-flex shrink-0 items-center justify-center', className)} aria-hidden>
      <span className="absolute inset-[12%] rotate-45 rounded-[22%] border-2 border-sun bg-navy shadow-[2px_2px_0_var(--color-tangerine)]" />
      <Sparkle className="relative size-[52%] text-sun" />
    </span>
  );
}

/** Orange "LABEL" tab with a thin rule ending in a diamond. */
export function SectionTag({ children, className, rule = true }: { children: ReactNode; className?: string; rule?: boolean }) {
  return (
    <div className={cx('flex items-center gap-3', className)}>
      <span className="inline-flex items-center rounded-lg bg-tangerine px-3 py-1.5 font-mono text-[13px] font-bold tracking-wider text-white uppercase shadow-[3px_3px_0_var(--color-navy)] dark:shadow-[3px_3px_0_rgb(0_0_0/0.4)]">
        {children}
      </span>
      {rule && (
        <span className="flex flex-1 items-center" aria-hidden>
          <span className="h-px flex-1 bg-ink/15" />
          <span className="size-2 rotate-45 bg-ink" />
        </span>
      )}
    </div>
  );
}

/** Small mono eyebrow, e.g. "PARENT DASHBOARD". */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx('font-mono text-[12px] font-bold tracking-[0.14em] text-tangerine uppercase', className)}>
      {children}
    </p>
  );
}

/** Numbered diamond used for steps. */
export function DiamondNumber({ n, tone = 'orange', className }: { n: number; tone?: 'orange' | 'yellow'; className?: string }) {
  return (
    <span className={cx('relative inline-flex size-14 shrink-0 items-center justify-center', className)}>
      <span
        className={cx(
          'absolute inset-[9px] rotate-45 rounded-[10px] border-[2.5px] border-navy dark:border-cream/80',
          tone === 'orange' ? 'bg-tangerine' : 'bg-sun',
        )}
        aria-hidden
      />
      <span className="relative font-display text-[20px] leading-none text-navy">{String(n).padStart(2, '0')}</span>
    </span>
  );
}

/** Navy terminal window from the banner, e.g. "simple_rules.txt". */
export function Terminal({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cx('overflow-hidden rounded-3xl bg-surface text-ink shadow-card ring-1 ring-ink/10 dark:bg-navy dark:text-cream dark:shadow-lift dark:ring-white/5', className)}>
      <div className="flex items-center gap-3 bg-accent px-5 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-3 rounded-full bg-tangerine" />
          <span className="size-3 rounded-full bg-sun" />
          <span className="size-3 rounded-full bg-white/90" />
        </span>
        <span className="font-mono text-[14px] font-bold text-white">{title}</span>
      </div>
      <div className="px-5 py-5 font-mono text-[15px] leading-relaxed sm:px-7 sm:py-6">{children}</div>
    </div>
  );
}

/** Dashed "speed lines" decoration. */
export function DashLines({ className, rows = 3 }: { className?: string; rows?: number }) {
  return (
    <span className={cx('flex flex-col gap-2', className)} aria-hidden>
      {Array.from({ length: rows }, (_, i) => (
        <span
          key={i}
          className="h-[3px] rounded-full"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0 18px, transparent 18px 26px)',
            marginLeft: `${i * 14}px`,
          }}
        />
      ))}
    </span>
  );
}
