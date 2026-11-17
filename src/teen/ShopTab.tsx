import { useState } from 'react';
import { Gift, Lock } from 'lucide-react';
import { Button, Card, EmptyState, Modal, PointsLabel } from '../components/ui';
import { useCelebrate } from '../components/motion';
import { useStore } from '../lib/store';
import type { Reward } from '../types';
import { LargeTitle } from './layout';

export function ShopTab({ onClaimed }: { onClaimed: () => void }) {
  const { state, claimReward } = useStore();
  const celebrate = useCelebrate();
  const [confirm, setConfirm] = useState<Reward | null>(null);
  const points = state.teen.points;
  const rewards = [...state.rewards].sort((a, b) => a.cost - b.cost);

  return (
    <div>
      <LargeTitle eyebrow="Spend your points" subtitle="Spend your points on rewards from your family.">Reward Shop</LargeTitle>

      {rewards.length === 0 ? (
        <Card>
          <EmptyState icon={<Gift className="size-7" />} title="The shop is empty" body="Ask your parent to add some rewards." />
        </Card>
      ) : (
        <div className="stagger grid grid-cols-2 gap-3">
          {rewards.map((r) => {
            const missing = r.cost - points;
            const locked = missing > 0;
            const progress = Math.min(100, Math.round((points / r.cost) * 100));
            return (
              <Card as="article" key={r.id} className="flex flex-col p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="flex aspect-square w-full items-center justify-center rounded-2xl bg-canvas text-[52px]" aria-hidden>
                  {r.icon}
                </span>
                <h2 className="mt-3 text-[16px] leading-snug font-semibold">{r.title}</h2>
                <PointsLabel points={r.cost} className="mt-1 text-[14px] text-ink-2" />
                <div className="mt-auto pt-3">
                  {locked ? (
                    <div>
                      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-fill" aria-hidden>
                        <div className="h-full origin-left animate-grow rounded-full bg-star [animation-delay:300ms]" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="flex items-start gap-1.5 rounded-xl bg-fill px-2.5 py-2 text-[13px] leading-snug font-semibold text-ink-2">
                        <Lock className="mt-px size-4 shrink-0" aria-hidden />
                        Locked — Need {missing} more {missing === 1 ? 'point' : 'points'}
                      </p>
                    </div>
                  ) : (
                    <Button block onClick={() => setConfirm(r)}>
                      Claim Reward
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={`Claim ${confirm?.title ?? ''}?`}
        description={confirm ? `This uses ${confirm.cost} points. You’ll have ${points - confirm.cost} left.` : ''}
        footer={
          <>
            <Button variant="secondary" size="lg" onClick={() => setConfirm(null)}>
              Not Now
            </Button>
            <Button
              size="lg"
              onClick={() => {
                if (confirm && claimReward(confirm.id)) {
                  const claimed = confirm;
                  setConfirm(null);
                  onClaimed();
                  celebrate({
                    title: 'Claimed!',
                    subtitle: `Your parent will hand over “${claimed.title}” in real life.`,
                    emoji: claimed.icon,
                    confetti: true,
                  });
                }
              }}
            >
              Yes, Claim It
            </Button>
          </>
        }
      >
        <div className="flex justify-center py-2 text-[80px]" aria-hidden>
          {confirm?.icon}
        </div>
      </Modal>
    </div>
  );
}
