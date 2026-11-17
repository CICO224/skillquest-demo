import { useState } from 'react';
import { Gift, Lock } from 'lucide-react';
import { Button, Card, EmptyState, Modal, PointsLabel, useToast } from '../components/ui';
import { useStore } from '../lib/store';
import type { Reward } from '../types';
import { LargeTitle } from './layout';

export function ShopTab({ onClaimed }: { onClaimed: () => void }) {
  const { state, claimReward } = useStore();
  const toast = useToast();
  const [confirm, setConfirm] = useState<Reward | null>(null);
  const points = state.teen.points;
  const rewards = [...state.rewards].sort((a, b) => a.cost - b.cost);

  return (
    <div className="animate-fade">
      <LargeTitle subtitle="Spend your points on rewards from your family.">Reward Shop</LargeTitle>

      {rewards.length === 0 ? (
        <Card>
          <EmptyState icon={<Gift className="size-7" />} title="The shop is empty" body="Ask your parent to add some rewards." />
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {rewards.map((r) => {
            const missing = r.cost - points;
            const locked = missing > 0;
            const progress = Math.min(100, Math.round((points / r.cost) * 100));
            return (
              <Card as="article" key={r.id} className="flex flex-col p-4">
                <span className="flex aspect-square w-full items-center justify-center rounded-2xl bg-canvas text-[52px]" aria-hidden>
                  {r.icon}
                </span>
                <h2 className="mt-3 text-[16px] leading-snug font-semibold">{r.title}</h2>
                <PointsLabel points={r.cost} className="mt-1 text-[14px] text-ink-2" />
                <div className="mt-auto pt-3">
                  {locked ? (
                    <div>
                      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-black/[0.06]" aria-hidden>
                        <div className="h-full rounded-full bg-star" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="flex items-start gap-1.5 rounded-xl bg-black/[0.05] px-2.5 py-2 text-[13px] leading-snug font-semibold text-ink-2">
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
                  toast('Claimed! Your parent will hand it over.');
                  setConfirm(null);
                  onClaimed();
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
