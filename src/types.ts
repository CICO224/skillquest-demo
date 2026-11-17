export type Category = 'Chores' | 'Study' | 'Health' | 'Responsibility';
export type RepeatInterval = 'None' | 'Daily' | 'Weekly' | 'Monthly';
export type QuestStatus = 'todo' | 'pending_review' | 'approved' | 'rejected';
export type Plan = 'free' | 'premium';

export interface Quest {
  id: string;
  title: string;
  category: Category;
  points: number;
  dueDate: string; // ISO timestamp
  repeat: RepeatInterval;
  status: QuestStatus;
  createdAt: string;
  submittedPhotoUrl?: string;
  submittedAt?: string;
  photoExpired?: boolean;
  rejectReason?: string;
  approvedAt?: string;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  icon: string; // emoji
}

export interface Claim {
  id: string;
  rewardId: string;
  rewardTitle: string;
  rewardIcon: string;
  cost: number;
  claimedAt: string;
  isDelivered: boolean;
  deliveredAt?: string;
}

export interface TeenProfile {
  id: string;
  name: string;
  points: number;
  questsCompleted: number;
  rewardsDelivered: number;
}

export interface AppState {
  plan: Plan;
  parentName: string;
  kidConnected: boolean;
  teen: TeenProfile;
  quests: Quest[];
  rewards: Reward[];
  claims: Claim[];
}

export const CATEGORIES: Category[] = ['Chores', 'Study', 'Health', 'Responsibility'];
export const REPEATS: RepeatInterval[] = ['None', 'Daily', 'Weekly', 'Monthly'];

export const PLAN_LIMITS: Record<Plan, { parents: number; teens: number; questSlots: number }> = {
  free: { parents: 1, teens: 1, questSlots: 3 },
  premium: { parents: 5, teens: 10, questSlots: 20 },
};
