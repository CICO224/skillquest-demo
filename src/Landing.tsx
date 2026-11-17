import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronRight, Monitor, Smartphone } from 'lucide-react';
import { Logo } from './components/Logo';
import { StarIcon } from './components/ui';
import { Caret, prefersReducedMotion, Reveal, TiltGlare, Typewriter, useTilt } from './components/motion';
import { DashLines, DiamondNumber, SectionTag, Sparkle, Terminal } from './components/brand';
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
      <NavShell>
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
            <a href={hrefFor('parent')} className="shine rounded-full bg-accent px-4 py-2 font-semibold text-white transition hover:bg-accent-hover active:scale-95">
              For Parents
            </a>
          </div>
        </nav>
      </NavShell>

      {/* Hero */}
      <section className="bg-pattern relative px-4 pt-14 pb-24 text-center sm:pt-20">
        <Sparkle twinkle className="absolute top-16 left-[8%] hidden size-7 text-sun sm:block" />
        <Sparkle twinkle className="absolute top-40 right-[10%] size-6 text-tangerine [animation-delay:0.8s]" />
        <Sparkle twinkle className="absolute top-28 right-[18%] hidden size-3 text-ink [animation-delay:1.6s] sm:block" />
        <Sparkle twinkle className="absolute top-[420px] left-[12%] hidden size-4 text-accent [animation-delay:1.1s] md:block" />
        <DashLines className="absolute top-24 -left-6 hidden w-48 text-accent/25 lg:flex" />
        <DashLines className="absolute top-[340px] -right-6 hidden w-56 text-accent/25 lg:flex" rows={4} />

        <h1 className="mx-auto max-w-4xl font-display text-[58px] leading-[0.95] tracking-[0.01em] uppercase sm:text-[104px]">
          <span className="block overflow-hidden pb-1">
            <span className="block animate-mask-up text-ink [animation-delay:80ms]">Turn chores</span>
          </span>
          <span className="relative mt-2 inline-block -rotate-1 animate-stamp rounded-2xl bg-accent px-5 pt-1 pb-2 text-white shadow-[8px_8px_0_var(--color-sun)] [animation-delay:420ms] sm:px-7">
            into quests
            <span className="absolute -bottom-4 left-8 h-3 w-24 origin-left animate-draw-x rounded-sm bg-tangerine [animation-delay:950ms]" aria-hidden />
          </span>
        </h1>

        <div className="mx-auto mt-10 inline-block animate-rise rotate-[0.6deg] rounded-2xl bg-surface px-6 py-4 text-left font-mono text-[16px] leading-relaxed shadow-card ring-1 ring-ink/10 [animation-delay:700ms] sm:text-[18px]">
          <Typewriter startDelay={1100} lines={TAGLINE} />
        </div>

        <div className="mt-9 flex animate-rise flex-col items-center justify-center gap-3 [animation-delay:850ms] sm:flex-row sm:gap-6">
          <a
            href={hrefFor('parent')}
            className="shine inline-flex h-12 items-center gap-2 rounded-full bg-accent px-7 text-[17px] font-semibold text-white shadow-[0_8px_24px_-6px_color-mix(in_srgb,var(--color-accent)_60%,transparent)] transition hover:-translate-y-0.5 hover:bg-accent-hover active:scale-[0.97]"
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
            <span className="absolute top-8 bottom-8 left-7 w-[2px] bg-tangerine/15" aria-hidden />
            <ScrollLine className="absolute top-8 bottom-8 left-7 w-[2px] bg-tangerine" />
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <div className="relative flex items-start gap-4 sm:gap-6">
                  <Reveal variant="pop" delay={i * 90 + 100}>
                    <DiamondNumber n={i + 1} tone={i % 2 ? 'yellow' : 'orange'} className="mt-3" />
                  </Reveal>
                  <Reveal variant="right" delay={i * 90} className="flex-1">
                    <div className="rounded-3xl bg-surface p-5 shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-lift sm:p-6">
                      <h3 className="font-display text-[26px] leading-none tracking-[0.02em] uppercase sm:text-[30px]">{s.title}</h3>
                      <p className="mt-2.5 text-[16px] leading-relaxed text-ink-2">{s.body}</p>
                    </div>
                  </Reveal>
                </div>
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
          <Reveal delay={100} variant="zoom">
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
                <Rule i={0}>
                  <b className="text-accent dark:text-sun">One currency only: points.</b> No XP, no levels.
                </Rule>
                <Rule i={1}>
                  Points are only added after you <b className="text-accent dark:text-sun">approve the photo</b>.
                </Rule>
                <Rule i={2} tone="red">
                  Missed a deadline? The quest turns red and says <b>“MISSED”</b>.
                </Rule>
                <Rule i={3}>
                  <b className="text-accent dark:text-sun">No leaderboards.</b> Kids only see their <b className="text-accent dark:text-sun">own progress</b>.
                </Rule>
                <Rule i={4}>
                  Connect your kid in seconds: click your <b className="text-accent dark:text-sun">profile picture</b> to show a <b className="text-accent dark:text-sun">QR code</b> for them
                  to scan.
                </Rule>
                <li className="pl-[26px] text-ink-3 dark:text-cream/50">
                  <Reveal variant="right" delay={650}>
                    {'>'} <Caret />
                  </Reveal>
                </li>
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
              <TiltLink
                href={hrefFor('parent')}
                className="bg-surface text-ink shadow-card ring-1 ring-ink/10 dark:bg-navy dark:text-cream dark:shadow-none dark:ring-white/5"
              >
                <Sparkle twinkle className="absolute top-8 right-8 size-8 text-tangerine dark:text-sun" />
                <Monitor className="size-8 text-ink-3 dark:text-cream/70" aria-hidden />
                <h3 className="mt-6 font-display text-[44px] leading-none tracking-[0.01em] uppercase">For Parents</h3>
                <p className="mt-4 text-[17px] text-ink-2 dark:text-cream/75">A calm desktop dashboard. One job per screen, clear words on every button.</p>
                <span className="mt-8 inline-flex items-center gap-1 text-[17px] font-medium text-accent dark:text-sun">
                  Open Parent Dashboard <ChevronRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
                </span>
              </TiltLink>
            </Reveal>
            <Reveal delay={120}>
              <TiltLink href={hrefFor('teen')} className="bg-accent text-white">
                <DashLines className="absolute top-10 right-6 w-32 text-white/30" />
                <Smartphone className="size-8 text-white/80" aria-hidden />
                <h3 className="mt-6 font-display text-[44px] leading-none tracking-[0.01em] uppercase">For Teens, 8–15</h3>
                <p className="mt-4 text-[17px] text-white/85">Made for the phone. See today’s quests, snap a photo, and watch your points grow.</p>
                <span className="mt-8 inline-flex items-center gap-1 text-[17px] font-medium text-sun">
                  Open Teen View <ChevronRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
                </span>
              </TiltLink>
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
              <div className="flex flex-col rounded-[28px] bg-surface p-8 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                <h3 className="font-display text-[48px] leading-none uppercase">Free</h3>
                <ul className="mt-5 space-y-2 font-mono text-[16px]">
                  <PlanLine n="1">parent</PlanLine>
                  <PlanLine n="1">teen</PlanLine>
                  <PlanLine n="3">quest slots</PlanLine>
                </ul>
                <p className="mt-auto pt-8 text-[28px] font-bold tracking-tight">Rp0</p>
                <p className="text-[14px] text-ink-2">forever</p>
              </div>
              <div className="shimmer relative flex flex-col rounded-[28px] bg-sun p-8 text-navy shadow-[8px_8px_0_var(--color-navy)] transition duration-300 hover:-translate-y-1 hover:shadow-[12px_12px_0_var(--color-navy)] dark:shadow-[8px_8px_0_var(--color-tangerine)] dark:hover:shadow-[12px_12px_0_var(--color-tangerine)]">
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
        <Reveal variant="zoom">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-3 rounded-2xl bg-tangerine px-6 py-4 text-center font-mono text-[15px] font-bold text-white sm:text-[17px]">
          <Sparkle className="size-5 shrink-0 animate-spin-slow text-sun" />
          <span>
            SKILLQuest never supplies rewards — <span className="text-navy">you do.</span>
          </span>
        </div>
        </Reveal>
        <p className="mt-6 text-center text-[12px] text-ink-3">A web app. No downloads, works in any browser.</p>
      </footer>
    </div>
  );
}

