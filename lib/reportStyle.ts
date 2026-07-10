/* ============================================================================
   Ekodz — Report PDF Style System

   Every product ships with a pre-defined PDF style template. The Style Editor
   in the Reports Editor exposes all of it and stores overrides through the
   same product store used for content (lib/productStore.ts).

   The style object is deliberately exhaustive — page setup, color palette,
   typography, cover page, section treatment, running header/footer, and
   decorative options — so the preview can render a faithful (not print-exact)
   reference of the generated report.
   ========================================================================== */

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type PageSize = "A4" | "Letter";
export type Orientation = "portrait" | "landscape";

export type Margins = { top: number; right: number; bottom: number; left: number };

export type ColorPalette = {
  /** Page / paper background. */
  paper: string;
  /** Body text. */
  ink: string;
  /** Secondary / muted text (labels, captions). */
  muted: string;
  /** Section + document headings. */
  heading: string;
  /** Primary accent (rules, badges, numbers, links). */
  accent: string;
  /** Secondary accent (e.g. Person B in Compatibility, part dividers). */
  accentSecondary: string;
  /** Divider / hairline color. */
  divider: string;
  /** Cover background. */
  coverBg: string;
  /** Cover text. */
  coverText: string;
};

export type Typography = {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  /** Base body size, pt. */
  baseSize: number;
  lineHeight: number;
  /** Heading scale, pt. */
  h1Size: number;
  h2Size: number;
  h3Size: number;
  headingWeight: number;
  /** Letter-spacing on headings, em. */
  headingTracking: number;
  /** Letter-spacing on eyebrow labels, em. */
  eyebrowTracking: number;
  /** Space after paragraphs, px. */
  paragraphSpacing: number;
  /** Justify body text. */
  justify: boolean;
};

export type CoverLayout = "centered" | "left" | "banner";
export type CoverBackground = "solid" | "gradient" | "accent-bar";

export type Cover = {
  enabled: boolean;
  layout: CoverLayout;
  background: CoverBackground;
  showLogo: boolean;
  brandName: string;
  title: string;
  subtitle: string;
  showTagline: boolean;
  /** Thin accent rule under the title. */
  accentRule: boolean;
};

export type NumberStyle = "badge" | "inline" | "roman" | "none";
export type DividerStyle = "rule" | "double-rule" | "ornament" | "dotted" | "none";
export type HeadingAlign = "left" | "center";

export type SectionStyle = {
  numberStyle: NumberStyle;
  dividerStyle: DividerStyle;
  /** Show the small uppercase eyebrow label above each heading. */
  showEyebrow: boolean;
  eyebrowText: string;
  /** Force each section to begin on a fresh page. */
  startOnNewPage: boolean;
  /** Vertical space before each section, px. */
  spacing: number;
  headingAlign: HeadingAlign;
  /** Drop-cap the first paragraph of each section. */
  dropCap: boolean;
  /** A thin accent bar to the left of section bodies. */
  accentBar: boolean;
};

export type RunningHeader = {
  enabled: boolean;
  text: string;
  showPageNumber: boolean;
  align: HeadingAlign;
};

export type RunningFooter = {
  enabled: boolean;
  text: string;
  showPageNumber: boolean;
};

export type CalloutStyle = "bar" | "box" | "quote";

export type Decoration = {
  calloutStyle: CalloutStyle;
  watermark: boolean;
  watermarkText: string;
  /** Page corner ornament. */
  cornerOrnament: boolean;
};

export type ReportStyle = {
  templateName: string;
  page: {
    size: PageSize;
    orientation: Orientation;
    margin: Margins;
  };
  colors: ColorPalette;
  typography: Typography;
  cover: Cover;
  sections: SectionStyle;
  header: RunningHeader;
  footer: RunningFooter;
  decoration: Decoration;
};

/* -------------------------------------------------------------------------- */
/*  Font + option catalogs (for the editor selects)                           */
/* -------------------------------------------------------------------------- */

/** name → CSS font stack used by the preview. Cormorant/Hanken are the loaded
 *  brand fonts; the rest fall back to close web-safe equivalents (the preview
 *  is a reference, not a print-exact proof). */
export const FONT_STACKS: Record<string, string> = {
  "Cormorant Garamond": "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
  "Hanken Grotesk": "var(--font-hanken), 'Hanken Grotesk', system-ui, sans-serif",
  Georgia: "Georgia, 'Times New Roman', serif",
  "Playfair Display": "'Playfair Display', Georgia, serif",
  "Times New Roman": "'Times New Roman', Times, serif",
  Garamond: "'EB Garamond', Garamond, Georgia, serif",
  Inter: "Inter, system-ui, sans-serif",
  Helvetica: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  "system-ui": "system-ui, -apple-system, sans-serif",
  "JetBrains Mono": "'JetBrains Mono', ui-monospace, monospace",
  Courier: "'Courier New', Courier, monospace",
};

