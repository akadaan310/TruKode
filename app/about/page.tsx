import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

const DISCIPLINES = [
  "Numerology",
  "Psychology",
  "Archetypes",
  "Life-Cycle Phases",
  "Spiritual Insight",
];

const TRUTHS = [
  [
    "I.",
    "Every human being is multi-dimensional — and exploring those dimensions is one of life's greatest journeys.",
  ],
  [
    "II.",
    "Who you are is shaped by both what you were born with and all that life has coded into you over time.",
  ],
  [
    "III.",
    "We're living in a defining moment, where self-discovery has become a life aspiration rather than a matter of survival.",
  ],
  [
    "IV.",
    "The challenge was never a lack of information — it was having all the pieces, yet still searching for how they fit together.",
  ],
  [
    "V.",
    "Self-knowledge is transformative — it reveals what's been holding you back, and opens the door to living with clarity, direction, and confidence.",
  ],
];

export default function AboutPage() {
  return (
    <div className="bg-ink">
      <Nav />

      {/* ===================== OPENING HERO ===================== */}
      <section className="relative overflow-hidden bg-ink">
        <div className="pointer-events-none absolute left-1/2 top-[-18%] h-[min(880px,150vw)] w-[min(880px,150vw)] -translate-x-1/2 animate-[tkGlow_10s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(216,180,120,0.16),rgba(216,180,120,0.04)_42%,transparent_64%)]" />
        <div className="relative mx-auto flex min-h-[clamp(520px,82vh,820px)] max-w-[900px] flex-col items-center justify-center px-[clamp(22px,5vw,56px)] py-[clamp(96px,18vh,200px)] pb-[clamp(88px,15vh,170px)] text-center">
          <Reveal className="mb-[34px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.28em] text-gold">
            The Manifesto
          </Reveal>
          <Reveal
            as="h1"
            delay={0.16}
            className="m-0 text-balance font-serif text-[clamp(42px,9vw,92px)] font-medium leading-[1.02] tracking-[-0.014em] text-light"
          >
            You came into this world without a manual.
          </Reveal>
        </div>
      </section>

      {/* ===================== MANIFESTO NARRATIVE ===================== */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[680px] px-[clamp(24px,6vw,40px)] py-[clamp(80px,14vh,170px)]">
          <Reveal>
            <div className="mb-[28px] font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-strong">
              Where it begins
            </div>
            <p className="m-0 text-[clamp(17px,2.4vw,20px)] leading-[1.8] text-dark">
              For most of human history, there was no time to ask{" "}
              <em className="italic">who am I.</em> There was only the next thing
              that had to be done — the harvest, the work, the war, the mouth to
              feed. The deeper questions were a luxury few could afford. And so
              they waited, generation after generation, mostly unasked.
            </p>
          </Reveal>

          <Reveal className="my-[clamp(48px,8vh,84px)] border-y border-dark/[0.12] py-[clamp(28px,5vw,40px)] text-center">
            <p className="m-0 text-balance font-serif text-[clamp(26px,4.6vw,40px)] font-medium leading-[1.2] tracking-[-0.01em] text-dark">
              For most of history, there was no time to wonder who you were.
              There was only the next thing that had to be done.
            </p>
          </Reveal>

          <Reveal>
            <p className="m-0 text-[clamp(17px,2.4vw,20px)] leading-[1.8] text-dark">
              Something has shifted. For the first time, on a scale never seen
              before, people have the space — and the longing — to turn inward.
              Not to escape their lives, but to live them more fully. We are no
              longer only trying to survive. We are trying to become.
            </p>
            <p className="mt-[28px] text-[clamp(17px,2.4vw,20px)] leading-[1.8] text-dark">
              This is the era of <strong className="font-semibold">Human 2.0</strong>:
              a generation that treats understanding itself not as indulgence,
              but as the foundation everything else is built upon.
            </p>
          </Reveal>

          <Reveal className="mt-[clamp(48px,8vh,84px)]">
            <p className="m-0 text-[clamp(17px,2.4vw,20px)] leading-[1.8] text-dark">
              And so we look. We reach for the spiritual, the psychological, the
              behavioral, the purposeful — and each one is real. Each reveals a
              genuine dimension of who you are. Numerology, archetypes, the phase
              of life you happen to be standing in, the quiet intelligence of the
              spirit — none of these are noise. They are facets of the same
              whole.
            </p>
            <p className="mt-[28px] text-[clamp(17px,2.4vw,20px)] leading-[1.8] text-dark">
              But they almost always arrive as separate pieces. A reading here. A
              framework there. An insight that glows for a week, then fades —
              because nothing ever connected it to the rest of you.
            </p>
          </Reveal>

          <Reveal className="my-[clamp(48px,8vh,84px)] border-y border-dark/[0.12] py-[clamp(28px,5vw,40px)] text-center">
            <p className="m-0 text-balance font-serif text-[clamp(26px,4.6vw,40px)] font-medium leading-[1.2] tracking-[-0.01em] text-dark">
              You were never short on information. You were short on a way to see
              how the pieces <span className="text-gold-strong">fit together.</span>
            </p>
          </Reveal>

          <Reveal>
            <p className="m-0 text-[clamp(17px,2.4vw,20px)] leading-[1.8] text-dark">
              The modern answer to that gap was simply <em className="italic">more</em>{" "}
              — more content, more tests, more advice. And more, it turned out,
              only deepened the noise. The pieces multiplied. The picture did
              not.
            </p>
            <p className="mt-[28px] text-[clamp(17px,2.4vw,20px)] leading-[1.8] text-dark">
              TruKode was built for exactly this moment. Not to add another
              fragment, but to bring the fragments together — to take the
              dimensions that have always described us and decode them, from your
              own data, into one cohesive, deeply personal picture. The whole, at
              last, seen as a whole.
            </p>
          </Reveal>

          <Reveal className="mt-[clamp(72px,12vh,140px)] text-center">
            <p className="m-0 text-balance font-serif text-[clamp(30px,5.4vw,54px)] font-medium leading-[1.1] tracking-[-0.012em] text-dark">
              You came into this world without a manual.
              <br />
              <span className="text-gold-strong">Consider this yours.</span>
            </p>
            <p className="mt-[24px] font-serif text-[clamp(19px,3vw,24px)] italic text-dark-soft">
              You&apos;ve just been decoded.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===================== HOW YOUR READ IS CREATED ===================== */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[680px] px-[clamp(24px,6vw,40px)] py-[clamp(80px,13vh,160px)]">
          <Reveal>
            <div className="mb-[26px] font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-strong">
              The care behind it
            </div>
            <h2 className="m-0 text-balance font-serif text-[clamp(30px,5.2vw,50px)] font-medium leading-[1.08] tracking-[-0.012em] text-dark">
              How your Read is created.
            </h2>
          </Reveal>

          <Reveal className="mt-[34px]">
            <p className="m-0 text-[clamp(17px,2.4vw,20px)] leading-[1.8] text-dark">
              Every Read is brought to life by an advanced intelligence we&apos;ve
              carefully trained on the most trusted, time-honored methods behind
              this kind of work — the established practices of numerology,
              psychology, archetypes, life-cycle phases, and spiritual insight —
              paired with precise, proven calculations applied to your own unique
              data.
            </p>
            <p className="mt-[28px] text-[clamp(17px,2.4vw,20px)] leading-[1.8] text-dark">
              This is not generic, and it is not random. It&apos;s a thoughtfully
              built system that brings rigor and consistency to something deeply
              personal — so that what you receive is both meaningful and grounded,
              never a horoscope and never a guess.
            </p>
            <p className="mt-[28px] text-[clamp(17px,2.4vw,20px)] leading-[1.8] text-dark">
              And because care matters most where it&apos;s most personal,{" "}
              <strong className="font-semibold">
                every report is reviewed before it reaches you.
              </strong>{" "}
              You&apos;re in expert, attentive hands from the first question to
              the final page.
            </p>
          </Reveal>

          <Reveal className="mt-[40px] flex flex-wrap gap-[10px]">
            {DISCIPLINES.map((label) => (
              <span
                key={label}
                className="rounded-full border border-dark/[0.16] px-4 py-2 text-[13px] text-dark-soft"
              >
                {label}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===================== THE FIVE TRUTHS ===================== */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[840px] px-[clamp(22px,5vw,56px)] py-[clamp(80px,13vh,160px)]">
          <Reveal className="mb-[clamp(40px,7vh,72px)] text-center">
            <div className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold">
              The Five Truths
            </div>
            <h2 className="m-0 font-serif text-[clamp(31px,5.4vw,54px)] font-medium leading-[1.06] tracking-[-0.012em] text-light">
              What we hold to be true.
            </h2>
          </Reveal>

          <Reveal className="flex flex-col gap-[clamp(48px,8vh,80px)]">
            {TRUTHS.map(([num, copy]) => (
              <div key={num} className="mx-auto max-w-[640px] text-center">
                <div className="mb-4 font-serif text-[28px] text-gold">
                  {num}
                </div>
                <p className="m-0 text-balance font-serif text-[clamp(24px,4vw,36px)] font-medium leading-[1.2] tracking-[-0.01em] text-light">
                  {copy}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===================== HUMAN 2.0 DECLARATION ===================== */}
      <section className="relative overflow-hidden border-t border-gold/[0.09] bg-ink-soft">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(700px,140vw)] w-[min(700px,140vw)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(216,180,120,0.1),transparent_60%)]" />
        <div className="relative mx-auto max-w-[760px] px-[clamp(22px,5vw,56px)] py-[clamp(88px,15vh,180px)] text-center">
          <Reveal className="mb-[30px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.28em] text-gold">
            The Human 2.0 Declaration
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="m-0 text-balance font-serif text-[clamp(27px,4.8vw,48px)] font-normal leading-[1.18] tracking-[-0.01em] text-light"
          >
            Knowing yourself is no longer a luxury. It is a priority. The
            question is no longer only <em className="italic">how do I survive</em>{" "}
            — but{" "}
            <span className="text-gold">who am I, and how do I thrive.</span>
          </Reveal>
          <Reveal
            as="p"
            delay={0.18}
            className="mt-[34px] text-[clamp(15px,2.2vw,18px)] leading-[1.7] text-light-soft"
          >
            TruKode was built for this moment, and for this generation.
          </Reveal>
        </div>
      </section>

      {/* ===================== THE COMPANY (LIGHT TOUCH) ===================== */}
      <section className="bg-ink-deep">
        <div className="mx-auto max-w-[680px] px-[clamp(22px,5vw,56px)] py-[clamp(48px,7vh,80px)] text-center">
          <Reveal className="inline-flex flex-col items-center gap-[14px]">
            <span className="h-px w-[30px] bg-gold/40" />
            <p className="m-0 text-[14px] leading-[1.6] text-light-soft">
              TruKode is created by{" "}
              <span className="text-light">Frankly / Frenkko LLC</span> — a small
              team building tools for the work of becoming fully human.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===================== CLOSING CTA ===================== */}
      <section className="relative overflow-hidden bg-ink">
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
            When you&apos;re ready, begin.
          </Reveal>
          <Reveal
            as="p"
            delay={0.18}
            className="mx-auto mt-[20px] max-w-[440px] text-[clamp(15px,2.1vw,17px)] leading-[1.65] text-light-soft"
          >
            No pressure, no rush. Just the first step toward seeing yourself
            clearly — whenever it feels like the right time.
          </Reveal>
          <Reveal
            delay={0.24}
            className="mt-[40px] flex flex-col items-center gap-[14px]"
          >
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-gold px-[36px] py-[17px] font-sans text-[16px] font-semibold text-[#1b1710] no-underline transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(216,180,120,0.34)]"
            >
              Explore the products
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