function Rule({ children, tone, i }: { children: ReactNode; tone?: 'red'; i: number }) {
  return (
    <li>
      <Reveal variant="right" delay={i * 120} className={cx('flex gap-3', tone === 'red' && 'text-bad dark:text-[#ff8a80]')}>
        <Sparkle className={cx('mt-1.5 size-3.5 shrink-0', tone === 'red' ? 'text-bad dark:text-[#ff8a80]' : 'text-tangerine dark:text-sun')} />
        <span>{children}</span>
      </Reveal>
    </li>
  );
}

const HOT = 'font-bold text-warn';
const TAGLINE = [
  [{ text: 'You set the ' }, { text: 'quests', className: HOT }, { text: '.' }],
  [{ text: 'They earn the ' }, { text: 'points', className: HOT }, { text: '.' }],
  [{ text: 'You hand over the ' }, { text: 'reward', className: HOT }, { text: '.' }],
];

/** Sticky nav that gains a shadow once scrolled, with a reading-progress bar. */
function NavShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <header
      className={cx(
        'glass sticky top-0 z-40 border-b transition-[box-shadow,border-color] duration-300',
        scrolled ? 'border-separator shadow-[0_6px_24px_-12px_rgb(16_35_63/0.25)]' : 'border-transparent',
      )}
    >
      {children}
      <span
        ref={barRef}
        aria-hidden
        className="absolute inset-x-0 -bottom-px h-[3px] origin-left bg-gradient-to-r from-tangerine via-sun to-accent"
        style={{ transform: 'scaleX(0)' }}
      />
    </header>
  );
}

/** A line that fills in as its parent scrolls through the viewport. */
function ScrollLine({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (prefersReducedMotion()) {
      el.style.transform = 'scaleY(1)';
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = parent.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.7 - r.top) / r.height));
      el.style.transform = `scaleY(${p})`;
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
  return <span ref={ref} aria-hidden className={cx('origin-top', className)} style={{ transform: 'scaleY(0)' }} />;
}

/** Card link that tilts toward the mouse with a soft glare. */
function TiltLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const ref = useTilt<HTMLAnchorElement>(7);
  return (
    <a
      ref={ref}
      href={href}
      className={cx(
        'group relative block h-full overflow-hidden rounded-[32px] p-10 transition-[transform,box-shadow] duration-200 ease-out will-change-transform hover:shadow-lift',
        className,
      )}
    >
      <TiltGlare />
      {children}
    </a>
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
