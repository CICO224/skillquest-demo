import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/utils';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* ---------- Counting number ---------- */

/** Counts smoothly from the previous value (or `from`) to `value`. */
export function AnimatedNumber({ value, from }: { value: number; from?: number }) {
  const [display, setDisplay] = useState(from ?? value);
  const shown = useRef(from ?? value);

  useEffect(() => {
    const start = shown.current;
    if (start === value || prefersReducedMotion()) {
      shown.current = value;
      setDisplay(value);
      return;
    }
    const duration = Math.min(1400, 500 + Math.abs(value - start) * 18);
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const n = Math.round(start + (value - start) * eased);
      shown.current = n;
      setDisplay(n);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className="tabular-nums">{display}</span>;
}

/* ---------- Celebration overlay ---------- */

interface CelebrateOptions {
  title: string;
  subtitle?: string;
  confetti?: boolean;
  emoji?: string;
}

const CelebrateContext = createContext<(o: CelebrateOptions) => void>(() => {});
export const useCelebrate = () => useContext(CelebrateContext);

const CONFETTI_COLORS = ['#ff6b1a', '#ffc83d', '#1f5fd1', '#10233f', '#ffffff', '#3b82f6'];

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<(CelebrateOptions & { key: number }) | null>(null);

  const celebrate = useCallback((o: CelebrateOptions) => setCurrent({ ...o, key: Date.now() }), []);

  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => setCurrent(null), current.confetti ? 2000 : 1500);
    return () => clearTimeout(t);
  }, [current]);

  const pieces = useRef(
    Array.from({ length: 34 }, (_, i) => {
      const angle = (i / 34) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 140 + Math.random() * 120;
      return {
        x: `${Math.cos(angle) * dist}px`,
        y: `${Math.sin(angle) * dist + 60}px`,
        r: `${Math.random() * 720 - 360}deg`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: `${Math.random() * 120}ms`,
        round: i % 3 === 0,
      };
    }),
  ).current;

  return (
    <CelebrateContext.Provider value={celebrate}>
      {children}
      <div aria-live="assertive" className="sr-only">
        {current ? `${current.title}. ${current.subtitle ?? ''}` : ''}
      </div>
      {current && (
        <div
          key={current.key}
          className="fixed inset-0 z-[70] flex animate-fade items-center justify-center bg-black/20 px-6 backdrop-blur-[2px]"
          onClick={() => setCurrent(null)}
          aria-hidden
        >
          <div className="relative">
            {current.confetti &&
              pieces.map((p, i) => (
                <span
                  key={i}
                  className="confetti-piece"
                  style={
                    {
                      '--x': p.x,
                      '--y': p.y,
                      '--r': p.r,
                      background: p.color,
                      animationDelay: p.delay,
                      borderRadius: p.round ? '999px' : undefined,
                      width: p.round ? 10 : undefined,
                      height: p.round ? 10 : undefined,
                    } as React.CSSProperties
                  }
                />
              ))}
            <div className="relative flex w-64 animate-pop flex-col items-center rounded-[32px] bg-surface/90 px-6 py-8 text-center shadow-lift backdrop-blur-xl">
              {current.emoji ? (
                <span className="text-[64px] leading-none">{current.emoji}</span>
              ) : (
                <svg viewBox="0 0 52 52" className="size-20">
                  <circle cx="26" cy="26" r="25" fill="var(--color-ok)" />
                  <path className="check-draw" d="M15 27l7 7 15-16" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <p className="mt-4 text-[24px] leading-tight font-semibold tracking-tight">{current.title}</p>
              {current.subtitle && <p className="mt-1 text-[15px] text-ink-2">{current.subtitle}</p>}
            </div>
          </div>
        </div>
      )}
    </CelebrateContext.Provider>
  );
}

/* ---------- Collapse-out for removed list items ---------- */

export function useLeaving(ms = 320) {
  const [ids, setIds] = useState<ReadonlySet<string>>(new Set());
  const leave = useCallback(
    (id: string, commit: () => void) => {
      setIds((s) => new Set(s).add(id));
      setTimeout(() => {
        commit();
        setIds((s) => {
          const n = new Set(s);
          n.delete(id);
          return n;
        });
      }, prefersReducedMotion() ? 0 : ms);
    },
    [ms],
  );
  return { isLeaving: (id: string) => ids.has(id), leave };
}

export function Collapse({
  leaving,
  children,
  as: Tag = 'div',
  className,
}: {
  leaving: boolean;
  children: ReactNode;
  as?: 'div' | 'li';
  className?: string;
}) {
  return (
    <Tag
      className={cx(
        'grid transition-[grid-template-rows,opacity,scale] duration-300 ease-out',
        leaving ? 'pointer-events-none scale-[0.98] grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr]',
        className,
      )}
    >
      <div className={cx('min-h-0', leaving && 'overflow-hidden')}>{children}</div>
    </Tag>
  );
}

/* ---------- Scroll reveal (landing page) ---------- */

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cx(
        'transition-[opacity,translate] duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  );
}
