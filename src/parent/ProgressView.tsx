import { CheckCircle2, Gift, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card, EmptyState, StarIcon } from '../components/ui';
import { AnimatedNumber } from '../components/motion';
import { CategoryIcon } from '../lib/categories';
import { useStore } from '../lib/store';
import { formatDate } from '../lib/utils';
import { PageHeader, SectionTitle } from './layout';

export function ProgressView() {
  const { state } = useStore();
  const { teen } = state;
  const recent = state.quests
    .filter((q) => q.status === 'approved' && q.approvedAt)
    .sort((a, b) => (b.approvedAt ?? '').localeCompare(a.approvedAt ?? ''))
    .slice(0, 6);

  return (
    <div>
      <PageHeader title="Teen Progress" subtitle={`How ${teen.name} is doing. Only their own progress, never compared to anyone else.`} />

      <div className="stagger grid gap-4 sm:grid-cols-3">
        <Stat icon={<StarIcon className="size-6 text-star" />} label="Points balance" value={teen.points} />
        <Stat icon={<CheckCircle2 className="size-6 text-ok" />} label="Quests completed" value={teen.questsCompleted} />
        <Stat icon={<Gift className="size-6 text-purple-600" />} label="Rewards delivered" value={teen.rewardsDelivered} />
      </div>

      <SectionTitle>Recently approved</SectionTitle>
      <Card className="overflow-hidden">
        {recent.length === 0 ? (
          <EmptyState icon={<Sparkles className="size-7" />} title="No approvals yet" body="Approved quests will be listed here." />
        ) : (
          <ul className="stagger divide-y divide-separator">
            {recent.map((q) => (
              <li key={q.id} className="flex items-center gap-4 px-5 py-4">
                <CategoryIcon category={q.category} />
                <p className="flex-1 text-[16px] font-medium">{q.title}</p>
                <p className="text-[14px] text-ink-2">{q.approvedAt && formatDate(q.approvedAt)}</p>
                <p className="w-24 text-right text-[15px] font-semibold text-ok tabular-nums">+{q.points} Points</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <Card className="p-6">
      <div className="flex size-11 items-center justify-center rounded-full bg-canvas" aria-hidden>
        {icon}
      </div>
      <p className="mt-5 text-[44px] leading-none font-semibold tracking-tight ">
        <AnimatedNumber value={value} from={0} />
      </p>
      <p className="mt-2 text-[15px] text-ink-2">{label}</p>
    </Card>
  );
}
