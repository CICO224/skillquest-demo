import { Camera, Check, ChevronRight, Gift, HandHeart, ListChecks, Monitor, ShieldCheck, Smartphone } from 'lucide-react';
import type { ReactNode } from 'react';
import { Logo } from './components/Logo';
import { StarIcon } from './components/ui';
import { hrefFor } from './lib/router';
import { cx } from './lib/utils';

const STEPS: { icon: ReactNode; title: string; body: string; tint: string }[] = [
  { icon: <ListChecks className="size-6" />, title: 'Parent creates a quest', body: 'Title, category, points and a due date. One screen, no setup.', tint: 'from-sky-400 to-blue-600' },
  { icon: <Camera className="size-6" />, title: 'Teen sends one photo', body: 'Right from their phone browser. Nothing to install.', tint: 'from-orange-400 to-pink-500' },
  { icon: <Check className="size-6" />, title: 'Parent approves', body: 'Approve to add points, or reject with a short reason so they can try again.', tint: 'from-emerald-400 to-green-600' },
  { icon: <Gift className="size-6" />, title: 'Teen claims a reward', body: 'Points are spent in a Reward Shop that you stock yourself.', tint: 'from-violet-400 to-purple-600' },
  { icon: <HandHeart className="size-6" />, title: 'You hand it over', body: 'Give the reward in real life, then tap “Mark Delivered”.', tint: 'from-rose-400 to-red-500' },
];

