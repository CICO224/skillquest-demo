import type { ReactNode } from 'react';

export function LargeTitle({ children, subtitle }: { children: ReactNode; subtitle?: string }) {
  return (
    <div className="mb-4 px-1">
      <h1 className="text-[34px] leading-tight font-bold tracking-tight">{children}</h1>
      {subtitle && <p className="text-[15px] text-ink-2">{subtitle}</p>}
    </div>
  );
}
