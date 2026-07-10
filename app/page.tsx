import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

const READS = [
  {
    title: "Personal Read™",
    href: "/reads/personal-read",
    copy: "Who you are at your core — the foundational picture of your blueprint.",
    price: "$29",
    featured: true,
  },
  {
    title: "Compatibility Read™",
    href: "/reads/compatibility-read",
    copy: "How two people connect, communicate, and clash — and where you meet.",
    price: "$59–79",
  },
  {
    title: "Life Purpose Read™",
    href: "/reads/life-purpose-read",
    copy: "Your soul direction and the mission beneath your days.",
    price: "$49",
  },
  {
    title: "Roadblock Read™",
    href: "/reads/roadblock-read",
    copy: "The patterns quietly holding you back — named, so they can move.",
    price: "$49",
  },
  {
    title: "Career / Business Read™",
    href: "/reads/career-business-read",
    copy: "Your natural professional direction and the strengths to build on.",
    price: "$49",
  },
];

const WHO = [
  ["01", "The Curious Beginner", "New to all this — and quietly intrigued by what it might reveal."],
  ["02", "The Natural Seeker", "You've always sensed there's more beneath the surface of who you are."],
  ["03", "The Explorer", "You collect frameworks and ideas, hungry to understand yourself from every angle."],
  ["04", "At a Crossroads", "Standing between chapters, ready for clarity on what comes next."],
  ["05", "The Relationship Decoder", "You want to understand how you and someone close truly connect."],
  ["06", "The Parent", "You want to know your child — and yourself — more deeply."],
  ["07", "The Achiever / Builder", "Building something, and wanting your work to align with who you are."],
  ["08", "The Fully Committed", "All in on growth, and ready for the complete picture."],
];

const STEPS = [
  ["1", "Choose your Read", "Start where you're drawn. Most begin with the Personal Read."],
  ["2", "Share your details", "A few essentials — your data is the raw material of your blueprint."],
  ["3", "We decode your blueprint", "The Blueprint System™ brings every dimension into one cohesive picture."],
  ["4", "Receive your report", "Delivered to you — considered, cohesive, and entirely yours."],
];

const NOTS = [
  ["Not therapy or diagnosis", "A mirror for reflection — never a clinical verdict or a substitute for care."],
  ["Not a personality quiz", "Built from your unique data — not twelve tidy boxes everyone shares."],
  ["Not a quick fix", "A foundation you return to over time — not a one-time hit of insight."],
  ["Not a box you're placed in", "Possibilities to explore and grow into — never a label to live inside."],
];

const TRUTHS = [
  ["01", "Every human is multi-dimensional.", "No single number, type, or trait could ever hold all of you."],
  ["02", "You're shaped by what you were born with — and what life has coded into you.", "Nature and experience, written together."],
  ["03", "This is a defining era for self-discovery.", "Understanding yourself is no longer a luxury. It's the work."],
  ["04", "The challenge was never missing information.", "It was knowing how the pieces fit together."],
  ["05", "Self-knowledge is transformative.", "When you see yourself clearly, everything downstream changes."],
];

const CHIPS = [
  ["Numerology", "-3deg"],
  ["Psychology", "2.5deg"],
  ["Archetypes", "-1.5deg"],
  ["Life-Cycle Phase", "3deg"],
  ["Spiritual Intelligence", "-2.5deg"],
];