export function Landing() {
  return (
    <div className="min-h-dvh bg-white">
      {/* Nav */}
      <header className="glass sticky top-0 z-40 border-b border-black/5">
        <nav className="mx-auto flex h-12 max-w-[1024px] items-center justify-between px-4 sm:px-6">
          <a href={hrefFor('home')} aria-label="SKILLQuest home">
            <Logo />
          </a>
          <div className="flex items-center gap-1 text-[13px] sm:gap-4">
            <a href="#how" className="hidden rounded-full px-3 py-1.5 text-ink-2 hover:text-ink sm:inline">How it works</a>
            <a href="#pricing" className="hidden rounded-full px-3 py-1.5 text-ink-2 hover:text-ink sm:inline">Pricing</a>
            <a href={hrefFor('teen')} className="rounded-full px-3 py-1.5 text-ink-2 hover:text-ink">For Teens</a>
            <a href={hrefFor('parent')} className="rounded-full bg-accent px-3.5 py-1.5 font-medium text-white hover:bg-accent-hover">
              For Parents
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="overflow-hidden bg-canvas px-4 pt-16 pb-20 text-center sm:pt-24">
        <p className="animate-rise text-[17px] font-semibold text-orange-600 sm:text-[19px]">SKILLQuest</p>
        <h1 className="mx-auto mt-2 max-w-3xl animate-rise text-[44px] leading-[1.05] font-semibold tracking-[-0.03em] text-ink [animation-delay:60ms] sm:text-[72px]">
          Chores, turned
          <br />
          into quests.
        </h1>
        <p className="mx-auto mt-5 max-w-xl animate-rise text-[19px] leading-snug text-ink-2 [animation-delay:120ms] sm:text-[21px]">
          You set the quest. Your teen sends one photo as proof. Points unlock real-life rewards that you hand over yourself.
        </p>
        <div className="mt-8 flex animate-rise flex-col items-center justify-center gap-3 [animation-delay:180ms] sm:flex-row sm:gap-6">
          <a
            href={hrefFor('parent')}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-7 text-[17px] font-medium text-white transition hover:bg-accent-hover active:scale-[0.97]"
          >
            <Monitor className="size-5" aria-hidden /> Open Parent Dashboard
          </a>
          <a href={hrefFor('teen')} className="inline-flex items-center gap-1 text-[17px] text-accent hover:underline">
            <Smartphone className="size-5" aria-hidden /> Open Teen View <ChevronRight className="size-4" aria-hidden />
          </a>
        </div>

        <HeroDevices />
      </section>

      {/* Promise */}
      <section className="px-4 py-20 text-center">
        <h2 className="mx-auto max-w-3xl text-[32px] leading-tight font-semibold tracking-tight sm:text-[48px]">
          One currency. <span className="text-ink-3">Points.</span>
          <br />
          No levels. No badges. <span className="text-ink-3">No leaderboards.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[19px] text-ink-2">
          SKILLQuest only ever shows your teen their own progress. No rankings, no comparing with anyone else.
        </p>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-14 bg-canvas px-4 py-20">
        <div className="mx-auto max-w-[1024px]">
          <h2 className="text-center text-[32px] font-semibold tracking-tight sm:text-[48px]">How it works.</h2>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-3xl bg-white p-6 shadow-card">
                <div className={cx('flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white', s.tint)} aria-hidden>
                  {s.icon}
                </div>
                <p className="mt-5 text-[13px] font-semibold text-ink-3">Step {i + 1}</p>
                <h3 className="mt-1 text-[19px] leading-snug font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Two experiences */}
      <section className="px-4 py-20">
        <div className="mx-auto grid max-w-[1024px] gap-4 md:grid-cols-2">
          <a href={hrefFor('parent')} className="group rounded-[32px] bg-ink p-10 text-white transition hover:scale-[1.01]">
            <Monitor className="size-8 text-white/70" aria-hidden />
            <h3 className="mt-6 text-[32px] leading-tight font-semibold tracking-tight">For Parents.</h3>
            <p className="mt-3 text-[17px] text-white/70">
              A calm desktop dashboard. One job per screen, clear words on every button.
            </p>
            <span className="mt-8 inline-flex items-center gap-1 text-[17px] text-[#2997ff] group-hover:underline">
              Open Parent Dashboard <ChevronRight className="size-4" aria-hidden />
            </span>
          </a>
          <a href={hrefFor('teen')} className="group rounded-[32px] bg-gradient-to-br from-[#fff4e5] to-[#ffe3ec] p-10 transition hover:scale-[1.01]">
            <Smartphone className="size-8 text-orange-500" aria-hidden />
            <h3 className="mt-6 text-[32px] leading-tight font-semibold tracking-tight">For Teens, 8–15.</h3>
            <p className="mt-3 text-[17px] text-ink-2">
              Made for the phone. See today’s quests, snap a photo, and watch your points grow.
            </p>
            <span className="mt-8 inline-flex items-center gap-1 text-[17px] text-accent group-hover:underline">
              Open Teen View <ChevronRight className="size-4" aria-hidden />
            </span>
          </a>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-14 bg-canvas px-4 py-20">
        <div className="mx-auto max-w-[880px]">
          <h2 className="text-center text-[32px] font-semibold tracking-tight sm:text-[48px]">Simple plans.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <PlanCard
              name="Free"
              price="Rp0"
              period="forever"
              features={['1 Parent', '1 Teen', '3 active quest slots', 'Reward Shop', 'Photo proof kept for 1 month']}
            />
            <PlanCard
              name="Premium"
              price="Rp200.000"
              period="per year · or Rp20.833/month"
              highlight
              features={['Up to 5 Parents', 'Up to 10 Teens', '20 active quest slots', 'Reward Shop', 'Photo proof kept for 1 month']}
            />
          </div>
          <p className="mt-6 text-center text-[13px] text-ink-3">Pricing shown is a placeholder for this prototype.</p>
        </div>
      </section>

      <footer className="border-t border-black/5 px-4 py-10 text-center text-[12px] text-ink-3">
        <p>
          SKILLQuest is a web app. No downloads, works in any browser. Rewards are chosen and given by parents; SKILLQuest never ships physical items.
        </p>
      </footer>
    </div>
  );
}

