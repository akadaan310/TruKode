"use client";

/* ----------------------------------------------------------------------------
   Shared admin editor primitives — matched to the /admin gold/ink design.
   Used by the Products section and the Reports Editor.
--------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";

const inputCls =
  "w-full bg-ink-soft border border-gold/25 rounded-lg px-[13px] py-[10px] font-sans text-[14px] text-light placeholder:text-light-soft/50 focus:outline-none focus:border-gold [color-scheme:dark] transition";
const labelCls =
  "block mb-[6px] font-sans text-[11px] uppercase tracking-[0.14em] text-light-soft";

export function Label({ children }: { children: React.ReactNode }) {
  return <span className={labelCls}>{children}</span>;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        className={`${inputCls} ${mono ? "font-mono text-[13px]" : ""}`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <div className="relative">
        <input
          type="number"
          className={inputCls}
          value={Number.isFinite(value) ? value : ""}
          step={step}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-sans text-[12px] text-light-soft/70">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

export function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <select
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-ink-soft">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Auto-growing textarea for prompts / long copy. */
export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  minRows = 3,
  hint,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minRows?: number;
  hint?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <label className="block">
      {label && <Label>{label}</Label>}
      <textarea
        ref={ref}
        className={`${inputCls} resize-none leading-[1.6]`}
        value={value}
        rows={minRows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && (
        <p className="mt-[6px] font-sans text-[11px] leading-snug text-light-soft/70">
          {hint}
        </p>
      )}
    </label>
  );
}

/** A titled panel used to group related fields. */
export function Panel({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6 rounded-2xl border border-gold/20 bg-ink-soft/40 p-[clamp(16px,2.6vw,26px)]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-[20px] text-light">{title}</h2>
          {subtitle && (
            <p className="mt-1 font-sans text-[12.5px] leading-snug text-light-soft/80">
              {subtitle}
            </p>
          )}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

export function Chip({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "gold" | "muted" | "solid";
}) {
  const cls =
    tone === "gold"
      ? "border-gold/50 text-gold"
      : tone === "solid"
        ? "border-gold bg-gold/[0.12] text-gold"
        : "border-light-soft/25 text-light-soft";
  return (
    <span
      className={`inline-block rounded-full border px-[10px] py-[3px] font-sans text-[10.5px] uppercase tracking-[0.08em] ${cls}`}
    >
      {children}
    </span>
  );
}

/** Small transient "Saved ✓" pill that appears after a change. */
export function SavedFlag({ show }: { show: boolean }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!show) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1400);
    return () => clearTimeout(t);
  }, [show]);
  if (!visible) return null;
  return (
    <span className="rounded-full border border-gold/50 bg-gold/[0.08] px-3 py-[5px] font-sans text-[11px] text-gold">
      Saved ✓
    </span>
  );
}
