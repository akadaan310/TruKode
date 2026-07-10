import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

const STEPS = [
  {
    label: "Step 01",
    title: "Choose your Read",
    copy: "Start where you're drawn. Each Read illuminates a different dimension — most people begin with the Personal Read.",
    icon: (
      <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
        <circle cx="16" cy="16" r="12" className="stroke-gold" strokeWidth="1.6" />
        <path
          d="M11 16.5l3.2 3.2L21 13"
          className="stroke-gold"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Step 02",
    title: "Share your details",
    copy: "A calm, guided experience — one question at a time. Just a few personal essentials, the raw material of your blueprint.",
    icon: (
      <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
        <rect x="6" y="7" width="20" height="15" rx="5" className="stroke-gold" strokeWidth="1.6" />
        <path d="M12 22v4.5l4.5-4.5" className="stroke-gold" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="12.5" cy="14.5" r="1.1" className="fill-gold" />
        <circle cx="16" cy="14.5" r="1.1" className="fill-gold" />
        <circle cx="19.5" cy="14.5" r="1.1" className="fill-gold" />
      </svg>
    ),
  },
  {
    label: "Step 03",
    title: "We decode your blueprint",
    copy: "Your data is run through The Blueprint System™ — bringing every dimension into one cohesive picture, then composed into your personal report.",
    icon: (
      <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
        <circle cx="16" cy="16" r="12" className="stroke-gold" strokeWidth="1.6" />
        <circle cx="16" cy="16" r="6.5" className="stroke-gold" strokeWidth="1.6" />
        <circle cx="16" cy="16" r="2.2" className="fill-gold" />
      </svg>
    ),
  },
  {
    label: "Step 04",
    title: "Receive your report",
    copy: "Available instantly as a beautiful PDF — and emailed to you, so it's always within reach when you want to return to it.",
    icon: (
      <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
        <rect x="8" y="5" width="16" height="22" rx="2" className="stroke-gold" strokeWidth="1.6" />
        <path
          d="M12 12h8M12 16h8M12 20h5"
          className="stroke-gold"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const DIMENSIONS = [
  {
    title: "Numerology",
    copy: "Your core numbers",
    icon: (
      <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
        <path d="M16 5l11 19H5z" className="stroke-gold" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="16" cy="18" r="2" className="fill-gold" />
      </svg>
    ),
  },
  {
    title: "Psychology",
    copy: "How your mind works",
    icon: (
      <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
        <circle cx="16" cy="16" r="11" className="stroke-gold" strokeWidth="1.6" />
        <circle cx="16" cy="16" r="5" className="stroke-gold" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: "Archetypes",
    copy: "The patterns you embody",
    icon: (
      <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
        <rect
          x="8.5"
          y="8.5"
          width="15"
          height="15"
          rx="1.5"
          transform="rotate(45 16 16)"
          className="stroke-gold"
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
  {
    title: "Life-Cycle Phase",
    copy: "Where you stand now",
    icon: (
      <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
        <circle cx="16" cy="16" r="11" className="stroke-gold" strokeWidth="1.6" />
        <path d="M16 5a11 11 0 0 1 0 22z" className="fill-gold" />
      </svg>
    ),
  },
  {
    title: "Spiritual Intelligence",
    copy: "The quiet inner compass",
    icon: (
      <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
        <path d="M16 4l2.6 9.4L28 16l-9.4 2.6L16 28l-2.6-9.4L4 16l9.4-2.6z" className="fill-gold" />
      </svg>
    ),
  },
];

const SAFE_CHIPS = ["Your name", "Birth date", "Birth place", "Birth time"];

const NOT_CHIPS = ["Not therapy", "Not a diagnosis", "Not a quiz", "Not a quick fix"];

export default function HowItWorksPage() {
  return (
    <div className="bg-ink">
      <Nav />

      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-ink">
        <div className="pointer-events-none absolute left-1/2 top-[-22%] h-[min(860px,150vw)] w-[min(860px,150vw)] -translate-x-1/2 animate-[tkGlow_10s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(216,180,120,0.16),rgba(216,180,120,0.04)_42%,transparent_64%)]" />
        <div className="relative mx-auto max-w-[820px] px-[clamp(22px,5vw,56px)] pb-[clamp(64px,10vh,110px)] pt-[clamp(80px,13vh,150px)] text-center">
          <Reveal className="mb-[28px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.28em] text-gold">
            How It Works
          </Reveal>
          <Reveal
            as="h1"
            delay={0.08}
            className="m-0 text-balance font-serif text-[clamp(40px,7.6vw,76px)] font-medium leading-[1.03] tracking-[-0.014em] text-light"
          >
            How TruKode decodes you.
          </Reveal>
          <Reveal
            as="p"
            delay={0.16}
            className="mx-auto mt-[24px] max-w-[520px] text-[clamp(15px,2.2vw,18px)] leading-[1.65] text-light-soft"
          >
            A simple, considered process — four calm steps from choosing your Read to holding it in
            your hands. Here&apos;s exactly what to expect.
          </Reveal>
        </div>
      </section>

      {/* ===================== THE JOURNEY (4 STEPS) ===================== */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1000px] px-[clamp(22px,5vw,56px)] py-[clamp(72px,12vh,150px)]">
          <Reveal className="mx-auto mb-[clamp(48px,8vh,80px)] max-w-[600px] text-center">
            <div className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold-strong">
              The Journey
            </div>
            <h2 className="m-0 font-serif text-[clamp(31px,5.4vw,54px)] font-medium leading-[1.06] tracking-[-0.012em] text-dark">
              Four steps, start to finish.
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto flex max-w-[720px] flex-col">
            {STEPS.map((step, i) => {
              const isLast = i === STEPS.length - 1;
              return (
                <div key={step.label} className="flex items-stretch gap-[clamp(18px,4vw,28px)]">
                  <div className="flex flex-none flex-col items-center">
                    <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-[1.5px] border-gold bg-paper">
                      {step.icon}
                    </div>
                    {!isLast && (
                      <div className="mt-[6px] w-[2px] flex-1 bg-[linear-gradient(var(--gold),rgba(216,180,120,0.25))]" />
                    )}
                  </div>
                  <div className={isLast ? "" : "pb-[clamp(36px,6vh,56px)]"}>
                    <div className="mb-[8px] font-sans text-[10.5px] font-semibold uppercase tracking-[0.16em] text-gold-strong">
                      {step.label}
                    </div>
                    <h3 className="m-0 font-serif text-[clamp(24px,3.6vw,30px)] font-semibold text-dark">
                      {step.title}
                    </h3>
                    <p className="mt-[10px] max-w-[440px] text-[15.5px] leading-[1.6] text-dark-soft">
                      {step.copy}
                    </p>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* ===================== HOW YOUR READ IS CREATED ===================== */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1000px] px-[clamp(22px,5vw,56px)] py-[clamp(72px,12vh,150px)]">
          <Reveal className="mx-auto max-w-[620px] text-center">
            <div className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold-strong">
              The Care Behind It
            </div>
            <h2 className="m-0 font-serif text-[clamp(31px,5.4vw,54px)] font-medium leading-[1.06] tracking-[-0.012em] text-dark">
              Rigorous and intentional — never generic.
            </h2>
            <p className="mx-auto mt-[20px] max-w-[520px] text-[clamp(15px,2vw,17px)] leading-[1.65] text-dark-soft">
              Every Read is brought to life by an advanced intelligence we&apos;ve carefully trained
              on the most trusted, time-honored methods — combined with precise, proven calculations
              applied to your own unique data.
            </p>
          </Reveal>

          <Reveal
            delay={0.1}
            className="mt-[clamp(44px,7vh,72px)] grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[16px]"
          >
            <div className="rounded-[14px] border border-dark/[0.08] bg-cream px-[26px] py-[30px] text-center">
              <span className="mb-[18px] inline-flex h-[52px] w-[52px] items-center justify-center rounded-[12px] bg-gold/[0.12]">
                <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
                  <path
                    d="M16 5l9 5v12l-9 5-9-5V10z"
                    className="stroke-gold"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <circle cx="16" cy="16" r="3" className="fill-gold" />
                </svg>
              </span>
              <div className="mb-[8px] font-sans text-[10px] uppercase tracking-[0.14em] text-gold-strong">
                01 · Your input
              </div>
              <h3 className="m-0 font-serif text-[22px] font-semibold text-dark">
                Your unique data
              </h3>
              <p className="mt-[8px] text-[14px] leading-[1.55] text-dark-soft">
                The details you share become the foundation — personal to you, and only you.
              </p>
            </div>

            <div className="rounded-[14px] border-[1.5px] border-gold bg-[linear-gradient(160deg,rgba(216,180,120,0.16),rgba(216,180,120,0.06))] px-[26px] py-[30px] text-center">
              <span className="mb-[18px] inline-flex h-[52px] w-[52px] items-center justify-center rounded-[12px] bg-gold/20">
                <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
                  <circle cx="16" cy="16" r="11" className="stroke-gold-strong" strokeWidth="1.6" />
                  <circle cx="16" cy="16" r="5" className="stroke-gold-strong" strokeWidth="1.6" />
                  <path
                    d="M16 5v3M16 24v3M5 16h3M24 16h3"
                    className="stroke-gold-strong"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div className="mb-[8px] font-sans text-[10px] uppercase tracking-[0.14em] text-gold-strong">
                02 · The system
              </div>
              <h3 className="m-0 font-serif text-[22px] font-semibold text-dark">
                The Blueprint System™
              </h3>
              <p className="mt-[8px] text-[14px] leading-[1.55] text-dark-soft">
                Trained on time-honored methods and proven calculation — bringing rigor and
                consistency to something deeply personal.
              </p>
            </div>

            <div className="rounded-[14px] border border-dark/[0.08] bg-cream px-[26px] py-[30px] text-center">
              <span className="mb-[18px] inline-flex h-[52px] w-[52px] items-center justify-center rounded-[12px] bg-gold/[0.12]">
                <svg viewBox="0 0 32 32" width="26" height="26" fill="none">
                  <rect x="9" y="5" width="14" height="22" rx="2" className="stroke-gold" strokeWidth="1.6" />
                  <path
                    d="M13 12h6M13 16h6M13 20h4"
                    className="stroke-gold"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div className="mb-[8px] font-sans text-[10px] uppercase tracking-[0.14em] text-gold-strong">
                03 · The result
              </div>
              <h3 className="m-0 font-serif text-[22px] font-semibold text-dark">
                Your personal report
              </h3>
              <p className="mt-[8px] text-[14px] leading-[1.55] text-dark-soft">
                Meaningful and grounded — a cohesive picture, never a horoscope and never a guess.
              </p>
            </div>
          </Reveal>

          <Reveal
            delay={0.18}
            className="mx-auto mt-[32px] flex w-max max-w-full items-center gap-[11px] rounded-full border border-gold/40 bg-gold/[0.12] px-[24px] py-[14px]"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" className="flex-none">
              <path
                d="M5 12.5l4 4 10-10"
                className="stroke-gold-strong"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[14.5px] font-medium text-dark">
              And every report is personally reviewed before it&apos;s delivered.
            </span>
          </Reveal>
        </div>
      </section>

      {/* ===================== THE BLUEPRINT SYSTEM (DIMENSIONS) ===================== */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1000px] px-[clamp(22px,5vw,56px)] py-[clamp(72px,12vh,150px)]">
          <Reveal className="mx-auto max-w-[620px] text-center">
            <div className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold">
              The Blueprint System™
            </div>
            <h2 className="m-0 font-serif text-[clamp(31px,5.4vw,54px)] font-medium leading-[1.06] tracking-[-0.012em] text-light">
              Five dimensions, one whole.
            </h2>
            <p className="mx-auto mt-[20px] max-w-[500px] text-[clamp(15px,2vw,17px)] leading-[1.65] text-light-soft">
              Every Read draws on five established dimensions — composed together so your report sees
              the whole of you, not a single trait.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-[clamp(44px,7vh,72px)] flex flex-col items-center">
            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-[14px]">
              {DIMENSIONS.map((dim) => (
                <div
                  key={dim.title}
                  className="rounded-[14px] border border-gold/20 bg-gold/[0.03] px-[20px] py-[26px] text-center"
                >
                  <span className="mb-[14px] inline-flex h-[48px] w-[48px] items-center justify-center rounded-[12px] bg-gold/10">
                    {dim.icon}
                  </span>
                  <h3 className="m-0 font-serif text-[19px] font-semibold text-light">
                    {dim.title}
                  </h3>
                  <p className="mt-[6px] text-[13px] leading-[1.5] text-light-soft">{dim.copy}</p>
                </div>
              ))}
            </div>

            <span className="mt-[30px] h-[50px] w-[2px] bg-[linear-gradient(rgba(216,180,120,0.15),var(--gold))]" />
            <span className="-mt-[3px] h-[8px] w-[8px] rounded-full bg-gold shadow-[0_0_16px_rgba(216,180,120,0.7)]" />
            <div className="mt-[24px] rounded-[10px] bg-[linear-gradient(135deg,var(--gold),var(--gold-strong))] px-[44px] py-[22px] text-center shadow-[0_18px_48px_rgba(216,180,120,0.22)]">
              <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[rgba(27,23,16,0.6)]">
                Composed into
              </div>
              <div className="mt-[3px] font-serif text-[clamp(24px,4vw,32px)] font-semibold leading-[1.1] text-[#1b1710]">
                One complete picture
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== YOUR DATA IS SAFE ===================== */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[760px] px-[clamp(22px,5vw,56px)] py-[clamp(72px,12vh,140px)] text-center">
          <Reveal className="flex flex-col items-center">
            <span className="mb-[28px] inline-flex h-[66px] w-[66px] items-center justify-center rounded-full border-[1.5px] border-gold bg-paper">
              <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
                <rect x="8" y="14" width="16" height="12" rx="2.5" className="stroke-gold-strong" strokeWidth="1.6" />
                <path d="M11 14v-3a5 5 0 0 1 10 0v3" className="stroke-gold-strong" strokeWidth="1.6" />
                <circle cx="16" cy="20" r="1.8" className="fill-gold-strong" />
              </svg>
            </span>
            <div className="mb-[18px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold-strong">
              Your data is safe
            </div>
            <h2 className="m-0 text-balance font-serif text-[clamp(28px,5vw,48px)] font-medium leading-[1.08] tracking-[-0.012em] text-dark">
              Handled with care, used only for your Read.
            </h2>
            <p className="mx-auto mt-[20px] max-w-[480px] text-[clamp(15px,2vw,17px)] leading-[1.65] text-dark-soft">
              The personal details you share are treated with care and used for one purpose only — to
              create your personal report. Nothing more.
            </p>
            <div className="mt-[30px] flex flex-wrap justify-center gap-[10px]">
              {SAFE_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-dark/[0.12] bg-paper px-[18px] py-[9px] text-[13.5px] text-dark"
                >
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== THE BOUNDARY ===================== */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[900px] px-[clamp(22px,5vw,56px)] py-[clamp(72px,12vh,150px)]">
          <Reveal className="mx-auto mb-[clamp(40px,6vh,56px)] max-w-[560px] text-center">
            <div className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold">
              Clarity, Not Labels
            </div>
            <h2 className="m-0 font-serif text-[clamp(30px,5.2vw,50px)] font-medium leading-[1.06] tracking-[-0.012em] text-light">
              What it is, and what it isn&apos;t.
            </h2>
          </Reveal>

          <Reveal
            delay={0.1}
            className="mb-[14px] grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[12px]"
          >
            {NOT_CHIPS.map((chip) => (
              <div
                key={chip}
                className="rounded-[12px] border border-gold/[0.14] bg-gold/[0.02] p-[20px] text-center"
              >
                <span className="font-sans text-[14px] text-light-soft">{chip}</span>
              </div>
            ))}
          </Reveal>

          <Reveal
            delay={0.16}
            className="rounded-[14px] border-[1.5px] border-gold bg-[linear-gradient(135deg,rgba(216,180,120,0.12),rgba(216,180,120,0.04))] p-[clamp(28px,5vw,40px)] text-center"
          >
            <p className="m-0 text-balance font-serif text-[clamp(22px,3.6vw,32px)] font-medium leading-[1.2] text-light">
              A personal foundation, built from your own data —{" "}
              <span className="text-gold">yours to explore, return to, and grow with.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===================== CLOSING CTA ===================== */}
      <section className="relative overflow-hidden border-t border-gold/[0.09] bg-ink-soft">
        <div className="pointer-events-none absolute bottom-[-40%] left-1/2 h-[min(820px,150vw)] w-[min(820px,150vw)] -translate-x-1/2 animate-[tkGlow_11s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(216,180,120,0.16),rgba(216,180,120,0.05)_40%,transparent_64%)]" />
        <div className="relative mx-auto max-w-[760px] px-[clamp(22px,5vw,56px)] py-[clamp(90px,15vh,180px)] text-center">
          <Reveal
            as="p"
            className="m-0 font-serif text-[clamp(18px,2.6vw,22px)] italic text-gold"
          >
            You&apos;ve just been decoded.
          </Reveal>
          <Reveal
            as="h2"
            delay={0.1}
            className="mt-[18px] text-balance font-serif text-[clamp(34px,6.2vw,64px)] font-medium leading-[1.05] tracking-[-0.012em] text-light"
          >
            Now you know the way. Begin.
          </Reveal>
          <Reveal
            delay={0.18}
            className="mt-[40px] flex flex-col items-center gap-[14px]"
          >
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-gold px-[36px] py-[17px] font-sans text-[16px] font-semibold text-[#1b1710] no-underline transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(216,180,120,0.34)]"
            >
              Choose your product
            </Link>
            <span className="text-[14px] text-light-soft">
              Most begin with the Personal Read™ — $29
            </span>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
