"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/products", label: "Products" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gold/[0.13] bg-ink/[0.72] backdrop-blur-[18px] backdrop-saturate-[1.4]">
        <div className="mx-auto flex max-w-[1160px] items-center gap-5 px-[clamp(20px,5vw,56px)] py-[14px]">
          <Link
            href="/"
            className="flex-none font-serif text-[25px] font-semibold leading-none tracking-[0.01em] text-light no-underline"
          >
            TruKode<span className="text-gold">.</span>
          </Link>

          <nav className="ml-auto hidden flex-none items-center gap-[clamp(20px,3vw,38px)] whitespace-nowrap min-[881px]:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-[14.5px] tracking-[0.005em] no-underline transition-colors duration-[250ms] hover:text-light ${
                  isActive(link.href)
                    ? "font-semibold text-light"
                    : "font-medium text-light-soft"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/intake"
            className="ml-auto inline-flex flex-none items-center whitespace-nowrap rounded-full bg-gold px-[21px] py-[10px] font-sans text-[13px] font-semibold tracking-[0.01em] text-[#1b1710] no-underline transition-[transform,box-shadow] duration-300 hover:-translate-y-px hover:shadow-[0_8px_22px_rgba(216,180,120,0.3)]"
          >
            <span className="max-[880px]:hidden">Start your Read</span>
            <span className="hidden max-[880px]:inline">Start</span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="hidden h-[42px] w-[42px] flex-none items-center justify-center rounded-[11px] border border-gold/[0.28] bg-transparent p-0 max-[880px]:inline-flex"
          >
            <span className="flex w-[18px] flex-col gap-[5px]">
              <span className="h-[1.6px] rounded-sm bg-light" />
              <span className="h-[1.6px] rounded-sm bg-light" />
              <span className="h-[1.6px] w-[72%] rounded-sm bg-light" />
            </span>
          </button>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex flex-col bg-[rgba(16,13,9,0.92)] backdrop-blur-[22px]"
          style={{ animation: "tkNavFade .28s ease both" }}
        >
          <div className="mx-auto flex w-full max-w-[1160px] flex-none items-center justify-between gap-5 px-[clamp(20px,5vw,56px)] py-[14px]">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="font-serif text-[25px] font-semibold leading-none text-light no-underline"
            >
              TruKode<span className="text-gold">.</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-[11px] border border-gold/[0.28] bg-transparent p-0"
            >
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  className="stroke-light"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav className="mx-auto flex w-full max-w-[760px] flex-1 flex-col justify-center gap-1.5 px-[clamp(28px,8vw,56px)] pb-[8vh]">
            {LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-serif text-[clamp(34px,9vw,52px)] font-medium leading-[1.18] tracking-[-0.01em] text-light no-underline"
                style={{ animation: `tkNavRise .4s ease both ${0.04 + i * 0.06}s` }}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/intake"
              onClick={() => setOpen(false)}
              className="mt-[38px] inline-flex items-center self-start rounded-full bg-gold px-[30px] py-[15px] font-sans text-[15px] font-semibold text-[#1b1710] no-underline"
              style={{ animation: "tkNavRise .4s ease both .3s" }}
            >
              Start your Read
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
