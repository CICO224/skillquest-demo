import { cx } from '../lib/utils';
import { Emblem } from './brand';

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5', className)}>
      <Emblem className="size-8" />
      {withText && (
        <span className="text-[18px] font-extrabold tracking-tight text-ink">
          SKILL<span className="text-accent">Quest</span>
        </span>
      )}
    </span>
  );
}
