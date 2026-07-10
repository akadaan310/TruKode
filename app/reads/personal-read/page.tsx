import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

const REVEALS = [
  ["Your core personality & identity", "The through-line of how you tend to think, feel, and show up."],
  ["Your natural strengths", "The capacities that may come most easily to you."],
  ["Your blind spots", "The tendencies that can quietly work against you."],
  ["Your decision-making style", "How you're inclined to weigh choices and move."],
  ["Key behavioral patterns", "Two or three recurring patterns your blueprint may reveal."],
];

const INSIDE = [
  ["01", "Your Personal Data", "The details your blueprint is built from."],
  ["02", "Your Core Numbers", "The foundational numbers that anchor your Read."],
  ["03", "Your Personal Profile", "A cohesive portrait of who you are at your core."],
  ["04", "Key Patterns", "The recurring themes that tend to shape your days."],
  ["05", "Your Guidance", "Gentle direction for working with your blueprint."],
  ["06", "Your North Star", "The orienting principle to return to."],
];

const WHO = [
  ["01", "The Curious Beginner", "New to all this — and quietly intrigued by what it might reveal."],
  ["02", "The Natural Seeker", "You've always sensed there's more beneath the surface of who you are."],
  ["03", "The Explorer", "You collect frameworks and ideas, hungry to understand yourself from every angle."],
  ["04", "At a Crossroads", "Standing between chapters, ready for clarity on what comes next."],
];

