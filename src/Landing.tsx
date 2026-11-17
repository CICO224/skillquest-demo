import { useEffect, useRef, type ReactNode } from 'react';
import { ChevronRight, Monitor, Smartphone } from 'lucide-react';
import { Logo } from './components/Logo';
import { StarIcon } from './components/ui';
import { prefersReducedMotion, Reveal } from './components/motion';
import { DashLines, DiamondNumber, Eyebrow, SectionTag, Sparkle, Terminal } from './components/brand';
import { ThemeToggle } from './lib/theme';
import { hrefFor } from './lib/router';
import { cx } from './lib/utils';

/** Orange highlight for key words, like the banner. */
const Hot = ({ children }: { children: ReactNode }) => <span className="font-bold text-warn">{children}</span>;

const STEPS: { title: string; body: ReactNode }[] = [
  {
    title: 'Create a quest',
    body: (
      <>
        Title, category, <Hot>points</Hot>, <Hot>due date</Hot>, and <Hot>repeat</Hot> (Daily, Weekly or Monthly). One screen, no setup.
      </>
    ),
  },
  {
    title: 'They complete it',
    body: (
      <>
        Your kid does the task and sends <Hot>one photo</Hot> as proof, right from their phone browser.
      </>
    ),
  },
  {
    title: 'You review the photo',
    body: (
      <>
        <Hot>Approve</Hot> to add points, or <Hot>Reject</Hot> with a typed <Hot>reason</Hot> so they can try again.
      </>
    ),
  },
  {
    title: 'They spend points',
    body: (
      <>
        On <Hot>rewards</Hot> you create. You mark it <Hot>“Delivered”</Hot> when you hand it over in real life.
      </>
    ),
  },
];

