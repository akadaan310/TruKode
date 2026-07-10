"use client";

/* ----------------------------------------------------------------------------
   ReportStylePreview — a reference render of a ReportStyle.

   This is intentionally approximate: it shows a scaled cover page and a
   content page (header/footer, eyebrow, section number, heading, divider,
   drop cap, body, callout, accent bar, watermark) so the admin can see the
   effect of every style control. It is NOT a print-exact proof.
--------------------------------------------------------------------------- */

import { useMemo } from "react";
import type { Product } from "@/lib/products";
import { FONT_STACKS, PAGE_PX, type ReportStyle } from "@/lib/reportStyle";

const MM = 3.7795; // px per mm at 96dpi

function font(name: string): string {
  return FONT_STACKS[name] ?? name;
}

const ROMAN = [
  "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
];

const SAMPLE_BODY =
  "Based on your blueprint data, you may have a tendency toward independence and original thinking — a through-line in how you approach the world. Your numbers suggest patterns consistent with a drive to lead and to be recognized as your own person, balanced against a quieter need for connection that shapes your closest relationships.";

const SAMPLE_BODY_2 =
  "Your blueprint indicates a decision-making style that moves quickly once you trust your read of a situation. Recognizing this early — naming it as a familiar pattern rather than a fixed trait — tends to be the fastest way back to steady ground when the ground feels unsteady.";

