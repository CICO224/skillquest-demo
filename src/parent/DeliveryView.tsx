import { useState } from 'react';
import { Gift, PackageCheck, Plus, Trash2 } from 'lucide-react';
import { Button, Card, EmptyState, Field, inputClass, Modal, Pill, PointsLabel, useToast } from '../components/ui';
import { Collapse, useCelebrate, useLeaving } from '../components/motion';
import { useStore } from '../lib/store';
import { cx, formatDate, formatRelative } from '../lib/utils';
import { PageHeader, SectionTitle } from './layout';

const EMOJIS = ['🎮', '🍕', '🎬', '📚', '🍦', '🛹', '🎨', '⚽', '🎧', '🧁', '🏊', '💵'];

export function DeliveryView() {
  const { state, markDelivered, deleteReward } = useStore();
  const toast = useToast();
  const celebrate = useCelebrate();
  const { isLeaving, leave } = useLeaving();
  const [addOpen, setAddOpen] = useState(false);

  const waiting = state.claims.filter((c) => !c.isDelivered);
  const delivered = state.claims.filter((c) => c.isDelivered).slice(0, 6);

  return (
    <div>
      <PageHeader title="Reward Delivery" subtitle={`Rewards ${state.teen.name} has claimed. Hand them over in real life, then mark them delivered.`} />

      <SectionTitle>Waiting to be handed over</SectionTitle>
      {waiting.length === 0 ? (
        <Card>
          <EmptyState icon={<PackageCheck className="size-7" />} title="Nothing to hand over" body="When your teen claims a reward, it will appear here." />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <ul className="stagger divide-y divide-separator">
            {waiting.map((c) => (
              <Collapse as="li" key={c.id} leaving={isLeaving(c.id)}>
              <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-canvas text-[26px]" aria-hidden>
                    {c.rewardIcon}
                  </span>
                  <div>
                    <p className="text-[17px] font-semibold">{c.rewardTitle}</p>
                    <p className="text-[14px] text-ink-2">
                      Claimed {formatRelative(c.claimedAt)} · {c.cost} Points spent
                    </p>
                  </div>
                </div>
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => {
                    leave(c.id, () => markDelivered(c.id));
                    celebrate({ title: 'Delivered', subtitle: `${c.rewardTitle} handed over` });
                  }}
                >
                  <PackageCheck className="size-5" aria-hidden /> Mark Delivered
                </Button>
              </div>
              </Collapse>
            ))}
          </ul>
        </Card>
      )}

      <div className="mt-10 mb-3 flex items-end justify-between px-1">
        <h2 className="text-[13px] font-semibold tracking-wide text-ink-2 uppercase">Family rewards in the shop</h2>
        <Button size="md" onClick={() => setAddOpen(true)}>
          <Plus className="size-4" aria-hidden /> Add Family Reward
        </Button>
      </div>
      {state.rewards.length === 0 ? (
        <Card>
          <EmptyState icon={<Gift className="size-7" />} title="The shop is empty" body="Add rewards your teen can save points for." />
        </Card>
      ) : (
        <div className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {state.rewards.map((r) => (
            <Card key={r.id} className="flex items-center gap-4 p-5">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-canvas text-[30px]" aria-hidden>
                {r.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] leading-snug font-semibold">{r.title}</p>
                <PointsLabel points={r.cost} className="mt-1 text-[14px] text-ink-2" />
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  deleteReward(r.id);
                  toast('Reward removed from the shop');
                }}
                aria-label={`Remove reward ${r.title}`}
              >
                <Trash2 className="size-4" aria-hidden /> Remove
              </Button>
            </Card>
          ))}
        </div>
      )}

      {delivered.length > 0 && (
        <>
          <SectionTitle>Already handed over</SectionTitle>
          <Card className="overflow-hidden">
            <ul className="stagger divide-y divide-separator">
              {delivered.map((c) => (
                <li key={c.id} className="flex items-center gap-4 px-5 py-4">
                  <span className="text-[22px]" aria-hidden>
                    {c.rewardIcon}
                  </span>
                  <p className="flex-1 text-[16px]">{c.rewardTitle}</p>
                  <Pill tone="green">✓ Delivered {c.deliveredAt ? formatDate(c.deliveredAt) : ''}</Pill>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}

      <AddRewardModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

function AddRewardModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addReward } = useStore();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState(25);
  const [icon, setIcon] = useState(EMOJIS[0]);
  const valid = title.trim().length > 0 && cost > 0;

  const close = () => {
    setTitle('');
    setCost(25);
    setIcon(EMOJIS[0]);
    onClose();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    addReward({ title: title.trim(), cost, icon });
    toast('Reward added to the shop');
    close();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Add Family Reward"
      description="You choose the reward and you hand it over. SKILLQuest never ships anything."
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" form="add-reward" disabled={!valid}>
            <Plus className="size-4" aria-hidden /> Add Reward
          </Button>
        </>
      }
    >
      <form id="add-reward" onSubmit={submit} className="space-y-6">
        <Field label="Reward name" htmlFor="r-title">
          <input
            id="r-title"
            className={inputClass}
            placeholder="e.g. Stay up 30 minutes later"
            value={title}
            maxLength={50}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </Field>
        <Field label="Cost in points" htmlFor="r-cost">
          <input
            id="r-cost"
            type="number"
            inputMode="numeric"
            min={1}
            className={cx(inputClass, 'font-semibold tabular-nums')}
            value={cost}
            onChange={(e) => setCost(Math.max(0, Math.min(10000, Number(e.target.value) || 0)))}
          />
        </Field>
        <Field label="Picture">
          <div role="radiogroup" aria-label="Reward picture" className="grid grid-cols-6 gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                role="radio"
                aria-checked={icon === e}
                onClick={() => setIcon(e)}
                className={cx(
                  'flex aspect-square items-center justify-center rounded-2xl text-[26px] transition',
                  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30',
                  icon === e ? 'bg-accent/10 ring-2 ring-accent' : 'bg-canvas hover:bg-fill',
                )}
              >
                {e}
              </button>
            ))}
          </div>
        </Field>
      </form>
    </Modal>
  );
}
