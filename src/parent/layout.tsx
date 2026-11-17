import type { ReactNode } from 'react';

export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[34px] leading-tight font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-[17px] text-ink-2">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mt-10 mb-3 px-1 text-[13px] font-semibold tracking-wide text-ink-2 uppercase">{children}</h2>;
}
