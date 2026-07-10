"use client";

/* ----------------------------------------------------------------------------
   /admin/labs — Prompt Workbench

   A lab bench for testing and refining the AI prompt logic defined for each
   product's sections. Enter a test subject (the same 5 raw inputs the
   Calculation Engine uses), pick a product, then run either the FULL report
   or any INDIVIDUAL sections. Each run shows the simulated draft, the fully
   resolved prompt that would be sent to the model, and the exact fields
   injected — so edits made in the Reports Editor can be tried instantly here.
--------------------------------------------------------------------------- */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { RawInputs } from "@/lib/engine";
import { CATEGORY_ORDER } from "@/lib/products";
import { useProducts, useProduct } from "@/lib/productStore";
import {
  computeSnapshot,
  generateSection,
  READOUT_FIELDS,
  type LabField,
} from "@/lib/labs";
import { SpecimenCard, type RunState } from "@/components/admin/SpecimenCard";
import { Chip } from "@/components/admin/Field";

const EMPTY: RawInputs = { firstName: "", middleName: "", lastName: "", dob: "", placeOfBirth: "", country: "", birthTime: "" };
const SAMPLE_A: RawInputs = { firstName: "John", middleName: "Michael", lastName: "Smith", dob: "1990-06-15", placeOfBirth: "London", country: "United Kingdom", birthTime: "14:30" };
const SAMPLE_B: RawInputs = { firstName: "Emma", middleName: "Rose", lastName: "Taylor", dob: "1992-11-02", placeOfBirth: "Manchester", country: "United Kingdom", birthTime: "09:10" };

const field =
  "w-full bg-ink-soft border border-gold/25 rounded-lg px-[12px] py-[9px] font-sans text-[14px] text-light placeholder:text-light-soft/50 focus:outline-none focus:border-gold [color-scheme:dark] transition";
