import { useState } from 'react';
import { CalendarClock, Lock, Plus, Repeat, Trash2 } from 'lucide-react';
import { Button, Card, EmptyState, Field, inputClass, MissedBadge, Modal, Pill, PointsLabel, Segmented, useToast } from '../components/ui';
import { CategoryIcon } from '../lib/categories';
import { useStore } from '../lib/store';
import { CATEGORIES, REPEATS, type Category, type Quest, type RepeatInterval } from '../types';
import { cx, endOfDayIso, formatDate, formatDue, isMissed, toDateInput } from '../lib/utils';
import { PageHeader, SectionTitle } from './layout';

export function QuestsView({ onUpgrade }: { onUpgrade: () => void }) {
  const { state, slotsFull, slotLimit, slotsUsed, deleteQuest } = useStore();
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Quest | null>(null);

  const active = state.quests.filter((q) => q.status !== 'approved');
  const done = state.quests.filter((q) => q.status === 'approved').slice(0, 8);

  return (
    <div className="animate-fade">
      <PageHeader
        title="Quests"
        subtitle={`Chores and tasks for ${state.teen.name}. ${slotsUsed} of ${slotLimit} quest slots in use.`}
        action={
          <Button size="lg" onClick={() => setCreateOpen(true)} disabled={slotsFull}>
            <Plus className="size-5" aria-hidden /> Create New Quest
          </Button>
        }
      />

      {slotsFull && (
        <Card className="mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-warn-soft text-warn" aria-hidden>
            <Lock className="size-5" />
          </span>
          <div className="flex-1">
            <p className="text-[16px] font-semibold">All {slotLimit} quest slots are in use.</p>
            <p className="text-[15px] text-ink-2">
              Approve or delete a quest to free a slot{state.plan === 'free' ? ', or upgrade to Premium for 20 slots.' : '.'}
            </p>
          </div>
          {state.plan === 'free' && (
            <Button variant="secondary" onClick={onUpgrade}>
              See Premium
            </Button>
          )}
        </Card>
      )}

      {active.length === 0 ? (
        <Card>
          <EmptyState
            icon={<CalendarClock className="size-7" />}
            title="No active quests"
            body="Create a quest and it will appear on your teen’s phone right away."
          />
        </Card>
      ) : (
        <Card as="section" className="overflow-hidden">
          <ul className="divide-y divide-black/5">
            {active.map((q) => (
              <QuestRow key={q.id} quest={q} onDelete={() => setConfirmDelete(q)} />
            ))}
          </ul>
        </Card>
      )}

      {done.length > 0 && (
        <>
          <SectionTitle>Recently completed</SectionTitle>
          <Card className="overflow-hidden">
            <ul className="divide-y divide-black/5">
              {done.map((q) => (
                <li key={q.id} className="flex items-center gap-4 px-5 py-4">
                  <CategoryIcon category={q.category} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[16px] font-medium">{q.title}</p>
                    <p className="text-[14px] text-ink-2">Approved {q.approvedAt ? formatDate(q.approvedAt) : ''}</p>
                  </div>
                  <Pill tone="green">+{q.points} Points</Pill>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}

      <CreateQuestModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete this quest?"
        description={confirmDelete ? `“${confirmDelete.title}” will be removed from ${state.teen.name}’s list.` : ''}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
              Keep Quest
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirmDelete) deleteQuest(confirmDelete.id);
                setConfirmDelete(null);
                toast('Quest deleted');
              }}
            >
              <Trash2 className="size-4" aria-hidden /> Delete Quest
            </Button>
          </>
        }
      />
    </div>
  );
}

const STATUS_LABEL: Record<Quest['status'], { text: string; tone: 'gray' | 'orange' | 'green' | 'red' }> = {
  todo: { text: 'To Do', tone: 'gray' },
  pending_review: { text: 'Photo waiting for you', tone: 'orange' },
  approved: { text: 'Approved', tone: 'green' },
  rejected: { text: 'Rejected · waiting for new photo', tone: 'red' },
};