export const SERIF_FONTS = [
  "Cormorant Garamond",
  "Georgia",
  "Playfair Display",
  "Times New Roman",
  "Garamond",
];
export const SANS_FONTS = ["Hanken Grotesk", "Inter", "Helvetica", "system-ui"];
export const MONO_FONTS = ["JetBrains Mono", "Courier"];

export const NUMBER_STYLES: { value: NumberStyle; label: string }[] = [
  { value: "badge", label: "Circled badge" },
  { value: "inline", label: "Inline number" },
  { value: "roman", label: "Roman numeral" },
  { value: "none", label: "No number" },
];

export const DIVIDER_STYLES: { value: DividerStyle; label: string }[] = [
  { value: "rule", label: "Single rule" },
  { value: "double-rule", label: "Double rule" },
  { value: "ornament", label: "Ornament (✦)" },
  { value: "dotted", label: "Dotted" },
  { value: "none", label: "None" },
];

/* -------------------------------------------------------------------------- */
/*  Pixel dimensions for the preview                                          */
/* -------------------------------------------------------------------------- */

/** Page pixel size at 96dpi-ish reference (used only for the preview aspect). */
export const PAGE_PX: Record<PageSize, { w: number; h: number }> = {
  A4: { w: 794, h: 1123 },
  Letter: { w: 816, h: 1056 },
};

/* -------------------------------------------------------------------------- */
/*  Template presets                                                           */
/* -------------------------------------------------------------------------- */

const INK = "#2a2620";
const MUTED = "#6e665a";
const GOLD = "#b0873f";
const GOLD_SOFT = "#d8b478";

function baseTypography(over: Partial<Typography> = {}): Typography {
  return {
    headingFont: "Cormorant Garamond",
    bodyFont: "Hanken Grotesk",
    monoFont: "JetBrains Mono",
    baseSize: 11,
    lineHeight: 1.6,
    h1Size: 34,
    h2Size: 22,
    h3Size: 15,
    headingWeight: 500,
    headingTracking: 0,
    eyebrowTracking: 0.22,
    paragraphSpacing: 10,
    justify: false,
    ...over,
  };
}

/** Reads — "Soft Focus": compact, warm, minimal furniture. */
function readsTemplate(name: string): ReportStyle {
  return {
    templateName: "Soft Focus",
    page: { size: "A4", orientation: "portrait", margin: { top: 22, right: 20, bottom: 20, left: 20 } },
    colors: {
      paper: "#fffdf8",
      ink: INK,
      muted: MUTED,
      heading: "#3a2f1c",
      accent: GOLD,
      accentSecondary: "#8a6d3a",
      divider: "#e6dcc7",
      coverBg: "#1b1710",
      coverText: "#f6f3ec",
    },
    typography: baseTypography({ baseSize: 11, h1Size: 30, h2Size: 20 }),
    cover: {
      enabled: true,
      layout: "centered",
      background: "solid",
      showLogo: true,
      brandName: "Ekodz™",
      title: name,
      subtitle: "Your Soul Imprint™",
      showTagline: false,
      accentRule: true,
    },
    sections: {
      numberStyle: "inline",
      dividerStyle: "rule",
      showEyebrow: false,
      eyebrowText: "Soul Imprint™",
      startOnNewPage: false,
      spacing: 26,
      headingAlign: "left",
      dropCap: false,
      accentBar: false,
    },
    header: { enabled: false, text: name, showPageNumber: false, align: "left" },
    footer: { enabled: true, text: "Ekodz™ · Your Soul Imprint™", showPageNumber: true },
    decoration: { calloutStyle: "bar", watermark: false, watermarkText: "Ekodz™", cornerOrnament: false },
  };
}