const labelCls = "block mb-[5px] font-sans text-[10.5px] uppercase tracking-[0.14em] text-light-soft";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function SubjectInputs({
  legend,
  inputs,
  set,
}: {
  legend: string;
  inputs: RawInputs;
  set: (k: keyof RawInputs, v: string) => void;
}) {
  return (
    <fieldset className="rounded-xl border border-gold/15 bg-ink-deep/40 p-[14px]">
      <legend className="px-2 font-sans text-[11px] uppercase tracking-[0.16em] text-gold">{legend}</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label><span className={labelCls}>First *</span><input className={field} value={inputs.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="First" /></label>
        <label><span className={labelCls}>Middle</span><input className={field} value={inputs.middleName} onChange={(e) => set("middleName", e.target.value)} placeholder="Middle" /></label>
        <label><span className={labelCls}>Last *</span><input className={field} value={inputs.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Last" /></label>
        <label><span className={labelCls}>Date of birth *</span><input type="date" className={field} value={inputs.dob} onChange={(e) => set("dob", e.target.value)} /></label>
        <label><span className={labelCls}>Place</span><input className={field} value={inputs.placeOfBirth} onChange={(e) => set("placeOfBirth", e.target.value)} placeholder="City" /></label>
        <label><span className={labelCls}>Country</span><input className={field} value={inputs.country} onChange={(e) => set("country", e.target.value)} placeholder="Country" /></label>
        <label className="col-span-2 sm:col-span-1"><span className={labelCls}>Birth time</span><input type="time" className={field} value={inputs.birthTime || ""} onChange={(e) => set("birthTime", e.target.value)} /></label>
      </div>
    </fieldset>
  );
}

export default function LabsPage() {
  const products = useProducts();
  const [productId, setProductId] = useState("personal-read");
  const { product } = useProduct(productId);

  const [inputsA, setInputsA] = useState<RawInputs>(SAMPLE_A);
  const [inputsB, setInputsB] = useState<RawInputs>(SAMPLE_B);
  const [mode, setMode] = useState<"full" | "sections">("full");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [runs, setRuns] = useState<Record<string, RunState>>({});
  const [order, setOrder] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const runId = useRef(0);

  const now = useMemo(() => new Date(), []);
  const twoPerson = product?.people === 2;

  const setA = (k: keyof RawInputs, v: string) => setInputsA((s) => ({ ...s, [k]: v }));
  const setB = (k: keyof RawInputs, v: string) => setInputsB((s) => ({ ...s, [k]: v }));

  const hasEnoughA = !!(inputsA.firstName.trim() && inputsA.lastName.trim() && inputsA.dob.trim());
  const hasEnoughB = !!(inputsB.firstName.trim() && inputsB.lastName.trim() && inputsB.dob.trim());
  const ready = hasEnoughA && (!twoPerson || hasEnoughB);

  const fieldsA = useMemo<LabField[]>(() => (hasEnoughA ? computeSnapshot(inputsA, now) : []), [inputsA, hasEnoughA, now]);
  const fieldsB = useMemo<LabField[]>(() => (twoPerson && hasEnoughB ? computeSnapshot(inputsB, now) : []), [inputsB, twoPerson, hasEnoughB, now]);

  // Default selection = all sections whenever the product changes.
  useEffect(() => {
    if (product) setSelected(new Set(product.sections.map((s) => s.id)));
    setRuns({});
    setOrder([]);
    setElapsed(null);
  }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const readout = useMemo(
    () => READOUT_FIELDS.map((n) => fieldsA.find((f) => f.num === n)).filter(Boolean) as LabField[],
    [fieldsA],
  );

  if (!product) return null;

  const sectionsToRun = () =>
    mode === "full" ? product.sections : product.sections.filter((s) => selected.has(s.id));

  const bPayload = () => (twoPerson ? { inputs: inputsB, fields: fieldsB } : undefined);

  async function run() {
    if (!ready || running) return;
    const secs = sectionsToRun();
    if (!secs.length) return;
    const myRun = ++runId.current;
    setRunning(true);
    setElapsed(null);
    setOrder(secs.map((s) => s.id));
    setRuns(Object.fromEntries(secs.map((s) => [s.id, { status: "queued" } as RunState])));
    const t0 = performance.now();
    for (const s of secs) {
      if (runId.current !== myRun) return; // superseded
      setRuns((prev) => ({ ...prev, [s.id]: { status: "running" } }));
      await sleep(200 + Math.random() * 260);
      const r = generateSection(product!, s, { inputs: inputsA, fields: fieldsA }, bPayload());
      setRuns((prev) => ({ ...prev, [s.id]: { status: "done", run: r } }));
    }
    setElapsed(performance.now() - t0);
    setRunning(false);
  }

  async function rerun(id: string) {
    const s = product!.sections.find((x) => x.id === id);
    if (!s || running) return;
    setRuns((prev) => ({ ...prev, [id]: { status: "running" } }));
    await sleep(260 + Math.random() * 220);
    const r = generateSection(product!, s, { inputs: inputsA, fields: fieldsA }, bPayload());
    setRuns((prev) => ({ ...prev, [id]: { status: "done", run: r } }));
  }

  const doneRuns = order.map((id) => runs[id]?.run).filter(Boolean);
  const totalWords = doneRuns.reduce((a, r) => a + (r?.wordCount ?? 0), 0);
  const totalTokens = doneRuns.reduce((a, r) => a + (r?.estTokens ?? 0), 0);

  const grouped = CATEGORY_ORDER.map((c) => ({ c, items: products.filter((p) => p.category === c) }));

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-gold/15 bg-ink-deep/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-[clamp(18px,4vw,36px)] py-4">
          <div>
            <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">Labs · Prompt Workbench</div>
            <h1 className="mt-1 font-serif text-[26px] font-medium text-light">
              Test <span className="text-gold">·</span> Generate <span className="text-gold">·</span> Refine
            </h1>
          </div>
          {elapsed !== null && (
            <div className="flex flex-wrap gap-2">
              <Chip>{doneRuns.length} sections</Chip>
              <Chip>{totalWords} words</Chip>
              <Chip>≈ {totalTokens} tokens</Chip>
              <Chip tone="gold">{(elapsed / 1000).toFixed(1)}s</Chip>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-[clamp(18px,4vw,36px)] py-8">
        {/* CONSOLE */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-b from-ink-soft/70 to-ink-soft/30">
          <div className="border-b border-gold/15 px-[clamp(16px,3vw,26px)] py-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              {/* Product picker */}
              <label className="min-w-[240px] flex-1">
                <span className={labelCls}>Product under test</span>
                <select className={field} value={productId} onChange={(e) => setProductId(e.target.value)}>
                  {grouped.map(({ c, items }) => (
                    <optgroup key={c} label={c} className="bg-ink-soft">
                      {items.map((p) => (
                        <option key={p.id} value={p.id} className="bg-ink-soft">
                          {p.name} — {p.sections.length} sections{p.people === 2 ? " · 2 people" : ""}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>

              {/* Mode toggle */}
              <div>
                <span className={labelCls}>Run mode</span>
                <div className="inline-flex rounded-lg border border-gold/25 bg-ink-deep/50 p-[3px]">
                  {(["full", "sections"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`rounded-md px-[14px] py-[7px] font-sans text-[12.5px] font-semibold transition ${
                        mode === m ? "bg-gold text-[#1b1710]" : "text-light-soft hover:text-light"
                      }`}
                    >
                      {m === "full" ? "Full report" : "Individual sections"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Run button */}
              <button
                onClick={run}
                disabled={!ready || running || (mode === "sections" && selected.size === 0)}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-[11px] font-sans text-[14px] font-semibold text-[#1b1710] transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {running ? (
                  <>
                    <span className="h-[15px] w-[15px] animate-spin-slow rounded-full border-2 border-[#1b1710]/30 border-t-[#1b1710]" />
                    Running…
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                      <path d="M9 3h6M10 3v5.5L5.5 16A2 2 0 0 0 7.3 19h9.4a2 2 0 0 0 1.8-3L14 8.5V3" strokeWidth="1.6" strokeLinejoin="round" className="stroke-[#1b1710]" />
                    </svg>
                    Run {mode === "full" ? "full report" : `${selected.size} section${selected.size === 1 ? "" : "s"}`}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Test subject */}
          <div className="px-[clamp(16px,3vw,26px)] py-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-[18px] text-light">
                Test Subject{twoPerson ? "s" : ""}
                <span className="ml-2 font-sans text-[12px] text-light-soft">— the 5 raw inputs, exactly as intake captures them</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setInputsA(SAMPLE_A); setInputsB(SAMPLE_B); }} className="rounded-full border border-gold/30 px-3 py-[5px] font-sans text-[12px] text-light-soft transition hover:border-gold hover:text-gold">Load sample</button>
                <button onClick={() => { setInputsA(EMPTY); setInputsB(EMPTY); }} className="rounded-full border border-gold/30 px-3 py-[5px] font-sans text-[12px] text-light-soft transition hover:border-gold hover:text-gold">Clear</button>
              </div>
            </div>
            <div className={`grid gap-4 ${twoPerson ? "lg:grid-cols-2" : ""}`}>
              <SubjectInputs legend={twoPerson ? "Person A" : "Client"} inputs={inputsA} set={setA} />
              {twoPerson && <SubjectInputs legend="Person B" inputs={inputsB} set={setB} />}
            </div>

            {/* Live readout */}
            {readout.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="font-sans text-[10.5px] uppercase tracking-[0.14em] text-light-soft/70">
                  {twoPerson ? "Person A readout" : "Live readout"}
                </span>
                {readout.map((f) => (
                  <span key={f.num} className="rounded-lg border border-gold/25 bg-ink-deep/50 px-[10px] py-[5px] font-sans text-[12px] text-light-soft">
                    {f.name} <span className="ml-1 font-semibold text-gold">{f.display}</span>
                  </span>
                ))}
              </div>
            )}
            {!ready && (
              <p className="mt-3 font-sans text-[12.5px] text-gold/80">
                Enter first name, last name, and date of birth{twoPerson ? " for both people" : ""} to enable a run.
              </p>
            )}
          </div>

          {/* Section chooser (sections mode) */}
          {mode === "sections" && (
            <div className="border-t border-gold/15 px-[clamp(16px,3vw,26px)] py-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-sans text-[12px] uppercase tracking-[0.14em] text-light-soft">
                  Choose sections — {selected.size}/{product.sections.length}
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => setSelected(new Set(product.sections.map((s) => s.id)))} className="font-sans text-[12px] text-gold transition hover:underline">Select all</button>
                  <span className="text-light-soft/40">·</span>
                  <button onClick={() => setSelected(new Set())} className="font-sans text-[12px] text-light-soft transition hover:text-light">None</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sections.map((s) => {
                  const on = selected.has(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() =>
                        setSelected((prev) => {
                          const n = new Set(prev);
                          n.has(s.id) ? n.delete(s.id) : n.add(s.id);
                          return n;
                        })
                      }
                      className={`rounded-lg border px-[10px] py-[6px] font-sans text-[12px] transition ${
                        on ? "border-gold/60 bg-gold/[0.09] text-light" : "border-gold/15 text-light-soft/70 hover:border-gold/40"
                      }`}
                      title={s.title}
                    >
                      <span className="text-gold">{s.index}</span> {s.title.length > 26 ? s.title.slice(0, 25) + "…" : s.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* WORKBENCH */}
        {order.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gold/25 py-16 text-center">
            <p className="font-serif text-[22px] text-light-soft">The bench is clear.</p>
            <p className="mx-auto mt-2 max-w-[460px] font-sans text-[13px] leading-relaxed text-light-soft/70">
              Pick a product, set a test subject, and hit <span className="text-gold">Run</span>. Each section is
              generated with its configured prompt — inspect the output, the fully resolved prompt, and the exact
              fields injected. Tune a prompt in the Reports Editor, then run it again here.
            </p>
            <Link href={`/admin/reports/${productId}`} className="mt-5 inline-block rounded-full border border-gold/40 px-5 py-[9px] font-sans text-[13px] text-gold no-underline transition hover:bg-gold/[0.08]">
              Open this product in the Reports Editor →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-[20px] text-gold">Workbench</h2>
              <span className="h-px flex-1 bg-gold/15" />
              <span className="font-sans text-[12px] text-light-soft">
                {product.name} · {order.length} section{order.length === 1 ? "" : "s"}
              </span>
            </div>
            {order.map((id) => {
              const s = product.sections.find((x) => x.id === id)!;
              return (
                <SpecimenCard
                  key={id}
                  productId={productId}
                  index={s.index}
                  title={s.title}
                  type={s.type}
                  state={runs[id] ?? { status: "queued" }}
                  onRerun={() => rerun(id)}
                  disabled={running}
                />
              );
            })}
          </div>
        )}

        <footer className="mt-8 rounded-xl border border-gold/15 bg-ink-soft/30 p-5 font-sans text-[12.5px] leading-[1.6] text-light-soft">
          <strong className="text-light">About the Lab.</strong> The <em>Resolved prompt</em> tab shows the exact
          prompt that would be sent to the model — system prompt + product context + your subject's injected
          numerology + the section instruction — so it is a faithful prompt-engineering artifact. The generated
          drafts are a <span className="text-gold">simulation</span> that reacts to each prompt's directives and the
          subject's real calculated fields (no live model is wired yet); swapping in a real LLM call is a drop-in that
          reuses this same resolved prompt.
        </footer>
      </main>
    </div>
  );
}