export default function PersonalReadPage() {
  return (
    <div className="bg-ink">
      <Nav />

      {/* ===================== PRODUCT HERO ===================== */}
      <section id="top" className="relative overflow-hidden bg-ink">
        <div className="pointer-events-none absolute left-[62%] top-[-20%] h-[min(760px,130vw)] w-[min(760px,130vw)] -translate-x-1/2 animate-[tkGlow_9s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(216,180,120,0.18),rgba(216,180,120,0.05)_40%,transparent_64%)]" />
        <div className="relative mx-auto max-w-[1160px] px-[clamp(22px,5vw,56px)] pb-[clamp(72px,11vh,120px)] pt-[clamp(40px,6vh,64px)]">
          <Reveal className="mb-[clamp(40px,7vh,72px)] flex items-center gap-[9px] font-sans text-[13px] text-light-soft">
            <Link
              href="/products"
              className="text-light-soft no-underline transition-colors duration-[250ms] hover:text-gold"
            >
              The Products
            </Link>
            <span className="opacity-50">→</span>
            <span className="text-gold">Personal Read™</span>
          </Reveal>

          <div className="flex flex-wrap items-center gap-[clamp(36px,6vw,72px)]">
            <div className="flex-[1_1_360px] min-w-[min(100%,360px)]">
              <Reveal className="mb-[24px] inline-flex items-center gap-2 rounded-full border border-gold/40 px-[14px] py-[6px] font-sans text-[10.5px] font-semibold uppercase tracking-[0.16em] text-gold">
                <span className="h-[6px] w-[6px] rounded-full bg-gold" />
                Best place to start
              </Reveal>
              <Reveal
                as="h1"
                delay={0.08}
                className="m-0 font-serif text-[clamp(42px,8vw,76px)] font-medium leading-[1.02] tracking-[-0.014em] text-light"
              >
                Personal Read™
              </Reveal>
              <Reveal
                as="p"
                delay={0.14}
                className="mt-[22px] max-w-[460px] text-pretty font-serif text-[clamp(20px,3.2vw,27px)] italic leading-[1.32] text-light-soft"
              >
                Who you are at your core — your personality, strengths, blind
                spots, and decision style.
              </Reveal>

              <Reveal delay={0.2} className="mt-[34px] flex items-center gap-[20px]">
                <span className="font-serif text-[clamp(38px,6vw,52px)] font-semibold leading-none text-gold">
                  $29
                </span>
                <span className="h-[38px] w-px bg-gold/30" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-light-soft">
                    Length
                  </span>
                  <span className="text-[16px] font-medium text-light">
                    2 pages
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.26} className="mt-[38px] flex flex-wrap gap-[14px]">
                <Link
                  href="/intake"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-gold px-[32px] py-[16px] font-sans text-[15px] font-semibold text-[#1b1710] no-underline transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(216,180,120,0.32)]"
                >
                  Get your Personal Read
                </Link>
                <Link
                  href="#inside"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-light/[0.26] bg-transparent px-[28px] py-[16px] font-sans text-[15px] font-medium text-light no-underline transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  See what&apos;s inside
                </Link>
              </Reveal>
            </div>

            <Reveal delay={0.2} className="flex flex-[0_1_320px] min-w-[min(100%,260px)] justify-center">
              <div className="relative flex aspect-[3/4] w-[min(300px,82vw)] flex-col rounded-lg border border-gold/30 bg-[linear-gradient(160deg,#201b14,#13100c)] px-[30px] py-[34px] shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
                <div className="font-sans text-[9.5px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Human Decode™
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <div className="font-serif text-[34px] font-medium leading-[1.05] text-light">
                    Personal
                    <br />
                    Read™
                  </div>
                  <div className="my-[20px] h-px w-[40px] bg-gold" />
                  <div className="font-serif text-[15px] italic text-light-soft">
                    Prepared for you.
                  </div>
                </div>
                <div className="flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.12em] text-light-soft">
                  <span>The Blueprint System™</span>
                  <span>2 pp</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== WHAT THIS READ REVEALS ===================== */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1000px] px-[clamp(22px,5vw,56px)] py-[clamp(80px,13vh,150px)]">
          <div className="max-w-[640px]">
            <Reveal className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold-strong">
              What This Read Reveals
            </Reveal>
            <Reveal
              as="h2"
              delay={0.08}
              className="m-0 text-balance font-serif text-[clamp(31px,5.4vw,54px)] font-medium leading-[1.06] tracking-[-0.012em] text-dark"
            >
              A clear portrait of who you are at your core.
            </Reveal>
            <Reveal
              as="p"
              delay={0.14}
              className="mt-[20px] text-[clamp(15px,2vw,17px)] leading-[1.65] text-dark-soft"
            >
              Drawn from your own data — framed as tendencies and possibilities
              to explore, never fixed verdicts.
            </Reveal>
          </div>

          <Reveal
            delay={0.18}
            className="mt-[50px] grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[14px]"
          >
            {REVEALS.map(([title, copy]) => (
              <div
                key={title}
                className="flex gap-[16px] rounded-[10px] border border-dark/[0.08] bg-paper p-[24px]"
              >
                <span className="mt-[8px] h-[9px] w-[9px] flex-none rounded-full bg-gold" />
                <div>
                  <h3 className="m-0 font-serif text-[21px] font-semibold text-dark">
                    {title}
                  </h3>
                  <p className="mt-[7px] text-[14.5px] leading-[1.55] text-dark-soft">
                    {copy}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===================== WHAT'S INSIDE ===================== */}
      <section id="inside" className="bg-ink">
        <div className="mx-auto max-w-[920px] px-[clamp(22px,5vw,56px)] py-[clamp(80px,13vh,150px)]">
          <div className="mx-auto max-w-[620px] text-center">
            <Reveal className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold">
              What&apos;s Inside
            </Reveal>
            <Reveal
              as="h2"
              delay={0.08}
              className="m-0 font-serif text-[clamp(31px,5.4vw,54px)] font-medium leading-[1.06] tracking-[-0.012em] text-light"
            >
              Exactly what you&apos;ll receive.
            </Reveal>
            <Reveal
              as="p"
              delay={0.14}
              className="mx-auto mt-[20px] max-w-[480px] text-[clamp(15px,2vw,17px)] leading-[1.65] text-light-soft"
            >
              Six considered sections, building from your raw data to a single
              orienting truth.
            </Reveal>
          </div>

          <Reveal delay={0.16} className="mt-[48px] flex flex-col">
            {INSIDE.map(([num, title, copy], i) => (
              <div
                key={num}
                className={`flex items-baseline gap-[clamp(18px,4vw,34px)] border-t border-gold/[0.14] py-[22px] ${
                  i === INSIDE.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="min-w-[38px] flex-none font-serif text-[clamp(20px,3vw,26px)] font-normal text-gold">
                  {num}
                </span>
                <div>
                  <h3 className="m-0 font-serif text-[clamp(21px,3vw,26px)] font-semibold text-light">
                    {title}
                  </h3>
                  <p className="mt-[6px] text-[14.5px] leading-[1.55] text-light-soft">
                    {copy}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===================== WHO IT'S FOR ===================== */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1080px] px-[clamp(22px,5vw,56px)] py-[clamp(80px,13vh,150px)]">
          <div className="mx-auto max-w-[640px] text-center">
            <Reveal className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold-strong">
              Who It&apos;s For
            </Reveal>
            <Reveal
              as="h2"
              delay={0.08}
              className="m-0 font-serif text-[clamp(31px,5.4vw,54px)] font-medium leading-[1.06] tracking-[-0.012em] text-dark"
            >
              The best place to start.
            </Reveal>
            <Reveal
              as="p"
              delay={0.14}
              className="mx-auto mt-[20px] max-w-[520px] text-[clamp(15px,2vw,17px)] leading-[1.65] text-dark-soft"
            >
              If you recognize yourself in any of these, the Personal Read is
              your foundation.
            </Reveal>
          </div>

          <Reveal
            delay={0.16}
            className="mt-[48px] grid grid-cols-[repeat(auto-fit,minmax(232px,1fr))] gap-[16px]"
          >
            {WHO.map(([num, title, copy]) => (
              <div
                key={num}
                className="rounded-[10px] border border-dark/[0.08] bg-paper p-[24px]"
              >
                <div className="mb-[12px] font-mono text-[11px] tracking-[0.1em] text-gold-strong">
                  {num}
                </div>
                <h3 className="m-0 font-serif text-[22px] font-semibold text-dark">
                  {title}
                </h3>
                <p className="mt-[8px] text-[14.5px] leading-[1.55] text-dark-soft">
                  {copy}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===================== SAMPLE / PREVIEW ===================== */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[900px] px-[clamp(22px,5vw,56px)] py-[clamp(80px,13vh,150px)]">
          <div className="mx-auto max-w-[600px] text-center">
            <Reveal className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold">
              A Glimpse Inside
            </Reveal>
            <Reveal
              as="h2"
              delay={0.08}
              className="m-0 font-serif text-[clamp(31px,5.4vw,54px)] font-medium leading-[1.06] tracking-[-0.012em] text-light"
            >
              The depth, before you open it.
            </Reveal>
          </div>

          <Reveal
            delay={0.14}
            className="relative mt-[46px] overflow-hidden rounded-[10px] border border-gold/20 bg-ink-soft"
          >
            <div className="p-[clamp(30px,5vw,52px)]">
              <div className="font-sans text-[10px] uppercase tracking-[0.18em] text-gold">
                Excerpt · Your Personal Profile
              </div>
              <h3 className="mt-[14px] font-serif text-[clamp(24px,3.6vw,32px)] font-medium leading-[1.15] text-light">
                At your core
              </h3>
              <p className="mt-[18px] max-w-[620px] text-[clamp(15px,2vw,17px)] leading-[1.75] text-light-soft">
                Your blueprint may lean toward a quiet intensity — a tendency to
                observe before you act, and to feel things more deeply than you
                tend to let on. You&apos;re likely drawn to meaning over noise,
                and your instinct is often to understand a thing fully before
                committing to it.
              </p>
              <p className="mt-[14px] max-w-[620px] select-none text-[clamp(15px,2vw,17px)] leading-[1.75] text-light-soft opacity-60 blur-[5px]">
                This same depth can become a blind spot: a pattern of holding
                back until certainty arrives, which may quietly delay decisions
                that would benefit from your involvement. Your decision-making
                style appears to favor reflection over reaction, weighing
                consequences others might overlook — a strength that, left
                unchecked, can read as hesitation.
              </p>
              <p className="mt-[14px] max-w-[620px] select-none text-[clamp(15px,2vw,17px)] leading-[1.75] text-light-soft opacity-45 blur-[6px]">
                Across your patterns, a recurring theme of self-reliance
                emerges, paired with a deep, often understated need for
                resonance with the people and work you choose.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex h-[62%] flex-col items-center justify-end gap-[14px] bg-[linear-gradient(transparent,var(--ink-soft)_72%)] pb-[34px]">
              <span className="inline-flex items-center gap-[9px] rounded-full border border-gold/40 bg-gold/[0.14] px-[18px] py-[9px] text-[13px] font-medium text-light">
                <span className="h-[6px] w-[6px] rounded-full bg-gold" />
                Your full Read is unlocked after purchase
              </span>
              <Link
                href="/intake"
                className="inline-flex items-center justify-center rounded-full bg-gold px-[28px] py-[14px] font-sans text-[14.5px] font-semibold text-[#1b1710] no-underline transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(216,180,120,0.3)]"
              >
                Get your Personal Read — $29
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== THE BOUNDARY ===================== */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[840px] px-[clamp(22px,5vw,56px)] py-[clamp(72px,11vh,130px)] text-center">
          <Reveal className="mb-[24px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold-strong">
            Clarity, Not Labels
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="m-0 text-balance font-serif text-[clamp(24px,4.2vw,38px)] font-normal leading-[1.22] tracking-[-0.008em] text-dark"
          >
            This isn&apos;t therapy, a diagnosis, or a personality quiz. It&apos;s
            a <span className="text-gold-strong">personal foundation</span> —
            built from your own data, written in possibilities to explore rather
            than labels to live inside.
          </Reveal>
        </div>
      </section>

      {/* ===================== PAIRS WELL WITH ===================== */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[920px] px-[clamp(22px,5vw,56px)] py-[clamp(72px,11vh,130px)]">
          <Reveal className="mb-[26px] text-center font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold-strong">
            Pairs Well With
          </Reveal>
          <Reveal
            delay={0.1}
            className="flex flex-wrap items-center gap-[clamp(24px,4vw,44px)] rounded-[14px] border border-dark/10 bg-cream p-[clamp(28px,4vw,44px)]"
          >
            <div className="flex-[1_1_280px]">
              <div className="mb-[10px] font-sans text-[10.5px] uppercase tracking-[0.14em] text-gold-strong">
                The natural next step
              </div>
              <h3 className="m-0 font-serif text-[clamp(27px,4.2vw,38px)] font-semibold leading-[1.05] text-dark">
                Life Purpose Read™
              </h3>
              <p className="mt-[12px] max-w-[420px] text-[15.5px] leading-[1.6] text-dark-soft">
                Once you know who you are at your core, find where it&apos;s all
                pointing — your soul direction and the mission beneath your days.
              </p>
            </div>
            <div className="flex flex-col items-start gap-[16px]">
              <span className="font-serif text-[34px] font-semibold text-gold-strong">
                $49
              </span>
              <Link
                href="/reads/life-purpose-read"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-dark/25 bg-transparent px-[26px] py-[14px] font-sans text-[14.5px] font-semibold text-dark no-underline transition-colors duration-300 hover:border-gold-strong hover:text-gold-strong"
              >
                Explore this Read →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== NORTH STAR CTA ===================== */}
      <section id="get" className="relative overflow-hidden bg-ink">
        <div className="pointer-events-none absolute bottom-[-40%] left-1/2 h-[min(820px,150vw)] w-[min(820px,150vw)] -translate-x-1/2 animate-[tkGlow_10s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(216,180,120,0.18),rgba(216,180,120,0.05)_40%,transparent_64%)]" />
        <div className="relative mx-auto max-w-[820px] px-[clamp(22px,5vw,56px)] py-[clamp(90px,15vh,170px)] text-center">
          <Reveal
            as="p"
            className="m-0 font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold"
          >
            Your North Star
          </Reveal>
          <Reveal
            as="h2"
            delay={0.1}
            className="mt-[18px] text-balance font-serif text-[clamp(34px,6.2vw,64px)] font-medium leading-[1.05] tracking-[-0.012em] text-light"
          >
            Begin with who you are.
          </Reveal>
          <Reveal
            as="p"
            delay={0.16}
            className="mx-auto mt-[20px] max-w-[480px] font-serif text-[clamp(18px,2.6vw,22px)] italic text-light-soft"
          >
            You&apos;ve just been decoded.
          </Reveal>
          <Reveal
            delay={0.22}
            className="mt-[40px] flex flex-col items-center gap-[14px]"
          >
            <Link
              href="/intake"
              className="inline-flex items-center justify-center rounded-full bg-gold px-[36px] py-[17px] font-sans text-[16px] font-semibold text-[#1b1710] no-underline transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(216,180,120,0.34)]"
            >
              Get your Personal Read — $29
            </Link>
            <span className="text-[14px] text-light-soft">
              2 pages · delivered after a personal review
            </span>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