function QuestRow({ quest: q, onDelete }: { quest: Quest; onDelete: () => void }) {
  const missed = isMissed(q);
  const status = STATUS_LABEL[q.status];
  return (
    <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <CategoryIcon category={q.category} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className={cx('text-[17px]', missed ? 'font-bold text-bad' : 'font-semibold')}>{q.title}</p>
            {missed && <MissedBadge />}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-ink-2">
            <span>{q.category}</span>
            <span className={cx(missed && 'font-bold text-bad')}>{formatDue(q.dueDate)}</span>
            {q.repeat !== 'None' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[12px] font-semibold text-accent">
                <Repeat className="size-3" aria-hidden /> {q.repeat}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 pl-16 sm:pl-0">
        <Pill tone={status.tone}>{status.text}</Pill>
        <PointsLabel points={q.points} className="w-24 text-[15px]" />
        <Button variant="secondary" size="sm" onClick={onDelete} aria-label={`Delete quest ${q.title}`}>
          <Trash2 className="size-4" aria-hidden /> Delete
        </Button>
      </div>
    </li>
  );
}

function CreateQuestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { createQuest, state } = useStore();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Chores');
  const [points, setPoints] = useState(10);
  const [due, setDue] = useState(() => toDateInput(new Date()));
  const [repeat, setRepeat] = useState<RepeatInterval>('None');
  const [touched, setTouched] = useState(false);

  const titleError = touched && !title.trim() ? 'Please give the quest a name.' : '';
  const valid = title.trim().length > 0 && points > 0 && !!due;

  const reset = () => {
    setTitle('');
    setCategory('Chores');
    setPoints(10);
    setDue(toDateInput(new Date()));
    setRepeat('None');
    setTouched(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    if (createQuest({ title: title.trim(), category, points, dueDate: endOfDayIso(due), repeat })) {
      toast(`Quest sent to ${state.teen.name}`);
      reset();
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create New Quest"
      description="Your teen will see this on their phone right away."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="create-quest" disabled={touched && !valid}>
            <Plus className="size-4" aria-hidden /> Create Quest
          </Button>
        </>
      }
    >
      <form id="create-quest" onSubmit={submit} className="space-y-6" noValidate>
        <Field label="What should they do?" htmlFor="q-title">
          <input
            id="q-title"
            className={cx(inputClass, titleError && 'border-bad focus:border-bad focus:ring-bad/15')}
            placeholder="e.g. Empty the dishwasher"
            value={title}
            maxLength={60}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={!!titleError}
            aria-describedby={titleError ? 'q-title-err' : undefined}
            autoFocus
          />
          {titleError && (
            <p id="q-title-err" className="text-[14px] font-medium text-bad">
              {titleError}
            </p>
          )}
        </Field>

        <Field label="Category">
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={category === c}
                onClick={() => setCategory(c)}
                className={cx(
                  'flex h-14 items-center gap-3 rounded-2xl border px-3 text-left text-[15px] font-medium transition',
                  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30',
                  category === c ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-hairline hover:bg-black/[0.03]',
                )}
              >
                <CategoryIcon category={c} />
                {c}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Points" htmlFor="q-points" hint="How many points this quest is worth.">
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => setPoints((p) => Math.max(5, p - 5))} aria-label="5 fewer points">
                −
              </Button>
              <input
                id="q-points"
                type="number"
                inputMode="numeric"
                min={1}
                max={500}
                className={cx(inputClass, 'text-center font-semibold tabular-nums')}
                value={points}
                onChange={(e) => setPoints(Math.max(0, Math.min(500, Number(e.target.value) || 0)))}
              />
              <Button variant="secondary" onClick={() => setPoints((p) => Math.min(500, p + 5))} aria-label="5 more points">
                +
              </Button>
            </div>
          </Field>
          <Field label="Due date" htmlFor="q-due" hint="Due by the end of this day.">
            <input id="q-due" type="date" className={inputClass} value={due} min={toDateInput(new Date())} onChange={(e) => setDue(e.target.value)} />
          </Field>
        </div>

        <Field label="Repeat" hint={repeat === 'None' ? 'This quest happens once.' : `A new copy appears after each approval (${repeat.toLowerCase()}).`}>
          <Segmented label="Repeat" value={repeat} options={REPEATS} onChange={setRepeat} renderOption={(r) => (r === 'None' ? 'Once' : r)} />
        </Field>
      </form>
    </Modal>
  );
}
