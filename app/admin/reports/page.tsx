"use client";

/* ----------------------------------------------------------------------------
   /admin/reports — Reports Editor index

   Lists every product's report template. Click one to open the full report
   editor, where every aspect of that report — brand copy, generated-report
   spec, global AI config, and each section's LLM prompt — is configurable.
--------------------------------------------------------------------------- */

import Link from "next/link";
import { useMemo } from "react";
import { CATEGORY_ORDER } from "@/lib/products";
import { useProducts, isCustomized } from "@/lib/productStore";
import { Chip } from "@/components/admin/Field";

export default function ReportsIndexPage() {
  const products = useProducts();

  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        items: products.filter((p) => p.category === category),
      })),
    [products],
  );

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-gold/15 bg-ink-deep/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4 px-[clamp(18px,4vw,36px)] py-4">
          <div>
            <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
              Reports Editor · Admin
            </div>
            <h1 className="mt-1 font-serif text-[26px] font-medium text-light">
              Reports <span className="text-gold">·</span> Configure every section
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-[clamp(18px,4vw,36px)] py-8">
        <p className="mb-7 max-w-[720px] font-sans text-[13.5px] leading-relaxed text-light-soft">
          Click any report to open its editor. Inside, every aspect of the report is available
          and configurable — the fixed brand copy, the generated-report spec, the global AI
          configuration, and the specific LLM prompt mapped to each section of the report.
        </p>

        {grouped.map(({ category, items }) => (
          <section key={category} className="mb-9">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="font-serif text-[21px] text-gold">{category}</h2>
              <span className="h-px flex-1 bg-gold/15" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-gold/20 bg-ink-soft/40">
              {items.map((p, idx) => {
                const aiCount = p.sections.filter((s) => s.type === "AI").length;
                return (
                  <Link
                    key={p.id}
                    href={`/admin/reports/${p.id}`}
                    className={`flex flex-wrap items-center gap-4 px-5 py-4 no-underline transition hover:bg-gold/[0.05] ${
                      idx > 0 ? "border-t border-gold/[0.08]" : ""
                    }`}
                  >
                    <span className="min-w-[220px] flex-1">
                      <span className="block font-serif text-[19px] text-light">{p.name}</span>
                      {p.tagline && (
                        <span className="mt-[2px] block font-sans text-[12px] text-light-soft/75">
                          {p.tagline}
                        </span>
                      )}
                    </span>
                    <span className="flex flex-wrap items-center gap-1.5">
                      <Chip>{p.sections.length} sections</Chip>
                      <Chip tone="gold">{aiCount} AI</Chip>
                      {isCustomized(p.id) && <Chip tone="solid">Customized</Chip>}
                    </span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className="text-gold">
                      <path d="M5 12h13M13 6l6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="stroke-current" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
