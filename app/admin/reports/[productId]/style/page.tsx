"use client";

/* ----------------------------------------------------------------------------
   /admin/reports/[productId]/style — PDF Style Editor

   Every product ships with a pre-defined template (see lib/reportStyle.ts).
   This screen exposes the whole style object — page setup, color palette,
   typography, cover, section treatment, running header/footer, decoration —
   alongside a live (reference, not print-exact) preview.

   Because the product store deep-merges one level, this editor always writes
   the FULL style object back via patch({ style }), so nested edits never drop
   sibling keys.
--------------------------------------------------------------------------- */

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { useProduct } from "@/lib/productStore";
import {
  defaultStyleFor,
  DIVIDER_STYLES,
  MONO_FONTS,
  NUMBER_STYLES,
  SANS_FONTS,
  SERIF_FONTS,
  STYLE_PRESETS,
  type ReportStyle,
} from "@/lib/reportStyle";
import { Panel, TextField, NumberField, Select, Chip, Label } from "@/components/admin/Field";
import { ReportStylePreview } from "@/components/admin/ReportStylePreview";
import { ReportTabs } from "@/components/admin/ReportTabs";

/* Immutable deep-set on the style object via a dotted path. */
function setPath(obj: ReportStyle, path: string, value: unknown): ReportStyle {
  const keys = path.split(".");
  const clone = structuredClone(obj) as unknown as Record<string, unknown>;
  let cur = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    cur = cur[keys[i]] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
  return clone as unknown as ReportStyle;
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <div className="flex items-center gap-2 rounded-lg border border-gold/25 bg-ink-soft px-2 py-[6px]">
        <input
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-[26px] w-[34px] flex-none cursor-pointer rounded border-0 bg-transparent [color-scheme:dark]"
          aria-label={label}
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent font-mono text-[12px] text-light focus:outline-none"
        />
      </div>
    </label>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center justify-between gap-3 rounded-lg border px-[13px] py-[10px] text-left font-sans text-[13px] transition ${
        value ? "border-gold/50 bg-gold/[0.07] text-light" : "border-gold/20 bg-ink-soft text-light-soft hover:border-gold/40"
      }`}
    >
      <span>{label}</span>
      <span
        className={`relative h-[18px] w-[32px] flex-none rounded-full transition ${value ? "bg-gold" : "bg-light-soft/30"}`}
      >
        <span
          className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-ink-deep transition-all ${value ? "left-[16px]" : "left-[2px]"}`}
        />
      </span>
    </button>
  );
}

