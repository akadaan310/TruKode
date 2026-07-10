import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { FaqList } from "@/components/FaqList";

const NOTS: [string, string, boolean?][] = [
  ["Not therapy", "A companion for self-understanding — alongside professional care, never instead of it."],
  ["Not generic", "Every report is built from your own data. Yours alone — no two are the same."],
  ["Not a personality quiz", "No types and no boxes — just the full, particular picture of you."],
  ["Not a quick fix", "A foundation to return to — one that deepens as you do."],
  ["Not here to tell you who to be", "We're here to help you see who you already are — clearly, and with confidence.", true],
];

export default function FaqPage() {
  return (
    <div className="bg-ink">
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-ink">
        <div className="pointer-events-none absolute left-1/2 top-[-26%] h-[min(820px,150vw)] w-[min(820px,150vw)] -translate-x-1/2 animate-[tkGlow_10s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(216,180,120,0.15),rgba(216,180,120,0.04)_42%,transparent_64%)]" />
        <div className="relative mx-auto max-w-[760px] px-[clamp(22px,5vw,56px)] pb-[clamp(56px,9vh,90px)] pt-[clamp(76px,12vh,140px)] text-center">
          <Reveal className="mb-[26px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.28em] text-gold">
            Frequently Asked
          </Reveal>
          <Reveal
            as="h1"
            delay={0.13}
            className="m-0 text-balance font-serif text-[clamp(40px,7.6vw,74px)] font-medium leading-[1.03] tracking-[-0.014em] text-light"
          >
            Questions? We&apos;ve got you.
          </Reveal>
          <Reveal
            as="p"
            delay={0.27}
            className="mx-auto mt-[22px] max-w-[480px] text-[clamp(15px,2.1vw,18px)] leading-[1.65] text-light-soft"
          >
            Everything you might want to know before you begin — answered
            plainly, with no pressure.
          </Reveal>
        </div>
      </section>

      {/* ACCORDION */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[780px] px-[clamp(22px,5vw,48px)] py-[clamp(64px,10vh,120px)]">
          <Reveal>
            <FaqList />
          </Reveal>
        </div>
      </section>

      {/* WHAT TRUKODE IS NOT */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[980px] px-[clamp(22px,5vw,56px)] py-[clamp(72px,12vh,150px)]">
          <Reveal className="mx-auto mb-[clamp(44px,7vh,72px)] max-w-[600px] text-center">
            <div className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold">
              Clarity, Not Labels
            </div>
            <h2 className="m-0 font-serif text-[clamp(31px,5.4vw,54px)] font-medium leading-[1.06] tracking-[-0.012em] text-light">
              What TruKode is not.
            </h2>
          </Reveal>
          <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(248px,1fr))] gap-[16px]">
            {NOTS.map(([title, copy, full]) => (
              <div
                key={title}
                className={`rounded-[14px] border border-gold/[0.16] bg-gold/[0.03] p-[28px] ${
                  full ? "col-span-full" : ""
                }`}
              >
                <h3 className="m-0 font-serif text-[22px] font-semibold text-gold">
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

      {/* STILL HAVE QUESTIONS */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[680px] px-[clamp(22px,5vw,56px)] py-[clamp(64px,10vh,120px)] text-center">
          <Reveal className="mb-[20px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold-strong">
            Still curious?
          </Reveal>
          <Reveal
            as="h2"
            delay={0.1}
            className="m-0 text-balance font-serif text-[clamp(28px,4.8vw,46px)] font-medium leading-[1.08] tracking-[-0.012em] text-dark"
          >
            Still have a question? We&apos;d love to hear it.
          </Reveal>
          <Reveal
            as="p"
            delay={0.16}
            className="mx-auto mt-[18px] max-w-[440px] text-[clamp(15px,2vw,17px)] leading-[1.65] text-dark-soft"
          >
            Reach out any time — a real person will get back to you, warmly and
            without pressure.
          </Reveal>
          <Reveal delay={0.22}>
            <a
              href="mailto:hello@trukode.com"
              className="mt-[30px] inline-flex items-center justify-center rounded-full border border-dark/25 bg-transparent px-[30px] py-[15px] font-sans text-[15px] font-semibold text-dark no-underline transition-colors duration-300 hover:border-gold-strong hover:text-gold-strong"
            >
              Contact us
            </a>
          </Reveal>
        </div>
      </section>

      {/* CLOSING CTA */}
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
            No more questions? Begin.
          </Reveal>
          <Reveal delay={0.18} className="mt-[40px] flex flex-col items-center gap-[14px]">
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
