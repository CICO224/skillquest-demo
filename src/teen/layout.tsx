import type { ReactNode } from 'react';
import { Eyebrow } from '../components/brand';

export function LargeTitle({ children, subtitle, eyebrow }: { children: ReactNode; subtitle?: string; eyebrow?: string }) {
  return (
    <div className="mb-5 px-1">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="mt-1 font-display text-[40px] leading-none tracking-[0.01em] uppercase">{children}</h1>
      {subtitle && <p className="mt-1.5 text-[15px] text-ink-2">{subtitle}</p>}
    </div>
  );
}

/** Mono "// CATEGORY" heading used for groups in the teen view. */
export function GroupTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2 px-1 font-mono text-[13px] font-bold tracking-[0.1em] text-ink-2 uppercase">
      <span className="text-tangerine" aria-hidden>
        //{' '}
      </span>
      {children}
    </h2>
  );
}
