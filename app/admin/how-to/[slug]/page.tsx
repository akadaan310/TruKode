"use client";

/* ----------------------------------------------------------------------------
   /admin/how-to/[slug] — Guide detail

   Renders one guide: meta, prerequisites, numbered steps, tips, a deep-link
   CTA into the relevant admin section, related guides, and prev/next within
   the same category.
--------------------------------------------------------------------------- */

import Link from "next/link";
import { useParams } from "next/navigation";
import { GUIDES, getGuide, type Guide } from "@/lib/guides";
import { formatInline } from "@/components/admin/RichText";

const levelTone: Record<string, string> = {
  Basics: "border-light-soft/25 text-light-soft",
  Intermediate: "border-gold/40 text-gold/85",
  Advanced: "border-gold/60 text-gold",
};

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = getGuide(slug);

  if (!guide) {
    return (
      <div className="mx-auto max-w-[900px] px-[clamp(18px,4vw,36px)] py-16">
        <p className="font-serif text-[22px] text-light-soft">Guide not found.</p>
        <Link href="/admin/how-to" className="mt-4 inline-block font-sans text-[14px] text-gold no-underline">
          ← Back to all guides
        </Link>
      </div>
    );
  }

  const siblings = GUIDES.filter((g) => g.category === guide.category);
  const idx = siblings.findIndex((g) => g.slug === guide.slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null;
  const prereqs = (guide.prereqs ?? []).map(getGuide).filter(Boolean) as Guide[];
  const related = (guide.related ?? []).map(getGuide).filter(Boolean) as Guide[];

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-gold/15 bg-ink-deep/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[900px] items-center justify-between gap-4 px-[clamp(18px,4vw,36px)] py-4">
          <Link
            href="/admin/how-to"
            className="font-sans text-[11px] uppercase tracking-[0.18em] text-light-soft no-underline transition hover:text-gold"
          >
            ← How-To / {guide.category}
          </Link>
          {guide.cta && (
            <Link
              href={guide.cta.href}
              className="rounded-full bg-gold px-4 py-[8px] font-sans text-[12.5px] font-semibold text-[#1b1710] no-underline transition hover:-translate-y-0.5"
            >
              {guide.cta.label} →
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-[clamp(18px,4vw,36px)] py-9">
        {/* TITLE */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-[9px] py-[3px] font-sans text-[10px] uppercase tracking-[0.08em] ${levelTone[guide.level]}`}>
            {guide.level}
          </span>
          <span className="font-sans text-[12px] text-light-soft">{guide.minutes} min read</span>
        </div>
        <h1 className="font-serif text-[clamp(30px,5vw,40px)] font-medium leading-[1.1] text-light">{guide.title}</h1>
        <p className="mt-3 max-w-[680px] font-sans text-[15px] leading-relaxed text-light-soft">{guide.summary}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {guide.tags.map((t) => (
            <span key={t} className="rounded-md border border-gold/15 px-[8px] py-[3px] font-sans text-[11px] text-light-soft/75">
              {t}
            </span>
          ))}
        </div>

        {/* PREREQS */}
        {prereqs.length > 0 && (
          <div className="mt-7 rounded-xl border border-gold/20 bg-ink-soft/40 p-[16px]">
            <div className="mb-2 font-sans text-[11px] uppercase tracking-[0.14em] text-gold">Before you start</div>
            <ul className="space-y-1.5">
              {prereqs.map((p) => (
                <li key={p.slug}>
                  <Link href={`/admin/how-to/${p.slug}`} className="font-sans text-[13.5px] text-light no-underline transition hover:text-gold">
                    → {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* STEPS */}
        <section className="mt-8">
          <h2 className="mb-4 font-serif text-[22px] text-gold">Steps</h2>
          <ol className="space-y-4">
            {guide.steps.map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full border border-gold/40 font-sans text-[13px] font-semibold text-gold">
                  {i + 1}
                </span>
                <div className="pt-[3px]">
                  <p className="font-sans text-[14.5px] leading-[1.65] text-light/90">{formatInline(s.do)}</p>
                  {s.note && (
                    <p className="mt-1.5 font-sans text-[12.5px] leading-relaxed text-light-soft/80">{formatInline(s.note)}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* TIPS */}
        {guide.tips && guide.tips.length > 0 && (
          <section className="mt-8 rounded-2xl border border-gold/25 bg-gold/[0.05] p-[clamp(16px,2.5vw,22px)]">
            <div className="mb-2 flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.14em] text-gold">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2A6 6 0 0 0 12 3z" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" className="stroke-current" />
              </svg>
              Tips
            </div>
            <ul className="space-y-2">
              {guide.tips.map((t, i) => (
                <li key={i} className="flex gap-2 font-sans text-[13.5px] leading-relaxed text-light/90">
                  <span className="text-gold">•</span>
                  <span>{formatInline(t)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA */}
        {guide.cta && (
          <Link
            href={guide.cta.href}
            className="mt-8 flex items-center justify-between rounded-2xl border border-gold/30 bg-ink-soft/40 px-5 py-4 no-underline transition hover:border-gold/60 hover:bg-ink-soft/60"
          >
            <span>
              <span className="block font-sans text-[11px] uppercase tracking-[0.14em] text-light-soft/70">Try it now</span>
              <span className="mt-0.5 block font-serif text-[19px] text-light">{guide.cta.label}</span>
            </span>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className="text-gold">
              <path d="M5 12h13M13 6l6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="stroke-current" />
            </svg>
          </Link>
        )}

        {/* RELATED */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 font-serif text-[19px] text-light">Related guides</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/admin/how-to/${r.slug}`}
                  className="rounded-xl border border-gold/20 bg-ink-soft/30 p-[14px] no-underline transition hover:border-gold/50"
                >
                  <span className="block font-sans text-[10.5px] uppercase tracking-[0.1em] text-gold/80">{r.category}</span>
                  <span className="mt-1 block font-serif text-[16px] leading-tight text-light">{r.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* PREV / NEXT */}
        <nav className="mt-10 flex flex-wrap gap-3 border-t border-gold/12 pt-6">
          {prev ? (
            <Link href={`/admin/how-to/${prev.slug}`} className="flex-1 rounded-xl border border-gold/20 p-4 no-underline transition hover:border-gold/50">
              <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-light-soft/70">← Previous</span>
              <span className="mt-1 block font-serif text-[16px] text-light">{prev.title}</span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link href={`/admin/how-to/${next.slug}`} className="flex-1 rounded-xl border border-gold/20 p-4 text-right no-underline transition hover:border-gold/50">
              <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-light-soft/70">Next →</span>
              <span className="mt-1 block font-serif text-[16px] text-light">{next.title}</span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
      </main>
    </div>
  );
}
