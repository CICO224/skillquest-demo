# SKILLQuest — Project Architecture & Implementation Guidelines

> **Project Goal:** Build an accessible, zero-friction web platform where parents turn chores/tasks into quests, and teens (ages 8–15) earn points by submitting one photo as proof to claim parent-fulfilled real-life rewards.

---

## 1. High-Level Vision & Core Loop

```
1. Parent creates quest (Title, Category, Points, Due Date, Repeat)
          │
          ▼
2. Teen views quest on mobile & uploads 1 photo proof
          │
          ▼
3. Parent reviews photo on desktop
    ├── [REJECT] ──> Requires text reason ──> Teen resubmits
    └── [APPROVE] ─> Points added to Teen's balance
          │
          ▼
4. Teen spends points to claim a reward in Reward Shop
          │
          ▼
5. Parent hands over reward in real life & clicks "Mark Delivered"
```

---

## 2. Hard System Constraints & Rules (Do Not Violate)

1. **Web-Only (No App Installs):** Operates directly in standard web browsers.
2. **Platform & Layout Target:**
   - **Parent Experience:** Desktop web layout. Target audience is non-tech-savvy; prioritize single-job screens, clear text labels over ambiguous icons, and zero cognitive load.
   - **Teen Experience:** Responsive mobile web layout. Target audience: ages 8–15.
3. **Single Currency:** Use only **"Points"**. No XP, no levels, no badges, and **strictly no leaderboards or rankings** (focus on individual growth and zero peer comparison).
4. **Who Can Create What:**
   - **Quests:** **Only parents** can create quests. Teens cannot create quests.
   - **Rewards:** **Only parents** create and fulfill rewards. SKILLQuest never provides or delivers physical rewards.
5. **Photo Proof Verification:**
   - Every quest requires exactly **one photo** as proof.
   - Points are **only** credited after parent approval.
   - Rejections **must** include a mandatory text reason.
   - The teen can resubmit proof after rejection.
   - Proof photos are kept for 1 month.
6. **Reward Claiming & Locking:**
   - Claiming a reward deducts points immediately and enters a `Waiting for Parent Delivery` state.
   - A locked reward **must explicitly state how many points are missing** (e.g., *"Locked — Need 15 more points"*).
7. **Deadlines & Missed State:**
   - Any quest past its due date **must be displayed in bold red with a "Missed" badge**.
8. **Plan Tiers:**
   - **Free Plan:** 1 Parent, 1 Teen, max 3 active quest slots.
   - **Premium Plan:** Up to 5 Parents, 10 Teens, 20 quest slots (pricing placeholder: Rp200,000/year or Rp20,833/month).
9. **Account Linking:**
   - Parent clicks their profile photo to show a QR code.
   - Teen scans QR to connect (in prototype/demo: clicking the QR code immediately displays *"Kid connected!"*).

---

## 3. Recommended Tech Stack for UltraCode in T3 Code

- **Framework:** Next.js 14+ (App Router) or Vite + React / TypeScript
- **Styling:** Tailwind CSS (accessible color palettes, large touch targets, readable font sizes)
- **State Management / Database:** 
  - *Prototype / MVP:* Supabase, Firebase Firestore, or local SQLite / JSON with Prisma
  - *Auth:* Google OAuth + QR-based family invite token
- **Icons & UI:** Lucide React icons with explicit text labels beside or below icons.

---

## 4. Screen-by-Screen Breakdown

### A. Parent Side (Desktop View)
| Screen / Section | Primary Purpose | Key Elements |
|---|---|---|
| **Header & Family Bar** | Identity & Account Linking | Parent Avatar (click opens QR modal), Free Plan status indicator (`3/3 Slots`). |
| **Quests Dashboard** | Manage active family chores | `+ Create New Quest` button, list of active quests, repeat badge (Daily/Weekly/Monthly), **Bold Red "Missed" status badge** for overdue tasks. |
| **Review Proofs** | Inspect photo submissions | Submitted photo preview, Quest details, `[Approve (+pts)]` green button, `[Reject with Reason]` red button opening text prompt. |
| **Reward Delivery** | Real-world fulfillment | List of claimed rewards waiting to be handed over, `[Mark Delivered]` button, Custom Reward Manager (`+ Add Family Reward`). |
| **Teen Progress** | Progress tracking | Points balance, total completed quests, delivered rewards (NO leaderboards). |

### B. Teen Side (Mobile View)
| Screen / Section | Primary Purpose | Key Elements |
|---|---|---|
| **Top Status Bar** | Points overview | Large points balance indicator (`⭐ 45 Points`). |
| **Today's Quests** | Tasks to complete | Cards grouped by category (Chores, Study, Health), Due dates, `[Take / Submit Photo Proof]` button, Status: `To Do` / `Pending Parent Approval` / `Approved` / `Rejected (with parent's reason & resubmit button)`. |
| **Reward Shop** | Redeem points | Parent-created reward cards, `[Claim Reward]` button (if affordable) or `[🔒 Locked — Need X more points]` banner. |
| **My Claims** | Track real-life delivery | Cards showing claimed items with `⏳ Waiting for parent to hand over in real life` or `✓ Handed over`. |

---

## 5. Suggested Data Models (TypeScript Interfaces)

```typescript
export type Category = 'Chores' | 'Study' | 'Health' | 'Responsibility';
export type RepeatInterval = 'None' | 'Daily' | 'Weekly' | 'Monthly';
export type QuestStatus = 'todo' | 'pending_review' | 'approved' | 'rejected';

export interface Quest {
  id: string;
  title: string;
  category: Category;
  points: number;
  dueDate: string; // ISO timestamp
  repeat: RepeatInterval;
  isMissed: boolean;
  status: QuestStatus;
  submittedPhotoUrl?: string;
  rejectReason?: string;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  iconOrImageUrl: string;
}

export interface Claim {
  id: string;
  rewardId: string;
  rewardTitle: string;
  cost: number;
  claimedAt: string;
  isDelivered: boolean;
}

export interface TeenProfile {
  id: string;
  name: string;
  points: number;
  questsCompleted: number;
  rewardsDelivered: number;
}
```

---

## 6. Prompt to Launch in UltraCode / New Thread

When you create a new thread with UltraCode in T3 Code, you can paste this starter prompt:

```text
Please build the SKILLQuest family task platform based on SKILLQUEST_PROJECT_GUIDELINES.md.
Key priorities:
1. Target desktop for Parents (simple, low-tech, clear labels) and mobile for Teens (ages 8-15).
2. Implement the full core loop: Parent quest creation -> Teen photo proof submission -> Parent approval/rejection with required text reason -> Points crediting -> Reward claim -> Real-life delivery confirmation.
3. Keep strict rules: Points only (no XP/levels/ranks), free tier limits (3 quests max), and at least one overdue quest marked with a bold red "Missed" badge.
```
