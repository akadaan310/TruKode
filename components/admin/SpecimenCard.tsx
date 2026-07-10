"use client";

/* ----------------------------------------------------------------------------
   SpecimenCard — one section's run in the Labs workbench.
   Shows status (queued / running / done), and once done, tabbed views:
   Output · Prompt (the fully resolved prompt) · Data (fields injected).
--------------------------------------------------------------------------- */

import Link from "next/link";
import { useState } from "react";
import type { SectionRun } from "@/lib/labs";
import { Chip } from "./Field";

export type RunState = { status: "queued" | "running" | "done"; run?: SectionRun };

const DIRECTIVE_LABEL: Record<string, string> = {
  data: "Data display",
  attachment: "Attachment ★",
  patterns: "Pattern list",
  guidance: "Guidance list",
  short: "Short overview",
  profile: "Narrative",
  fixed: "Fixed copy",
};

export function SpecimenCard({
  productId,
  index,
  title,
  type,
  state,
  onRerun,
  disabled,
}: {
  productId: string;
  index: string;
  title: string;
  type: "AI" | "Fixed copy";
  state: RunState;
  onRerun: () => void;
  disabled: boolean;
}) {
  const [tab, setTab] = useState<"output" | "prompt" | "data">("output");
  const [copied, setCopied] = useState(false);
  const run = state.run;

  const status = state.status;
  const statusPill =
    status === "done" ? (
      <span className="rounded-full border border-gold/50 bg-gold/[0.08] px-[9px] py-[3px] font-sans text-[10px] uppercase tracking-[0.08em] text-gold">
        Done
      </span>
    ) : status === "running" ? (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-[9px] py-[3px] font-sans text-[10px] uppercase tracking-[0.08em] text-gold">
        <span className="h-[6px] w-[6px] animate-pulse-soft rounded-full bg-gold" />
        Running
      </span>
    ) : (
      <span className="rounded-full border border-light-soft/25 px-[9px] py-[3px] font-sans text-[10px] uppercase tracking-[0.08em] text-light-soft/70">
        Queued
      </span>
    );

  const copy = async () => {
    if (!run) return;
    try {
      await navigator.clipboard.writeText(tab === "prompt" ? run.resolvedPrompt : run.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-ink-soft/30 transition ${
        status === "running" ? "border-gold/50" : "border-gold/20"
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 px-[16px] py-[12px]">
        <span className="flex h-[26px] min-w-[26px] flex-none items-center justify-center rounded-full border border-gold/40 px-[6px] font-sans text-[11px] font-semibold text-gold">
          {index}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-serif text-[17px] text-light">{title}</span>
        </span>
        <Chip tone={type === "AI" ? "gold" : "muted"}>{type}</Chip>
        {run && <Chip>{DIRECTIVE_LABEL[run.directive] ?? run.directive}</Chip>}
        {statusPill}
      </div>

      {/* Running bar */}
      {status === "running" && (
        <div className="h-[3px] w-full overflow-hidden bg-ink-deep">
          <div className="h-full w-1/3 animate-[tkFwd_1.1s_ease-in-out_infinite] bg-gold/70" />
        </div>
      )}

      {/* Body */}
      {status === "done" && run && (
        <div className="border-t border-gold/12">
          {/* Tabs + actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/10 px-[16px] py-[9px]">
            <div className="flex gap-1">
              {(["output", "prompt", "data"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-[12px] py-[5px] font-sans text-[12px] font-semibold capitalize transition ${
                    tab === t ? "bg-gold/[0.12] text-gold" : "text-light-soft hover:text-light"
                  }`}
                >
                  {t === "prompt" ? "Resolved prompt" : t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copy}
                className="rounded-full border border-gold/25 px-[11px] py-[5px] font-sans text-[11px] text-light-soft transition hover:border-gold hover:text-gold"
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
              {type === "AI" && (
                <Link
                  href={`/admin/reports/${productId}`}
                  className="rounded-full border border-gold/25 px-[11px] py-[5px] font-sans text-[11px] text-light-soft no-underline transition hover:border-gold hover:text-gold"
                >
                  Edit prompt →
                </Link>
              )}
              <button
                onClick={onRerun}
                disabled={disabled}
                className="rounded-full border border-gold/40 px-[11px] py-[5px] font-sans text-[11px] text-gold transition hover:bg-gold/[0.08] disabled:opacity-40"
              >
                Re-run
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="px-[16px] py-[14px]">
            {tab === "output" && (
              <>
                <p className="whitespace-pre-line font-sans text-[13.5px] leading-[1.7] text-light/90">
                  {run.output}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 border-t border-gold/10 pt-2.5 font-sans text-[11px] text-light-soft/70">
                  <span>
                    {run.wordCount} words
                    {run.wordTarget ? (
                      <span className={run.wordCount < run.wordTarget * 0.6 ? " text-gold/80" : ""}>
                        {" "}/ ~{run.wordTarget} target
                      </span>
                    ) : null}
                  </span>
                  <span>≈ {run.estTokens} tokens</span>
                  {run.type === "Fixed copy" && <span>Rendered verbatim — no model call</span>}
                </div>
              </>
            )}

            {tab === "prompt" && (
              <pre className="max-h-[420px] overflow-auto rounded-lg bg-ink-deep/70 p-[13px] font-mono text-[11.5px] leading-[1.65] text-light/85">
                {run.resolvedPrompt}
              </pre>
            )}

            {tab === "data" && (
              <div>
                {run.fieldsUsed.length ? (
                  <div className="flex flex-wrap gap-2">
                    {run.fieldsUsed.map((f) => (
                      <span
                        key={f.name}
                        className="rounded-lg border border-gold/25 bg-ink-deep/40 px-[10px] py-[6px] font-sans text-[12px] text-light-soft"
                      >
                        {f.name} <span className="ml-1 font-semibold text-gold">{f.display}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="font-sans text-[12.5px] text-light-soft/70">
                    No specific fields referenced — this section draws on the global data set / brand copy.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