/** Blueprints — "Signature": full cover, badges, drop caps, rules. */
function blueprintTemplate(name: string, accent = GOLD): ReportStyle {
  return {
    templateName: "Signature",
    page: { size: "A4", orientation: "portrait", margin: { top: 26, right: 24, bottom: 24, left: 24 } },
    colors: {
      paper: "#fffdf8",
      ink: INK,
      muted: MUTED,
      heading: "#2c2415",
      accent,
      accentSecondary: "#7a5c2c",
      divider: "#e3d8c1",
      coverBg: "#15120e",
      coverText: "#f2ead9",
    },
    typography: baseTypography({ baseSize: 11.5, h1Size: 40, h2Size: 24, paragraphSpacing: 12 }),
    cover: {
      enabled: true,
      layout: "centered",
      background: "gradient",
      showLogo: true,
      brandName: "Ekodz™",
      title: name,
      subtitle: "Soul Imprint™ Blueprint",
      showTagline: true,
      accentRule: true,
    },
    sections: {
      numberStyle: "badge",
      dividerStyle: "rule",
      showEyebrow: true,
      eyebrowText: "Soul Imprint™ Blueprint",
      startOnNewPage: false,
      spacing: 36,
      headingAlign: "left",
      dropCap: true,
      accentBar: false,
    },
    header: { enabled: true, text: name, showPageNumber: true, align: "left" },
    footer: { enabled: true, text: "Ekodz™ · Confidential", showPageNumber: true },
    decoration: { calloutStyle: "box", watermark: false, watermarkText: "Ekodz™", cornerOrnament: true },
  };
}

/** Compatibility — "Duet": two-tone accents for Person A / Person B. */
function compatibilityTemplate(name: string): ReportStyle {
  const s = blueprintTemplate(name, "#b0873f");
  s.templateName = "Duet";
  s.colors.accent = "#b0873f"; // Person A
  s.colors.accentSecondary = "#7c6aa8"; // Person B
  s.colors.coverBg = "#171320";
  s.cover.subtitle = "Shared Soul Imprint™";
  s.cover.layout = "banner";
  s.sections.eyebrowText = "Compatibility Blueprint™";
  s.sections.accentBar = true;
  return s;
}

/** Manual — "Flagship": richest treatment, part pages, page numbers. */
function manualTemplate(name: string): ReportStyle {
  const s = blueprintTemplate(name, "#a5812f");
  s.templateName = "Flagship";
  s.page.margin = { top: 28, right: 26, bottom: 26, left: 26 };
  s.typography = baseTypography({ baseSize: 12, h1Size: 46, h2Size: 26, h3Size: 16, paragraphSpacing: 13, lineHeight: 1.65 });
  s.cover.subtitle = "The Complete Soul Imprint™";
  s.cover.background = "gradient";
  s.sections.startOnNewPage = true;
  s.sections.dropCap = true;
  s.sections.spacing = 40;
  s.sections.eyebrowText = "Ekodz Manual™";
  s.decoration.cornerOrnament = true;
  s.footer.text = "Ekodz Manual™ · Confidential";
  return s;
}

/** The pre-defined template for a product, chosen by category. */
export function defaultStyleFor(category: string, name: string): ReportStyle {
  switch (category) {
    case "Reads":
      return readsTemplate(name);
    case "Blueprints":
      return blueprintTemplate(name);
    case "Compatibility Blueprints":
      return compatibilityTemplate(name);
    case "Manuals":
      return manualTemplate(name);
    default:
      return blueprintTemplate(name);
  }
}

/* -------------------------------------------------------------------------- */
/*  Preset library (quick-apply named looks in the editor)                    */
/* -------------------------------------------------------------------------- */

export const STYLE_PRESETS: { name: string; description: string; build: (name: string) => ReportStyle }[] = [
  { name: "Soft Focus", description: "Compact & warm — the Reads look.", build: readsTemplate },
  { name: "Signature", description: "Full cover, badges, drop caps — the Blueprint look.", build: (n) => blueprintTemplate(n) },
  { name: "Duet", description: "Two-tone accents for two people.", build: compatibilityTemplate },
  { name: "Flagship", description: "Richest — part pages & page numbers.", build: manualTemplate },
  {
    name: "Noir",
    description: "Dark paper, luminous gold — a dramatic alternative.",
    build: (n) => {
      const s = blueprintTemplate(n);
      s.templateName = "Noir";
      s.colors = {
        ...s.colors,
        paper: "#14110c",
        ink: "#e9e2d4",
        muted: "#a99f8c",
        heading: "#f0e6cf",
        accent: GOLD_SOFT,
        divider: "#3a3324",
        coverBg: "#0d0b07",
        coverText: "#f6f3ec",
      };
      s.decoration.watermark = true;
      return s;
    },
  },
  {
    name: "Editorial",
    description: "Clean, justified, magazine-like. Minimal ornament.",
    build: (n) => {
      const s = blueprintTemplate(n);
      s.templateName = "Editorial";
      s.typography = baseTypography({ baseSize: 11, h1Size: 36, h2Size: 21, justify: true, headingTracking: -0.01 });
      s.cover.background = "accent-bar";
      s.cover.layout = "left";
      s.sections.numberStyle = "inline";
      s.sections.dividerStyle = "double-rule";
      s.sections.dropCap = false;
      s.decoration.cornerOrnament = false;
      return s;
    },
  },
];
