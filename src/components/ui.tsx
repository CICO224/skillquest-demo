import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { cx } from '../lib/utils';

/* ---------- Button ---------- */

type Variant = 'primary' | 'success' | 'danger' | 'secondary' | 'plain' | 'dark';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  success: 'bg-ok text-white hover:brightness-110',
  danger: 'bg-bad text-white hover:brightness-110',
  secondary: 'bg-black/[0.06] text-ink hover:bg-black/10',
  plain: 'text-accent hover:bg-accent/10',
  dark: 'bg-ink text-white hover:bg-black',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-[14px]',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-14 px-7 text-[17px]',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

export function Button({ variant = 'primary', size = 'md', block, className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex select-none items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap',
        'transition duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30',
        'disabled:pointer-events-none disabled:opacity-40',
        VARIANTS[variant],
        SIZES[size],
        block && 'w-full',
        className,
      )}
      {...props}
    />
  );
}

/* ---------- Card ---------- */

export function Card({ className, children, as: Tag = 'div' }: { className?: string; children: ReactNode; as?: 'div' | 'section' | 'article' | 'li' }) {
  return <Tag className={cx('rounded-3xl bg-white shadow-card', className)}>{children}</Tag>;
}

/* ---------- Pill / status label ---------- */

type Tone = 'gray' | 'blue' | 'green' | 'red' | 'orange' | 'missed';
const TONES: Record<Tone, string> = {
  gray: 'bg-black/[0.06] text-ink-2',
  blue: 'bg-accent/10 text-accent',
  green: 'bg-ok-soft text-ok',
  red: 'bg-bad-soft text-bad',
  orange: 'bg-warn-soft text-warn',
  missed: 'bg-bad text-white font-bold uppercase tracking-wide',
};

export function Pill({ tone = 'gray', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none', TONES[tone], className)}>
      {children}
    </span>
  );
}

export function MissedBadge() {
  return <Pill tone="missed">Missed</Pill>;
}

/* ---------- Segmented control ---------- */

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  renderOption,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  label: string;
  renderOption?: (v: T) => ReactNode;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex w-full rounded-xl bg-black/[0.06] p-1">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={cx(
              'flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[9px] px-2 text-[14px] font-medium transition',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
              active ? 'bg-white text-ink shadow-[0_1px_3px_rgba(0,0,0,0.12)]' : 'text-ink-2 hover:text-ink',
            )}
          >
            {renderOption ? renderOption(opt) : opt}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Form field ---------- */

export function Field({ label, hint, htmlFor, children }: { label: string; hint?: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-[15px] font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="text-[13px] text-ink-2">{hint}</p>}
    </div>
  );
}

export const inputClass =
  'block w-full h-12 rounded-xl border border-hairline bg-white px-4 text-[16px] text-ink placeholder:text-ink-3 ' +
  'transition focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15';

/* ---------- Modal (sheet on phones, dialog on desktop) ---------- */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const prevFocus = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => {
      const target = panelRef.current?.querySelector<HTMLElement>('[autofocus], input, textarea, select');
      (target ?? panelRef.current)?.focus();
    });
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade bg-black/35 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx(
          'relative flex max-h-[92dvh] w-full animate-pop flex-col overflow-hidden rounded-t-[28px] bg-white shadow-lift outline-none sm:rounded-[28px]',
          wide ? 'sm:max-w-2xl' : 'sm:max-w-lg',
        )}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-2">
          <div>
            <h2 id={titleId} className="text-[22px] font-semibold tracking-tight text-ink">
              {title}
            </h2>
            {description && <p className="mt-1 text-[15px] text-ink-2">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-black/[0.06] px-3 text-[13px] font-medium text-ink-2 hover:bg-black/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
          >
            <X className="size-4" aria-hidden /> Close
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-4">{children}</div>
        {footer && <div className="flex flex-col-reverse gap-3 border-t border-black/5 px-6 py-4 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  );
}

/* ---------- Toast ---------- */

const ToastContext = createContext<(msg: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<{ text: string; key: number } | null>(null);
  const show = useCallback((text: string) => setMsg({ text, key: Date.now() }), []);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2800);
    return () => clearTimeout(t);
  }, [msg]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 sm:bottom-8">
        {msg && (
          <div key={msg.key} className="flex animate-pop items-center gap-2 rounded-full bg-ink/90 px-5 py-3 text-[15px] font-medium text-white shadow-lift backdrop-blur">
            <CheckCircle2 className="size-5 text-[#30d158]" aria-hidden />
            {msg.text}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

/* ---------- Points ---------- */

export function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.5l2.94 5.96 6.56.96-4.75 4.63 1.12 6.53L12 17.5l-5.87 3.08 1.12-6.53L2.5 9.42l6.56-.96L12 2.5z"
      />
    </svg>
  );
}

export function PointsLabel({ points, className }: { points: number; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1 font-semibold tabular-nums', className)}>
      <StarIcon className="size-[1.05em] text-star" />
      {points} {points === 1 ? 'Point' : 'Points'}
    </span>
  );
}

/* ---------- Empty state ---------- */

export function EmptyState({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-black/[0.05] text-ink-3">{icon}</div>
      <p className="text-[17px] font-semibold text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-[15px] text-ink-2">{body}</p>
    </div>
  );
}

/* ---------- Demo QR code (decorative; not a scannable code) ---------- */

export function DemoQr({ seed = 'skillquest', size = 220 }: { seed?: string; size?: number }) {
  const n = 25;
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
  const cells: ReactNode[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (!inFinder(x, y) && rand() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} rx={0.25} />);
  const finder = (x: number, y: number) => (
    <g key={`f${x}${y}`}>
      <rect x={x} y={y} width={7} height={7} rx={1.8} />
      <rect x={x + 1} y={y + 1} width={5} height={5} rx={1.2} fill="#fff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.8} />
    </g>
  );
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} width={size} height={size} fill="#1d1d1f" aria-hidden>
      <rect x={-1} y={-1} width={n + 2} height={n + 2} fill="#fff" />
      {cells}
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
    </svg>
  );
}
