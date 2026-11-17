import { useEffect, useRef, useState, type ComponentType } from 'react';
import { StarIcon } from '../components/ui';
import { AnimatedNumber, useCelebrate } from '../components/motion';
import { useStore } from '../lib/store';
import { hrefFor } from '../lib/router';
import { cx } from '../lib/utils';
import { QuestsTab } from './QuestsTab';
import { ShopTab } from './ShopTab';
import { ClaimsTab } from './ClaimsTab';
import { ClaimsIcon, QuestsIcon, ShopIcon } from './TabIcons';

export type TeenTab = 'quests' | 'shop' | 'claims';

const SEEN_KEY = 'skillquest:teen-seen-points';

function readSeen(fallback: number): number {
  try {
    const v = localStorage.getItem(SEEN_KEY);
    return v === null ? fallback : Number(v);
  } catch {
    return fallback;
  }
}

export function TeenApp() {
  const { state } = useStore();
  const celebrate = useCelebrate();
  const [tab, setTab] = useState<TeenTab>('quests');
  const points = state.teen.points;

  // Count up from the last balance this device saw, and celebrate new points.
  const [startPoints] = useState(() => readSeen(points));
  const prevPoints = useRef(startPoints);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    const gained = points - prevPoints.current;
    if (gained > 0) {
      setBump((b) => b + 1);
      celebrate({ title: `+${gained} Points!`, subtitle: 'Your parent approved your quest.', emoji: '⭐', confetti: true });
    }
    prevPoints.current = points;
    try {
      localStorage.setItem(SEEN_KEY, String(points));
    } catch {
      /* ignore */
    }
  }, [points, celebrate]);

  const tabs: { id: TeenTab; label: string; Icon: ComponentType<{ active: boolean }> }[] = [
    { id: 'quests', label: 'Quests', Icon: QuestsIcon },
    { id: 'shop', label: 'Reward Shop', Icon: ShopIcon },
    { id: 'claims', label: 'My Claims', Icon: ClaimsIcon },
  ];

  const go = (t: TeenTab) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-dvh bg-canvas">
      <div className="mx-auto min-h-dvh max-w-md bg-canvas sm:border-x sm:border-separator">
        {/* Top Status Bar */}
        <header className="glass sticky top-0 z-30 border-b border-separator px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3">
          <div className="flex items-center gap-3">
            <a
              href={hrefFor('home')}
              aria-label="SKILLQuest home"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-[17px] font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
            >
              {state.teen.name.charAt(0)}
            </a>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[12px] font-semibold tracking-wide text-ink-3 uppercase">{today}</p>
              <p className="truncate text-[17px] font-semibold">Hi, {state.teen.name} 👋</p>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-full bg-surface py-1.5 pr-3.5 pl-2.5 shadow-card"
              aria-label={`You have ${points} points`}
              role="status"
            >
              <span key={bump} className={cx('inline-flex', bump > 0 && 'animate-bump')}>
                <StarIcon className="size-6 text-star drop-shadow-[0_1px_2px_rgba(255,184,0,0.5)]" />
              </span>
              <span className="text-[24px] leading-none font-bold tracking-tight">
                <AnimatedNumber value={points} from={startPoints} />
              </span>
              <span className="text-[14px] font-semibold text-ink-2">Points</span>
            </div>
          </div>
        </header>

        <main key={tab} className="animate-enter px-4 pt-5 pb-32">
          {tab === 'quests' && <QuestsTab onShop={() => go('shop')} />}
          {tab === 'shop' && <ShopTab onClaimed={() => go('claims')} />}
          {tab === 'claims' && <ClaimsTab onShop={() => go('shop')} />}
        </main>

        {/* Tab bar */}
        <nav aria-label="Teen sections" className="glass fixed inset-x-0 bottom-0 z-30 border-t border-separator">
          <ul className="mx-auto flex max-w-md px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),8px)]">
            {tabs.map(({ id, label, Icon }) => {
              const active = tab === id;
              const waiting = id === 'claims' ? state.claims.filter((c) => !c.isDelivered).length : 0;
              return (
                <li key={id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => go(id)}
                    aria-current={active ? 'page' : undefined}
                    className={cx(
                      'relative flex w-full flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium transition active:scale-95',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                      active ? 'text-accent' : 'text-ink-3',
                    )}
                  >
                    <Icon active={active} />
                    {label}
                    {waiting > 0 && (
                      <span className="absolute top-0.5 left-1/2 ml-2 min-w-[18px] rounded-full bg-bad px-1 text-[11px] leading-[18px] font-semibold text-white">
                        {waiting}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
