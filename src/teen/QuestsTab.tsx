import { useRef, useState } from 'react';
import { Camera, CheckCircle2, Clock, MessageCircleWarning, PartyPopper, RefreshCw, Send } from 'lucide-react';
import { Button, Card, EmptyState, MissedBadge, Modal, Pill, PointsLabel, useToast } from '../components/ui';
import { CategoryIcon } from '../lib/categories';
import { useStore } from '../lib/store';
import { CATEGORIES, type Quest } from '../types';
import { compressImage, cx, formatDate, formatDue, isMissed } from '../lib/utils';
import { LargeTitle } from './layout';

export function QuestsTab() {
  const { state, submitProof } = useStore();
  const toast = useToast();
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
    toast('Photo sent! Waiting for your parent.');
    closeSheet();
  };

  return (
    <div className="animate-fade">
      <LargeTitle subtitle={todoCount ? `${todoCount} ${todoCount === 1 ? 'quest' : 'quests'} left to do` : 'Everything is sent. Nice work!'}>
        Today’s Quests
      </LargeTitle>

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
            <h2 className="mb-2 px-1 text-[13px] font-semibold tracking-wide text-ink-2 uppercase">{cat}</h2>
            <div className="space-y-3">
              {list.map((q) => (
                <QuestCard key={q.id} quest={q} onPhoto={() => pickPhoto(q)} busy={busy && target?.id === q.id} />
              ))}
            </div>
          </section>
        );
      })}

      {done.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 px-1 text-[13px] font-semibold tracking-wide text-ink-2 uppercase">Done</h2>
          <Card className="overflow-hidden">
            <ul className="divide-y divide-black/5">
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

function QuestCard({ quest: q, onPhoto, busy }: { quest: Quest; onPhoto: () => void; busy: boolean }) {
  const missed = isMissed(q);
  return (
    <Card as="article" className={cx('p-4', missed && 'ring-2 ring-bad/60')}>
      <div className="flex items-start gap-3">
        <CategoryIcon category={q.category} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cx('text-[18px] leading-snug', missed ? 'font-bold text-bad' : 'font-semibold')}>{q.title}</h3>
            <PointsLabel points={q.points} className="shrink-0 pt-0.5 text-[15px]" />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {missed && <MissedBadge />}
            <span className={cx('text-[14px]', missed ? 'font-bold text-bad' : 'text-ink-2')}>{formatDue(q.dueDate)}</span>
            {q.repeat !== 'None' && <span className="text-[13px] text-ink-3">· {q.repeat}</span>}
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
          <div className="flex items-center gap-3 rounded-2xl bg-warn-soft p-3">
            {q.submittedPhotoUrl && <img src={q.submittedPhotoUrl} alt="" className="size-12 rounded-xl object-cover" />}
            <div className="flex items-center gap-2 text-[15px] font-semibold text-warn">
              <Clock className="size-5" aria-hidden /> Pending Parent Approval
            </div>
          </div>
        )}

        {q.status === 'rejected' && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-bad-soft p-3">
              <p className="flex items-center gap-2 text-[14px] font-semibold text-bad">
                <MessageCircleWarning className="size-5" aria-hidden /> Rejected. Your parent said:
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
