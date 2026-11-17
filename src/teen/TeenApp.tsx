import { useState, type ReactNode } from 'react';
import { ListChecks, Package, Store } from 'lucide-react';
import { StarIcon } from '../components/ui';
import { useStore } from '../lib/store';
import { hrefFor } from '../lib/router';
import { cx } from '../lib/utils';
import { QuestsTab } from './QuestsTab';
import { ShopTab } from './ShopTab';
import { ClaimsTab } from './ClaimsTab';

export type TeenTab = 'quests' | 'shop' | 'claims';

export function TeenApp() {
  const { state } = useStore();
  const [tab, setTab] = useState<TeenTab>('quests');

  const tabs: { id: TeenTab; label: string; icon: ReactNode }[] = [
    { id: 'quests', label: 'Quests', icon: <ListChecks className="size-6" /> },
    { id: 'shop', label: 'Reward Shop', icon: <Store className="size-6" /> },
    { id: 'claims', label: 'My Claims', icon: <Package className="size-6" /> },
  ];

  const go = (t: TeenTab) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-dvh bg-canvas">
      <div className="mx-auto min-h-dvh max-w-md bg-canvas sm:border-x sm:border-black/5">
        {/* Top Status Bar */}
        <header className="glass sticky top-0 z-30 border-b border-black/5 px-5 pt-[max(env(safe-area-inset-top),12px)] pb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-ink-2">Hi, {state.teen.name} 👋</p>
              <a href={hrefFor('home')} className="text-[12px] text-accent">
                SKILLQuest
              </a>
            </div>
            <div
              className="flex items-center gap-2 rounded-full bg-white py-2 pr-4 pl-3 shadow-card"
              aria-label={`You have ${state.teen.points} points`}
              role="status"
            >
              <StarIcon className="size-7 text-star drop-shadow-[0_1px_2px_rgba(255,184,0,0.5)]" />
              <span className="text-[26px] leading-none font-bold tracking-tight tabular-nums">{state.teen.points}</span>
              <span className="text-[15px] font-semibold text-ink-2">Points</span>
            </div>
          </div>
        </header>

        <main className="px-4 pt-4 pb-32">
          {tab === 'quests' && <QuestsTab />}
          {tab === 'shop' && <ShopTab onClaimed={() => go('claims')} />}
          {tab === 'claims' && <ClaimsTab onShop={() => go('shop')} />}
        </main>

        {/* Tab bar */}
        <nav aria-label="Teen sections" className="glass fixed inset-x-0 bottom-0 z-30 border-t border-black/5">
          <ul className="mx-auto flex max-w-md px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),8px)]">
            {tabs.map((t) => {
              const active = tab === t.id;
              const waiting = t.id === 'claims' ? state.claims.filter((c) => !c.isDelivered).length : 0;
              return (
                <li key={t.id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => go(t.id)}
                    aria-current={active ? 'page' : undefined}
                    className={cx(
                      'relative flex w-full flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium transition',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                      active ? 'text-accent' : 'text-ink-3',
                    )}
                  >
                    <span aria-hidden>{t.icon}</span>
                    {t.label}
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
