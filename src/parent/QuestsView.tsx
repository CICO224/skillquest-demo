import { useState, type ReactNode } from 'react';
import { CalendarClock, ChevronRight, Gift, ImageUp, Layers, Lock, Plus, Repeat, Trash2 } from 'lucide-react';
import { Button, Card, EmptyState, Field, inputClass, MissedBadge, Modal, Pill, PointsLabel, Segmented, StarIcon, useToast } from '../components/ui';
import { AnimatedNumber, Collapse, useLeaving } from '../components/motion';
import { CategoryIcon } from '../lib/categories';
import { StatusPill } from '../lib/status';
import { useStore } from '../lib/store';
import { CATEGORIES, REPEATS, type Category, type Quest, type RepeatInterval } from '../types';
import { cx, endOfDayIso, formatDate, formatDue, isMissed, toDateInput } from '../lib/utils';
import { PageHeader, SectionTitle } from './layout';
import type { Section } from './ParentApp';

const WEEK = 7 * 24 * 60 * 60 * 1000;

export function QuestsView({ onUpgrade, onNavigate }: { onUpgrade: () => void; onNavigate: (s: Section) => void }) {
  const { state, slotsFull, slotLimit, slotsUsed, deleteQuest } = useStore();
  const toast = useToast();
  const { isLeaving, leave } = useLeaving();
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Quest | null>(null);

  const active = state.quests.filter((q) => q.status !== 'approved');
  const done = state.quests.filter((q) => q.status === 'approved').slice(0, 8);

  const toReview = state.quests.filter((q) => q.status === 'pending_review').length;
  const toHandOver = state.claims.filter((c) => !c.isDelivered).length;
  const weekPoints = state.quests
    .filter((q) => q.status === 'approved' && q.approvedAt && Date.now() - new Date(q.approvedAt).getTime() < WEEK)
    .reduce((sum, q) => sum + q.points, 0);

  return (
    <div>
      <PageHeader
        title="Quests"
        subtitle={`Chores and tasks for ${state.teen.name}.`}
        action={
          <Button size="lg" onClick={() => setCreateOpen(true)} disabled={slotsFull}>
            <Plus className="size-5" aria-hidden /> Create New Quest
          </Button>
        }
      />

      {/* Summary widgets */}
      <div className="stagger mb-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Widget
          onClick={() => onNavigate('review')}
          icon={<ImageUp className="size-5" />}
          tint="bg-orange-500"
          value={toReview}
          label={toReview === 1 ? 'Photo to review' : 'Photos to review'}
          highlight={toReview > 0}
        />
        <Widget
          onClick={() => onNavigate('delivery')}
          icon={<Gift className="size-5" />}
          tint="bg-purple-500"
          value={toHandOver}
          label={toHandOver === 1 ? 'Reward to hand over' : 'Rewards to hand over'}
          highlight={toHandOver > 0}
        />
        <Widget
          onClick={() => onNavigate('progress')}
          icon={<StarIcon className="size-5" />}
          tint="bg-amber-400"
          value={weekPoints}
          label="Points earned this week"
        />
        <Widget
          onClick={onUpgrade}
          icon={<Layers className="size-5" />}
          tint="bg-accent"
          value={slotsUsed}
          suffix={`/${slotLimit}`}
          label="Quest slots in use"
          highlight={slotsFull}
        />
      </div>

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
          <ul className="stagger divide-y divide-separator">
            {active.map((q) => (
              <QuestRow key={q.id} quest={q} leaving={isLeaving(q.id)} onDelete={() => setConfirmDelete(q)} />
            ))}
          </ul>
        </Card>
      )}

      {done.length > 0 && (
        <>
          <SectionTitle>Recently completed</SectionTitle>
          <Card className="overflow-hidden">
            <ul className="stagger divide-y divide-separator">
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
                if (confirmDelete) {
                  const id = confirmDelete.id;
                  leave(id, () => deleteQuest(id));
                }
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

function Widget({
  icon,
  tint,
  value,
  suffix,
  label,
  onClick,
  highlight,
}: {
  icon: ReactNode;
  tint: string;
  value: number;
  suffix?: string;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'group flex flex-col rounded-3xl bg-surface p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30',
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cx('flex size-9 items-center justify-center rounded-full text-white', tint)} aria-hidden>
          {icon}
        </span>
        <ChevronRight className="size-5 text-ink-3 transition group-hover:translate-x-0.5" aria-hidden />
      </div>
      <p className={cx('mt-4 text-[34px] leading-none font-semibold tracking-tight', highlight && 'text-accent')}>
        <AnimatedNumber value={value} />
        {suffix && <span className="text-[20px] text-ink-3">{suffix}</span>}
      </p>
      <p className="mt-1.5 text-[14px] font-medium text-ink-2">{label}</p>
    </button>
  );
}

function QuestRow({ quest: q, onDelete, leaving }: { quest: Quest; onDelete: () => void; leaving: boolean }) {
  const missed = isMissed(q);
  return (
    <Collapse as="li" leaving={leaving}>
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
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
              <Pill tone="blue">
                <Repeat className="size-3.5" strokeWidth={2.5} aria-hidden /> {q.repeat}
              </Pill>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 pl-16 sm:pl-0">
        <StatusPill status={q.status} audience="parent" />
        <PointsLabel points={q.points} className="w-24 text-[15px]" />
        <Button variant="secondary" size="sm" onClick={onDelete} aria-label={`Delete quest ${q.title}`}>
          <Trash2 className="size-4" aria-hidden /> Delete
        </Button>
      </div>
    </div>
    </Collapse>
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
                  category === c ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-hairline hover:bg-fill',
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
