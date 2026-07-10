"use client";

/* ----------------------------------------------------------------------------
   /admin/products/[productId] — Product editor

   Everything about a product is set here AND configurable:
     · Specs (pages, people, attachment depth, tagline, positioning, delivery)
     · Pricing (launch + future)
     · Generated report spec (format, section count, depth, delivery)
     · AI configuration (model, temperature, max tokens, top-p, system prompt)
     · Numerology field selection (field, rationale, weight — add / edit / remove)
     · Brand copy (fixed intro / closing)
     · Language rules
     · The LLM prompt mapped to every report section (inline, via SectionEditor)

   The deep section-by-section experience is also available on its own in the
   Reports Editor — both write to the same store.
--------------------------------------------------------------------------- */

import Link from "next/link";
import { useParams } from "next/navigation";
import { useProduct } from "@/lib/productStore";
import {
  AI_MODELS,
  NON_DIAGNOSTIC_RULE,
  type FieldWeight,
  type NumerologyFieldRef,
} from "@/lib/products";
import {
  Panel,
  TextField,
  NumberField,
  TextArea,
  Select,
  Chip,
  Label,
} from "@/components/admin/Field";
import { SectionEditor } from "@/components/admin/SectionEditor";

const WEIGHTS: { value: FieldWeight; label: string }[] = [
  { value: "primary", label: "Primary" },
  { value: "used", label: "Used" },
  { value: "context", label: "Context" },
];

