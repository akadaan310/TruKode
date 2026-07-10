"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Item = {
  href: string;
  label: string;
  hint: string;
  exact?: boolean;
  icon: React.ReactNode;
};

const ITEMS: Item[] = [
  {
    href: "/admin",
    label: "Calculation Engine",
    hint: "Inspect all 34 derived fields",
    exact: true,
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <rect x="4" y="3" width="16" height="18" rx="2" strokeWidth="1.6" className="stroke-current" />
        <line x1="8" y1="7" x2="16" y2="7" strokeWidth="1.6" strokeLinecap="round" className="stroke-current" />
        <line x1="8" y1="11" x2="9" y2="11" strokeWidth="1.6" strokeLinecap="round" className="stroke-current" />
        <line x1="11.5" y1="11" x2="12.5" y2="11" strokeWidth="1.6" strokeLinecap="round" className="stroke-current" />
        <line x1="15" y1="11" x2="16" y2="11" strokeWidth="1.6" strokeLinecap="round" className="stroke-current" />
        <line x1="8" y1="15" x2="9" y2="15" strokeWidth="1.6" strokeLinecap="round" className="stroke-current" />
        <line x1="11.5" y1="15" x2="12.5" y2="15" strokeWidth="1.6" strokeLinecap="round" className="stroke-current" />
        <line x1="15" y1="15" x2="16" y2="18" strokeWidth="1.6" strokeLinecap="round" className="stroke-current" />
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "Products",
    hint: "Specs, pricing & AI config",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" strokeWidth="1.6" strokeLinejoin="round" className="stroke-current" />
        <path d="M4 7.5l8 4.5 8-4.5M12 12v9" strokeWidth="1.6" strokeLinejoin="round" className="stroke-current" />
      </svg>
    ),
  },
  {
    href: "/admin/reports",
    label: "Reports Editor",
    hint: "Every report, section by section",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M6 3h9l3 3v15H6V3z" strokeWidth="1.6" strokeLinejoin="round" className="stroke-current" />
        <path d="M14 3v4h4" strokeWidth="1.6" strokeLinejoin="round" className="stroke-current" />
        <line x1="9" y1="12" x2="15" y2="12" strokeWidth="1.6" strokeLinecap="round" className="stroke-current" />
        <line x1="9" y1="15.5" x2="15" y2="15.5" strokeWidth="1.6" strokeLinecap="round" className="stroke-current" />
      </svg>
    ),
  },
  {
    href: "/admin/labs",
    label: "Labs",
    hint: "Test & refine section prompts",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M9 3h6M10 3v6.2L5.2 17A2 2 0 0 0 7 20h10a2 2 0 0 0 1.8-3L14 9.2V3" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" className="stroke-current" />
        <path d="M7.8 14h8.4" strokeWidth="1.6" strokeLinecap="round" className="stroke-current" />
        <circle cx="10.5" cy="16.5" r="0.9" className="fill-current" />
        <circle cx="13.5" cy="17.6" r="0.7" className="fill-current" />
      </svg>
    ),
  },
  {
    href: "/admin/how-to",
    label: "How-To",
    hint: "Guides for every section",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5z" strokeWidth="1.6" strokeLinejoin="round" className="stroke-current" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5A2.5 2.5 0 0 1 20 21.5V5.5z" strokeWidth="1.6" strokeLinejoin="round" className="stroke-current" />
      </svg>
    ),
  },
  {
    href: "/admin/orders",
    label: "Orders",
    hint: "Reads purchased & in progress",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M4 7l1.5-2.5h13L20 7" strokeWidth="1.6" strokeLinejoin="round" className="stroke-current" />
        <rect x="4" y="7" width="16" height="13" rx="1.5" strokeWidth="1.6" className="stroke-current" />
        <path d="M9 11a3 3 0 0 0 6 0" strokeWidth="1.6" strokeLinecap="round" className="stroke-current" />
      </svg>
    ),
  },
  {
    href: "/admin/users",
    label: "Users",
    hint: "Clients & their intakes",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <circle cx="9" cy="8" r="3.2" strokeWidth="1.6" className="stroke-current" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0" strokeWidth="1.6" strokeLinecap="round" className="stroke-current" />
        <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 19a5.5 5.5 0 0 0-3-4.9" strokeWidth="1.6" strokeLinecap="round" className="stroke-current" />
      </svg>
    ),
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (item: Item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const nav = (
    <nav className="flex flex-col gap-1.5">
      {ITEMS.map((item) => {
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`group flex items-start gap-3 rounded-xl border px-[14px] py-[12px] no-underline transition ${
              active
                ? "border-gold/40 bg-gold/[0.09] text-light"
                : "border-transparent text-light-soft hover:border-gold/20 hover:bg-ink-soft/60 hover:text-light"
            }`}
          >
            <span
              className={`mt-[1px] flex-none transition ${
                active ? "text-gold" : "text-light-soft group-hover:text-gold"
              }`}
            >
              {item.icon}
            </span>
            <span className="flex flex-col">
              <span className="font-sans text-[14.5px] font-semibold leading-tight">
                {item.label}
              </span>
              <span className="mt-[3px] font-sans text-[11.5px] leading-snug text-light-soft/70">
                {item.hint}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gold/15 bg-ink-deep/90 px-[clamp(18px,4vw,36px)] py-3 backdrop-blur-md md:hidden">
        <Link href="/admin" className="font-serif text-[20px] font-semibold text-light no-underline">
          TruKode<span className="text-gold">.</span>{" "}
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-light-soft">
            Admin
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle admin menu"
          className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-gold/30"
        >
          <span className="flex w-[16px] flex-col gap-[4px]">
            <span className="h-[1.6px] rounded-sm bg-light" />
            <span className="h-[1.6px] rounded-sm bg-light" />
            <span className="h-[1.6px] w-[70%] rounded-sm bg-light" />
          </span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-b border-gold/15 bg-ink-deep px-[clamp(18px,4vw,36px)] py-4 md:hidden">
          {nav}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[264px] flex-none flex-col border-r border-gold/15 bg-ink-deep/60 px-[18px] py-6 md:flex">
        <Link
          href="/admin"
          className="mb-2 flex items-baseline gap-2 px-[6px] no-underline"
        >
          <span className="font-serif text-[24px] font-semibold leading-none text-light">
            TruKode<span className="text-gold">.</span>
          </span>
        </Link>
        <div className="mb-6 px-[6px] font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
          Admin Dashboard
        </div>

        {nav}

        <div className="mt-auto px-[6px] pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-sans text-[12.5px] text-light-soft no-underline transition hover:text-gold"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
              <path d="M13 5l-7 7 7 7M6 12h13" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="stroke-current" />
            </svg>
            Back to site
          </Link>
        </div>
      </aside>
    </>
  );
}
