import { useState } from 'react';
import { Check, ImageOff, Inbox, X } from 'lucide-react';
import { Button, Card, EmptyState, Field, MissedBadge, Modal, Pill, useToast } from '../components/ui';
import { Collapse, useCelebrate, useLeaving } from '../components/motion';
import { CategoryIcon } from '../lib/categories';
import { useStore } from '../lib/store';
import type { Quest } from '../types';
import { cx, formatDue, formatRelative, isMissed } from '../lib/utils';
import { PageHeader } from './layout';

const QUICK_REASONS = ['The photo is too blurry', 'It isn’t finished yet', 'Wrong photo for this quest'];

export function ReviewView() {
  const { state, approveQuest } = useStore();
  const celebrate = useCelebrate();
  const { isLeaving, leave } = useLeaving();
  const [rejecting, setRejecting] = useState<Quest | null>(null);
  const [zoom, setZoom] = useState<Quest | null>(null);

  const pending = state.quests.filter((q) => q.status === 'pending_review');

  return (
    <div>
      <PageHeader title="Review Proofs" subtitle={`Look at each photo ${state.teen.name} sent, then approve or reject it.`} />

      {pending.length === 0 ? (
        <Card>
          <EmptyState icon={<Inbox className="size-7" />} title="You’re all caught up" body="New photos from your teen will show up here." />
        </Card>
      ) : (
        <div className="stagger space-y-5">
          {pending.map((q) => {
            const missed = isMissed(q);
            return (
              <Collapse key={q.id} leaving={isLeaving(q.id)}>
              <Card as="article" className="overflow-hidden lg:flex">
                <button
                  type="button"
                  onClick={() => q.submittedPhotoUrl && setZoom(q)}
                  className="group relative block aspect-[4/3] w-full shrink-0 bg-fill lg:w-[420px]"
                  aria-label={`Open the photo for ${q.title} larger`}
                >
                  {q.submittedPhotoUrl ? (
                    <img src={q.submittedPhotoUrl} alt={`Proof photo for ${q.title}`} className="size-full object-cover" />
                  ) : (
                    <span className="flex size-full flex-col items-center justify-center gap-2 text-ink-3">
                      <ImageOff className="size-8" aria-hidden /> Photo removed after 1 month
                    </span>
                  )}
                  {q.submittedPhotoUrl && (
                    <span className="absolute right-3 bottom-3 rounded-full bg-black/55 px-3 py-1 text-[12px] font-medium text-white backdrop-blur">
                      Click to enlarge
                    </span>
                  )}
                </button>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start gap-4">
                    <CategoryIcon category={q.category} size="lg" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className={cx('text-[22px] leading-tight tracking-tight', missed ? 'font-bold text-bad' : 'font-semibold')}>{q.title}</h2>
                        {missed && <MissedBadge />}
                      </div>
                      <p className="mt-1 text-[15px] text-ink-2">
                        {q.category} · {formatDue(q.dueDate)}
                      </p>
                    </div>
                  </div>

                  <dl className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-canvas p-4">
                      <dt className="text-[13px] text-ink-2">Photo sent</dt>
                      <dd className="mt-0.5 text-[17px] font-semibold">{q.submittedAt ? formatRelative(q.submittedAt) : '—'}</dd>
                    </div>
                    <div className="rounded-2xl bg-canvas p-4">
                      <dt className="text-[13px] text-ink-2">Worth</dt>
                      <dd className="mt-0.5 text-[17px] font-semibold">{q.points} Points</dd>
                    </div>
                  </dl>

                  <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
                    <Button
                      variant="success"
                      size="lg"
                      className="flex-1"
                      onClick={() => {
                        leave(q.id, () => approveQuest(q.id));
                        celebrate({ title: 'Approved', subtitle: `+${q.points} points for ${state.teen.name}` });
                      }}
                    >
                      <Check className="size-5" aria-hidden /> Approve (+{q.points} pts)
                    </Button>
                    <Button variant="danger" size="lg" className="flex-1" onClick={() => setRejecting(q)}>
                      <X className="size-5" aria-hidden /> Reject with Reason
                    </Button>
                  </div>
                </div>
              </Card>
              </Collapse>
            );
          })}
        </div>
      )}

      <RejectModal quest={rejecting} onClose={() => setRejecting(null)} commit={leave} />

      <Modal open={!!zoom} onClose={() => setZoom(null)} title={zoom?.title ?? ''} wide>
        {zoom?.submittedPhotoUrl && <img src={zoom.submittedPhotoUrl} alt={`Proof photo for ${zoom.title}`} className="w-full rounded-2xl" />}
      </Modal>
    </div>
  );
}

function RejectModal({ quest, onClose, commit }: { quest: Quest | null; onClose: () => void; commit: (id: string, fn: () => void) => void }) {
  const { rejectQuest, state } = useStore();
  const toast = useToast();
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);
  const empty = !reason.trim();

  const close = () => {
    setReason('');
    setTouched(false);
    onClose();
  };

  const submit = () => {
    setTouched(true);
    if (!quest || empty) return;
    const id = quest.id;
    const text = reason;
    commit(id, () => rejectQuest(id, text));
    toast(`Sent back to ${state.teen.name} with your reason`);
    close();
  };

  return (
    <Modal
      open={!!quest}
      onClose={close}
      title="Reject with Reason"
      description={`Tell ${state.teen.name} what to fix. They can send a new photo afterwards.`}
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button variant="danger" onClick={submit} disabled={empty}>
            <X className="size-4" aria-hidden /> Reject and Send Reason
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Reason (required)" htmlFor="reject-reason">
          <textarea
            id="reject-reason"
            rows={3}
            maxLength={200}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="e.g. The bed isn’t made yet, please try again."
            aria-invalid={touched && empty}
            className={cx(
              'block w-full resize-none rounded-xl border bg-surface px-4 py-3 text-[16px] transition focus:outline-none focus:ring-4',
              touched && empty ? 'border-bad focus:ring-bad/15' : 'border-hairline focus:border-accent focus:ring-accent/15',
            )}
            autoFocus
          />
          {touched && empty && <p className="text-[14px] font-medium text-bad">A reason is required so your teen knows what to fix.</p>}
        </Field>
        <div>
          <p className="mb-2 text-[13px] text-ink-2">Quick reasons</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className="rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
              >
                <Pill tone="gray" className="px-3.5 py-2 text-[14px] font-medium hover:bg-fill-2">
                  {r}
                </Pill>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
