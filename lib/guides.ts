/* ============================================================================
   Ekodz — Admin How-To Guides

   A library of task-oriented guides for the admin panel. Each guide is short,
   step-by-step, and references the real controls in the Products section, the
   Reports Editor (Content + PDF Style), and Labs. Inline `**bold**` and
   `` `code` `` are supported by the renderer.
   ========================================================================== */

export type GuideCategory =
  | "Getting Started"
  | "Products"
  | "Reports Editor"
  | "Style Editor"
  | "Labs"
  | "Workflows";

export const CATEGORY_ORDER: GuideCategory[] = [
  "Getting Started",
  "Products",
  "Reports Editor",
  "Style Editor",
  "Labs",
  "Workflows",
];

export const CATEGORY_META: Record<GuideCategory, { blurb: string; icon: string }> = {
  "Getting Started": { blurb: "Orient yourself — the admin map and the core concepts.", icon: "compass" },
  Products: { blurb: "Set prices, specs, fields, AI config and section prompts.", icon: "cube" },
  "Reports Editor": { blurb: "Shape each report section and its LLM prompt.", icon: "doc" },
  "Style Editor": { blurb: "Design the PDF — colors, type, cover, layout.", icon: "brush" },
  Labs: { blurb: "Test generations and refine prompt logic with real inputs.", icon: "flask" },
  Workflows: { blurb: "End-to-end recipes for common real tasks.", icon: "route" },
};

export type Level = "Basics" | "Intermediate" | "Advanced";

export type Step = { do: string; note?: string };

export type Guide = {
  slug: string;
  title: string;
  category: GuideCategory;
  summary: string;
  minutes: number;
  level: Level;
  tags: string[];
  prereqs?: string[]; // slugs
  steps: Step[];
  tips?: string[];
  related?: string[]; // slugs
  cta?: { label: string; href: string };
};

/* -------------------------------------------------------------------------- */

