import { Package } from 'lucide-react';
import { Button, Card, EmptyState } from '../components/ui';
import { useStore } from '../lib/store';
import { formatDate } from '../lib/utils';
import { LargeTitle } from './layout';

export function ClaimsTab({ onShop }: { onShop: () => void }) {
  const { state } = useStore();
  const claims = [...state.claims].sort((a, b) => Number(a.isDelivered) - Number(b.isDelivered) || b.claimedAt.localeCompare(a.claimedAt));

  return (
    <div>
      <LargeTitle eyebrow="Real-life rewards" subtitle="Rewards you claimed and whether you got them yet.">My Claims</LargeTitle>

      {claims.length === 0 ? (
        <Card>
          <EmptyState icon={<Package className="size-7" />} title="No claims yet" body="Claim a reward in the shop and it will show up here." />
          <div className="flex justify-center pb-8">
            <Button onClick={onShop}>Go to Reward Shop</Button>
          </div>
        </Card>
      ) : (
        <div className="stagger space-y-3">
          {claims.map((c) => (
            <Card as="article" key={c.id} className="flex items-center gap-4 p-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-canvas text-[30px]" aria-hidden>
                {c.rewardIcon}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-[17px] leading-snug font-semibold">{c.rewardTitle}</h2>
                <p className="text-[13px] text-ink-2">
                  Claimed {formatDate(c.claimedAt)} · {c.cost} points
                </p>
                {c.isDelivered ? (
                  <p className="mt-2 inline-flex rounded-full bg-ok-soft px-3 py-1 text-[14px] font-semibold text-ok">✓ Handed over</p>
                ) : (
                  <p className="mt-2 rounded-xl bg-warn-soft px-3 py-1.5 text-[14px] leading-snug font-semibold text-warn">
                    ⏳ Waiting for parent to hand over in real life
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
