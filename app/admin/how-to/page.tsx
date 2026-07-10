"use client";

/* ----------------------------------------------------------------------------
   /admin/how-to — Guide library

   A searchable, category-filtered index of task-oriented guides for the
   Products, Reports Editor, Style Editor, and Labs sections.
--------------------------------------------------------------------------- */

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CATEGORY_ORDER,
  CATEGORY_META,
  GUIDES,
  searchGuides,
  type GuideCategory,
} from "@/lib/guides";

const levelTone: Record<string, string> = {
  Basics: "border-light-soft/25 text-light-soft",
  Intermediate: "border-gold/40 text-gold/85",
  Advanced: "border-gold/60 text-gold",
};

export default function HowToPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<GuideCategory | "All">("All");

  const results = useMemo(() => {
    let list = searchGuides(query);
    if (cat !== "All") list = list.filter((g) => g.category === cat);
    return list;
  }, [query, cat]);

  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        items: results.filter((g) => g.category === category),
      })).filter((g) => g.items.length > 0),
    [results],
  );

  const counts = useMemo(() => {
    const m = new Map<GuideCategory, number>();
    for (const g of GUIDES) m.set(g.category, (m.get(g.category) ?? 0) + 1);
    return m;
  }, []);

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-gold/15 bg-ink-deep/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 px-[clamp(18px,4vw,36px)] py-4">
          <div>
            <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
              How-To · Admin
            </div>
            <h1 className="mt-1 font-serif text-[26px] font-medium text-light">
              Guides <span className="text-gold">·</span> {GUIDES.length} how-tos
            </h1>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides…"
            className="w-full max-w-[280px] rounded-full border border-gold/25 bg-ink-soft px-4 py-[9px] font-sans text-[13.5px] text-light placeholder:text-light-soft/50 focus:border-gold focus:outline-none"
          />
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-[clamp(18px,4vw,36px)] py-8">
        {/* CATEGORY FILTER */}
        <div className="mb-8 flex flex-wrap gap-2">
          <FilterChip active={cat === "All"} onClick={() => setCat("All")} label="All" count={GUIDES.length} />
          {CATEGORY_ORDER.map((c) => (
            <FilterChip key={c} active={cat === c} onClick={() => setCat(c)} label={c} count={counts.get(c) ?? 0} />
          ))}
        </div>

        {results.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gold/25 py-16 text-center">
            <p className="font-serif text-[22px] text-light-soft">No guides match “{query}”.</p>
            <button
              onClick={() => { setQuery(""); setCat("All"); }}
              className="mt-4 rounded-full border border-gold/40 px-5 py-[9px] font-sans text-[13px] text-gold transition hover:bg-gold/[0.08]"
            >
              Clear filters
            </button>
          </div>
        )}

        {grouped.map(({ category, items }) => (
          <section key={category} className="mb-10">
            <div className="mb-1 flex items-center gap-3">
              <h2 className="font-serif text-[22px] text-gold">{category}</h2>
              <span className="h-px flex-1 bg-gold/15" />
              <span className="font-sans text-[12px] text-light-soft">
                {items.length} {items.length === 1 ? "guide" : "guides"}
              </span>
            </div>
            <p className="mb-4 font-sans text-[12.5px] text-light-soft/75">{CATEGORY_META[category].blurb}</p>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
              {items.map((g) => (
                <Link
                  key={g.slug}
                  href={`/admin/how-to/${g.slug}`}
                  className="group flex flex-col rounded-2xl border border-gold/20 bg-ink-soft/40 p-[18px] no-underline transition hover:border-gold/50 hover:bg-ink-soft/60"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`rounded-full border px-[9px] py-[3px] font-sans text-[10px] uppercase tracking-[0.08em] ${levelTone[g.level]}`}>
                      {g.level}
                    </span>
                    <span className="font-sans text-[11.5px] text-light-soft/70">{g.minutes} min</span>
                  </div>
                  <h3 className="font-serif text-[19px] leading-tight text-light">{g.title}</h3>
                  <p className="mt-2 flex-1 font-sans text-[13px] leading-relaxed text-light-soft/85">{g.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {g.tags.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-md border border-gold/15 px-[7px] py-[2px] font-sans text-[10.5px] text-light-soft/70">
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

function FilterChip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-[13px] py-[7px] font-sans text-[12.5px] font-semibold transition ${
        active ? "border-gold bg-gold/[0.1] text-gold" : "border-gold/20 text-light-soft hover:border-gold/45 hover:text-light"
      }`}
    >
      {label}
      <span className={`ml-2 font-normal ${active ? "text-gold/70" : "text-light-soft/50"}`}>{count}</span>
    </button>
  );
}
