"use client";

/* ----------------------------------------------------------------------------
   /admin/reports/[productId] — Report Editor (deep)

   When a report is clicked, ALL aspects of the report are available and
   configurable here:
     · Report overview / generated-report spec
     · AI configuration (model + sampling + global system prompt)
     · Fixed brand copy (intro / closing)
     · Language rules
     · Every section — title, type, primary fields, word count, framework step,
       and the LLM prompt mapped to that section.
--------------------------------------------------------------------------- */

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useProduct } from "@/lib/productStore";
import { AI_MODELS } from "@/lib/products";
import { Panel, TextField, NumberField, TextArea, Select, Chip } from "@/components/admin/Field";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { ReportTabs } from "@/components/admin/ReportTabs";

export default function ReportEditorPage() {
  const { productId } = useParams<{ productId: string }>();
  const { product, customized, patch, setSection, reset } = useProduct(productId);
  const [allOpen, setAllOpen] = useState<boolean | null>(null);
  const [rev, setRev] = useState(0); // remount key to force open/close all

  if (!product) {
    return (
      <div className="mx-auto max-w-[1000px] px-[clamp(18px,4vw,36px)] py-16">
        <p className="font-serif text-[22px] text-light-soft">Report not found.</p>
        <Link href="/admin/reports" className="mt-4 inline-block font-sans text-[14px] text-gold no-underline">
          ← Back to Reports Editor
        </Link>
      </div>
    );
  }

  const aiCount = product.sections.filter((s) => s.type === "AI").length;
  const toggleAll = (open: boolean) => {
    setAllOpen(open);
    setRev((r) => r + 1);
  };

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-gold/15 bg-ink-deep/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4 px-[clamp(18px,4vw,36px)] pt-4">
          <div className="min-w-0">
            <Link
              href="/admin/reports"
              className="font-sans text-[11px] uppercase tracking-[0.18em] text-light-soft no-underline transition hover:text-gold"
            >
              ← Reports Editor
            </Link>
            <h1 className="mt-1 truncate font-serif text-[26px] font-medium text-light">
              {product.name} <span className="text-gold">·</span> Report
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {customized && <Chip tone="gold">Customized</Chip>}
            <Link
              href={`/admin/products/${product.id}`}
              className="rounded-full border border-gold/30 px-4 py-[8px] font-sans text-[12.5px] text-light-soft no-underline transition hover:border-gold hover:text-gold"
            >
              Product specs & pricing →
            </Link>
            <button
              onClick={() => {
                if (confirm("Reset this report to its spec default?")) reset();
              }}
              className="rounded-full border border-gold/30 px-4 py-[8px] font-sans text-[12.5px] text-light-soft transition hover:border-gold hover:text-gold"
            >
              Reset to spec
            </button>
          </div>
        </div>
        <ReportTabs productId={productId} active="content" />
      </header>

      <main className="mx-auto max-w-[1100px] px-[clamp(18px,4vw,36px)] py-8">
        {/* OVERVIEW STRIP */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Chip>{product.category}</Chip>
          <Chip>{product.pages}</Chip>
          <Chip>{product.people === 2 ? "2 people" : "1 person"}</Chip>
          <Chip>{product.sections.length} sections</Chip>
          <Chip tone="gold">{aiCount} AI-generated</Chip>
          <Chip>{product.sections.length - aiCount} fixed copy</Chip>
        </div>

        {/* REPORT SPEC */}
        <Panel title="Generated Report Spec" subtitle="Format, size, depth and delivery of the produced report.">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4">
            <TextField label="Format" value={product.reportSpec.format} onChange={(v) => patch({ reportSpec: { ...product.reportSpec, format: v } })} />
            <TextField label="Page count" value={product.reportSpec.pageCount} onChange={(v) => patch({ reportSpec: { ...product.reportSpec, pageCount: v } })} />
            <TextField label="Section count" value={product.reportSpec.sectionCount} onChange={(v) => patch({ reportSpec: { ...product.reportSpec, sectionCount: v } })} />
            <TextField label="Depth (words)" value={product.reportSpec.depthWords} onChange={(v) => patch({ reportSpec: { ...product.reportSpec, depthWords: v } })} />
          </div>
          <div className="mt-4">
            <TextArea label="Delivery" value={product.reportSpec.delivery} onChange={(v) => patch({ reportSpec: { ...product.reportSpec, delivery: v } })} minRows={2} />
          </div>
        </Panel>

        {/* AI CONFIG */}
        <Panel title="AI Configuration" subtitle="Applied to every AI section of this report.">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
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
              minRows={4}
              hint="Prepended to every section prompt below."
            />
          </div>
        </Panel>

        {/* BRAND COPY */}
        <Panel title="Fixed Brand Copy" subtitle="Rendered verbatim at the open and close of the report.">
          <div className="space-y-4">
            <TextArea label="Brand Intro" value={product.brandIntro} onChange={(v) => patch({ brandIntro: v })} minRows={4} />
            <TextArea label="Brand Closing" value={product.brandClosing} onChange={(v) => patch({ brandClosing: v })} minRows={4} />
          </div>
        </Panel>

        {/* LANGUAGE RULES (read-only summary; edit on product page) */}
        {product.languageRules.length > 0 && (
          <Panel title="Language Rules" subtitle="Guardrails enforced across the whole report. Full editing on the Product page.">
            <ol className="space-y-2">
              {product.languageRules.map((r, i) => (
                <li key={i} className="flex gap-2 font-sans text-[12.5px] leading-relaxed text-light-soft">
                  <span className="font-mono text-gold">{i + 1}.</span>
                  <span>{r}</span>
                </li>
              ))}
            </ol>
          </Panel>
        )}

        {/* SECTIONS */}
        <Panel
          title="Report Sections"
          subtitle="Every section of the report — expand any to configure it, including the exact LLM prompt mapped to it."
          right={
            <div className="flex gap-2">
              <button
                onClick={() => toggleAll(true)}
                className="rounded-full border border-gold/30 px-3 py-[6px] font-sans text-[12px] text-light-soft transition hover:border-gold hover:text-gold"
              >
                Expand all
              </button>
              <button
                onClick={() => toggleAll(false)}
                className="rounded-full border border-gold/30 px-3 py-[6px] font-sans text-[12px] text-light-soft transition hover:border-gold hover:text-gold"
              >
                Collapse all
              </button>
            </div>
          }
        >
          <div key={rev} className="space-y-2.5">
            {product.sections.map((s, i) => (
              <SectionEditor
                key={s.id}
                section={s}
                onChange={(p) => setSection(s.id, p)}
                defaultOpen={allOpen === null ? i === 0 : allOpen}
              />
            ))}
          </div>
        </Panel>
      </main>
    </div>
  );
}
