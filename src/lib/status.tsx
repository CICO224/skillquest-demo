import { CheckCircle2, Circle, Clock, RotateCcw, type LucideIcon } from 'lucide-react';
import { Pill } from '../components/ui';
import type { QuestStatus } from '../types';

type Audience = 'parent' | 'teen';

const STATUS_META: Record<QuestStatus, { tone: 'gray' | 'orange' | 'green' | 'red'; icon: LucideIcon; parent: string; teen: string }> = {
  todo: { tone: 'gray', icon: Circle, parent: 'To Do', teen: 'To Do' },
  pending_review: { tone: 'orange', icon: Clock, parent: 'Needs your review', teen: 'Pending Parent Approval' },
  approved: { tone: 'green', icon: CheckCircle2, parent: 'Approved', teen: 'Approved' },
  rejected: { tone: 'red', icon: RotateCcw, parent: 'Sent back for a new photo', teen: 'Rejected' },
};

/** One status label, styled the same in the parent and teen views. */
export function StatusPill({ status, audience }: { status: QuestStatus; audience: Audience }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <Pill tone={meta.tone}>
      <Icon className="size-3.5" strokeWidth={2.5} aria-hidden />
      {meta[audience]}
    </Pill>
  );
}