export function Landing() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-canvas">
      {/* Nav */}
      <header className="glass sticky top-0 z-40 border-b border-separator">
        <nav className="mx-auto flex h-14 max-w-[1080px] items-center justify-between gap-2 px-4 sm:px-6">
          <a href={hrefFor('home')} aria-label="SKILLQuest home">
            <Logo />
          </a>
          <div className="flex items-center gap-1 text-[13px] sm:gap-3">
            <a href="#how" className="hidden rounded-full px-3 py-1.5 text-ink-2 hover:text-ink md:inline">How it works</a>
            <a href="#rules" className="hidden rounded-full px-3 py-1.5 text-ink-2 hover:text-ink md:inline">Rules</a>
            <a href="#pricing" className="hidden rounded-full px-3 py-1.5 text-ink-2 hover:text-ink md:inline">Plans</a>
            <a href={hrefFor('teen')} className="hidden rounded-full px-3 py-1.5 text-ink-2 hover:text-ink sm:inline">For Teens</a>
            <ThemeToggle className="h-9 w-9" />
            <a href={hrefFor('parent')} className="rounded-full bg-accent px-4 py-2 font-semibold text-white hover:bg-accent-hover">
              For Parents
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-pattern relative px-4 pt-14 pb-24 text-center sm:pt-20">
        <Sparkle twinkle className="absolute top-16 left-[8%] hidden size-7 text-sun sm:block" />
        <Sparkle twinkle className="absolute top-40 right-[10%] size-6 text-tangerine [animation-delay:0.8s]" />
        <Sparkle className="absolute top-28 right-[18%] hidden size-3 text-ink sm:block" />
        <DashLines className="absolute top-24 -left-6 hidden w-48 text-accent/25 lg:flex" />
        <DashLines className="absolute top-[340px] -right-6 hidden w-56 text-accent/25 lg:flex" rows={4} />

        <div className="animate-rise">
          <Eyebrow>Family quest board · Ages 8–15</Eyebrow>
        </div>
        <h1 className="mx-auto mt-5 max-w-4xl animate-rise font-display text-[58px] leading-[0.95] tracking-[0.01em] uppercase [animation-delay:60ms] sm:text-[104px]">
          <span className="block text-ink">Turn chores</span>
          <span className="relative mt-2 inline-block -rotate-1 rounded-2xl bg-accent px-5 pt-1 pb-2 text-white shadow-[8px_8px_0_var(--color-sun)] sm:px-7">
            into quests
            <span className="absolute -bottom-4 left-8 h-3 w-24 rounded-sm bg-tangerine" aria-hidden />
          </span>
        </h1>

        <div className="mx-auto mt-10 inline-block animate-rise rotate-[0.6deg] rounded-2xl bg-surface px-6 py-4 text-left font-mono text-[16px] leading-relaxed shadow-card ring-1 ring-ink/10 [animation-delay:140ms] sm:text-[18px]">
          You set the <Hot>quests</Hot>.
          <br />
          They earn the <Hot>points</Hot>.
          <br />
          You hand over the <Hot>reward</Hot>.
        </div>

        <div className="mt-9 flex animate-rise flex-col items-center justify-center gap-3 [animation-delay:200ms] sm:flex-row sm:gap-6">
          <a
            href={hrefFor('parent')}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-7 text-[17px] font-semibold text-white transition hover:bg-accent-hover active:scale-[0.97]"
          >
            <Monitor className="size-5" aria-hidden /> Open Parent Dashboard
          </a>
          <a href={hrefFor('teen')} className="inline-flex items-center gap-1 text-[17px] font-medium text-accent hover:underline">
            <Smartphone className="size-5" aria-hidden /> Open Teen View <ChevronRight className="size-4" aria-hidden />
          </a>
        </div>

        <HeroDevices />
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-16 px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <SectionTag>How it works</SectionTag>
          </Reveal>
          <ol className="relative mt-10 space-y-4">
            <span className="absolute top-8 bottom-8 left-7 w-[2px] bg-tangerine/60" aria-hidden />
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 90}>
                  <div className="relative flex items-start gap-4 sm:gap-6">
                    <DiamondNumber n={i + 1} tone={i % 2 ? 'yellow' : 'orange'} className="mt-3" />
                    <div className="flex-1 rounded-3xl bg-surface p-5 shadow-card sm:p-6">
                      <h3 className="font-display text-[26px] leading-none tracking-[0.02em] uppercase sm:text-[30px]">{s.title}</h3>
                      <p className="mt-2.5 text-[16px] leading-relaxed text-ink-2">{s.body}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Simple rules */}
      <section id="rules" className="bg-pattern scroll-mt-16 px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <SectionTag>Simple rules</SectionTag>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-8 font-display text-[40px] leading-[1] tracking-[0.01em] uppercase sm:text-[56px]">
              <span className="whitespace-nowrap">One currency.</span> <span className="whitespace-nowrap text-accent">Points.</span>
              <br />
              <span className="whitespace-nowrap text-ink-3">No levels. No badges.</span>{' '}
              <span className="whitespace-nowrap text-ink-3">No leaderboards.</span>
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <Terminal title="simple_rules.txt" className="mt-8">
              <ul className="space-y-3">
                <Rule>
                  <b className="text-sun">One currency only: points.</b> No XP, no levels.
                </Rule>
                <Rule>
                  Points are only added after you <b className="text-sun">approve the photo</b>.
                </Rule>
                <Rule tone="red">
                  Missed a deadline? The quest turns red and says <b>“MISSED”</b>.
                </Rule>
                <Rule>
                  <b className="text-sun">No leaderboards.</b> Kids only see their <b className="text-sun">own progress</b>.
                </Rule>
                <Rule>
                  Connect your kid in seconds: click your <b className="text-sun">profile picture</b> to show a <b className="text-sun">QR code</b> for them
                  to scan.
                </Rule>
              </ul>
            </Terminal>
          </Reveal>
        </div>
      </section>

      {/* Two experiences */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-[1080px]">
          <Reveal>
            <SectionTag>Two views</SectionTag>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Reveal>
              <a
                href={hrefFor('parent')}
                className="group relative block h-full overflow-hidden rounded-[32px] bg-navy p-10 text-cream ring-1 ring-white/5 transition hover:-translate-y-1"
              >
                <Sparkle className="absolute top-8 right-8 size-8 text-sun" />
                <Monitor className="size-8 text-cream/70" aria-hidden />
                <h3 className="mt-6 font-display text-[44px] leading-none tracking-[0.01em] uppercase">For Parents</h3>
                <p className="mt-4 text-[17px] text-cream/75">A calm desktop dashboard. One job per screen, clear words on every button.</p>
                <span className="mt-8 inline-flex items-center gap-1 text-[17px] font-medium text-sun group-hover:underline">
                  Open Parent Dashboard <ChevronRight className="size-4" aria-hidden />
                </span>
              </a>
            </Reveal>
            <Reveal delay={120}>
              <a
                href={hrefFor('teen')}
                className="group relative block h-full overflow-hidden rounded-[32px] bg-accent p-10 text-white transition hover:-translate-y-1"
              >
                <DashLines className="absolute top-10 right-6 w-32 text-white/30" />
                <Smartphone className="size-8 text-white/80" aria-hidden />
                <h3 className="mt-6 font-display text-[44px] leading-none tracking-[0.01em] uppercase">For Teens, 8–15</h3>
                <p className="mt-4 text-[17px] text-white/85">Made for the phone. See today’s quests, snap a photo, and watch your points grow.</p>
                <span className="mt-8 inline-flex items-center gap-1 text-[17px] font-medium text-sun group-hover:underline">
                  Open Teen View <ChevronRight className="size-4" aria-hidden />
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="pricing" className="bg-pattern scroll-mt-16 px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <SectionTag>Plans</SectionTag>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="flex flex-col rounded-[28px] bg-surface p-8 shadow-card">
                <h3 className="font-display text-[48px] leading-none uppercase">Free</h3>
                <ul className="mt-5 space-y-2 font-mono text-[16px]">
                  <PlanLine n="1">parent</PlanLine>
                  <PlanLine n="1">teen</PlanLine>
                  <PlanLine n="3">quest slots</PlanLine>
                </ul>
                <p className="mt-auto pt-8 text-[28px] font-bold tracking-tight">Rp0</p>
                <p className="text-[14px] text-ink-2">forever</p>
              </div>
              <div className="relative flex flex-col rounded-[28px] bg-sun p-8 text-navy shadow-[8px_8px_0_var(--color-navy)] dark:shadow-[8px_8px_0_var(--color-tangerine)]">
                <Sparkle twinkle className="absolute top-7 right-7 size-7 text-tangerine" />
                <h3 className="font-display text-[48px] leading-none uppercase">Premium</h3>
                <ul className="mt-5 space-y-2 font-mono text-[16px]">
                  <PlanLine n="5" dark>
                    parents
                  </PlanLine>
                  <PlanLine n="10" dark>
                    teens
                  </PlanLine>
                  <PlanLine n="20" dark>
                    quest slots
                  </PlanLine>
                </ul>
                <p className="mt-auto pt-8 text-[28px] font-bold tracking-tight">Rp200,000/year</p>
                <p className="text-[14px] font-medium">or Rp20,833/month</p>
              </div>
            </div>
            <p className="mt-6 text-center font-mono text-[12px] text-ink-3">Pricing shown is a placeholder for this prototype.</p>
          </Reveal>
        </div>
      </section>

      <footer className="px-4 pt-4 pb-12">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-3 rounded-2xl bg-tangerine px-6 py-4 text-center font-mono text-[15px] font-bold text-white sm:text-[17px]">
          <Sparkle className="size-5 shrink-0 text-sun" />
          <span>
            SKILLQuest never supplies rewards — <span className="text-navy">you do.</span>
          </span>
        </div>
        <p className="mt-6 text-center text-[12px] text-ink-3">A web app. No downloads, works in any browser.</p>
      </footer>
    </div>
  );
}

