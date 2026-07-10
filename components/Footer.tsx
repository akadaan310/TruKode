import Link from "next/link";

const PRODUCTS: { label: string; href: string }[] = [
  { label: "All products", href: "/products" },
  { label: "Personal Read™", href: "/reads/personal-read" },
  { label: "Compatibility Read™", href: "/reads/compatibility-read" },
  { label: "Life Purpose Read™", href: "/reads/life-purpose-read" },
  { label: "Roadblock Read™", href: "/reads/roadblock-read" },
  { label: "Career / Business Read™", href: "/reads/career-business-read" },
];

export function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-ink-deep">
      <div className="mx-auto max-w-[1160px] px-[clamp(22px,5vw,56px)] pb-10 pt-[clamp(56px,8vh,84px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-x-7 gap-y-9">
          <div className="col-span-full max-w-[340px]">
            <Link
              href="/"
              className="font-serif text-[26px] font-semibold text-light no-underline"
            >
              TruKode<span className="text-gold">.</span>
            </Link>
            <p className="mt-[14px] font-serif text-[18px] italic leading-[1.4] text-light-soft">
              You came into this world without a manual. Consider this yours.
            </p>
          </div>

          <div>
            <div className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
              Products
            </div>
            <div className="flex flex-col gap-[11px]">
              {PRODUCTS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[14px] text-light-soft no-underline transition-colors duration-[250ms] hover:text-gold"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
              Explore
            </div>
            <div className="flex flex-col gap-[11px]">
              <Link
                href="/#how"
                className="text-[14px] text-light-soft no-underline transition-colors duration-[250ms] hover:text-gold"
              >
                How it works
              </Link>
              <Link
                href="/#who"
                className="text-[14px] text-light-soft no-underline transition-colors duration-[250ms] hover:text-gold"
              >
                Who it&apos;s for
              </Link>
              <Link
                href="/about"
                className="text-[14px] text-light-soft no-underline transition-colors duration-[250ms] hover:text-gold"
              >
                The Manifesto
              </Link>
            </div>
          </div>

          <div>
            <div className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
              Company
            </div>
            <div className="flex flex-col gap-[11px]">
              <a
                href="mailto:hello@trukode.com"
                className="text-[14px] text-light-soft no-underline transition-colors duration-[250ms] hover:text-gold"
              >
                Contact
              </a>
              <Link
                href="/faq"
                className="text-[14px] text-light-soft no-underline transition-colors duration-[250ms] hover:text-gold"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-7 gap-y-[14px] border-t border-gold/10 pt-[26px]">
          <span className="text-[12.5px] text-light-soft">
            © 2026 TruKode · Human Decode™ · The Blueprint System™
          </span>
          <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-light-soft/70">
            Made for becoming fully human
          </span>
        </div>
        <p className="mt-[22px] max-w-[720px] text-[12px] leading-[1.6] text-light-soft/65">
          TruKode offers tools for self-reflection and personal development. It
          is not therapy, medical or psychological diagnosis, or professional
          advice, and is not intended to diagnose, treat, or replace the care of
          a qualified professional.
        </p>
      </div>
    </footer>
  );
}
