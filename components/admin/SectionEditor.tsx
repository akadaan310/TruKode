"use client";

/* ----------------------------------------------------------------------------
   SectionEditor — one collapsible card per report section, exposing every
   configurable aspect: title, type (AI / Fixed copy), primary fields, word
   count, framework step, the mapped LLM prompt, and fixed brand copy.

   Shared by the Products detail screen and the Reports Editor so both write
   to the same store and can never drift.
--------------------------------------------------------------------------- */

import { useState } from "react";
import type { ReportSection } from "@/lib/products";
import { TextField, TextArea, Select, Chip } from "./Field";

export function SectionEditor({
  section,
  onChange,
  defaultOpen = false,
}: {
  section: ReportSection;
  onChange: (patch: Partial<ReportSection>) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isAI = section.type === "AI";

  return (
    <article className="overflow-hidden rounded-xl border border-gold/20 bg-ink-soft/30">
      {/* Header row */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-[16px] py-[13px] text-left transition hover:bg-gold/[0.04]"
      >
        <span className="flex h-[28px] min-w-[28px] flex-none items-center justify-center rounded-full border border-gold/40 px-[7px] font-sans text-[12px] font-semibold text-gold">
          {section.index}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-serif text-[17px] text-light">
            {section.title}
          </span>
          {section.primaryFields && (
            <span className="mt-[2px] block truncate font-sans text-[11.5px] text-light-soft/70">
              {section.primaryFields}
            </span>
          )}
        </span>
        <Chip tone={isAI ? "gold" : "muted"}>{section.type}</Chip>
        {section.framework && (
          <span className="hidden font-sans text-[11px] text-light-soft/70 sm:inline">
            {section.framework}
          </span>
        )}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          className={`flex-none text-light-soft transition ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M6 9l6 6 6-6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-current"
          />
        </svg>
      </button>

      {/* Body */}
      {open && (
        <div className="border-t border-gold/12 px-[16px] py-[16px]">
          <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
            <TextField
              label="Section title"
              value={section.title}
              onChange={(v) => onChange({ title: v })}
            />
            <Select
              label="Type"
              value={section.type}
              options={[
                { value: "AI", label: "AI-generated" },
                { value: "Fixed copy", label: "Fixed brand copy" },
              ]}
              onChange={(v) => onChange({ type: v as ReportSection["type"] })}
            />
            <TextField
              label="Word count / length"
              value={section.wordCount ?? ""}
              onChange={(v) => onChange({ wordCount: v })}
              placeholder="e.g. 150–300"
            />
            <TextField
              label="Primary fields"
              value={section.primaryFields ?? ""}
              onChange={(v) => onChange({ primaryFields: v })}
              placeholder="Numerology fields feeding this section"
            />
            <TextField
              label="Ekodz Framework™ step"
              value={section.framework ?? ""}
              onChange={(v) => onChange({ framework: v })}
              placeholder="e.g. Step 1 — Decode Your Architecture"
            />
          </div>

          {isAI ? (
            <TextArea
              label="LLM prompt — mapped to this section"
              value={section.prompt}
              onChange={(v) => onChange({ prompt: v })}
              minRows={4}
              hint="This is the exact instruction sent to the model for this section, appended to the product's global system prompt."
            />
          ) : (
            <div className="space-y-4">
              <TextArea
                label="Fixed brand copy (rendered verbatim)"
                value={section.fixedCopy ?? ""}
                onChange={(v) => onChange({ fixedCopy: v })}
                minRows={4}
                hint="Shown to the client exactly as written — no AI generation."
              />
              <TextArea
                label="Production note"
                value={section.prompt}
                onChange={(v) => onChange({ prompt: v })}
                minRows={2}
              />
            </div>
          )}
        </div>
      )}
    </article>
  );
}
