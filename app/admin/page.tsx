"use client";

/* ----------------------------------------------------------------------------
   /admin — Calculation Engine Inspector

   Enter the 5 raw client inputs (or load whatever the last intake captured)
   and see how every one of the 34 fields is derived, live, per the spec.
   Backed entirely by lib/engine.ts — the same functions a real order runs.
--------------------------------------------------------------------------- */

import { useEffect, useMemo, useState } from "react";
import {
  calculateAll,
  CATEGORY_ORDER,
  type RawInputs,
  type ComputedField,
} from "@/lib/engine";

const EMPTY: RawInputs = {
  firstName: "",
  middleName: "",
  lastName: "",
  dob: "",
  placeOfBirth: "",
  country: "",
  birthTime: "",
};

const SAMPLE: RawInputs = {
  firstName: "John",
  middleName: "Michael",
  lastName: "Smith",
  dob: "1990-06-15",
  placeOfBirth: "London",
  country: "United Kingdom",
  birthTime: "14:30",
};

const field =
  "w-full bg-ink-soft border border-gold/25 rounded-lg px-[13px] py-[10px] font-sans text-[15px] text-light placeholder:text-light-soft/50 focus:outline-none focus:border-gold [color-scheme:dark]";
const labelCls =
  "block mb-[6px] font-sans text-[11px] uppercase tracking-[0.14em] text-light-soft";

function badgeTone(bt: ComputedField["birthTime"]): string {
  if (bt === "Yes") return "border-gold/60 text-gold";
  if (bt === "Partial") return "border-gold/35 text-gold/80";
  return "border-light-soft/25 text-light-soft";
}