export function ReportStylePreview({
  style,
  product,
  width = 460,
}: {
  style: ReportStyle;
  product: Product;
  width?: number;
}) {
  const dim = PAGE_PX[style.page.size];
  const scale = width / dim.w;
  const px = (pt: number) => pt * 1.333 * scale;
  const mm = (v: number) => v * MM * scale;

  const c = style.colors;
  const t = style.typography;
  const s = style.sections;
  const pageH = dim.h * scale;
  const pad = {
    top: mm(style.page.margin.top),
    right: mm(style.page.margin.right),
    bottom: mm(style.page.margin.bottom),
    left: mm(style.page.margin.left),
  };

  // First two AI section titles for realistic headings.
  const aiSections = useMemo(
    () => product.sections.filter((x) => x.type === "AI").slice(0, 2),
    [product.sections],
  );

  const coverBg =
    style.cover.background === "gradient"
      ? `linear-gradient(160deg, ${c.coverBg}, ${shade(c.coverBg, -18)})`
      : style.cover.background === "accent-bar"
        ? c.paper
        : c.coverBg;

  const isBanner = style.cover.layout === "banner";
  const coverAlign = style.cover.layout === "left" ? "flex-start" : "center";
  const coverTextAlign: "left" | "center" = style.cover.layout === "left" ? "left" : "center";

  function sectionNumber(i: number): string | null {
    switch (s.numberStyle) {
      case "roman": return ROMAN[i] ?? String(i);
      case "inline": return String(i).padStart(2, "0");
      case "badge": return String(i);
      case "none": return null;
    }
  }

  function Divider() {
    if (s.dividerStyle === "none") return null;
    const w = s.headingAlign === "center" ? "40%" : "64%";
    const mx = s.headingAlign === "center" ? "auto" : undefined;
    if (s.dividerStyle === "ornament") {
      return (
        <div style={{ textAlign: s.headingAlign, color: c.accent, fontSize: px(t.h3Size), margin: `${px(4)}px 0` }}>
          ✦
        </div>
      );
    }
    if (s.dividerStyle === "double-rule") {
      return (
        <div style={{ width: w, marginLeft: mx, marginTop: px(6), marginBottom: px(8) }}>
          <div style={{ height: Math.max(1, px(1)), background: c.accent }} />
          <div style={{ height: Math.max(1, px(1)), background: c.divider, marginTop: px(2) }} />
        </div>
      );
    }
    return (
      <div
        style={{
          width: w,
          marginLeft: mx,
          marginTop: px(6),
          marginBottom: px(8),
          height: Math.max(1, px(1.4)),
          background: c.accent,
          borderBottom: s.dividerStyle === "dotted" ? `${Math.max(1, px(1.4))}px dotted ${c.accent}` : undefined,
          backgroundColor: s.dividerStyle === "dotted" ? "transparent" : c.accent,
        }}
      />
    );
  }

  function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
    if (!style.decoration.cornerOrnament) return null;
    const size = px(14);
    const off = px(10);
    const base: React.CSSProperties = { position: "absolute", width: size, height: size, borderColor: c.accent, opacity: 0.6 };
    const map: Record<string, React.CSSProperties> = {
      tl: { top: off, left: off, borderTop: `1px solid`, borderLeft: `1px solid` },
      tr: { top: off, right: off, borderTop: `1px solid`, borderRight: `1px solid` },
      bl: { bottom: off, left: off, borderBottom: `1px solid`, borderLeft: `1px solid` },
      br: { bottom: off, right: off, borderBottom: `1px solid`, borderRight: `1px solid` },
    };
    return <div style={{ ...base, ...map[pos] }} />;
  }

  function Section({ index, title, body, num }: { index: number; title: string; body: string; num: string | null }) {
    const headingRow = (
      <div style={{ display: "flex", alignItems: "baseline", gap: px(8), justifyContent: s.headingAlign === "center" ? "center" : "flex-start" }}>
        {num !== null && s.numberStyle === "badge" && (
          <span
            style={{
              flex: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: px(24),
              height: px(24),
              borderRadius: 999,
              border: `1px solid ${c.accent}`,
              color: c.accent,
              fontFamily: font(t.bodyFont),
              fontSize: px(9),
              fontWeight: 600,
            }}
          >
            {num}
          </span>
        )}
        {num !== null && (s.numberStyle === "inline" || s.numberStyle === "roman") && (
          <span style={{ color: c.accent, fontFamily: font(t.headingFont), fontSize: px(t.h2Size * 0.8), fontWeight: t.headingWeight }}>
            {num} ·
          </span>
        )}
        <h2
          style={{
            margin: 0,
            color: c.heading,
            fontFamily: font(t.headingFont),
            fontSize: px(t.h2Size),
            fontWeight: t.headingWeight,
            letterSpacing: `${t.headingTracking}em`,
            lineHeight: 1.15,
          }}
        >
          {title}
        </h2>
      </div>
    );

    const first = body.charAt(0);
    const rest = body.slice(1);

    return (
      <div style={{ marginTop: px(s.spacing), textAlign: s.headingAlign === "center" ? "center" : "left" }}>
        {s.showEyebrow && (
          <div
            style={{
              color: c.accent,
              fontFamily: font(t.bodyFont),
              fontSize: px(7.5),
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: `${t.eyebrowTracking}em`,
              marginBottom: px(3),
            }}
          >
            {s.eyebrowText}
          </div>
        )}
        {headingRow}
        <Divider />
        <div
          style={{
            textAlign: t.justify ? "justify" : (s.headingAlign === "center" ? "center" : "left"),
            borderLeft: s.accentBar ? `${px(2)}px solid ${c.accent}` : undefined,
            paddingLeft: s.accentBar ? px(10) : undefined,
          }}
        >
          <p
            style={{
              margin: 0,
              marginBottom: px(t.paragraphSpacing),
              color: c.ink,
              fontFamily: font(t.bodyFont),
              fontSize: px(t.baseSize),
              lineHeight: t.lineHeight,
            }}
          >
            {s.dropCap ? (
              <>
                <span
                  style={{
                    float: "left",
                    color: c.accent,
                    fontFamily: font(t.headingFont),
                    fontSize: px(t.baseSize * 3.2),
                    lineHeight: 0.8,
                    paddingRight: px(4),
                    fontWeight: t.headingWeight,
                  }}
                >
                  {first}
                </span>
                {rest}
              </>
            ) : (
              body
            )}
          </p>
          {index === 1 && (
            <p style={{ margin: 0, color: c.ink, fontFamily: font(t.bodyFont), fontSize: px(t.baseSize), lineHeight: t.lineHeight }}>
              {SAMPLE_BODY_2}
            </p>
          )}
        </div>

        {/* A sample callout on the second section */}
        {index === 2 && <Callout />}
      </div>
    );
  }

  function Callout() {
    const kind = style.decoration.calloutStyle;
    const common: React.CSSProperties = {
      marginTop: px(12),
      color: c.ink,
      fontFamily: font(t.bodyFont),
      fontSize: px(t.baseSize * 0.96),
      lineHeight: t.lineHeight,
    };
    const text = "Your North Star: lead with your natural direction, honor your need for connection, and keep evolving toward who you are becoming.";
    if (kind === "quote") {
      return (
        <div style={{ ...common, borderLeft: `${px(3)}px solid ${c.accent}`, paddingLeft: px(12), fontStyle: "italic", color: c.muted }}>
          “{text}”
        </div>
      );
    }
    if (kind === "box") {
      return (
        <div style={{ ...common, border: `1px solid ${c.divider}`, background: shade(c.paper, -3), borderRadius: px(4), padding: px(12) }}>
          <div style={{ color: c.accent, fontSize: px(7.5), fontWeight: 600, textTransform: "uppercase", letterSpacing: `${t.eyebrowTracking}em`, marginBottom: px(4) }}>
            Your North Star
          </div>
          {text}
        </div>
      );
    }
    return (
      <div style={{ ...common, borderTop: `${px(2)}px solid ${c.accent}`, paddingTop: px(8) }}>{text}</div>
    );
  }

  const pageBase: React.CSSProperties = {
    position: "relative",
    width,
    height: pageH,
    background: c.paper,
    overflow: "hidden",
    borderRadius: 4,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* COVER */}
      {style.cover.enabled && (
        <div style={{ ...pageBase, background: coverBg }}>
          {style.cover.background === "accent-bar" && (
            <div style={{ position: "absolute", top: 0, left: 0, width: px(10), height: "100%", background: c.accent }} />
          )}
          {isBanner && (
            <div style={{ position: "absolute", top: "42%", left: 0, width: "100%", height: px(70), background: shade(c.coverBg, 8), opacity: 0.5 }} />
          )}
          <div
            style={{
              position: "relative",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: coverAlign,
              justifyContent: "center",
              textAlign: coverTextAlign,
              padding: `${pad.top}px ${pad.right}px`,
              color: style.cover.background === "accent-bar" ? c.heading : c.coverText,
            }}
          >
            {style.cover.showLogo && (
              <div
                style={{
                  fontFamily: font(t.bodyFont),
                  fontSize: px(9),
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: `${t.eyebrowTracking}em`,
                  color: c.accent,
                  marginBottom: px(14),
                }}
              >
                {style.cover.brandName}
              </div>
            )}
            <div
              style={{
                fontFamily: font(t.headingFont),
                fontSize: px(t.h1Size),
                fontWeight: t.headingWeight,
                lineHeight: 1.05,
                letterSpacing: `${t.headingTracking}em`,
                marginBottom: px(8),
              }}
            >
              {style.cover.title}
            </div>
            {style.cover.accentRule && (
              <div style={{ width: px(60), height: px(2), background: c.accent, marginBottom: px(10), marginLeft: coverTextAlign === "center" ? "auto" : 0, marginRight: coverTextAlign === "center" ? "auto" : 0 }} />
            )}
            {style.cover.subtitle && (
              <div style={{ fontFamily: font(t.headingFont), fontStyle: "italic", fontSize: px(t.h3Size), color: style.cover.background === "accent-bar" ? c.muted : c.coverText, opacity: 0.9 }}>
                {style.cover.subtitle}
              </div>
            )}
            {style.cover.showTagline && product.tagline && (
              <div style={{ marginTop: px(10), fontFamily: font(t.bodyFont), fontSize: px(t.baseSize * 0.9), color: c.muted, maxWidth: "78%" }}>
                {product.tagline}
              </div>
            )}
          </div>
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />
        </div>
      )}

      {/* CONTENT PAGE */}
      <div style={pageBase}>
        {style.decoration.watermark && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(-30deg)",
              color: c.accent,
              opacity: 0.06,
              fontFamily: font(t.headingFont),
              fontSize: px(80),
              fontWeight: t.headingWeight,
              pointerEvents: "none",
            }}
          >
            {style.decoration.watermarkText}
          </div>
        )}

        <div style={{ position: "absolute", inset: 0, padding: `${pad.top}px ${pad.right}px ${pad.bottom}px ${pad.left}px`, display: "flex", flexDirection: "column" }}>
          {/* Running header */}
          {style.header.enabled && (
            <div
              style={{
                display: "flex",
                justifyContent: style.header.align === "center" ? "center" : "space-between",
                borderBottom: `1px solid ${c.divider}`,
                paddingBottom: px(6),
                marginBottom: px(6),
                color: c.muted,
                fontFamily: font(t.bodyFont),
                fontSize: px(7.5),
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              <span>{style.header.text}</span>
              {style.header.showPageNumber && style.header.align !== "center" && <span>2</span>}
            </div>
          )}

          {/* Sections */}
          <div style={{ flex: 1 }}>
            {aiSections.map((sec, i) => (
              <Section
                key={sec.id}
                index={i + 1}
                title={sec.title}
                body={i === 0 ? product.brandIntro.slice(0, 220).replace(/\[First Name\]/g, "Alex") : SAMPLE_BODY}
                num={sectionNumber(i + 1)}
              />
            ))}
          </div>

          {/* Running footer */}
          {style.footer.enabled && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: `1px solid ${c.divider}`,
                paddingTop: px(6),
                marginTop: px(6),
                color: c.muted,
                fontFamily: font(t.bodyFont),
                fontSize: px(7.5),
              }}
            >
              <span>{style.footer.text}</span>
              {style.footer.showPageNumber && <span>2</span>}
            </div>
          )}
        </div>
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
        <Corner pos="br" />
      </div>
    </div>
  );
}

/* Lighten (+) / darken (−) a hex color by a percentage. */
function shade(hex: string, pct: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = clamp((n >> 16) + Math.round((255 * pct) / 100));
  const g = clamp(((n >> 8) & 0xff) + Math.round((255 * pct) / 100));
  const b = clamp((n & 0xff) + Math.round((255 * pct) / 100));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
function clamp(v: number): number {
  return Math.max(0, Math.min(255, v));
}
