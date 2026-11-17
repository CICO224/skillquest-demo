import { useState, type ReactNode } from 'react';
import { ArrowLeft, Gift, ImageUp, LineChart, ListChecks, RotateCcw, Smartphone } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui';
import { useStore } from '../lib/store';
import { hrefFor } from '../lib/router';
import { cx } from '../lib/utils';
import { QuestsView } from './QuestsView';
import { ReviewView } from './ReviewView';
import { DeliveryView } from './DeliveryView';
import { ProgressView } from './ProgressView';
import { PlanModal, QrModal } from './FamilyModals';

export type Section = 'quests' | 'review' | 'delivery' | 'progress';

export function ParentApp() {
  const { state, slotsUsed, slotLimit, resetDemo } = useStore();
  const [section, setSection] = useState<Section>('quests');
  const [qrOpen, setQrOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);

  const pendingCount = state.quests.filter((q) => q.status === 'pending_review').length;
  const waitingCount = state.claims.filter((c) => !c.isDelivered).length;
  const initials = state.parentName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

  const nav: { id: Section; label: string; icon: ReactNode; count?: number }[] = [
    { id: 'quests', label: 'Quests', icon: <ListChecks className="size-5" /> },
    { id: 'review', label: 'Review Proofs', icon: <ImageUp className="size-5" />, count: pendingCount },
    { id: 'delivery', label: 'Reward Delivery', icon: <Gift className="size-5" />, count: waitingCount },
    { id: 'progress', label: 'Teen Progress', icon: <LineChart className="size-5" /> },
  ];

  return (
    <div className="min-h-dvh bg-canvas">
      {/* Header & Family Bar */}
      <header className="glass sticky top-0 z-40 border-b border-separator">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-4 sm:px-6">
          <a href={hrefFor('home')} aria-label="SKILLQuest home">
            <Logo />
          </a>
          <span className="hidden rounded-full bg-fill px-2.5 py-1 text-[12px] font-semibold text-ink-2 md:inline">Parent</span>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setPlanOpen(true)}
              className="flex h-10 items-center gap-2 rounded-full bg-surface px-4 text-[14px] shadow-card transition hover:bg-surface/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
            >
              <span className="font-semibold">{state.plan === 'free' ? 'Free Plan' : 'Premium Plan'}</span>
              <span className="text-ink-3" aria-hidden>·</span>
              <span className={cx('tabular-nums', slotsUsed >= slotLimit ? 'font-semibold text-bad' : 'text-ink-2')}>
                {slotsUsed}/{slotLimit} Slots
              </span>
            </button>
            <a
              href={hrefFor('teen')}
              target="_blank"
              rel="noreferrer"
              className="hidden h-10 items-center gap-2 rounded-full px-3 text-[14px] text-accent hover:bg-accent/10 lg:flex"
            >
              <Smartphone className="size-4" aria-hidden /> Open Teen View
            </a>
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              className="group flex items-center gap-2 rounded-full py-1 pr-3 pl-1 transition hover:bg-fill focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
              aria-label={`${state.parentName}. Show QR code to connect your teen`}
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-[14px] font-semibold text-white">
                {initials}
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-[14px] font-semibold">{state.parentName}</span>
                <span className="block text-[12px] text-accent">Connect Teen</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row md:py-8">
        {/* Sidebar */}
        <aside className="md:w-60 md:shrink-0">
          <nav aria-label="Parent sections" className="md:sticky md:top-24">
            <ul className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:gap-1 md:overflow-visible">
              {nav.map((item) => {
                const active = section === item.id;
                return (
                  <li key={item.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setSection(item.id)}
                      aria-current={active ? 'page' : undefined}
                      className={cx(
                        'flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-left text-[15px] font-medium transition',
                        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30',
                        active ? 'bg-accent text-white shadow-card' : 'text-ink hover:bg-fill',
                      )}
                    >
                      <span className={active ? 'text-white' : 'text-ink-2'} aria-hidden>
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {!!item.count && (
                        <span
                          className={cx(
                            'min-w-6 rounded-full px-2 py-0.5 text-center text-[12px] font-semibold tabular-nums',
                            active ? 'bg-white/25 text-white' : 'bg-bad text-white',
                          )}
                          aria-label={`${item.count} waiting`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 hidden space-y-2 md:block">
              <a href={hrefFor('home')} className="flex items-center gap-2 px-4 text-[13px] text-ink-2 hover:text-ink">
                <ArrowLeft className="size-4" aria-hidden /> Back to home page
              </a>
              <Button variant="plain" size="sm" onClick={resetDemo} className="px-4">
                <RotateCcw className="size-4" aria-hidden /> Reset demo data
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main key={section} className="min-w-0 flex-1 animate-enter">
          {section === 'quests' && <QuestsView onUpgrade={() => setPlanOpen(true)} onNavigate={setSection} />}
          {section === 'review' && <ReviewView />}
          {section === 'delivery' && <DeliveryView />}
          {section === 'progress' && <ProgressView />}
        </main>
      </div>

      <QrModal open={qrOpen} onClose={() => setQrOpen(false)} />
      <PlanModal open={planOpen} onClose={() => setPlanOpen(false)} />
    </div>
  );
}
