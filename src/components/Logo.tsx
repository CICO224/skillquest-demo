import { cx } from '../lib/utils';

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <span className={cx('inline-flex items-center gap-2', className)}>
      <span
        aria-hidden
        className="flex size-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-emerald-500 to-emerald-700 text-[15px] font-bold text-white shadow-sm"
      >
        S
      </span>
      {withText && <span className="text-[17px] font-semibold tracking-tight text-ink">SKILLQuest</span>}
    </span>
  );
}
