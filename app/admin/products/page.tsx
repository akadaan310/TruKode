"use client";

/* ----------------------------------------------------------------------------
   /admin/products — Products catalog

   Every Ekodz product, grouped by category (Reads · Blueprints · Compatibility
   Blueprints · Manuals). Each card shows the live (possibly customized) price
   and specs and links to the full product editor, where specs, pricing, AI
   configuration, numerology fields, brand copy, language rules and the LLM
   prompt for every report section are all configurable.
--------------------------------------------------------------------------- */

import Link from "next/link";
import { useMemo } from "react";
import { CATEGORY_ORDER, formatPrice, type ProductCategory } from "@/lib/products";
import { useProducts, isCustomized, resetAll } from "@/lib/productStore";
import { Chip } from "@/components/admin/Field";

const CATEGORY_BLURB: Record<ProductCategory, string> = {
  Reads: "Focused, concise reports — 5-layer model. $29–$79.",
  Blueprints: "Comprehensive single-pillar reports — all 6 layers at full depth. $397 each.",
  "Compatibility Blueprints": "Two-person relationship reports built on two full field sets.",
  Manuals: "The flagship — all 4 pillars + the exclusive Integration Chapter™.",
};

export default function ProductsPage() {
  const products = useProducts();

  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        items: products.filter((p) => p.category === category),
      })),
    [products],
  );

  const customizedCount = products.filter((p) => isCustomized(p.id)).length;

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-gold/15 bg-ink-deep/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-[clamp(18px,4vw,36px)] py-4">
          <div>
            <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
              Products · Admin
            </div>
            <h1 className="mt-1 font-serif text-[26px] font-medium text-light">
              Product Catalog <span className="text-gold">·</span> {products.length} products
            </h1>
          </div>
          {customizedCount > 0 && (
            <button
              onClick={() => {
                if (confirm("Reset ALL products to their spec defaults? This clears every customization.")) resetAll();
              }}
              className="rounded-full border border-gold/30 px-4 py-[7px] font-sans text-[12px] text-light-soft transition hover:border-gold hover:text-gold"
            >
              Reset all to spec ({customizedCount} customized)
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-[clamp(18px,4vw,36px)] py-8">
        {grouped.map(({ category, items }) => (
          <section key={category} className="mb-11">
            <div className="mb-1 flex items-center gap-3">
              <h2 className="font-serif text-[23px] text-gold">{category}</h2>
              <span className="h-px flex-1 bg-gold/15" />
              <span className="font-sans text-[12px] text-light-soft">
                {items.length} {items.length === 1 ? "product" : "products"}
              </span>
            </div>
            <p className="mb-4 font-sans text-[12.5px] text-light-soft/75">
              {CATEGORY_BLURB[category]}
            </p>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
              {items.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}`}
                  className="group flex flex-col rounded-2xl border border-gold/20 bg-ink-soft/40 p-[18px] no-underline transition hover:border-gold/50 hover:bg-ink-soft/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-[20px] leading-tight text-light">
                      {p.name}
                    </h3>
                    <span className="flex-none font-serif text-[22px] leading-none text-gold">
                      {formatPrice(p)}
                    </span>
                  </div>

                  {p.tagline && (
                    <p className="mt-2 font-sans text-[12.5px] italic leading-snug text-light-soft/80">
                      {p.tagline}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Chip>{p.pages}</Chip>
                    <Chip>{p.people === 2 ? "2 people" : "1 person"}</Chip>
                    <Chip>{p.sections.length} sections</Chip>
                    {isCustomized(p.id) && <Chip tone="gold">Customized</Chip>}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gold/12 pt-3">
                    <span className="font-sans text-[11.5px] text-light-soft/70">
                      Attachment (L6): {p.attachment.split("—")[0].split("(")[0].trim() || "—"}
                    </span>
                    <span className="inline-flex items-center gap-1 font-sans text-[12.5px] font-semibold text-gold opacity-0 transition group-hover:opacity-100">
                      Configure
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                        <path d="M5 12h13M13 6l6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="stroke-current" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <footer className="mt-4 rounded-xl border border-gold/15 bg-ink-soft/30 p-5 font-sans text-[12.5px] leading-[1.6] text-light-soft">
          <strong className="text-light">How this works.</strong> These products are seeded
          from <span className="text-gold">ekodz-product-specs.md</span>. Every edit is saved to
          this browser and layered over the spec defaults — open any product to change its price,
          specs, AI configuration, numerology fields, brand copy, and the LLM prompt mapped to each
          report section. Use <em>Reset to spec</em> on a product (or all) to return to the
          original specification at any time.
        </footer>
      </main>
    </div>
  );
}
