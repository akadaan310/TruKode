import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { PersonalReadReport } from "@/components/PersonalReadReport";

const NEXT_STEPS = [
  ["01", "Set aside ten unhurried minutes, somewhere calm."],
  ["02", "Notice what resonates — and what gently surprises you."],
  ["03", "Return to your North Star whenever the path feels unclear."],
];

export default function ConfirmationPage() {
  return (
    <div className="bg-ink">
      <style>{
        "@keyframes tkFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}" +
        "@media print{body *{visibility:hidden}.tk-report,.tk-report *{visibility:visible}.tk-report{position:absolute;left:0;top:0;width:100%}.tk-page{box-shadow:none!important;border-color:#e2ddd2!important;page-break-after:always;max-width:100%!important}}"
      }</style>
      <Nav />

      {/* ===================== REVEAL + DOWNLOAD ===================== */}
      <section className="relative overflow-hidden bg-ink">
        <div className="pointer-events-none absolute left-1/2 top-[-12%] h-[min(900px,150vw)] w-[min(900px,150vw)] -translate-x-1/2 animate-[tkGlow_8s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(216,180,120,0.22),rgba(216,180,120,0.06)_40%,transparent_62%)]" />
        <div className="relative mx-auto max-w-[760px] px-[clamp(22px,5vw,56px)] pb-[clamp(72px,12vh,130px)] pt-[clamp(64px,11vh,120px)] text-center">
          <Reveal className="mb-[30px] inline-flex items-center gap-[9px] font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-gold">
            <span className="h-[6px] w-[6px] rounded-full bg-gold shadow-[0_0_14px_rgba(216,180,120,0.8)]" />
            The decoding is complete
          </Reveal>
          <Reveal
            as="h1"
            delay={0.08}
            className="m-0 text-balance font-serif text-[clamp(38px,7.6vw,74px)] font-medium leading-[1.04] tracking-[-0.014em] text-light"
          >
            Your blueprint has been decoded.
          </Reveal>
          <Reveal
            as="p"
            delay={0.16}
            className="mt-[24px] font-serif text-[clamp(20px,3.2vw,26px)] italic text-light-soft"
          >
            Your Personal Read is ready below.
          </Reveal>
        </div>

        {/* GENERATED REPORT */}
        <div className="tk-report relative mx-auto max-w-[820px] px-[clamp(16px,4vw,40px)] pb-[clamp(64px,10vh,110px)]">
          <PersonalReadReport />
        </div>
      </section>

      {/* ===================== RECEIPT + WHAT'S NEXT ===================== */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[900px] px-[clamp(22px,5vw,56px)] py-[clamp(56px,9vh,90px)]">
          {/* RECEIPT STRIP */}
          <Reveal className="flex flex-wrap items-center gap-x-[28px] gap-y-[14px] rounded-[12px] border border-dark/10 bg-paper px-[24px] py-[18px]">
            <div className="flex items-center gap-[10px]">
              <span className="h-[7px] w-[7px] rounded-full bg-gold-strong" />
              <span className="text-[13.5px] font-medium text-dark">
                Personal Read™
              </span>
            </div>
            <span className="h-[16px] w-px bg-dark/15" />
            <span className="text-[13.5px] text-dark-soft">June 22, 2026</span>
            <span className="h-[16px] w-px bg-dark/15" />
            <span className="text-[13.5px] text-dark-soft">
              A copy is on its way to your inbox
            </span>
          </Reveal>

          {/* WHAT'S NEXT */}
          <Reveal
            delay={0.1}
            className="mx-auto mt-[clamp(48px,8vh,80px)] max-w-[600px] text-center"
          >
            <div className="mb-[22px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold-strong">
              Getting the most from it
            </div>
            <h2 className="m-0 text-balance font-serif text-[clamp(28px,5vw,48px)] font-medium leading-[1.08] tracking-[-0.012em] text-dark">
              Find a quiet moment. Read it slowly.
            </h2>
            <p className="mt-[20px] text-[clamp(15px,2vw,17px)] leading-[1.65] text-dark-soft">
              Your Read isn&apos;t meant to be skimmed once and filed away. It&apos;s
              a foundation to return to — as you grow, as life shifts, as new
              questions arrive. This is a beginning, not a finish line.
            </p>
          </Reveal>

          <Reveal
            delay={0.16}
            className="mt-[40px] grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[14px]"
          >
            {NEXT_STEPS.map(([num, copy]) => (
              <div
                key={num}
                className="rounded-[10px] border border-dark/[0.08] bg-paper p-[24px] text-center"
              >
                <div className="font-serif text-[30px] text-gold">{num}</div>
                <p className="mt-[8px] text-[14.5px] leading-[1.55] text-dark-soft">
                  {copy}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===================== EXPLORE ANOTHER READ ===================== */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[920px] px-[clamp(22px,5vw,56px)] py-[clamp(64px,10vh,120px)]">
          <Reveal className="mb-[26px] text-center font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold-strong">
            Continue the Journey
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
                Now that you know who you are at your core, discover where it&apos;s
                all pointing — your soul direction and the mission beneath your days.
              </p>
            </div>
            <div className="flex flex-col items-start gap-[16px]">
              <span className="font-serif text-[34px] font-semibold text-gold-strong">
                $49
              </span>
              <Link
                href="/reads/personal-read"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-dark/25 bg-transparent px-[26px] py-[14px] font-sans text-[14.5px] font-semibold text-dark no-underline transition-[border-color,color] duration-300 hover:border-gold-strong hover:text-gold-strong"
              >
                Explore this Read →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== BOUNDARY (LIGHT TOUCH) ===================== */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[680px] px-[clamp(22px,5vw,56px)] py-[clamp(48px,7vh,80px)] text-center">
          <Reveal
            as="p"
            className="m-0 text-[clamp(15px,2vw,17px)] leading-[1.7] text-dark-soft"
          >
            A gentle reminder: your Read is a{" "}
            <span className="font-medium text-gold-strong">
              personal foundation
            </span>{" "}
            built from your own data — a mirror for reflection, not therapy,
            diagnosis, or a quick fix. Take what resonates, and let it grow with
            you.
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