export default function AdminPage() {
  const [inputs, setInputs] = useState<RawInputs>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");

  // Load whatever the last intake captured, once, on mount.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("ekodz:intake");
      if (raw) {
        const p = JSON.parse(raw);
        setInputs({
          firstName: p.firstName || "",
          middleName: p.middleName || "",
          lastName: p.lastName || "",
          dob: p.dob || "",
          placeOfBirth: p.placeOfBirth || "",
          country: p.country || "",
          birthTime: p.birthTime || "",
        });
        setLoaded(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const set = (k: keyof RawInputs) => (v: string) =>
    setInputs((s) => ({ ...s, [k]: v }));

  const hasEnough = inputs.firstName.trim() && inputs.lastName.trim() && inputs.dob.trim();

  const computed = useMemo<ComputedField[]>(() => {
    if (!hasEnough) return [];
    try {
      return calculateAll(inputs, new Date());
    } catch {
      return [];
    }
  }, [inputs, hasEnough]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return computed;
    return computed.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        String(f.num) === q,
    );
  }, [computed, query]);

  const byCategory = useMemo(() => {
    const map = new Map<string, ComputedField[]>();
    for (const f of filtered) {
      if (!map.has(f.category)) map.set(f.category, []);
      map.get(f.category)!.push(f);
    }
    return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => ({
      category: c,
      fields: map.get(c)!,
    }));
  }, [filtered]);

  const activeCount = computed.filter((f) => !f.result.unavailable).length;

  return (
    <div className="min-h-screen bg-ink text-light">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-gold/15 bg-ink-deep/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-[clamp(18px,4vw,36px)] py-4">
          <div>
            <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
              Calculation Engine · Admin
            </div>
            <h1 className="mt-1 font-serif text-[26px] font-medium text-light">
              All 34 Fields <span className="text-gold">·</span> Live Derivation
            </h1>
          </div>
          {hasEnough && (
            <div className="text-right font-sans text-[13px] text-light-soft">
              <span className="text-light">{activeCount}</span>/34 fields
              calculated
              <br />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter fields…"
                className="mt-2 w-[200px] rounded-md border border-gold/25 bg-ink-soft px-3 py-[7px] text-[13px] text-light focus:border-gold focus:outline-none"
              />
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-[clamp(18px,4vw,36px)] py-8">
        {/* INPUT PANEL */}
        <section className="mb-9 rounded-2xl border border-gold/20 bg-ink-soft/50 p-[clamp(18px,3vw,28px)]">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-serif text-[20px] text-light">
              Raw Client Inputs
              <span className="ml-2 font-sans text-[12px] text-light-soft">
                — the 5 inputs all 34 fields derive from
              </span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {loaded && (
                <span className="rounded-full border border-gold/40 px-3 py-[5px] font-sans text-[11px] text-gold">
                  Loaded from last intake
                </span>
              )}
              <button
                onClick={() => setInputs(SAMPLE)}
                className="rounded-full border border-gold/30 px-3 py-[5px] font-sans text-[12px] text-light-soft transition hover:border-gold hover:text-gold"
              >
                Load sample
              </button>
              <button
                onClick={() => setInputs(EMPTY)}
                className="rounded-full border border-gold/30 px-3 py-[5px] font-sans text-[12px] text-light-soft transition hover:border-gold hover:text-gold"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
            <div>
              <label className={labelCls}>First name *</label>
              <input
                className={field}
                value={inputs.firstName}
                onChange={(e) => set("firstName")(e.target.value)}
                placeholder="First"
              />
            </div>
            <div>
              <label className={labelCls}>Middle name</label>
              <input
                className={field}
                value={inputs.middleName}
                onChange={(e) => set("middleName")(e.target.value)}
                placeholder="Middle (optional)"
              />
            </div>
            <div>
              <label className={labelCls}>Last name *</label>
              <input
                className={field}
                value={inputs.lastName}
                onChange={(e) => set("lastName")(e.target.value)}
                placeholder="Last"
              />
            </div>
            <div>
              <label className={labelCls}>Date of birth *</label>
              <input
                type="date"
                className={field}
                value={inputs.dob}
                onChange={(e) => set("dob")(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Place of birth</label>
              <input
                className={field}
                value={inputs.placeOfBirth}
                onChange={(e) => set("placeOfBirth")(e.target.value)}
                placeholder="City"
              />
            </div>
            <div>
              <label className={labelCls}>Country</label>
              <input
                className={field}
                value={inputs.country}
                onChange={(e) => set("country")(e.target.value)}
                placeholder="Country"
              />
            </div>
            <div>
              <label className={labelCls}>Birth time</label>
              <input
                type="time"
                className={field}
                value={inputs.birthTime || ""}
                onChange={(e) => set("birthTime")(e.target.value)}
              />
              <p className="mt-[6px] font-sans text-[11px] leading-snug text-light-soft/70">
                Leave blank to see graceful null handling (fields 9, 10, 11).
              </p>
            </div>
          </div>
        </section>

        {!hasEnough && (
          <div className="rounded-2xl border border-dashed border-gold/25 py-16 text-center">
            <p className="font-serif text-[22px] text-light-soft">
              Enter a first name, last name, and date of birth to calculate.
            </p>
            <button
              onClick={() => setInputs(SAMPLE)}
              className="mt-5 rounded-full bg-gold px-6 py-3 font-sans text-[14px] font-semibold text-[#1b1710] transition hover:-translate-y-0.5"
            >
              Or load a sample client
            </button>
          </div>
        )}

        {/* FIELD SECTIONS */}
        {byCategory.map(({ category, fields }) => (
          <section key={category} className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <h3 className="font-serif text-[22px] text-gold">{category}</h3>
              <span className="h-px flex-1 bg-gold/15" />
              <span className="font-sans text-[12px] text-light-soft">
                {fields.length} {fields.length === 1 ? "field" : "fields"}
              </span>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
              {fields.map((f) => (
                <article
                  key={f.num}
                  className={`flex flex-col rounded-xl border bg-ink-soft/40 p-[18px] transition ${
                    f.result.unavailable
                      ? "border-light-soft/15 opacity-70"
                      : "border-gold/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-[10px]">
                      <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full border border-gold/40 font-sans text-[13px] font-semibold text-gold">
                        {f.num}
                      </span>
                      <h4 className="font-serif text-[19px] leading-tight text-light">
                        {f.name}
                      </h4>
                    </div>
                    <div
                      className={`flex-none rounded-full border px-[9px] py-[3px] font-sans text-[10px] uppercase tracking-[0.08em] ${badgeTone(
                        f.birthTime,
                      )}`}
                      title="Birth time required"
                    >
                      {f.birthTime === "No"
                        ? "No time"
                        : f.birthTime === "Yes"
                          ? "Needs time"
                          : "Partial"}
                    </div>
                  </div>

                  {/* VALUE */}
                  <div className="mt-[14px] flex items-baseline gap-2">
                    <span
                      className={`font-serif leading-none ${
                        f.result.unavailable
                          ? "text-[24px] text-light-soft"
                          : "text-[40px] text-gold"
                      }`}
                    >
                      {f.result.display}
                    </span>
                  </div>

                  <p className="mt-[10px] font-sans text-[13px] leading-[1.5] text-light-soft">
                    {f.plainMeaning}
                  </p>

                  {/* HOW / DERIVATION */}
                  <div className="mt-[14px] border-t border-gold/12 pt-[12px]">
                    <div className="mb-[6px] font-sans text-[10px] uppercase tracking-[0.14em] text-light-soft/80">
                      How it&apos;s calculated
                    </div>
                    <p className="mb-[10px] font-sans text-[12.5px] leading-[1.5] text-light-soft">
                      {f.howTo}
                    </p>
                    <div className="rounded-lg bg-ink-deep/60 p-[11px]">
                      {f.result.steps.map((s, idx) => (
                        <div
                          key={idx}
                          className="font-mono text-[12px] leading-[1.7] text-light/90"
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  {f.verify && (
                    <div className="mt-[12px] rounded-lg border border-gold/30 bg-gold/[0.06] px-[11px] py-[8px] font-sans text-[11.5px] leading-snug text-gold/90">
                      ⚠ Formula verification flagged in spec — confirm exact
                      formula against a recognized reference before production.
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}

        {hasEnough && (
          <footer className="mt-6 rounded-xl border border-gold/15 bg-ink-soft/30 p-5 font-sans text-[12.5px] leading-[1.6] text-light-soft">
            <strong className="text-light">Engine note.</strong> All 34 fields
            are calculated for every client regardless of product — report
            templates select which to display. Master numbers 11, 22, 33 are
            never reduced. Compatibility products call these same functions twice
            (once per person). Fields flagged ⚠ use an interpretive formula
            pending verification against a recognized numerology reference.
          </footer>
        )}
      </main>
    </div>
  );
}