export const GUIDES: Guide[] = [
  /* ============================ GETTING STARTED ========================== */
  {
    slug: "admin-overview",
    title: "Tour the admin panel",
    category: "Getting Started",
    summary: "A quick map of every section in the sidebar and what each one is for.",
    minutes: 3,
    level: "Basics",
    tags: ["overview", "navigation", "start here"],
    steps: [
      { do: "Open the sidebar on the left. Every admin area lives here." },
      { do: "**Calculation Engine** inspects all 34 numerology fields for any set of client inputs — the raw data every report is built from." },
      { do: "**Products** is the catalog: pricing, specs, AI configuration, numerology fields, brand copy, and the LLM prompt for every report section." },
      { do: "**Reports Editor** is where you shape each product's report — section by section — and its PDF style." },
      { do: "**Labs** lets you run full reports or individual sections against test inputs to refine prompt logic." },
      { do: "**Orders** and **Users** track purchases and clients (scaffolded)." },
    ],
    tips: [
      "Everything you change in Products / Reports / Style is saved to this browser and layered over the spec defaults — you can always reset.",
      "The Products editor and the Reports Editor write to the same store, so edits stay consistent between them.",
    ],
    related: ["product-model", "calc-engine-basics", "labs-first-run"],
    cta: { label: "Open the Calculation Engine", href: "/admin" },
  },
  {
    slug: "product-model",
    title: "Understand the Ekodz product model",
    category: "Getting Started",
    summary: "How the four product categories relate — Reads, Blueprints, Compatibility Blueprint, and the Manual.",
    minutes: 4,
    level: "Basics",
    tags: ["concepts", "products", "ladder"],
    steps: [
      { do: "**Reads** ($29–$79) are focused, concise reports using a 5-layer model. Great entry points and upsell hooks." },
      { do: "**Blueprints** ($397) are comprehensive single-pillar reports using all 6 layers — Attachment Theory is exclusive to this tier and up." },
      { do: "**Compatibility Blueprint** ($497→$597) is the only two-person product, built from two full field sets." },
      { do: "**Manual** ($997→$2,500) is the flagship — all 4 pillars plus the exclusive Integration Chapter™, 55 sections." },
      { do: "Open Products to see them grouped exactly this way, with live prices and section counts." },
    ],
    tips: ["Each product has an upsell path baked into its spec — you can see and edit it in the product's Specifications panel."],
    related: ["admin-overview", "browse-products"],
    cta: { label: "Browse the product catalog", href: "/admin/products" },
  },
  {
    slug: "calc-engine-basics",
    title: "Read the Calculation Engine",
    category: "Getting Started",
    summary: "See how the 34 numerology fields are derived from five raw inputs.",
    minutes: 4,
    level: "Basics",
    tags: ["engine", "fields", "numerology"],
    steps: [
      { do: "Go to the Calculation Engine and click **Load sample** (or type a first name, last name, and date of birth)." },
      { do: "Scroll the field cards — each shows the value, a plain-language meaning, and the exact derivation steps." },
      { do: "Clear the **Birth time** field to see how time-dependent fields (Time, Time Sum, Mindplane) degrade gracefully." },
      { do: "Note fields flagged ⚠ — their formula is interpretive and pending verification against a reference." },
    ],
    tips: ["All 34 fields are always calculated regardless of product — report templates choose which to display."],
    related: ["labs-first-run", "manage-fields"],
    cta: { label: "Open the Calculation Engine", href: "/admin" },
  },
  {
    slug: "language-rule",
    title: "The non-diagnostic language rule",
    category: "Getting Started",
    summary: "The locked guardrail that shapes every prompt and every report.",
    minutes: 3,
    level: "Basics",
    tags: ["language", "guardrails", "prompts"],
    steps: [
      { do: 'Never phrase output as a diagnosis ("You are…", "You have…"). Always use **tendency language** ("you may have a tendency to…", "your numbers suggest patterns consistent with…").' },
      { do: "For Attachment Theory, never diagnose a style, and always include an evolution pathway toward secure attachment." },
      { do: "You'll find this rule pre-loaded in every product's **AI Configuration → System prompt** and in its **Language Rules** panel." },
      { do: "If you rewrite a system prompt, keep the rule intact — the product editor offers a one-click re-insert if it's missing." },
    ],
    related: ["edit-brand-copy", "product-ai-config"],
    cta: { label: "Review a product's language rules", href: "/admin/products/personal-read" },
  },

  /* ================================ PRODUCTS ============================= */
  {
    slug: "browse-products",
    title: "Find a product in the catalog",
    category: "Products",
    summary: "Navigate the grouped catalog and open any product to configure it.",
    minutes: 2,
    level: "Basics",
    tags: ["catalog", "navigation"],
    steps: [
      { do: "Open **Products**. Products are grouped by category with live price and section-count chips." },
      { do: "A **Customized** chip means that product has edits layered over the spec default." },
      { do: "Click any card to open its full editor." },
    ],
    related: ["edit-price", "edit-specs"],
    cta: { label: "Open Products", href: "/admin/products" },
  },
  {
    slug: "edit-price",
    title: "Change a product's price",
    category: "Products",
    summary: "Set the launch price and an optional future/target price.",
    minutes: 2,
    level: "Basics",
    tags: ["pricing", "launch price"],
    steps: [
      { do: "Open a product and find the **Pricing** panel." },
      { do: "Set **Launch price** (USD). This is what shows on the catalog card." },
      { do: "Optionally set a **Future price** — the catalog then renders it as `$497 → $597`. Leave it at 0 to hide it." },
    ],
    tips: ["Prices are stored per browser; use **Reset to spec** on the product to return to the original price."],
    related: ["launch-new-price", "reset-product"],
    cta: { label: "Edit the Compatibility Blueprint price", href: "/admin/products/compatibility-blueprint" },
  },
  {
    slug: "edit-specs",
    title: "Edit product specifications",
    category: "Products",
    summary: "Adjust pages, people, attachment depth, tagline, and upsell positioning.",
    minutes: 3,
    level: "Basics",
    tags: ["specs", "positioning", "attachment"],
    steps: [
      { do: "Open a product and use the **Specifications** panel." },
      { do: "Edit **Pages**, **People**, and **Attachment (Layer 6)** depth." },
      { do: "Set the **Tagline**, **Perfect for**, and **Upsell from / Upsell to** to shape positioning." },
      { do: "Use **Formula** to describe which layers apply, and **Delivery** for fulfillment wording." },
    ],
    tips: ["Setting **People** to 2 marks the product two-person — Labs will then ask for Person A and Person B inputs."],
    related: ["edit-report-spec", "manage-fields"],
    cta: { label: "Edit a Blueprint's specs", href: "/admin/products/personal-architecture-blueprint" },
  },
  {
    slug: "edit-report-spec",
    title: "Configure the generated report spec",
    category: "Products",
    summary: "Define the delivered report's format, page count, section count, depth, and delivery.",
    minutes: 2,
    level: "Basics",
    tags: ["report spec", "delivery", "format"],
    steps: [
      { do: "In the product editor, open the **Generated Report Spec** panel." },
      { do: "Set **Format** (e.g. PDF report), **Page count**, **Section count**, and **Depth (words)**." },
      { do: "Use **Delivery** to describe how the report reaches the client (download link, email)." },
    ],
    tips: ["The same report spec is editable from the Reports Editor — both views stay in sync."],
    related: ["reports-overview", "edit-specs"],
    cta: { label: "Open a product editor", href: "/admin/products/life-purpose-read" },
  },
  {
    slug: "manage-fields",
    title: "Manage a product's numerology fields",
    category: "Products",
    summary: "Add, edit, remove, and weight the engine fields a product draws from.",
    minutes: 4,
    level: "Intermediate",
    tags: ["fields", "weights", "numerology"],
    steps: [
      { do: "Open a product and scroll to the **Numerology Fields** panel." },
      { do: "Each row has the **Field** name, a **Weight** (Primary / Used / Context), and a **Why this field** rationale." },
      { do: "Click **+ Add field** to append a new one; use **Remove** to delete a row." },
      { do: "Primary fields guide emphasis, not exclusion — the AI still has all 34 fields available." },
    ],
    tips: [
      "Field names should match the engine's names (e.g. `Lifepath`, `Soul Urge`, `1st Challenge`) so Labs can inject the right values.",
      "In Labs, the **Data** tab on each section shows exactly which fields were injected — a fast way to confirm your selection.",
    ],
    related: ["calc-engine-basics", "labs-read-metrics"],
    cta: { label: "Edit fields on the Soul & Conscious Blueprint", href: "/admin/products/soul-conscious-blueprint" },
  },
  {
    slug: "product-ai-config",
    title: "Configure a product's AI settings",
    category: "Products",
    summary: "Choose the model and sampling parameters, and edit the global system prompt.",
    minutes: 4,
    level: "Intermediate",
    tags: ["ai", "model", "temperature", "system prompt"],
    steps: [
      { do: "Open a product and find the **AI Configuration** panel (also available in the Reports Editor)." },
      { do: "Pick a **Model** and set **Temperature**, **Max tokens**, and **Top-p**." },
      { do: "Edit the **System prompt** — this is prepended to every section prompt in the report." },
      { do: "Keep the non-diagnostic rule in the system prompt; use the re-insert button if you've removed it." },
    ],
    tips: [
      "Higher temperature = more varied prose; lower = more consistent. Longer products need higher **Max tokens**.",
      "Test any change immediately in Labs — the **Resolved prompt** tab shows your system prompt in context.",
    ],
    related: ["language-rule", "labs-refine-prompt"],
    cta: { label: "Configure AI on the Manual", href: "/admin/products/ekodz-manual" },
  },
  {
    slug: "edit-section-prompt-product",
    title: "Edit a section's LLM prompt from Products",
    category: "Products",
    summary: "Tune the exact instruction mapped to any report section without leaving the product editor.",
    minutes: 3,
    level: "Intermediate",
    tags: ["prompts", "sections"],
    steps: [
      { do: "Open a product and scroll to **Report Sections & LLM Prompts**." },
      { do: "Click a section row to expand it." },
      { do: "Edit its **LLM prompt** — the exact instruction sent to the model for that section." },
      { do: "For deeper editing (type, fields, word count, framework step) use the **Reports Editor →** button." },
    ],
    tips: ["Every prompt edit here is identical to editing it in the Reports Editor — same underlying store."],
    related: ["configure-section", "labs-refine-prompt"],
    cta: { label: "Edit prompts on the Roadblock Read", href: "/admin/products/roadblock-read" },
  },
  {
    slug: "edit-brand-copy",
    title: "Edit brand copy and language rules",
    category: "Products",
    summary: "Change the fixed intro/closing copy and the guardrails enforced across a report.",
    minutes: 3,
    level: "Intermediate",
    tags: ["brand copy", "language rules"],
    steps: [
      { do: "Open a product and find the **Brand Copy** panel." },
      { do: "Edit the **Brand Intro** and **Brand Closing** — these render verbatim in the report." },
      { do: "Keep the `[First Name]` (and `[Partner Name]` for Compatibility) tokens — they're substituted at generation time." },
      { do: "In **Language Rules**, add or edit the guardrails; use **+ Add rule** for product-specific rules." },
    ],
    related: ["language-rule", "configure-fixed-copy"],
    cta: { label: "Edit brand copy on the Personal Read", href: "/admin/products/personal-read" },
  },
  {
    slug: "reset-product",
    title: "Reset a product to its spec default",
    category: "Products",
    summary: "Undo all customizations for one product, or for the whole catalog.",
    minutes: 1,
    level: "Basics",
    tags: ["reset", "defaults"],
    steps: [
      { do: "To reset one product: open it and click **Reset to spec** in the header. This clears every customization for that product." },
      { do: "To reset everything: on the Products index, click **Reset all to spec** (shown when any product is customized)." },
      { do: "Resetting content also clears that product's style customizations — the style has its own targeted reset in the Style Editor." },
    ],
    tips: ["Spec defaults come straight from the product specification, so a reset is always safe and predictable."],
    related: ["browse-products", "reset-style"],
    cta: { label: "Open Products", href: "/admin/products" },
  },

  /* ============================= REPORTS EDITOR ========================= */
  {
    slug: "reports-overview",
    title: "Reports Editor overview",
    category: "Reports Editor",
    summary: "How the Content & Prompts tab and the PDF Style tab fit together.",
    minutes: 3,
    level: "Basics",
    tags: ["reports", "tabs"],
    steps: [
      { do: "Open **Reports Editor** and click a report to open its editor." },
      { do: "The **Content & Prompts** tab holds the report spec, AI config, brand copy, language rules, and every section." },
      { do: "The **PDF Style** tab holds the visual design and a live preview." },
      { do: "Switch tabs anytime using the strip under the header." },
    ],
    related: ["configure-section", "style-overview"],
    cta: { label: "Open Reports Editor", href: "/admin/reports" },
  },
  {
    slug: "configure-section",
    title: "Configure a report section end-to-end",
    category: "Reports Editor",
    summary: "Set a section's title, type, fields, length, framework step, and prompt.",
    minutes: 4,
    level: "Intermediate",
    tags: ["sections", "prompts", "fields"],
    steps: [
      { do: "In a report's **Content & Prompts** tab, scroll to **Report Sections** and expand a section." },
      { do: "Set the **Section title** and choose **Type** — AI-generated or Fixed brand copy." },
      { do: "Set **Word count / length** and **Primary fields** (the numerology fields feeding this section)." },
      { do: "Add an **Ekodz Framework™ step** if the section references one (e.g. North Star sections)." },
      { do: "Write the **LLM prompt** — the exact instruction the model follows for this section." },
    ],
    tips: [
      "Primary fields drive what Labs injects and interprets — keep them aligned with the prompt's intent.",
      "Use **Expand all / Collapse all** to move quickly through long reports.",
    ],
    related: ["configure-fixed-copy", "labs-refine-prompt", "navigate-long-report"],
    cta: { label: "Edit the Personal Read sections", href: "/admin/reports/personal-read" },
  },
  {
    slug: "configure-fixed-copy",
    title: "Switch a section between AI and fixed copy",
    category: "Reports Editor",
    summary: "Turn a section into verbatim brand copy, or back into an AI-generated section.",
    minutes: 2,
    level: "Intermediate",
    tags: ["fixed copy", "sections"],
    steps: [
      { do: "Expand the section and set **Type** to **Fixed brand copy**." },
      { do: "A **Fixed brand copy** field appears — its text renders verbatim, with no model call." },
      { do: "Switch **Type** back to **AI-generated** to restore prompt-driven generation." },
    ],
    tips: ["Intro and Closing sections are fixed copy by default; body sections are AI. In Labs, fixed-copy sections show `Rendered verbatim — no model call`."],
    related: ["configure-section", "edit-brand-copy"],
    cta: { label: "Open a report", href: "/admin/reports/life-purpose-read" },
  },
  {
    slug: "navigate-long-report",
    title: "Navigate a long report (the Manual)",
    category: "Reports Editor",
    summary: "Work efficiently through the 55-section Manual.",
    minutes: 2,
    level: "Basics",
    tags: ["manual", "navigation"],
    steps: [
      { do: "Open the Ekodz Manual report. Sections are grouped as Opening (O), Parts 1–4 (P), and Integration (I)." },
      { do: "Use **Collapse all** to scan titles, then expand only what you need." },
      { do: "The overview strip shows how many sections are AI vs fixed copy at a glance." },
    ],
    related: ["reports-overview", "configure-section"],
    cta: { label: "Open the Manual report", href: "/admin/reports/ekodz-manual" },
  },

  /* ============================== STYLE EDITOR ========================== */
  {
    slug: "style-overview",
    title: "Open the PDF Style Editor",
    category: "Style Editor",
    summary: "Where the report's visual design lives, with a live reference preview.",
    minutes: 2,
    level: "Basics",
    tags: ["style", "pdf", "preview"],
    steps: [
      { do: "Open a report and click the **PDF Style** tab (or the **PDF Style** header link)." },
      { do: "Controls are on the left; a **Live Preview** of a cover page and a content page is on the right." },
      { do: "The preview is a reference, not print-exact — fonts fall back to close web equivalents." },
    ],
    tips: ["Every product ships with a pre-defined template chosen by category — the chip in the header shows which."],
    related: ["apply-preset", "build-palette"],
    cta: { label: "Open a Style Editor", href: "/admin/reports/personal-architecture-blueprint/style" },
  },
  {
    slug: "apply-preset",
    title: "Apply a template preset",
    category: "Style Editor",
    summary: "Start from a named look like Signature, Duet, Flagship, Noir, or Editorial.",
    minutes: 2,
    level: "Basics",
    tags: ["presets", "templates"],
    steps: [
      { do: "In the Style Editor, use the **Template Presets** panel." },
      { do: "Your product's current template is highlighted. Click any preset to apply it wholesale." },
      { do: "Fine-tune from there — presets are just a starting point." },
    ],
    tips: ["**Noir** flips to dark paper with luminous gold; **Editorial** is justified and minimal. Great for quick A/B looks."],
    related: ["style-overview", "reset-style"],
    cta: { label: "Try presets on the Manual", href: "/admin/reports/ekodz-manual/style" },
  },
  {
    slug: "page-setup",
    title: "Set page size, orientation & margins",
    category: "Style Editor",
    summary: "Control the physical page the report is laid out on.",
    minutes: 2,
    level: "Basics",
    tags: ["page", "margins", "layout"],
    steps: [
      { do: "Open the **Page Setup** panel." },
      { do: "Choose **Page size** (A4 or US Letter) and **Orientation**." },
      { do: "Adjust the four **margins** (mm). Watch the preview reflow as you change them." },
    ],
    related: ["style-overview", "section-treatment"],
    cta: { label: "Open a Style Editor", href: "/admin/reports/roadblock-read/style" },
  },
  {
    slug: "build-palette",
    title: "Build a color palette",
    category: "Style Editor",
    summary: "Set paper, ink, accents, dividers, and cover colors — and watch the preview.",
    minutes: 3,
    level: "Intermediate",
    tags: ["colors", "palette", "accent"],
    steps: [
      { do: "Open the **Color Palette** panel. Each swatch has a color picker plus a hex input." },
      { do: "Set **Paper**, **Body text (ink)**, and **Headings** first — they define readability." },
      { do: "Set the **Primary accent** (rules, numbers, badges) and **Secondary accent** (e.g. Person B in Compatibility)." },
      { do: "Set **Cover background** and **Cover text**; check contrast in the preview's cover page." },
    ],
    tips: ["Keep body text and paper at a comfortable contrast — the preview's content page is the fastest gut-check."],
    related: ["typography", "design-cover"],
    cta: { label: "Style the Love & Connection Blueprint", href: "/admin/reports/love-connection-blueprint/style" },
  },
  {
    slug: "typography",
    title: "Set typography",
    category: "Style Editor",
    summary: "Choose fonts and tune scale, weight, tracking, spacing, and justification.",
    minutes: 3,
    level: "Intermediate",
    tags: ["typography", "fonts"],
    steps: [
      { do: "Open the **Typography** panel and pick **Heading**, **Body**, and **Mono** fonts." },
      { do: "Set **Body size** and **Line height** for readability, then the **H1 / H2 / H3** scale." },
      { do: "Adjust **Heading weight** and **tracking**; toggle **Justify body text** for a magazine feel." },
    ],
    tips: ["Cormorant + Hanken are the loaded brand fonts and render most faithfully in the preview."],
    related: ["build-palette", "section-treatment"],
    cta: { label: "Open a Style Editor", href: "/admin/reports/career-business-read/style" },
  },
  {
    slug: "design-cover",
    title: "Design the cover page",
    category: "Style Editor",
    summary: "Configure the report's first page — layout, background, logo, title, subtitle.",
    minutes: 3,
    level: "Intermediate",
    tags: ["cover", "branding"],
    steps: [
      { do: "Open the **Cover Page** panel." },
      { do: "Pick a **Layout** (centered / left / banner) and **Background** (solid / gradient / accent bar)." },
      { do: "Set **Brand name**, **Title**, and **Subtitle**; toggle **Show logo**, **Accent rule**, and **Show tagline**." },
      { do: "Toggle **Show cover page** off entirely for short reports where you don't want a cover." },
    ],
    related: ["build-palette", "apply-preset"],
    cta: { label: "Design the Compatibility Blueprint cover", href: "/admin/reports/compatibility-blueprint/style" },
  },
  {
    slug: "section-treatment",
    title: "Define how sections look",
    category: "Style Editor",
    summary: "Section numbers, dividers, eyebrows, drop caps, accent bars, and page breaks.",
    minutes: 3,
    level: "Intermediate",
    tags: ["sections", "dividers", "drop cap"],
    steps: [
      { do: "Open the **Section Treatment** panel." },
      { do: "Choose a **Section number** style (badge / inline / roman / none) and a **Divider** under the heading." },
      { do: "Set **Heading alignment** and an **Eyebrow label**; toggle **Show eyebrow**." },
      { do: "Toggle **Drop cap**, **Left accent bar**, and **Each section on new page** to taste." },
    ],
    tips: ["**Each section on new page** suits the Manual and Blueprints; leave it off for short Reads."],
    related: ["header-footer-deco", "typography"],
    cta: { label: "Open a Style Editor", href: "/admin/reports/soul-conscious-blueprint/style" },
  },
  {
    slug: "header-footer-deco",
    title: "Running header, footer & decoration",
    category: "Style Editor",
    summary: "Add repeated page furniture, page numbers, callouts, watermark, and ornaments.",
    minutes: 3,
    level: "Intermediate",
    tags: ["header", "footer", "watermark", "callout"],
    steps: [
      { do: "In **Running Header & Footer**, toggle each on and set its text, alignment, and page-number visibility." },
      { do: "In **Decoration**, pick a **Callout style** (bar / box / quote) used for highlighted passages." },
      { do: "Toggle **Watermark** (with custom text) and **Corner ornaments** for a premium feel." },
    ],
    related: ["section-treatment", "rebrand-report"],
    cta: { label: "Open a Style Editor", href: "/admin/reports/ekodz-manual/style" },
  },
  {
    slug: "reset-style",
    title: "Reset a report's style",
    category: "Style Editor",
    summary: "Return just the visual design to its pre-defined template.",
    minutes: 1,
    level: "Basics",
    tags: ["reset", "style"],
    steps: [
      { do: "In the Style Editor header, click **Reset style to template**." },
      { do: "This restores the pre-defined template for the product's category and leaves the report content untouched." },
    ],
    related: ["apply-preset", "reset-product"],
    cta: { label: "Open a Style Editor", href: "/admin/reports/personal-read/style" },
  },

  /* ================================= LABS ============================== */
  {
    slug: "labs-first-run",
    title: "Run your first full report",
    category: "Labs",
    summary: "Generate every section of a product against a test subject.",
    minutes: 3,
    level: "Basics",
    tags: ["labs", "generate", "full report"],
    steps: [
      { do: "Open **Labs**. Pick a **Product under test** and leave **Run mode** on **Full report**." },
      { do: "Click **Load sample** to fill the test subject, or enter first name, last name, and date of birth." },
      { do: "Press **Run full report**. Sections stream in from queued → running → done." },
      { do: "Open any card's **Output** tab to read the draft." },
    ],
    tips: ["The header shows a run summary — section count, total words, estimated tokens, and elapsed time."],
    related: ["labs-single-section", "labs-refine-prompt", "labs-read-metrics"],
    cta: { label: "Open Labs", href: "/admin/labs" },
  },
  {
    slug: "labs-single-section",
    title: "Test an individual section",
    category: "Labs",
    summary: "Focus on one or a few sections instead of the whole report.",
    minutes: 2,
    level: "Basics",
    tags: ["labs", "sections"],
    steps: [
      { do: "In Labs, switch **Run mode** to **Individual sections**." },
      { do: "A section chooser appears — click sections to include them, or use **Select all / None**." },
      { do: "Press **Run** to generate only the chosen sections." },
      { do: "On any card, click **Re-run** to regenerate just that section." },
    ],
    tips: ["This is the fastest loop when you're iterating on a single section's prompt."],
    related: ["labs-refine-prompt", "labs-first-run"],
    cta: { label: "Open Labs", href: "/admin/labs" },
  },
  {
    slug: "labs-refine-prompt",
    title: "Refine a prompt with the Resolved Prompt tab",
    category: "Labs",
    summary: "The core loop — read the exact assembled prompt, edit it, and re-run.",
    minutes: 5,
    level: "Advanced",
    tags: ["labs", "prompt engineering", "resolved prompt"],
    steps: [
      { do: "Run a section in Labs, then open its **Resolved prompt** tab." },
      { do: "Read the full assembly: system prompt + product context + the subject's injected numerology + the section instruction + generation parameters." },
      { do: "Click **Edit prompt →** to jump to the Reports Editor and change that section's instruction." },
      { do: "Return to Labs and **Re-run** the section. The resolved prompt and the draft both reflect your edit." },
      { do: "Repeat until the output matches your intent." },
    ],
    tips: [
      "The resolved prompt is 100% real — it's exactly what a live model would receive.",
      "Change a directive in the prompt (e.g. ask for '3–5 patterns' vs 'one paragraph') and watch the simulated draft change shape.",
    ],
    related: ["configure-section", "edit-section-prompt-product", "labs-read-metrics"],
    cta: { label: "Open Labs", href: "/admin/labs" },
  },
  {
    slug: "labs-two-person",
    title: "Test a two-person (Compatibility) product",
    category: "Labs",
    summary: "Provide Person A and Person B inputs and generate a relationship report.",
    minutes: 3,
    level: "Intermediate",
    tags: ["labs", "compatibility", "two people"],
    steps: [
      { do: "In Labs, select **Compatibility Read** or **Compatibility Blueprint** — both are two-person." },
      { do: "The test subject splits into **Person A** and **Person B**. Fill in both (or Load sample)." },
      { do: "Run the report. Sections blend both field sets; the **Data** tab shows fields from each person." },
    ],
    tips: ["The live readout shows Person A's core numbers; both sets are injected into the resolved prompt."],
    related: ["labs-first-run", "edit-specs"],
    cta: { label: "Open Labs", href: "/admin/labs" },
  },
  {
    slug: "labs-read-metrics",
    title: "Read the output metrics",
    category: "Labs",
    summary: "Interpret word count vs target, tokens, and injected fields.",
    minutes: 2,
    level: "Intermediate",
    tags: ["labs", "metrics", "word count"],
    steps: [
      { do: "On a done card's **Output** tab, check **words / ~target** — a highlighted count means it's well under target." },
      { do: "See the estimated **tokens** to gauge cost/length." },
      { do: "Open the **Data** tab to confirm which numerology fields were injected into that section." },
    ],
    tips: ["If a section reads short, widen its word-count target or enrich the prompt; then re-run to compare."],
    related: ["labs-refine-prompt", "tighten-length"],
    cta: { label: "Open Labs", href: "/admin/labs" },
  },

  /* =============================== WORKFLOWS ============================ */
  {
    slug: "launch-new-price",
    title: "Launch a new price for a product",
    category: "Workflows",
    summary: "A safe, end-to-end recipe for changing pricing.",
    minutes: 3,
    level: "Intermediate",
    tags: ["pricing", "workflow"],
    steps: [
      { do: "Open the product and go to **Pricing**." },
      { do: "Update **Launch price**; set **Future price** if you're signalling an upcoming increase." },
      { do: "Confirm the catalog card reflects the new price (and the `→` future price, if set)." },
      { do: "If needed, update **Upsell from / to** in **Specifications** so the ladder still reads correctly." },
    ],
    related: ["edit-price", "edit-specs"],
    cta: { label: "Open Products", href: "/admin/products" },
  },
  {
    slug: "rebrand-report",
    title: "Rebrand a report's look",
    category: "Workflows",
    summary: "Give a product a fresh visual identity from preset to details.",
    minutes: 5,
    level: "Intermediate",
    tags: ["style", "branding", "workflow"],
    steps: [
      { do: "Open the report's **PDF Style** tab and apply a **Template Preset** close to your target." },
      { do: "Set the **Color Palette** — paper, ink, accents, cover." },
      { do: "Tune **Typography** and design the **Cover Page**." },
      { do: "Adjust **Section Treatment** and **Header/Footer/Decoration**, checking the live preview throughout." },
      { do: "If you overshoot, use **Reset style to template** and start again — content is never affected." },
    ],
    related: ["apply-preset", "build-palette", "design-cover", "reset-style"],
    cta: { label: "Open Reports Editor", href: "/admin/reports" },
  },
  {
    slug: "tighten-length",
    title: "Fix a section that runs too long or too short",
    category: "Workflows",
    summary: "Diagnose length in Labs and correct it in the Reports Editor.",
    minutes: 4,
    level: "Advanced",
    tags: ["length", "prompts", "workflow"],
    steps: [
      { do: "In Labs, run the section and note **words / ~target** on the Output tab." },
      { do: "If it's too short: raise the **Word count / length** and add specificity to the prompt ('include 3–5 concrete points')." },
      { do: "If it's too long: lower the target and constrain the prompt ('one tight paragraph, 2–3 sentences')." },
      { do: "Edit in the Reports Editor, then **Re-run** in Labs and compare the new count." },
    ],
    related: ["labs-read-metrics", "configure-section", "labs-refine-prompt"],
    cta: { label: "Open Labs", href: "/admin/labs" },
  },
  {
    slug: "ship-new-product-variant",
    title: "Adapt a product for a new use case",
    category: "Workflows",
    summary: "Repoint an existing product's fields, prompts, and positioning.",
    minutes: 6,
    level: "Advanced",
    tags: ["workflow", "fields", "prompts", "positioning"],
    steps: [
      { do: "Open the product and revise **Specifications** (tagline, perfect-for, upsell) for the new angle." },
      { do: "In **Numerology Fields**, swap in the fields that matter for the new use case and set their weights." },
      { do: "Update each section's **LLM prompt** and **Primary fields** so the topic lens shifts accordingly." },
      { do: "Refresh **Brand Copy** to match the new voice, keeping the `[First Name]` token." },
      { do: "Validate the whole thing in Labs with a couple of different test subjects." },
    ],
    related: ["manage-fields", "configure-section", "edit-brand-copy", "labs-first-run"],
    cta: { label: "Open Products", href: "/admin/products" },
  },
  {
    slug: "qa-before-launch",
    title: "QA a product before launch",
    category: "Workflows",
    summary: "A checklist pass across content, style, and generation.",
    minutes: 6,
    level: "Advanced",
    tags: ["qa", "checklist", "workflow"],
    steps: [
      { do: "Content: open the report and confirm every section's **Type**, **Primary fields**, **Word count**, and **prompt** read correctly." },
      { do: "Guardrails: confirm the **System prompt** and **Language Rules** include the non-diagnostic rule." },
      { do: "Style: open **PDF Style**, verify cover, palette contrast, and section treatment in the preview." },
      { do: "Generation: in Labs, run the **Full report** with at least two different subjects (and Person B for two-person)." },
      { do: "Spot-check each section's **Resolved prompt** and **Data** tabs for the right context and fields." },
    ],
    tips: ["Run once with a birth time and once without to confirm time-dependent fields degrade gracefully."],
    related: ["labs-first-run", "labs-refine-prompt", "language-rule"],
    cta: { label: "Open Labs", href: "/admin/labs" },
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function guidesByCategory(): { category: GuideCategory; items: Guide[] }[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: GUIDES.filter((g) => g.category === category),
  })).filter((g) => g.items.length > 0);
}

export function searchGuides(query: string): Guide[] {
  const q = query.trim().toLowerCase();
  if (!q) return GUIDES;
  return GUIDES.filter((g) => {
    const hay = `${g.title} ${g.summary} ${g.category} ${g.tags.join(" ")}`.toLowerCase();
    return q.split(/\s+/).every((term) => hay.includes(term));
  });
}
