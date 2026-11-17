import type { ReactNode } from 'react';
import { Eyebrow } from '../components/brand';

export function PageHeader({
  title,
  subtitle,
  action,
  eyebrow = 'Parent dashboard',
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-1.5 font-display text-[44px] leading-none tracking-[0.01em] uppercase">{title}</h1>
        <p className="mt-2 text-[17px] text-ink-2">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-10 mb-3 px-1 font-mono text-[13px] font-bold tracking-[0.1em] text-ink-2 uppercase">
      <span className="text-tangerine" aria-hidden>
        //{' '}
      </span>
      {children}
    </h2>
  );
}
