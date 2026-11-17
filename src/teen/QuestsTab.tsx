import { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, ChevronRight, MessageCircleWarning, PartyPopper, RefreshCw, Send } from 'lucide-react';
import { Button, Card, EmptyState, MissedBadge, Modal, Pill, PointsLabel } from '../components/ui';
import { useCelebrate } from '../components/motion';
import { CategoryIcon } from '../lib/categories';
import { StatusPill } from '../lib/status';
import { useStore } from '../lib/store';
import { CATEGORIES, type Quest } from '../types';
import { compressImage, cx, formatDate, formatDue, formatRelative, isMissed } from '../lib/utils';
import { GroupTitle, LargeTitle } from './layout';

export function QuestsTab({ onShop }: { onShop: () => void }) {
  const { state, submitProof } = useStore();
  const celebrate = useCelebrate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [target, setTarget] = useState<Quest | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const active = state.quests.filter((q) => q.status !== 'approved');
  const done = state.quests.filter((q) => q.status === 'approved').slice(0, 5);
  const todoCount = active.filter((q) => q.status === 'todo' || q.status === 'rejected').length;

  const pickPhoto = (q: Quest) => {
    setTarget(q);
    setError('');
    fileRef.current?.click();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try {
      setPreview(await compressImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setPreview(null);
    } finally {
      setBusy(false);
    }
  };

  const closeSheet = () => {
    setPreview(null);
    setTarget(null);
    setError('');
  };

  const send = () => {
    if (!target || !preview) return;
    submitProof(target.id, preview);
    closeSheet();
    celebrate({ title: 'Photo sent!', subtitle: 'Waiting for your parent to check it.' });
  };

  return (
    <div className="stagger">
      <LargeTitle eyebrow="Quest board" subtitle={todoCount ? `${todoCount} ${todoCount === 1 ? 'quest' : 'quests'} left to do` : 'Everything is sent. Nice work!'}>
        Today’s Quests
      </LargeTitle>

      <GoalCard onShop={onShop} />

      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />

      {active.length === 0 && (
        <Card>
          <EmptyState icon={<PartyPopper className="size-7" />} title="No quests right now" body="Your parent will add new quests here." />
        </Card>
      )}

      {CATEGORIES.map((cat) => {
        const list = active.filter((q) => q.category === cat);
        if (!list.length) return null;
        return (
          <section key={cat} className="mb-6">
            <GroupTitle>{cat}</GroupTitle>
            <div className="stagger space-y-3">
              {list.map((q) => (
                <QuestCard key={q.id} quest={q} onPhoto={() => pickPhoto(q)} busy={busy && target?.id === q.id} />
              ))}
            </div>
          </section>
        );
      })}

      {done.length > 0 && (
        <section className="mt-8">
          <GroupTitle>Done</GroupTitle>
          <Card className="overflow-hidden">
            <ul className="stagger divide-y divide-separator">
              {done.map((q) => (
                <li key={q.id} className="flex items-center gap-3 px-4 py-3">
                  <CheckCircle2 className="size-6 shrink-0 text-ok" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[16px] font-medium">{q.title}</p>
                    <p className="text-[13px] text-ink-2">Approved {q.approvedAt && formatDate(q.approvedAt)}</p>
                  </div>
                  <Pill tone="green">+{q.points}</Pill>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      <Modal
        open={!!target && (!!preview || !!error)}
        onClose={closeSheet}
        title={error ? 'Oops' : 'Send this photo?'}
        description={target ? target.title : undefined}
        footer={
          <>
            <Button variant="secondary" size="lg" onClick={() => target && pickPhoto(target)}>
              <RefreshCw className="size-5" aria-hidden /> {error ? 'Try Again' : 'Take Another'}
            </Button>
            {!error && (
              <Button size="lg" onClick={send}>
                <Send className="size-5" aria-hidden /> Send to Parent
              </Button>
            )}
          </>
        }
      >
        {error ? (
          <p className="text-[16px] text-bad">{error}</p>
        ) : (
          preview && <img src={preview} alt="Your proof photo" className="max-h-[50dvh] w-full rounded-2xl object-cover" />
        )}
      </Modal>
    </div>
  );
}

/** The teen's own next goal: the cheapest reward they can't afford yet. */
function GoalCard({ onShop }: { onShop: () => void }) {
  const { state } = useStore();
  const points = state.teen.points;
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  if (state.rewards.length === 0) return null;

  const locked = state.rewards.filter((r) => r.cost > points).sort((a, b) => a.cost - b.cost);
  const next = locked[0];
  const progress = next ? Math.min(1, points / next.cost) : 1;
  const r = 26;
  const circ = 2 * Math.PI * r;

  return (
    <button
      type="button"
      onClick={onShop}
      className="mb-6 flex w-full items-center gap-4 rounded-3xl bg-gradient-to-br from-[#fff3d6] to-[#ffe4cf] p-4 text-left shadow-card transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 dark:from-sun/15 dark:to-tangerine/15"
    >
      <span className="relative flex size-16 shrink-0 items-center justify-center">
        <svg viewBox="0 0 64 64" className="absolute inset-0 size-full -rotate-90" aria-hidden>
          <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-black/10 dark:text-white/15" />
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke="var(--color-star)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - (ready ? progress : 0))}
            className="transition-[stroke-dashoffset] delay-300 duration-[1400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          />
        </svg>
        <span className="text-[26px]" aria-hidden>
          {next ? next.icon : '🎉'}
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] font-semibold tracking-wide text-warn uppercase">Your next goal</span>
        {next ? (
          <span className="mt-0.5 block text-[17px] leading-snug font-semibold">
            {next.cost - points} more points to {next.title}
          </span>
        ) : (
          <span className="mt-0.5 block text-[17px] leading-snug font-semibold">You can claim any reward now!</span>
        )}
        <span className="mt-1 inline-flex items-center text-[14px] font-medium text-accent">
          See Reward Shop <ChevronRight className="size-4" aria-hidden />
        </span>
      </span>
    </button>
  );
}

function QuestCard({ quest: q, onPhoto, busy }: { quest: Quest; onPhoto: () => void; busy: boolean }) {
  const missed = isMissed(q);
  return (
    <Card as="article" className={cx('p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift', missed && 'ring-2 ring-bad/60')}>
      <div className="flex items-start gap-3">
        <CategoryIcon category={q.category} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cx('text-[18px] leading-snug', missed ? 'font-bold text-bad' : 'font-semibold')}>{q.title}</h3>
            <PointsLabel points={q.points} className="shrink-0 pt-0.5 text-[15px]" />
          </div>
          <p className={cx('mt-0.5 text-[14px]', missed ? 'font-bold text-bad' : 'text-ink-2')}>
            {formatDue(q.dueDate)}
            {q.repeat !== 'None' && <span className="font-normal text-ink-3"> · {q.repeat}</span>}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {missed && <MissedBadge />}
            <StatusPill status={q.status} audience="teen" />
          </div>
        </div>
      </div>

      <div className="mt-4">
        {q.status === 'todo' && (
          <Button size="lg" block onClick={onPhoto} disabled={busy}>
            <Camera className="size-5" aria-hidden /> {busy ? 'Opening photo…' : 'Take / Submit Photo Proof'}
          </Button>
        )}

        {q.status === 'pending_review' && (
          <div className="flex items-center gap-3 rounded-2xl bg-canvas p-2.5">
            {q.submittedPhotoUrl && <img src={q.submittedPhotoUrl} alt="" className="size-12 rounded-xl object-cover" />}
            <p className="text-[14px] text-ink-2">
              Photo sent {q.submittedAt ? formatRelative(q.submittedAt) : ''}. Your parent will check it soon.
            </p>
          </div>
        )}

        {q.status === 'rejected' && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-bad-soft p-3">
              <p className="flex items-center gap-2 text-[14px] font-semibold text-bad">
                <MessageCircleWarning className="size-5" aria-hidden /> Your parent said:
              </p>
              <p className="mt-1 pl-7 text-[16px] text-ink">“{q.rejectReason}”</p>
            </div>
            <Button size="lg" block onClick={onPhoto} disabled={busy}>
              <Camera className="size-5" aria-hidden /> {busy ? 'Opening photo…' : 'Resubmit Photo Proof'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
