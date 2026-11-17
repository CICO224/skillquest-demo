import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppState, Category, Plan, Quest, RepeatInterval, Reward } from '../types';
import { PLAN_LIMITS } from '../types';
import { nextDue, photoIsExpired, uid } from './utils';

const STORAGE_KEY = 'skillquest:v1';
const DAY = 24 * 60 * 60 * 1000;

function samplePhoto(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#cfe3ff"/><stop offset="1" stop-color="#f5e6ff"/></linearGradient></defs>
    <rect width="800" height="600" fill="url(#g)"/>
    <rect x="120" y="300" width="560" height="170" rx="28" fill="#ffffff"/>
    <rect x="120" y="230" width="560" height="110" rx="28" fill="#8fb8f0"/>
    <rect x="160" y="250" width="160" height="70" rx="22" fill="#ffffff"/>
    <rect x="480" y="250" width="160" height="70" rx="22" fill="#ffffff"/>
    <rect x="120" y="470" width="30" height="60" rx="8" fill="#6e6e73"/>
    <rect x="650" y="470" width="30" height="60" rx="8" fill="#6e6e73"/>
    <text x="400" y="110" text-anchor="middle" font-family="-apple-system,Segoe UI,sans-serif" font-size="40" font-weight="600" fill="#1d1d1f">Sample proof photo</text>
    <text x="400" y="160" text-anchor="middle" font-family="-apple-system,Segoe UI,sans-serif" font-size="26" fill="#6e6e73">Bedroom tidied up</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function endOfDay(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(23, 59, 0, 0);
  return d.toISOString();
}

export function createSeedState(): AppState {
  const now = Date.now();
  const iso = (msAgo: number) => new Date(now - msAgo).toISOString();
  return {
    plan: 'free',
    parentName: 'Alex Parker',
    kidConnected: true,
    teen: { id: 'teen-1', name: 'Sam', points: 45, questsCompleted: 6, rewardsDelivered: 1 },
    quests: [
      {
        id: uid(),
        title: 'Tidy your bedroom',
        category: 'Chores',
        points: 15,
        dueDate: endOfDay(0),
        repeat: 'Weekly',
        status: 'pending_review',
        createdAt: iso(3 * DAY),
        submittedPhotoUrl: samplePhoto(),
        submittedAt: iso(40 * 60 * 1000),
      },
      {
        id: uid(),
        title: 'Read for 20 minutes',
        category: 'Study',
        points: 10,
        dueDate: endOfDay(-1),
        repeat: 'Daily',
        status: 'todo',
        createdAt: iso(2 * DAY),
      },
      {
        id: uid(),
        title: 'Walk the dog after school',
        category: 'Health',
        points: 10,
        dueDate: endOfDay(-1),
        repeat: 'None',
        status: 'approved',
        createdAt: iso(4 * DAY),
        submittedAt: iso(DAY + 3 * 60 * 60 * 1000),
        approvedAt: iso(DAY),
      },
    ],
    rewards: [
      { id: uid(), title: '30 min extra screen time', cost: 20, icon: '🎮' },
      { id: uid(), title: "Pick Friday's dinner", cost: 35, icon: '🍕' },
      { id: uid(), title: 'Family movie night pick', cost: 60, icon: '🎬' },
      { id: uid(), title: 'A new book of your choice', cost: 100, icon: '📚' },
    ],
    claims: [
      {
        id: uid(),
        rewardId: 'ice-cream',
        rewardTitle: 'Ice cream trip',
        rewardIcon: '🍦',
        cost: 25,
        claimedAt: iso(5 * DAY),
        isDelivered: true,
        deliveredAt: iso(4 * DAY),
      },
    ],
  };
}

/** Drops proof photos older than the retention window. */
function applyRetention(state: AppState): AppState {
  let changed = false;
  const quests = state.quests.map((q) => {
    if (q.submittedPhotoUrl && photoIsExpired(q.submittedAt)) {
      changed = true;
      return { ...q, submittedPhotoUrl: undefined, photoExpired: true };
    }
    return q;
  });
  return changed ? { ...state, quests } : state;
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return applyRetention(JSON.parse(raw) as AppState);
  } catch {
    /* storage unavailable or corrupt: fall back to demo data */
  }
  return createSeedState();
}

export interface NewQuestInput {
  title: string;
  category: Category;
  points: number;
  dueDate: string;
  repeat: RepeatInterval;
}