export default function ProductEditorPage() {
  const { productId } = useParams<{ productId: string }>();
  const { product, customized, patch, setSection, reset } = useProduct(productId);

  if (!product) {
    return (
      <div className="mx-auto max-w-[1000px] px-[clamp(18px,4vw,36px)] py-16">
        <p className="font-serif text-[22px] text-light-soft">Product not found.</p>
        <Link href="/admin/products" className="mt-4 inline-block font-sans text-[14px] text-gold no-underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  const fields = product.numerologyFields;
  const setFields = (next: NumerologyFieldRef[]) => patch({ numerologyFields: next });
  const setRule = (i: number, v: string) => {
    const next = [...product.languageRules];
    next[i] = v;
    patch({ languageRules: next });
  };

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-gold/15 bg-ink-deep/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4 px-[clamp(18px,4vw,36px)] py-4">
          <div className="min-w-0">
            <Link
              href="/admin/products"
              className="font-sans text-[11px] uppercase tracking-[0.18em] text-light-soft no-underline transition hover:text-gold"
            >
              ← Products / {product.category}
            </Link>
            <h1 className="mt-1 truncate font-serif text-[26px] font-medium text-light">
              {product.name}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {customized && <Chip tone="gold">Customized</Chip>}
            <Link
              href={`/admin/reports/${product.id}`}
              className="rounded-full bg-gold px-4 py-[8px] font-sans text-[12.5px] font-semibold text-[#1b1710] no-underline transition hover:-translate-y-0.5"
            >
              Open in Reports Editor →
            </Link>
            <button
              onClick={() => {
                if (confirm("Reset this product to its spec default?")) reset();
              }}
              className="rounded-full border border-gold/30 px-4 py-[8px] font-sans text-[12.5px] text-light-soft transition hover:border-gold hover:text-gold"
            >
              Reset to spec
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-[clamp(18px,4vw,36px)] py-8">
        {/* SPECS */}
        <Panel title="Specifications" subtitle="Core product attributes.">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <TextField label="Product name" value={product.name} onChange={(v) => patch({ name: v })} />
            <TextField label="Tagline" value={product.tagline ?? ""} onChange={(v) => patch({ tagline: v })} />
            <TextField label="Pages" value={product.pages} onChange={(v) => patch({ pages: v })} />
            <NumberField label="People" value={product.people} min={1} max={2} onChange={(v) => patch({ people: v })} />
            <TextField label="Attachment (Layer 6)" value={product.attachment} onChange={(v) => patch({ attachment: v })} />
            <TextField label="Perfect for" value={product.perfectFor ?? ""} onChange={(v) => patch({ perfectFor: v })} />
            <TextField label="Upsell from" value={product.upsellFrom ?? ""} onChange={(v) => patch({ upsellFrom: v })} />
            <TextField label="Upsell to" value={product.upsellTo ?? ""} onChange={(v) => patch({ upsellTo: v })} />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <TextArea label="Formula (layers applied)" value={product.formula} onChange={(v) => patch({ formula: v })} minRows={2} />
            <TextField label="Delivery" value={product.delivery} onChange={(v) => patch({ delivery: v })} />
          </div>
        </Panel>

        {/* PRICING */}
        <Panel title="Pricing" subtitle="Launch price and future / target price (USD).">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
            <NumberField label="Launch price" value={product.priceLaunch} min={0} step={1} suffix="USD" onChange={(v) => patch({ priceLaunch: v })} />
            <NumberField
              label="Future price (optional)"
              value={product.priceFuture ?? 0}
              min={0}
              step={1}
              suffix="USD"
              onChange={(v) => patch({ priceFuture: v || undefined })}
            />
          </div>
        </Panel>

        {/* GENERATED REPORT SPEC */}
        <Panel title="Generated Report Spec" subtitle="The shape of the delivered report.">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <TextField label="Format" value={product.reportSpec.format} onChange={(v) => patch({ reportSpec: { ...product.reportSpec, format: v } })} />
            <TextField label="Page count" value={product.reportSpec.pageCount} onChange={(v) => patch({ reportSpec: { ...product.reportSpec, pageCount: v } })} />
            <TextField label="Section count" value={product.reportSpec.sectionCount} onChange={(v) => patch({ reportSpec: { ...product.reportSpec, sectionCount: v } })} />
            <TextField label="Depth (words)" value={product.reportSpec.depthWords} onChange={(v) => patch({ reportSpec: { ...product.reportSpec, depthWords: v } })} />
          </div>
          <div className="mt-4">
            <TextArea label="Delivery" value={product.reportSpec.delivery} onChange={(v) => patch({ reportSpec: { ...product.reportSpec, delivery: v } })} minRows={2} />
          </div>
        </Panel>

        {/* AI CONFIGURATION */}
        <Panel
          title="AI Configuration"
          subtitle="Model + sampling parameters + the global system prompt applied ahead of every section prompt."
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
            <Select
              label="Model"
              value={product.ai.model}
              options={AI_MODELS.map((m) => ({ value: m, label: m }))}
              onChange={(v) => patch({ ai: { ...product.ai, model: v } })}
            />
            <NumberField label="Temperature" value={product.ai.temperature} step={0.05} min={0} max={2} onChange={(v) => patch({ ai: { ...product.ai, temperature: v } })} />
            <NumberField label="Max tokens" value={product.ai.maxTokens} step={256} min={256} onChange={(v) => patch({ ai: { ...product.ai, maxTokens: v } })} />
            <NumberField label="Top-p" value={product.ai.topP} step={0.05} min={0} max={1} onChange={(v) => patch({ ai: { ...product.ai, topP: v } })} />
          </div>
          <div className="mt-4">
            <TextArea
              label="System prompt (global)"
              value={product.ai.systemPrompt}
              onChange={(v) => patch({ ai: { ...product.ai, systemPrompt: v } })}
              minRows={5}
              hint="Prepended to every section's prompt. Keep the non-diagnostic language rule intact."
            />
            {!product.ai.systemPrompt.includes("Non-Diagnostic") && (
              <button
                onClick={() =>
                  patch({ ai: { ...product.ai, systemPrompt: `${product.ai.systemPrompt}\n\n${NON_DIAGNOSTIC_RULE}` } })
                }
                className="mt-2 rounded-full border border-gold/40 px-3 py-[5px] font-sans text-[11px] text-gold transition hover:bg-gold/[0.08]"
              >
                + Re-insert non-diagnostic rule
              </button>
            )}
          </div>
        </Panel>

        {/* NUMEROLOGY FIELDS */}
        <Panel
          title="Numerology Fields"
          subtitle="Which of the 34 engine fields this product selects, with rationale and emphasis weight."
          right={
            <button
              onClick={() => setFields([...fields, { field: "", why: "", weight: "used" }])}
              className="rounded-full border border-gold/40 px-3 py-[6px] font-sans text-[12px] text-gold transition hover:bg-gold/[0.08]"
            >
              + Add field
            </button>
          }
        >
          <div className="space-y-3">
            {fields.map((f, i) => (
              <div key={i} className="rounded-xl border border-gold/15 bg-ink-deep/40 p-[14px]">
                <div className="grid grid-cols-[1fr_160px_auto] items-end gap-3">
                  <TextField label={`Field ${i + 1}`} value={f.field} onChange={(v) => setFields(fields.map((x, j) => (j === i ? { ...x, field: v } : x)))} />
                  <Select
                    label="Weight"
                    value={f.weight}
                    options={WEIGHTS}
                    onChange={(v) => setFields(fields.map((x, j) => (j === i ? { ...x, weight: v as FieldWeight } : x)))}
                  />
                  <button
                    onClick={() => setFields(fields.filter((_, j) => j !== i))}
                    className="mb-[2px] rounded-lg border border-light-soft/25 px-3 py-[9px] font-sans text-[12px] text-light-soft transition hover:border-red-400/60 hover:text-red-300"
                    aria-label="Remove field"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-3">
                  <TextArea label="Why this field" value={f.why} onChange={(v) => setFields(fields.map((x, j) => (j === i ? { ...x, why: v } : x)))} minRows={2} />
                </div>
              </div>
            ))}
            {fields.length === 0 && (
              <p className="font-sans text-[13px] text-light-soft/70">No fields selected yet.</p>
            )}
          </div>
        </Panel>

        {/* BRAND COPY */}
        <Panel title="Brand Copy" subtitle="Fixed intro and closing copy, rendered verbatim in the report.">
          <div className="space-y-4">
            <TextArea label="Brand Intro" value={product.brandIntro} onChange={(v) => patch({ brandIntro: v })} minRows={4} />
            <TextArea label="Brand Closing" value={product.brandClosing} onChange={(v) => patch({ brandClosing: v })} minRows={4} />
          </div>
        </Panel>

        {/* LANGUAGE RULES */}
        <Panel
          title="Language Rules"
          subtitle="Locked guardrails enforced across the whole report."
          right={
            <button
              onClick={() => patch({ languageRules: [...product.languageRules, ""] })}
              className="rounded-full border border-gold/40 px-3 py-[6px] font-sans text-[12px] text-gold transition hover:bg-gold/[0.08]"
            >
              + Add rule
            </button>
          }
        >
          <div className="space-y-3">
            {product.languageRules.map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-[10px] font-mono text-[12px] text-gold">{i + 1}.</span>
                <div className="flex-1">
                  <TextArea value={r} onChange={(v) => setRule(i, v)} minRows={2} />
                </div>
                <button
                  onClick={() => patch({ languageRules: product.languageRules.filter((_, j) => j !== i) })}
                  className="mt-[8px] rounded-lg border border-light-soft/25 px-2.5 py-[7px] font-sans text-[11px] text-light-soft transition hover:border-red-400/60 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </Panel>

        {/* SECTION PROMPTS */}
        <Panel
          title="Report Sections & LLM Prompts"
          subtitle={`${product.sections.length} sections — expand any to edit the LLM prompt mapped to it. Full editing also in the Reports Editor.`}
          right={
            <Link
              href={`/admin/reports/${product.id}`}
              className="rounded-full border border-gold/40 px-3 py-[6px] font-sans text-[12px] text-gold no-underline transition hover:bg-gold/[0.08]"
            >
              Reports Editor →
            </Link>
          }
        >
          <div className="space-y-2.5">
            {product.sections.map((s) => (
              <SectionEditor key={s.id} section={s} onChange={(p) => setSection(s.id, p)} />
            ))}
          </div>
        </Panel>
      </main>
    </div>
  );
}
