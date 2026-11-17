import { useCallback, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cx } from './utils';

export type Theme = 'light' | 'dark';
const KEY = 'skillquest:theme';
const META_COLOR: Record<Theme, string> = { light: '#f7f3ea', dark: '#0a1930' };

function current(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function apply(theme: Theme, animate: boolean) {
  const root = document.documentElement;
  if (animate) {
    root.classList.add('theme-switching');
    window.setTimeout(() => root.classList.remove('theme-switching'), 400);
  }
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLOR[theme]);
}

/** Light/dark theme shared by every page. Starts from the device setting until the viewer picks one. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(current);

  // Keep every toggle on the page in sync, and follow the device until a choice is saved.
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(current()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystem = (e: MediaQueryListEvent) => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(KEY);
      } catch {
        /* ignore */
      }
      if (!saved) apply(e.matches ? 'dark' : 'light', true);
    };
    mq.addEventListener('change', onSystem);
    return () => {
      observer.disconnect();
      mq.removeEventListener('change', onSystem);
    };
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = current() === 'dark' ? 'light' : 'dark';
    apply(next, true);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  return { theme, toggle };
}

export function ThemeToggle({ className, withLabel }: { className?: string; withLabel?: boolean }) {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cx(
        'relative flex h-10 items-center gap-2 rounded-full bg-surface text-[14px] font-medium text-ink shadow-card transition hover:bg-fill active:scale-95',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30',
        withLabel ? 'px-3.5' : 'w-10 justify-center',
        className,
      )}
    >
      <span className="relative size-5" aria-hidden>
        <Sun
          className={cx(
            'absolute inset-0 size-5 text-tangerine transition duration-500',
            dark ? 'scale-50 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
          )}
        />
        <Moon
          className={cx(
            'absolute inset-0 size-5 text-sun transition duration-500',
            dark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0',
          )}
        />
      </span>
      {withLabel && <span>{dark ? 'Light' : 'Dark'}</span>}
    </button>
  );
}