interface Store {
  state: AppState;
  slotLimit: number;
  slotsUsed: number;
  slotsFull: boolean;
  createQuest: (input: NewQuestInput) => boolean;
  deleteQuest: (id: string) => void;
  submitProof: (id: string, photoUrl: string) => void;
  approveQuest: (id: string) => void;
  rejectQuest: (id: string, reason: string) => void;
  addReward: (input: Omit<Reward, 'id'>) => void;
  deleteReward: (id: string) => void;
  claimReward: (rewardId: string) => boolean;
  markDelivered: (claimId: string) => void;
  setPlan: (plan: Plan) => void;
  connectKid: () => void;
  resetDemo: () => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('SKILLQuest: could not save to local storage', err);
    }
  }, [state]);

  // Keep a Parent tab and a Teen tab in sync on the same device.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        setState(JSON.parse(e.newValue) as AppState);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const slotLimit = PLAN_LIMITS[state.plan].questSlots;
  const slotsUsed = state.quests.filter((q) => q.status !== 'approved').length;
  const slotsFull = slotsUsed >= slotLimit;

  const updateQuest = useCallback((id: string, patch: Partial<Quest>) => {
    setState((s) => ({ ...s, quests: s.quests.map((q) => (q.id === id ? { ...q, ...patch } : q)) }));
  }, []);

  const createQuest = useCallback(
    (input: NewQuestInput) => {
      if (slotsFull) return false;
      const quest: Quest = { ...input, id: uid(), status: 'todo', createdAt: new Date().toISOString() };
      setState((s) => ({ ...s, quests: [quest, ...s.quests] }));
      return true;
    },
    [slotsFull],
  );

  const deleteQuest = useCallback((id: string) => {
    setState((s) => ({ ...s, quests: s.quests.filter((q) => q.id !== id) }));
  }, []);

  const submitProof = useCallback(
    (id: string, photoUrl: string) =>
      updateQuest(id, {
        status: 'pending_review',
        submittedPhotoUrl: photoUrl,
        submittedAt: new Date().toISOString(),
        photoExpired: false,
      }),
    [updateQuest],
  );

  const approveQuest = useCallback((id: string) => {
    setState((s) => {
      const q = s.quests.find((x) => x.id === id);
      if (!q || q.status !== 'pending_review') return s;
      const now = new Date().toISOString();
      let quests = s.quests.map((x) =>
        x.id === id ? { ...x, status: 'approved' as const, approvedAt: now, rejectReason: undefined } : x,
      );
      if (q.repeat !== 'None') {
        const next: Quest = {
          id: uid(),
          title: q.title,
          category: q.category,
          points: q.points,
          repeat: q.repeat,
          dueDate: nextDue(q.dueDate, q.repeat),
          status: 'todo',
          createdAt: now,
        };
        quests = [next, ...quests];
      }
      return {
        ...s,
        quests,
        teen: { ...s.teen, points: s.teen.points + q.points, questsCompleted: s.teen.questsCompleted + 1 },
      };
    });
  }, []);

  const rejectQuest = useCallback(
    (id: string, reason: string) => {
      const trimmed = reason.trim();
      if (!trimmed) return;
      updateQuest(id, { status: 'rejected', rejectReason: trimmed });
    },
    [updateQuest],
  );

  const addReward = useCallback((input: Omit<Reward, 'id'>) => {
    setState((s) => ({ ...s, rewards: [...s.rewards, { ...input, id: uid() }] }));
  }, []);

  const deleteReward = useCallback((id: string) => {
    setState((s) => ({ ...s, rewards: s.rewards.filter((r) => r.id !== id) }));
  }, []);

  const claimReward = useCallback(
    (rewardId: string) => {
      const reward = state.rewards.find((r) => r.id === rewardId);
      if (!reward || state.teen.points < reward.cost) return false;
      setState((s) => {
        if (s.teen.points < reward.cost) return s;
        return {
          ...s,
          teen: { ...s.teen, points: s.teen.points - reward.cost },
          claims: [
            {
              id: uid(),
              rewardId: reward.id,
              rewardTitle: reward.title,
              rewardIcon: reward.icon,
              cost: reward.cost,
              claimedAt: new Date().toISOString(),
              isDelivered: false,
            },
            ...s.claims,
          ],
        };
      });
      return true;
    },
    [state.rewards, state.teen.points],
  );

  const markDelivered = useCallback((claimId: string) => {
    setState((s) => {
      const claim = s.claims.find((c) => c.id === claimId);
      if (!claim || claim.isDelivered) return s;
      return {
        ...s,
        claims: s.claims.map((c) =>
          c.id === claimId ? { ...c, isDelivered: true, deliveredAt: new Date().toISOString() } : c,
        ),
        teen: { ...s.teen, rewardsDelivered: s.teen.rewardsDelivered + 1 },
      };
    });
  }, []);

  const setPlan = useCallback((plan: Plan) => setState((s) => ({ ...s, plan })), []);
  const connectKid = useCallback(() => setState((s) => ({ ...s, kidConnected: true })), []);
  const resetDemo = useCallback(() => setState(createSeedState()), []);

  const value = useMemo<Store>(
    () => ({
      state,
      slotLimit,
      slotsUsed,
      slotsFull,
      createQuest,
      deleteQuest,
      submitProof,
      approveQuest,
      rejectQuest,
      addReward,
      deleteReward,
      claimReward,
      markDelivered,
      setPlan,
      connectKid,
      resetDemo,
    }),
    [state, slotLimit, slotsUsed, slotsFull, createQuest, deleteQuest, submitProof, approveQuest, rejectQuest, addReward, deleteReward, claimReward, markDelivered, setPlan, connectKid, resetDemo],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