export default function StyleEditorPage() {
  const { productId } = useParams<{ productId: string }>();
  const { product, customized, patch, reset } = useProduct(productId);

  const style = product?.style;

  const update = useCallback(
    (path: string, value: unknown) => {
      if (!style) return;
      patch({ style: setPath(style, path, value) });
    },
    [style, patch],
  );

  const applyPreset = useCallback(
    (build: (name: string) => ReportStyle) => {
      if (!product) return;
      patch({ style: build(product.name) });
    },
    [product, patch],
  );

  if (!product || !style) {
    return (
      <div className="mx-auto max-w-[1000px] px-[clamp(18px,4vw,36px)] py-16">
        <p className="font-serif text-[22px] text-light-soft">Report not found.</p>
        <Link href="/admin/reports" className="mt-4 inline-block font-sans text-[14px] text-gold no-underline">
          ← Back to Reports Editor
        </Link>
      </div>
    );
  }

  const sfOpts = SERIF_FONTS.map((f) => ({ value: f, label: f }));
  const ssOpts = SANS_FONTS.map((f) => ({ value: f, label: f }));
  const monoOpts = MONO_FONTS.map((f) => ({ value: f, label: f }));

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
              {product.name} <span className="text-gold">·</span> PDF Style
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="gold">Template: {style.templateName}</Chip>
            {customized && <Chip>Customized</Chip>}
            <button
              onClick={() => {
                if (confirm("Reset this report's style to its pre-defined template?"))
                  patch({ style: defaultStyleFor(product.category, product.name) });
              }}
              className="rounded-full border border-gold/30 px-4 py-[8px] font-sans text-[12.5px] text-light-soft transition hover:border-gold hover:text-gold"
            >
              Reset style to template
            </button>
          </div>
        </div>
        <ReportTabs productId={productId} active="style" />
      </header>

      <main className="mx-auto grid max-w-[1100px] grid-cols-1 gap-6 px-[clamp(18px,4vw,36px)] py-8 lg:grid-cols-[1fr_480px]">
        {/* ---------------- CONTROLS ---------------- */}
        <div className="min-w-0">
          {/* PRESETS */}
          <Panel title="Template Presets" subtitle="Start from a named look. Your product's pre-defined template is highlighted.">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5">
              {STYLE_PRESETS.map((p) => {
                const active = p.name === style.templateName;
                return (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p.build)}
                    className={`rounded-xl border px-3 py-[11px] text-left transition ${
                      active ? "border-gold bg-gold/[0.08]" : "border-gold/20 bg-ink-soft/40 hover:border-gold/50"
                    }`}
                  >
                    <div className="font-serif text-[16px] text-light">{p.name}</div>
                    <div className="mt-1 font-sans text-[11px] leading-snug text-light-soft/75">{p.description}</div>
                  </button>
                );
              })}
            </div>
          </Panel>

          {/* PAGE SETUP */}
          <Panel title="Page Setup" subtitle="Physical page, orientation and margins (mm).">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
              <Select label="Page size" value={style.page.size} options={[{ value: "A4", label: "A4" }, { value: "Letter", label: "US Letter" }]} onChange={(v) => update("page.size", v)} />
              <Select label="Orientation" value={style.page.orientation} options={[{ value: "portrait", label: "Portrait" }, { value: "landscape", label: "Landscape" }]} onChange={(v) => update("page.orientation", v)} />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              <NumberField label="Top" value={style.page.margin.top} suffix="mm" onChange={(v) => update("page.margin.top", v)} />
              <NumberField label="Right" value={style.page.margin.right} suffix="mm" onChange={(v) => update("page.margin.right", v)} />
              <NumberField label="Bottom" value={style.page.margin.bottom} suffix="mm" onChange={(v) => update("page.margin.bottom", v)} />
              <NumberField label="Left" value={style.page.margin.left} suffix="mm" onChange={(v) => update("page.margin.left", v)} />
            </div>
          </Panel>

          {/* COLORS */}
          <Panel title="Color Palette" subtitle="Paper, text, accents and cover colors.">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
              <ColorField label="Paper / background" value={style.colors.paper} onChange={(v) => update("colors.paper", v)} />
              <ColorField label="Body text (ink)" value={style.colors.ink} onChange={(v) => update("colors.ink", v)} />
              <ColorField label="Muted / labels" value={style.colors.muted} onChange={(v) => update("colors.muted", v)} />
              <ColorField label="Headings" value={style.colors.heading} onChange={(v) => update("colors.heading", v)} />
              <ColorField label="Primary accent" value={style.colors.accent} onChange={(v) => update("colors.accent", v)} />
              <ColorField label="Secondary accent" value={style.colors.accentSecondary} onChange={(v) => update("colors.accentSecondary", v)} />
              <ColorField label="Divider / hairline" value={style.colors.divider} onChange={(v) => update("colors.divider", v)} />
              <ColorField label="Cover background" value={style.colors.coverBg} onChange={(v) => update("colors.coverBg", v)} />
              <ColorField label="Cover text" value={style.colors.coverText} onChange={(v) => update("colors.coverText", v)} />
            </div>
          </Panel>

          {/* TYPOGRAPHY */}
          <Panel title="Typography" subtitle="Fonts, scale, weight, tracking and spacing.">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
              <Select label="Heading font" value={style.typography.headingFont} options={sfOpts} onChange={(v) => update("typography.headingFont", v)} />
              <Select label="Body font" value={style.typography.bodyFont} options={ssOpts} onChange={(v) => update("typography.bodyFont", v)} />
              <Select label="Mono font" value={style.typography.monoFont} options={monoOpts} onChange={(v) => update("typography.monoFont", v)} />
            </div>
            <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3">
              <NumberField label="Body size" value={style.typography.baseSize} step={0.5} suffix="pt" onChange={(v) => update("typography.baseSize", v)} />
              <NumberField label="Line height" value={style.typography.lineHeight} step={0.05} onChange={(v) => update("typography.lineHeight", v)} />
              <NumberField label="H1 (cover)" value={style.typography.h1Size} suffix="pt" onChange={(v) => update("typography.h1Size", v)} />
              <NumberField label="H2 (section)" value={style.typography.h2Size} suffix="pt" onChange={(v) => update("typography.h2Size", v)} />
              <NumberField label="H3 (label)" value={style.typography.h3Size} suffix="pt" onChange={(v) => update("typography.h3Size", v)} />
              <NumberField label="Heading weight" value={style.typography.headingWeight} step={100} min={300} max={800} onChange={(v) => update("typography.headingWeight", v)} />
              <NumberField label="Heading tracking" value={style.typography.headingTracking} step={0.01} suffix="em" onChange={(v) => update("typography.headingTracking", v)} />
              <NumberField label="Eyebrow tracking" value={style.typography.eyebrowTracking} step={0.02} suffix="em" onChange={(v) => update("typography.eyebrowTracking", v)} />
              <NumberField label="Paragraph gap" value={style.typography.paragraphSpacing} suffix="px" onChange={(v) => update("typography.paragraphSpacing", v)} />
            </div>
            <div className="mt-4">
              <Toggle label="Justify body text" value={style.typography.justify} onChange={(v) => update("typography.justify", v)} />
            </div>
          </Panel>

          {/* COVER */}
          <Panel title="Cover Page" subtitle="The first page of the report.">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
              <Select label="Layout" value={style.cover.layout} options={[{ value: "centered", label: "Centered" }, { value: "left", label: "Left-aligned" }, { value: "banner", label: "Banner band" }]} onChange={(v) => update("cover.layout", v)} />
              <Select label="Background" value={style.cover.background} options={[{ value: "solid", label: "Solid" }, { value: "gradient", label: "Gradient" }, { value: "accent-bar", label: "Accent bar (light)" }]} onChange={(v) => update("cover.background", v)} />
              <TextField label="Brand name" value={style.cover.brandName} onChange={(v) => update("cover.brandName", v)} />
              <TextField label="Title" value={style.cover.title} onChange={(v) => update("cover.title", v)} />
              <TextField label="Subtitle" value={style.cover.subtitle} onChange={(v) => update("cover.subtitle", v)} />
            </div>
            <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
              <Toggle label="Show cover page" value={style.cover.enabled} onChange={(v) => update("cover.enabled", v)} />
              <Toggle label="Show logo" value={style.cover.showLogo} onChange={(v) => update("cover.showLogo", v)} />
              <Toggle label="Accent rule" value={style.cover.accentRule} onChange={(v) => update("cover.accentRule", v)} />
              <Toggle label="Show tagline" value={style.cover.showTagline} onChange={(v) => update("cover.showTagline", v)} />
            </div>
          </Panel>

          {/* SECTIONS */}
          <Panel title="Section Treatment" subtitle="How each report section is defined and separated.">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
              <Select label="Section number" value={style.sections.numberStyle} options={NUMBER_STYLES} onChange={(v) => update("sections.numberStyle", v)} />
              <Select label="Divider under heading" value={style.sections.dividerStyle} options={DIVIDER_STYLES} onChange={(v) => update("sections.dividerStyle", v)} />
              <Select label="Heading alignment" value={style.sections.headingAlign} options={[{ value: "left", label: "Left" }, { value: "center", label: "Center" }]} onChange={(v) => update("sections.headingAlign", v)} />
              <TextField label="Eyebrow label" value={style.sections.eyebrowText} onChange={(v) => update("sections.eyebrowText", v)} />
              <NumberField label="Section spacing" value={style.sections.spacing} suffix="px" onChange={(v) => update("sections.spacing", v)} />
            </div>
            <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
              <Toggle label="Show eyebrow label" value={style.sections.showEyebrow} onChange={(v) => update("sections.showEyebrow", v)} />
              <Toggle label="Each section on new page" value={style.sections.startOnNewPage} onChange={(v) => update("sections.startOnNewPage", v)} />
              <Toggle label="Drop cap first paragraph" value={style.sections.dropCap} onChange={(v) => update("sections.dropCap", v)} />
              <Toggle label="Left accent bar on body" value={style.sections.accentBar} onChange={(v) => update("sections.accentBar", v)} />
            </div>
          </Panel>

          {/* HEADER / FOOTER */}
          <Panel title="Running Header & Footer" subtitle="Repeated furniture on content pages.">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-gold/15 bg-ink-deep/40 p-4">
                <div className="mb-3"><Toggle label="Running header" value={style.header.enabled} onChange={(v) => update("header.enabled", v)} /></div>
                <div className="space-y-3">
                  <TextField label="Header text" value={style.header.text} onChange={(v) => update("header.text", v)} />
                  <Select label="Header align" value={style.header.align} options={[{ value: "left", label: "Left" }, { value: "center", label: "Center" }]} onChange={(v) => update("header.align", v)} />
                  <Toggle label="Page number in header" value={style.header.showPageNumber} onChange={(v) => update("header.showPageNumber", v)} />
                </div>
              </div>
              <div className="rounded-xl border border-gold/15 bg-ink-deep/40 p-4">
                <div className="mb-3"><Toggle label="Running footer" value={style.footer.enabled} onChange={(v) => update("footer.enabled", v)} /></div>
                <div className="space-y-3">
                  <TextField label="Footer text" value={style.footer.text} onChange={(v) => update("footer.text", v)} />
                  <Toggle label="Page number in footer" value={style.footer.showPageNumber} onChange={(v) => update("footer.showPageNumber", v)} />
                </div>
              </div>
            </div>
          </Panel>

          {/* DECORATION */}
          <Panel title="Decoration" subtitle="Callouts, watermark and page ornaments.">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
              <Select label="Callout style" value={style.decoration.calloutStyle} options={[{ value: "bar", label: "Top bar" }, { value: "box", label: "Boxed" }, { value: "quote", label: "Quote rule" }]} onChange={(v) => update("decoration.calloutStyle", v)} />
              <TextField label="Watermark text" value={style.decoration.watermarkText} onChange={(v) => update("decoration.watermarkText", v)} />
            </div>
            <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
              <Toggle label="Watermark" value={style.decoration.watermark} onChange={(v) => update("decoration.watermark", v)} />
              <Toggle label="Corner ornaments" value={style.decoration.cornerOrnament} onChange={(v) => update("decoration.cornerOrnament", v)} />
            </div>
          </Panel>
        </div>

        {/* ---------------- PREVIEW ---------------- */}
        <div className="lg:sticky lg:top-[112px] lg:h-fit">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-[18px] text-light">Live Preview</h2>
            <span className="font-sans text-[11px] text-light-soft/70">Reference only — not print-exact</span>
          </div>
          <div className="max-h-[calc(100vh-160px)] overflow-y-auto rounded-2xl border border-gold/15 bg-ink-deep/60 p-5">
            <ReportStylePreview style={style} product={product} width={430} />
          </div>
          <p className="mt-3 font-sans text-[11.5px] leading-snug text-light-soft/70">
            Shows a representative cover page and one content page (with {product.sections.filter((s) => s.type === "AI").length} of this
            report&apos;s sections sampled). Fonts fall back to close web equivalents where the brand fonts aren&apos;t loaded.
          </p>
        </div>
      </main>
    </div>
  );
}
