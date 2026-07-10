"use client";

import Link from "next/link";

/* Tab strip shared by the report Content editor and the Style editor. */
export function ReportTabs({ productId, active }: { productId: string; active: "content" | "style" }) {
  const tabs = [
    { key: "content", label: "Content & Prompts", href: `/admin/reports/${productId}` },
    { key: "style", label: "PDF Style", href: `/admin/reports/${productId}/style` },
  ] as const;

  return (
    <div className="mx-auto flex max-w-[1100px] gap-1 px-[clamp(18px,4vw,36px)]">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`-mb-px border-b-2 px-4 py-[10px] font-sans text-[13px] font-semibold no-underline transition ${
            active === t.key
              ? "border-gold text-gold"
              : "border-transparent text-light-soft hover:text-light"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