export default function LandingPage() {
  return (
    <div className="bg-ink">
      <Nav />

      {/* ===================== HERO ===================== */}
      <section id="top" className="relative overflow-hidden bg-ink">
        <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[min(900px,140vw)] w-[min(900px,140vw)] -translate-x-1/2 animate-[tkGlow_9s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(216,180,120,0.20),rgba(216,180,120,0.06)_38%,transparent_62%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,rgba(16,13,9,0.9),transparent_60%)]" />
        <div className="relative mx-auto flex min-h-[clamp(580px,90vh,940px)] max-w-[1000px] flex-col items-center justify-center px-[clamp(22px,6vw,56px)] py-[clamp(96px,16vh,170px)] pb-[clamp(80px,13vh,140px)] text-center">
          <Reveal className="mb-[30px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.28em] text-gold">
            Human&nbsp;Decode™ &nbsp;·&nbsp; The Blueprint System™
          </Reveal>
          <Reveal
            as="h1"
            delay={0.08}
            className="m-0 text-balance font-serif text-[clamp(40px,8.6vw,84px)] font-medium leading-[1.03] tracking-[-0.012em] text-light"
          >
            You came into this world
            <br />
            without a manual.
            <br />
            <span className="text-gold">Consider this yours.</span>
          </Reveal>
          <Reveal
            as="p"
            delay={0.16}
            className="mt-[30px] font-serif text-[clamp(20px,3.6vw,27px)] italic tracking-[0.01em] text-light-soft"
          >
            You&apos;ve just been decoded.
          </Reveal>
          <Reveal
            delay={0.24}
            className="mt-[44px] flex flex-wrap justify-center gap-[14px]"
          >
            <Link
              href="/products"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-gold px-[30px] py-[16px] font-sans text-[15px] font-semibold text-[#1b1710] no-underline transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(216,180,120,0.32)]"
            >
              Discover Your Blueprint
            </Link>
            <Link
              href="#how"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-light/[0.26] bg-transparent px-[28px] py-[16px] font-sans text-[15px] font-medium text-light no-underline transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              How it works
            </Link>
          </Reveal>
          <div className="absolute bottom-[30px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[9px]">
            <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-light-soft">
              Begin
            </span>
            <span className="h-[34px] w-px animate-[tkBob_2.4s_ease-in-out_infinite] bg-[linear-gradient(var(--gold),transparent)]" />
          </div>
        </div>
      </section>

      {/* ===================== THE SHIFT / HUMAN 2.0 ===================== */}
      <section className="border-t border-gold/[0.09] bg-ink-soft">
        <div className="mx-auto max-w-[1000px] px-[clamp(22px,5vw,56px)] py-[clamp(80px,13vh,150px)] text-center">
          <Reveal className="mb-[26px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold">
            A New Era · Human 2.0
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="m-0 text-balance font-serif text-[clamp(27px,4.9vw,50px)] font-normal leading-[1.18] tracking-[-0.01em] text-light"
          >
            We&apos;ve reached the moment where knowing yourself is no longer a
            luxury reserved for later — it&apos;s the quiet work that shapes
            everything else.{" "}
            <span className="text-gold">
              This is the era of becoming fully, deliberately human.
            </span>
          </Reveal>
        </div>
      </section>

      {/* ===================== WHAT YOU GET ===================== */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1000px] px-[clamp(22px,5vw,56px)] py-[clamp(84px,13vh,160px)] text-center">
          <Reveal className="mb-[24px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold">
            From Fragments to a Whole
          </Reveal>
          <Reveal
            as="h2"
            delay={0.08}
            className="mx-auto max-w-[760px] text-balance font-serif text-[clamp(31px,5.6vw,56px)] font-medium leading-[1.08] tracking-[-0.012em] text-light"
          >
            The spiritual, psychological, behavioral, and purposeful — brought
            into one picture.
          </Reveal>
          <Reveal
            as="p"
            delay={0.14}
            className="mx-auto mt-[24px] max-w-[560px] text-[clamp(15px,2vw,18px)] leading-[1.65] text-light-soft"
          >
            Not fragments. Not noise. Every dimension of you, drawn from your
            unique data and decoded into something cohesive — and unmistakably
            yours.
          </Reveal>

          <Reveal delay={0.2} className="mt-[62px] flex flex-col items-center">
            <div className="flex max-w-[580px] flex-wrap justify-center gap-[13px]">
              {CHIPS.map(([label, rot]) => (
                <span
                  key={label}
                  className="inline-block rounded-full border border-gold/30 bg-gold/5 px-[17px] py-[10px] text-[13.5px] font-medium text-light-soft"
                  style={{ transform: `rotate(${rot})` }}
                >
                  {label}
                </span>
              ))}
            </div>
            <span className="mt-[22px] h-[56px] w-px bg-[linear-gradient(rgba(216,180,120,0.1),var(--gold))]" />
            <span className="-mt-[3px] h-[7px] w-[7px] rounded-full bg-gold shadow-[0_0_16px_rgba(216,180,120,0.7)]" />
            <div className="mt-[24px] rounded-lg bg-[linear-gradient(135deg,var(--gold),var(--gold-strong))] px-[40px] py-[22px] text-center shadow-[0_18px_48px_rgba(216,180,120,0.24)]">
              <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[rgba(27,23,16,0.6)]">
                Your
              </div>
              <div className="mt-0.5 font-serif text-[clamp(26px,4.5vw,38px)] font-semibold leading-[1.05] text-[#1b1710]">
                Blueprint
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== THE READS ===================== */}
      <section id="reads" className="bg-cream">
        <div className="mx-auto max-w-[1160px] px-[clamp(22px,5vw,56px)] py-[clamp(84px,13vh,160px)]">
          <div className="mx-auto max-w-[680px] text-center">
            <Reveal className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold-strong">
              The Reads
            </Reveal>
            <Reveal
              as="h2"
              delay={0.08}
              className="m-0 font-serif text-[clamp(31px,5.6vw,56px)] font-medium leading-[1.06] tracking-[-0.012em] text-dark"
            >
              Choose where your decoding begins.
            </Reveal>
            <Reveal
              as="p"
              delay={0.14}
              className="mx-auto mt-[20px] text-[clamp(15px,2vw,17px)] leading-[1.65] text-dark-soft"
            >
              Each Read is a focused, deeply personal report. Most people start
              with the Personal Read — the foundation everything else builds on.
            </Reveal>
          </div>

          <Reveal
            delay={0.18}
            className="mt-[52px] grid grid-cols-[repeat(auto-fit,minmax(252px,1fr))] gap-[18px]"
          >
            {READS.map((r) =>
              r.featured ? (
                <div
                  key={r.title}
                  className="relative flex flex-col rounded-[10px] border-[1.5px] border-gold bg-paper px-[26px] pb-[26px] pt-[30px] shadow-[0_14px_40px_rgba(216,180,120,0.18)]"
                >
                  <span className="absolute -top-[11px] left-[26px] rounded-full bg-gold px-3 py-[5px] font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#1b1710]">
                    Best starting point
                  </span>
                  <h3 className="mb-0 mt-[6px] font-serif text-[26px] font-semibold text-dark">
                    {r.title}
                  </h3>
                  <p className="mt-[10px] flex-1 text-[15px] leading-[1.55] text-dark-soft">
                    {r.copy}
                  </p>
                  <div className="mt-[24px] flex items-baseline justify-between border-t border-dark/10 pt-[18px]">
                    <span className="font-serif text-[28px] font-semibold text-gold-strong">
                      {r.price}
                    </span>
                    <Link
                      href={r.href}
                      className="font-sans text-[14px] font-semibold text-dark no-underline transition-colors duration-300 hover:text-gold-strong"
                    >
                      Learn more →
                    </Link>
                  </div>
                </div>
              ) : (
                <div
                  key={r.title}
                  className="flex flex-col rounded-[10px] border border-dark/10 bg-paper px-[26px] pb-[26px] pt-[30px] transition-[transform,box-shadow,border-color] duration-[350ms] hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_16px_40px_rgba(42,38,32,0.1)]"
                >
                  <h3 className="m-0 font-serif text-[26px] font-semibold text-dark">
                    {r.title}
                  </h3>
                  <p className="mt-[10px] flex-1 text-[15px] leading-[1.55] text-dark-soft">
                    {r.copy}
                  </p>
                  <div className="mt-[24px] flex items-baseline justify-between border-t border-dark/10 pt-[18px]">
                    <span className="font-serif text-[28px] font-semibold text-gold-strong">
                      {r.price}
                    </span>
                    <Link
                      href={r.href}
                      className="font-sans text-[14px] font-semibold text-dark no-underline transition-colors duration-300 hover:text-gold-strong"
                    >
                      Learn more →
                    </Link>
                  </div>
                </div>
              ),
            )}
          </Reveal>
        </div>
      </section>

      {/* ===================== WHO THIS IS FOR ===================== */}
      <section id="who" className="bg-paper">
        <div className="mx-auto max-w-[1160px] px-[clamp(22px,5vw,56px)] py-[clamp(84px,13vh,160px)]">
          <div className="mx-auto max-w-[680px] text-center">
            <Reveal className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold-strong">
              Who This Is For
            </Reveal>
            <Reveal
              as="h2"
              delay={0.08}
              className="m-0 text-balance font-serif text-[clamp(31px,5.6vw,56px)] font-medium leading-[1.06] tracking-[-0.012em] text-dark"
            >
              Wherever you&apos;re standing, there&apos;s a place to begin.
            </Reveal>
          </div>

          <Reveal
            delay={0.16}
            className="mt-[50px] grid grid-cols-[repeat(auto-fit,minmax(244px,1fr))] gap-[16px]"
          >
            {WHO.map(([num, title, copy]) => (
              <div
                key={num}
                className="rounded-[10px] border border-dark/[0.08] bg-cream p-[24px] transition-[transform,border-color] duration-[350ms] hover:-translate-y-[3px] hover:border-gold/[0.55]"
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

      {/* ===================== HOW IT WORKS ===================== */}
      <section id="how" className="border-t border-dark/[0.06] bg-cream">
        <div className="mx-auto max-w-[1100px] px-[clamp(22px,5vw,56px)] py-[clamp(84px,13vh,160px)]">
          <div className="mx-auto max-w-[660px] text-center">
            <Reveal className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold-strong">
              How It Works
            </Reveal>
            <Reveal
              as="h2"
              delay={0.08}
              className="m-0 font-serif text-[clamp(31px,5.6vw,56px)] font-medium leading-[1.06] tracking-[-0.012em] text-dark"
            >
              Four quiet steps to your blueprint.
            </Reveal>
          </div>

          <Reveal
            delay={0.16}
            className="mt-[54px] grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[14px]"
          >
            {STEPS.map(([num, title, copy]) => (
              <div
                key={num}
                className="rounded-[10px] border border-dark/[0.08] bg-paper px-[24px] py-[30px]"
              >
                <div className="font-serif text-[54px] font-medium leading-none text-gold">
                  {num}
                </div>
                <h3 className="mt-[14px] font-serif text-[23px] font-semibold text-dark">
                  {title}
                </h3>
                <p className="mt-[9px] text-[14.5px] leading-[1.55] text-dark-soft">
                  {copy}
                </p>
              </div>
            ))}
          </Reveal>

          <Reveal
            delay={0.24}
            className="mx-auto mt-[34px] flex w-max max-w-full items-center gap-[11px] rounded-full border border-gold/40 bg-gold/[0.12] px-[22px] py-[13px]"
          >
            <span className="h-[7px] w-[7px] flex-none rounded-full bg-gold-strong" />
            <span className="text-[14px] font-medium text-dark">
              Every report is personally reviewed before it reaches you.
            </span>
          </Reveal>
        </div>
      </section>

      {/* ===================== WHAT TRUKODE IS NOT ===================== */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1060px] px-[clamp(22px,5vw,56px)] py-[clamp(84px,13vh,160px)]">
          <div className="mx-auto max-w-[660px] text-center">
            <Reveal className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold">
              Clarity, Not Labels
            </Reveal>
            <Reveal
              as="h2"
              delay={0.08}
              className="m-0 font-serif text-[clamp(31px,5.6vw,56px)] font-medium leading-[1.06] tracking-[-0.012em] text-light"
            >
              A few things this isn&apos;t.
            </Reveal>
          </div>

          <Reveal
            delay={0.16}
            className="mt-[48px] grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[16px]"
          >
            {NOTS.map(([title, copy]) => (
              <div
                key={title}
                className="rounded-[10px] border border-gold/[0.16] bg-gold/[0.03] p-[26px]"
              >
                <h3 className="m-0 font-serif text-[21px] font-semibold text-gold">
                  {title}
                </h3>
                <p className="mt-[9px] text-[14.5px] leading-[1.6] text-light-soft">
                  {copy}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===================== THE FIVE TRUTHS ===================== */}
      <section className="border-t border-gold/[0.09] bg-ink-soft">
        <div className="mx-auto max-w-[920px] px-[clamp(22px,5vw,56px)] py-[clamp(84px,13vh,160px)]">
          <div className="mb-[18px] text-center">
            <Reveal className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold">
              The Five Truths
            </Reveal>
            <Reveal
              as="h2"
              delay={0.08}
              className="m-0 font-serif text-[clamp(31px,5.6vw,56px)] font-medium leading-[1.06] tracking-[-0.012em] text-light"
            >
              What we believe.
            </Reveal>
          </div>

          <Reveal delay={0.14} className="mt-[42px] flex flex-col">
            {TRUTHS.map(([num, title, copy], i) => (
              <div
                key={num}
                className={`flex items-baseline gap-[clamp(18px,4vw,40px)] border-t border-gold/[0.14] py-[26px] ${
                  i === TRUTHS.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="min-w-[42px] flex-none font-serif text-[clamp(22px,3vw,30px)] font-normal text-gold">
                  {num}
                </span>
                <div>
                  <p className="m-0 font-serif text-[clamp(23px,3.6vw,34px)] font-medium leading-[1.18] text-light">
                    {title}
                  </p>
                  <p className="mt-[8px] text-[15px] leading-[1.55] text-light-soft">
                    {copy}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="relative overflow-hidden bg-ink">
        <div className="pointer-events-none absolute bottom-[-40%] left-1/2 h-[min(820px,150vw)] w-[min(820px,150vw)] -translate-x-1/2 animate-[tkGlow_10s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(216,180,120,0.18),rgba(216,180,120,0.05)_40%,transparent_64%)]" />
        <div className="relative mx-auto max-w-[820px] px-[clamp(22px,5vw,56px)] py-[clamp(96px,16vh,180px)] text-center">
          <Reveal
            as="p"
            className="m-0 font-serif text-[clamp(18px,2.6vw,22px)] italic text-gold"
          >
            You&apos;ve just been decoded.
          </Reveal>
          <Reveal
            as="h2"
            delay={0.1}
            className="mt-[18px] text-balance font-serif text-[clamp(34px,6.4vw,66px)] font-medium leading-[1.05] tracking-[-0.012em] text-light"
          >
            Your blueprint is waiting to be read.
          </Reveal>
          <Reveal
            delay={0.18}
            className="mt-[40px] flex flex-col items-center gap-[14px]"
          >
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-gold px-[36px] py-[17px] font-sans text-[16px] font-semibold text-[#1b1710] no-underline transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(216,180,120,0.34)]"
            >
              Discover Your Blueprint
            </Link>
            <span className="text-[14px] text-light-soft">
              Start with the Personal Read™ — $29
            </span>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
