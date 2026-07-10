import Link from "next/link";
import type { ReactNode } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { productsByCategory, formatPrice, type ProductCategory } from "@/lib/products";

/* ----------------------------------------------------------------------------
   /products — the full Ekodz product catalog for the marketing site.
   Names, prices, pages and people come from the canonical catalog
   (lib/products.ts) so the site and the admin panel never drift. Marketing
   copy, icons, links and badges are layered on top per product.
--------------------------------------------------------------------------- */

type Meta = { copy: string; href: string; cta: string; badge?: string; icon: ReactNode };

const I = {
  personal: (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
      <circle cx="20" cy="20" r="14" className="stroke-gold" strokeWidth="1.6" />
      <circle cx="20" cy="20" r="4" className="fill-gold" />
    </svg>
  ),
  compat: (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
      <circle cx="15" cy="20" r="11" className="stroke-gold" strokeWidth="1.6" />
      <circle cx="25" cy="20" r="11" className="stroke-gold" strokeWidth="1.6" />
    </svg>
  ),
  purpose: (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
      <polygon points="20,3 23,17 37,20 23,23 20,37 17,23 3,20 17,17" className="fill-gold" />
    </svg>
  ),
  roadblock: (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
      <line x1="5" y1="20" x2="14" y2="20" className="stroke-gold" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="26" y1="20" x2="35" y2="20" className="stroke-gold" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="15.5" y="15.5" width="9" height="9" rx="1.5" transform="rotate(45 20 20)" className="stroke-gold" strokeWidth="1.6" />
    </svg>
  ),
  career: (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
      <rect x="6" y="24" width="6" height="10" rx="1.5" className="fill-gold" />
      <rect x="17" y="17" width="6" height="17" rx="1.5" className="fill-gold" />
      <rect x="28" y="8" width="6" height="26" rx="1.5" className="fill-gold" />
    </svg>
  ),
  architecture: (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
      <path d="M20 4l14 8v16l-14 8-14-8V12z" className="stroke-gold" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6 12l14 8 14-8M20 20v16" className="stroke-gold" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  love: (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
      <path d="M20 33S7 25.5 7 16.5A6.5 6.5 0 0 1 20 13a6.5 6.5 0 0 1 13 3.5C33 25.5 20 33 20 33z" className="fill-gold" />
    </svg>
  ),
  professional: (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
      <rect x="6" y="13" width="28" height="20" rx="2.5" className="stroke-gold" strokeWidth="1.6" />
      <path d="M15 13v-2.5A2.5 2.5 0 0 1 17.5 8h5A2.5 2.5 0 0 1 25 10.5V13" className="stroke-gold" strokeWidth="1.6" />
      <line x1="6" y1="22" x2="34" y2="22" className="stroke-gold" strokeWidth="1.6" />
    </svg>
  ),
  soul: (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
      <path d="M20 5c4 6 4 10 0 14-4-4-4-8 0-14z" className="fill-gold" />
      <path d="M20 33c-5-1-9-5-9-11 5 1 9 5 9 11zM20 33c5-1 9-5 9-11-5 1-9 5-9 11z" className="fill-gold" />
    </svg>
  ),
  duet: (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
      <circle cx="14" cy="14" r="6" className="stroke-gold" strokeWidth="1.6" />
      <circle cx="26" cy="14" r="6" className="stroke-gold" strokeWidth="1.6" />
      <path d="M5 33a9 9 0 0 1 18 0M17 33a9 9 0 0 1 18 0" className="stroke-gold" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  manual: (
    <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
      <path d="M20 9c-3-2-7-3-11-3v25c4 0 8 1 11 3 3-2 7-3 11-3V6c-4 0-8 1-11 3z" className="stroke-gold" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1="20" y1="9" x2="20" y2="34" className="stroke-gold" strokeWidth="1.6" />
    </svg>
  ),
};

const META: Record<string, Meta> = {
  "personal-read": { copy: "Who you are at your core — personality, strengths, blind spots, and decision style.", href: "/reads/personal-read", cta: "Learn more", badge: "Best place to start", icon: I.personal },
  "compatibility-read": { copy: "How you and your partner connect, communicate, and clash.", href: "/reads/compatibility-read", cta: "Learn more", icon: I.compat },
  "life-purpose-read": { copy: "Your soul direction, mission, and conscious path.", href: "/reads/life-purpose-read", cta: "Learn more", icon: I.purpose },
  "roadblock-read": { copy: "The specific patterns blocking you from moving forward.", href: "/reads/roadblock-read", cta: "Learn more", icon: I.roadblock },
  "career-business-read": { copy: "Your natural professional strengths, direction, and blocks.", href: "/reads/career-business-read", cta: "Learn more", icon: I.career },
  "personal-architecture-blueprint": { copy: "Who you are, fully decoded — your complete personal wiring in one comprehensive report.", href: "/intake", cta: "Get started", icon: I.architecture },
  "love-connection-blueprint": { copy: "How you love, connect, and what gets in the way — attachment patterns at full depth.", href: "/intake", cta: "Get started", icon: I.love },
  "professional-design-blueprint": { copy: "Your professional wiring, your career path, and what's blocking your success.", href: "/intake", cta: "Get started", icon: I.professional },
  "soul-conscious-blueprint": { copy: "Your soul's purpose, conscious evolution, and what you're truly here for.", href: "/intake", cta: "Get started", icon: I.soul },
  "compatibility-blueprint": { copy: "Two people, fully decoded — how you're each wired and how to bring out your best together.", href: "/intake", cta: "Get started", badge: "For two", icon: I.duet },
  "ekodz-manual": { copy: "The complete picture — all four dimensions of you, fully integrated, plus the exclusive Integration Chapter™.", href: "/intake", cta: "Get started", badge: "Flagship", icon: I.manual },
};

const CATEGORY_INTRO: Record<ProductCategory, string> = {
  Reads: "Focused, essential reports — the fastest way into your blueprint.",
  Blueprints: "Comprehensive single-dimension deep dives — all six layers, at full depth.",
  "Compatibility Blueprints": "For two people — how your two designs actually work together.",
  Manuals: "The flagship — everything about you, fully integrated into one document.",
};

export default function ProductsPage() {
  const groups = productsByCategory().filter((g) => g.products.length > 0);

  return (
    <div className="bg-ink">
      <Nav />

      {/* ===================== PAGE HEADER ===================== */}
      <section className="relative overflow-hidden bg-ink">
        <div className="pointer-events-none absolute left-1/2 top-[-30%] h-[min(820px,140vw)] w-[min(820px,140vw)] -translate-x-1/2 animate-[tkGlow_9s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(216,180,120,0.16),rgba(216,180,120,0.04)_42%,transparent_64%)]" />
        <div className="relative mx-auto max-w-[820px] px-[clamp(22px,5vw,56px)] py-[clamp(72px,12vh,130px)] pb-[clamp(56px,9vh,90px)] text-center">
          <Reveal className="mb-[24px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.28em] text-gold">
            The Products
          </Reveal>
          <Reveal
            as="h1"
            delay={0.1}
            className="m-0 text-balance font-serif text-[clamp(40px,7.4vw,72px)] font-medium leading-[1.03] tracking-[-0.014em] text-light"
          >
            Every way to read your blueprint.
          </Reveal>
          <Reveal
            as="p"
            delay={0.18}
            className="mx-auto mt-[24px] max-w-[580px] text-[clamp(15px,2.1vw,18px)] leading-[1.65] text-light-soft"
          >
            From a focused Read to the complete Manual — every product is decoded
            from your own unique data through The Blueprint System™, each
            illuminating a different dimension of who you are.
          </Reveal>
        </div>
      </section>

      {/* ===================== CATEGORY SECTIONS ===================== */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1160px] px-[clamp(22px,5vw,56px)] py-[clamp(56px,9vh,96px)]">
          {groups.map((group) => (
            <div key={group.category} className="mb-[clamp(48px,7vh,80px)] last:mb-0">
              <Reveal className="mb-[28px] flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-dark/10 pb-[16px]">
                <div>
                  <h2 className="m-0 font-serif text-[clamp(28px,4.4vw,42px)] font-medium leading-[1.05] tracking-[-0.01em] text-dark">
                    {group.category}
                  </h2>
                  <p className="mt-[8px] max-w-[520px] text-[14.5px] leading-[1.55] text-dark-soft">
                    {CATEGORY_INTRO[group.category]}
                  </p>
                </div>
                <span className="font-sans text-[12px] uppercase tracking-[0.14em] text-dark-soft/70">
                  {group.products.length} {group.products.length === 1 ? "product" : "products"}
                </span>
              </Reveal>

              <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-[18px]">
                {group.products.map((p) => {
                  const m = META[p.id];
                  if (!m) return null;
                  const featured = m.badge === "Best place to start" || m.badge === "Flagship";
                  return (
                    <Link
                      key={p.id}
                      href={m.href}
                      className={
                        featured
                          ? "relative flex flex-col rounded-[14px] border-[1.5px] border-gold bg-paper px-[28px] pb-[26px] pt-[32px] no-underline shadow-[0_14px_40px_rgba(216,180,120,0.18)] transition-[transform,box-shadow] duration-[350ms] hover:-translate-y-[5px] hover:shadow-[0_22px_52px_rgba(216,180,120,0.24)]"
                          : "flex flex-col rounded-[14px] border border-dark/10 bg-paper px-[28px] pb-[26px] pt-[32px] no-underline transition-[transform,box-shadow,border-color] duration-[350ms] hover:-translate-y-[5px] hover:border-gold/50 hover:shadow-[0_18px_44px_rgba(42,38,32,0.1)]"
                      }
                    >
                      {m.badge && (
                        <span className="absolute -top-[11px] left-[28px] rounded-full bg-gold px-[13px] py-[5px] font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#1b1710]">
                          {m.badge}
                        </span>
                      )}
                      <span className="flex h-[54px] w-[54px] items-center justify-center rounded-[12px] bg-gold/[0.12]">
                        {m.icon}
                      </span>
                      <h3 className="mb-0 mt-[22px] font-serif text-[24px] font-semibold leading-[1.12] text-dark">
                        {p.name}
                      </h3>
                      <p className="mt-[10px] flex-1 text-[14.5px] leading-[1.55] text-dark-soft">
                        {m.copy}
                      </p>
                      <div className="mt-[26px] flex items-end justify-between border-t border-dark/10 pt-[18px]">
                        <div className="flex flex-col gap-[3px]">
                          <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-dark-soft">
                            {p.pages}
                          </span>
                          <span className="font-serif text-[27px] font-semibold leading-none text-gold-strong">
                            {formatPrice(p)}
                          </span>
                        </div>
                        <span className="whitespace-nowrap font-sans text-[14px] font-semibold text-dark">
                          {m.cta} →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== NOT SURE WHERE TO START ===================== */}
      <section className="bg-cream pb-[clamp(64px,10vh,110px)]">
        <div className="mx-auto max-w-[1000px] px-[clamp(22px,5vw,56px)]">
          <Reveal className="flex flex-wrap items-center gap-[clamp(22px,4vw,44px)] rounded-[16px] border border-gold/40 bg-[linear-gradient(135deg,rgba(216,180,120,0.14),rgba(216,180,120,0.05))] p-[clamp(30px,4.5vw,48px)]">
            <div className="flex-[1_1_320px]">
              <div className="mb-[14px] font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-strong">
                Not sure where to start?
              </div>
              <h2 className="m-0 text-balance font-serif text-[clamp(26px,4vw,38px)] font-medium leading-[1.1] tracking-[-0.01em] text-dark">
                Begin with the Personal Read™.
              </h2>
              <p className="mt-[14px] max-w-[480px] text-[15.5px] leading-[1.6] text-dark-soft">
                Every other product builds on knowing your own blueprint first.
                Understand who you are at your core, and the rest comes into
                focus.
              </p>
            </div>
            <Link
              href="/intake"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-gold px-[30px] py-[16px] font-sans text-[15px] font-semibold text-[#1b1710] no-underline transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(216,180,120,0.32)]"
            >
              Start here — $29
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===================== THE BOUNDARY ===================== */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[840px] px-[clamp(22px,5vw,56px)] py-[clamp(72px,11vh,130px)] text-center">
          <Reveal className="mb-[24px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold">
            Clarity, Not Labels
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="m-0 text-balance font-serif text-[clamp(24px,4.2vw,40px)] font-normal leading-[1.22] tracking-[-0.008em] text-light"
          >
            Not therapy. Not a quiz. Not a quick fix. Not a box you&apos;re
            placed in.{" "}
            <span className="text-gold">
              A personal foundation — built from your own data.
            </span>
          </Reveal>
        </div>
      </section>

      {/* ===================== FAQ TEASER ===================== */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[760px] px-[clamp(22px,5vw,56px)] py-[clamp(64px,10vh,110px)] text-center">
          <Reveal className="mb-[20px] font-sans text-[11.5px] font-semibold uppercase tracking-[0.26em] text-gold-strong">
            Questions?
          </Reveal>
          <Reveal
            as="h2"
            delay={0.08}
            className="m-0 text-balance font-serif text-[clamp(28px,4.8vw,46px)] font-medium leading-[1.08] tracking-[-0.01em] text-dark"
          >
            How it works, what we need, and how it&apos;s delivered.
          </Reveal>
          <Reveal
            as="p"
            delay={0.14}
            className="mx-auto mt-[18px] max-w-[480px] text-[clamp(15px,2vw,17px)] leading-[1.65] text-dark-soft"
          >
            Everything you might want to know before you begin — answered
            plainly.
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              href="/faq"
              className="mt-[30px] inline-flex items-center justify-center rounded-full border border-dark/25 bg-transparent px-[30px] py-[15px] font-sans text-[15px] font-semibold text-dark no-underline transition-colors duration-300 hover:border-gold-strong hover:text-gold-strong"
            >
              Visit the FAQ →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="relative overflow-hidden bg-ink">
        <div className="pointer-events-none absolute bottom-[-40%] left-1/2 h-[min(820px,150vw)] w-[min(820px,150vw)] -translate-x-1/2 animate-[tkGlow_10s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(216,180,120,0.18),rgba(216,180,120,0.05)_40%,transparent_64%)]" />
        <div className="relative mx-auto max-w-[820px] px-[clamp(22px,5vw,56px)] py-[clamp(90px,15vh,170px)] text-center">
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
            Choose your product and begin.
          </Reveal>
          <Reveal
            delay={0.18}
            className="mt-[40px] flex flex-col items-center gap-[14px]"
          >
            <Link
              href="/reads/personal-read"
              className="inline-flex items-center justify-center rounded-full bg-gold px-[36px] py-[17px] font-sans text-[16px] font-semibold text-[#1b1710] no-underline transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(216,180,120,0.34)]"
            >
              Discover Your Blueprint
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