function Rule({ children, tone }: { children: ReactNode; tone?: 'red' }) {
  return (
    <li className={cx('flex gap-3', tone === 'red' && 'text-[#ff8a80]')}>
      <Sparkle className={cx('mt-1.5 size-3.5 shrink-0', tone === 'red' ? 'text-[#ff8a80]' : 'text-sun')} />
      <span>{children}</span>
    </li>
  );
}

function PlanLine({ n, children, dark }: { n: string; children: ReactNode; dark?: boolean }) {
  return (
    <li>
      {dark ? 'Up to ' : ''}
      <b className={dark ? 'text-accent' : 'text-warn'}>{n}</b> {children}
    </li>
  );
}

/** A laptop + phone mockup drawn in HTML to preview both experiences. */
function HeroDevices() {
  const laptopRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  // Gentle parallax: the laptop settles and the phone floats up as you scroll.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, window.scrollY / 700);
      if (laptopRef.current) laptopRef.current.style.transform = `translateY(${p * -24}px) scale(${1 + p * 0.03})`;
      if (phoneRef.current) phoneRef.current.style.transform = `translateY(${p * -90}px) rotate(${p * -3}deg)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative mx-auto mt-16 max-w-[900px] animate-rise [animation-delay:260ms]" aria-hidden>
      <div ref={laptopRef} className="will-change-transform">
        <div className="mx-auto w-[88%] rounded-t-[22px] border-[10px] border-b-0 border-navy bg-navy shadow-lift dark:border-[#050e1c] dark:bg-[#050e1c]">
          <div className="overflow-hidden rounded-t-[12px] bg-canvas text-left">
            <div className="flex h-7 items-center gap-1.5 bg-surface/80 px-3">
              <span className="size-2.5 rounded-full bg-tangerine" />
              <span className="size-2.5 rounded-full bg-sun" />
              <span className="size-2.5 rounded-full bg-ink/20" />
            </div>
            <div className="flex gap-3 p-3 sm:gap-4 sm:p-5">
              <div className="hidden w-36 shrink-0 space-y-1.5 rounded-2xl bg-surface/70 p-3 sm:block">
                {['Quests', 'Review Proofs', 'Reward Delivery', 'Teen Progress'].map((t, i) => (
                  <div key={t} className={cx('rounded-lg px-2 py-1.5 text-[11px] font-medium', i === 1 ? 'bg-accent text-white' : 'text-ink-2')}>
                    {t}
                  </div>
                ))}
              </div>
              <div className="flex-1 space-y-3">
                <div className="font-display text-[16px] tracking-wide uppercase sm:text-[22px]">Review Proofs</div>
                <div className="flex gap-3 rounded-2xl bg-surface p-3 shadow-card">
                  <div className="aspect-[4/3] w-24 shrink-0 rounded-xl bg-gradient-to-br from-sky-200 to-amber-100 sm:w-36" />
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
                <div className="flex items-center gap-2 rounded-2xl bg-surface p-3 shadow-card">
                  <div className="text-[12px] font-bold text-bad sm:text-[14px]">Read for 20 minutes</div>
                  <span className="rounded-full bg-bad px-2 py-0.5 text-[9px] font-bold text-white uppercase">Missed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto h-3 w-full rounded-b-[14px] bg-gradient-to-b from-[#c9c3b4] to-[#9a9384] dark:from-[#2b4670] dark:to-[#1a2f50]" />
      </div>

      {/* Phone */}
      <div
        ref={phoneRef}
        className="absolute -right-1 -bottom-6 w-[30%] max-w-[210px] rounded-[34px] border-[7px] border-navy bg-navy shadow-lift will-change-transform sm:right-2 dark:border-[#050e1c] dark:bg-[#050e1c]"
      >
        <div className="overflow-hidden rounded-[27px] bg-canvas p-2.5 text-left sm:p-3">
          <div className="mx-auto mb-2 h-3.5 w-14 rounded-full bg-navy dark:bg-[#050e1c]" />
          <div className="text-[9px] font-medium text-ink-2 sm:text-[11px]">Hi, Sam</div>
          <div className="flex items-center gap-1 text-[16px] font-bold tracking-tight sm:text-[22px]">
            <StarIcon className="size-4 text-star sm:size-5" /> 45
            <span className="text-[10px] font-semibold text-ink-2 sm:text-[12px]">Points</span>
          </div>
          <div className="mt-2 space-y-1.5">
            <div className="rounded-xl bg-surface p-2 shadow-card">
              <div className="text-[9px] font-semibold sm:text-[11px]">Make your bed</div>
              <div className="mt-1.5 rounded-full bg-accent py-1 text-center text-[8px] font-medium text-white sm:text-[10px]">Submit Photo Proof</div>
            </div>
            <div className="rounded-xl bg-surface p-2 shadow-card">
              <div className="text-[9px] font-semibold sm:text-[11px]">🎬 Movie night pick</div>
              <div className="mt-1 text-[8px] font-medium text-ink-2 sm:text-[10px]">🔒 Locked — Need 15 more points</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