function PlanCard({ name, price, period, features, highlight }: { name: string; price: string; period: string; features: string[]; highlight?: boolean }) {
  return (
    <div className={cx('rounded-[28px] bg-white p-8 shadow-card', highlight && 'ring-2 ring-accent')}>
      <div className="flex items-center justify-between">
        <h3 className="text-[24px] font-semibold tracking-tight">{name}</h3>
        {highlight && <span className="rounded-full bg-accent/10 px-3 py-1 text-[12px] font-semibold text-accent">For bigger families</span>}
      </div>
      <p className="mt-4 text-[36px] font-semibold tracking-tight">{price}</p>
      <p className="text-[14px] text-ink-2">{period}</p>
      <ul className="mt-6 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-[15px]">
            <ShieldCheck className="size-5 shrink-0 text-ok" aria-hidden /> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A laptop + phone mockup drawn in HTML to preview both experiences. */
function HeroDevices() {
  return (
    <div className="relative mx-auto mt-16 max-w-[900px] animate-rise [animation-delay:260ms]" aria-hidden>
      {/* Laptop */}
      <div className="mx-auto w-[88%] rounded-t-[22px] border-[10px] border-b-0 border-[#1d1d1f] bg-[#1d1d1f] shadow-lift">
        <div className="overflow-hidden rounded-t-[12px] bg-canvas text-left">
          <div className="flex h-7 items-center gap-1.5 bg-white/80 px-3">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex gap-3 p-3 sm:gap-4 sm:p-5">
            <div className="hidden w-36 shrink-0 space-y-1.5 rounded-2xl bg-white/70 p-3 sm:block">
              {['Quests', 'Review Proofs', 'Reward Delivery', 'Teen Progress'].map((t, i) => (
                <div key={t} className={cx('rounded-lg px-2 py-1.5 text-[11px] font-medium', i === 1 ? 'bg-accent text-white' : 'text-ink-2')}>
                  {t}
                </div>
              ))}
            </div>
            <div className="flex-1 space-y-3">
              <div className="text-[15px] font-semibold sm:text-[18px]">Review Proofs</div>
              <div className="flex gap-3 rounded-2xl bg-white p-3 shadow-card">
                <div className="aspect-[4/3] w-24 shrink-0 rounded-xl bg-gradient-to-br from-sky-200 to-violet-200 sm:w-36" />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="text-[12px] font-semibold sm:text-[14px]">Tidy your bedroom</div>
                    <div className="text-[10px] text-ink-2 sm:text-[12px]">Sent 40 min ago · 15 Points</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-ok px-2.5 py-1 text-[10px] font-medium text-white sm:text-[12px]">Approve (+15)</span>
                    <span className="rounded-full bg-bad px-2.5 py-1 text-[10px] font-medium text-white sm:text-[12px]">Reject with Reason</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white p-3 shadow-card">
                <div className="text-[12px] font-bold text-bad sm:text-[14px]">Read for 20 minutes</div>
                <span className="rounded-full bg-bad px-2 py-0.5 text-[9px] font-bold text-white uppercase">Missed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto h-3 w-full rounded-b-[14px] bg-gradient-to-b from-[#d2d2d7] to-[#a1a1a6]" />

      {/* Phone */}
      <div className="absolute -right-1 -bottom-6 w-[30%] max-w-[210px] rounded-[34px] border-[7px] border-[#1d1d1f] bg-[#1d1d1f] shadow-lift sm:right-2">
        <div className="overflow-hidden rounded-[27px] bg-canvas p-2.5 text-left sm:p-3">
          <div className="mx-auto mb-2 h-3.5 w-14 rounded-full bg-[#1d1d1f]" />
          <div className="text-[9px] font-medium text-ink-2 sm:text-[11px]">Hi, Sam</div>
          <div className="flex items-center gap-1 text-[16px] font-bold tracking-tight sm:text-[22px]">
            <StarIcon className="size-4 text-star sm:size-5" /> 45
            <span className="text-[10px] font-semibold text-ink-2 sm:text-[12px]">Points</span>
          </div>
          <div className="mt-2 space-y-1.5">
            <div className="rounded-xl bg-white p-2 shadow-card">
              <div className="text-[9px] font-semibold sm:text-[11px]">Make your bed</div>
              <div className="mt-1.5 rounded-full bg-accent py-1 text-center text-[8px] font-medium text-white sm:text-[10px]">Submit Photo Proof</div>
            </div>
            <div className="rounded-xl bg-white p-2 shadow-card">
              <div className="text-[9px] font-semibold sm:text-[11px]">🎬 Movie night pick</div>
              <div className="mt-1 text-[8px] font-medium text-ink-2 sm:text-[10px]">🔒 Locked — Need 15 more points</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
