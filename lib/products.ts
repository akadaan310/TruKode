/* ============================================================================
   Ekodz — Product Catalog  ·  v1.0
   Faithful encoding of ekodz-product-specs.md (v1.0 · July 22 2026).

   This module is the SINGLE SOURCE OF TRUTH for every product's:
     · specs (pages, people, attachment depth, tagline, positioning)
     · pricing (launch + future)
     · generated-report spec (format, section count, depth, delivery)
     · AI configuration (model, sampling params, system prompt)
     · numerology field selection (with per-field rationale + weight)
     · brand copy (fixed intro / closing)
     · language rules
     · per-section report structure INCLUDING the LLM prompt mapped to each
       section of the report.

   The admin Products section and Reports Editor read these objects as the
   DEFAULT configuration. Overrides an admin makes are layered on top in
   lib/productStore.ts (localStorage), so nothing here is destroyed — "Reset
   to spec default" always returns to exactly this file.
   ========================================================================== */

import { defaultStyleFor, type ReportStyle } from "./reportStyle";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ProductCategory =
  | "Reads"
  | "Blueprints"
  | "Compatibility Blueprints"
  | "Manuals";

export const CATEGORY_ORDER: ProductCategory[] = [
  "Reads",
  "Blueprints",
  "Compatibility Blueprints",
  "Manuals",
];

export type FieldWeight = "primary" | "used" | "context";

export type NumerologyFieldRef = {
  /** Field name as it appears in the calculation engine / spec. */
  field: string;
  /** Why this field is selected for this product. */
  why: string;
  /** Emphasis weight — primary fields guide emphasis, not exclusion. */
  weight: FieldWeight;
};

export type SectionType = "AI" | "Fixed copy";

export type ReportSection = {
  /** Stable id used for store overrides. */
  id: string;
  /** Display index — "Intro", "1", "O1", "I1", "Closing", etc. */
  index: string;
  /** Section title. */
  title: string;
  /** AI-generated or fixed brand copy. */
  type: SectionType;
  /** Primary numerology fields feeding this section (free text per spec). */
  primaryFields?: string;
  /** Target length — "150–300 words", "¾ pg", "~150", etc. */
  wordCount?: string;
  /** Ekodz Framework™ step reference(s) for this section, if any. */
  framework?: string;
  /** The LLM prompt / AI instructions mapped to this section. Editable. */
  prompt: string;
  /** Fixed brand copy for non-AI sections (Intro / Closing). */
  fixedCopy?: string;
};

export type AIConfig = {
  /** Model id — defaults to the latest capable Claude model. */
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  /** Global system prompt applied ahead of every section prompt. */
  systemPrompt: string;
};

export type ReportSpec = {
  format: string;
  pageCount: string;
  sectionCount: string;
  depthWords: string;
  delivery: string;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  tagline?: string;
  /** Launch price, USD. */
  priceLaunch: number;
  /** Future / target price, USD (optional). */
  priceFuture?: number;
  currency: "USD";
  pages: string;
  people: number;
  /** Attachment Theory (Layer 6) depth for this product. */
  attachment: string;
  perfectFor?: string;
  /** Layer formula summary (which layers apply + framework steps). */
  formula: string;
  frameworkSteps: string[];
  upsellFrom?: string;
  upsellTo?: string;
  delivery: string;
  numerologyFields: NumerologyFieldRef[];
  brandIntro: string;
  brandClosing: string;
  languageRules: string[];
  reportSpec: ReportSpec;
  ai: AIConfig;
  sections: ReportSection[];
  /** Pre-defined PDF style template for the generated report. */
  style: ReportStyle;
};

/* -------------------------------------------------------------------------- */
/*  Shared foundations (spec §0)                                              */
/* -------------------------------------------------------------------------- */

export const NON_DIAGNOSTIC_RULE =
  'Non-Diagnostic Language Rule — LOCKED. Never say "You are..." or "You have..." as a diagnosis. Always use tendency language: "Based on your blueprint data, you may have a tendency to..." / "Your numbers suggest patterns consistent with..." / "You may find yourself..." / "Your blueprint indicates...". Applies to ALL layers, especially Psychology. Attachment Theory: always tendency language, NEVER diagnose an attachment style, and every attachment insight must include an evolution pathway toward secure attachment.';

export const SIX_LAYERS = [
  { n: 1, name: "Numerology", contribution: "Calculated fields = objective personal data foundation; every insight grounded in the client's numbers." },
  { n: 2, name: "Psychology", contribution: "Behavioral patterns, emotional tendencies, cognitive style, self-sabotage mechanisms — observational, never diagnostic." },
  { n: 3, name: "Archetypes", contribution: "Dominant + shadow archetype from Lifepath + Expression + Soul Urge + Mindplane." },
  { n: 4, name: "Life Cycle Phase", contribution: "Current Pinnacle + Personal Year; phase named (Building / Transitioning / Consolidating / Harvesting)." },
  { n: 5, name: "Spiritual", contribution: "Soul purpose · North/South Node · karmic patterns · alignment check · intuition style · Ekodz Framework™ step in closing." },
  { n: 6, name: "Attachment Theory", contribution: "BLUEPRINTS/Manual exclusive at full depth; focused depth in Compatibility Read + Roadblock Read only." },
];

export const FRAMEWORK_STEPS = [
  { step: 1, name: "Decode Your Architecture", meaning: "Understanding who you are at your core — your innate design." },
  { step: 2, name: "Clear the Roadblocks", meaning: "Identifying and working through what is blocking you." },
  { step: 3, name: "Realign Your Life", meaning: "Aligning your life and decisions with your true design." },
  { step: 4, name: "Consciously Evolve", meaning: "The ongoing evolution into your fullest design." },
];

/** Default AI configuration seeded onto every product. */
function defaultAI(overrides: Partial<AIConfig> = {}): AIConfig {
  return {
    model: "claude-opus-4-8",
    temperature: 0.7,
    maxTokens: 4096,
    topP: 1,
    systemPrompt:
      `You are the Ekodz™ report engine. You receive a client's pre-calculated numerology fields (all 34 fields are computed by the engine before you are called — you NEVER calculate numerology yourself). Interpret the data through the Ekodz 6-Layer Analysis Formula (Numerology · Psychology · Archetypes · Life Cycle Phase · Spiritual · Attachment Theory). Ground every insight in the client's specific numbers — never generic. ${NON_DIAGNOSTIC_RULE}`,
    ...overrides,
  };
}

/* -------------------------------------------------------------------------- */
/*  READS — shared universal structure (spec §1.1 / §1.2)                     */
/* -------------------------------------------------------------------------- */

const READ_INTRO =
  "[First Name], what you're about to read is your Soul Imprint™. For the first time, everything you need to understand yourself is in one place. No separate readings. No years of searching. No piecing it together from multiple sources. Your Soul Imprint™ was developed to give you a complete picture of who you are — your innate design and the patterns that shape how you think, feel, connect, and decide — all at once. This is yours. Read it.";

const READ_CLOSING =
  "What you've just read is a snapshot — a focused window into your Soul Imprint™. There is much more here. Most people spend years searching for this kind of clarity, one piece at a time. You've just found your starting point. When you're ready to go further, we have a full, comprehensive Blueprint built for exactly that. — Ekodz";

const READ_PROMPTS = {
  personalData:
    "Display the client's full name, date of birth, place of birth, country, and time of birth cleanly. Confirm data is correct. Personalize from the first line. No analysis in this section.",
  personalDataTwo:
    "Display the client's full name, date of birth, place of birth, country, and time of birth cleanly. Compatibility Read: display both people's data. Confirm data is correct. Personalize from the first line. No analysis in this section.",
  coreNumbers:
    "Display the specific numerology fields for this Read with their calculated values and a one-line plain-language label for each. Do not analyze yet — simply present the numbers clearly and cleanly.",
  profile:
    "This is the heart of the report. Apply all relevant layers. Draw from the specific fields listed. Interpret through the lens of this Read's topic. Use tendency language throughout. Never diagnose. Make every insight specific to this client's data — not generic.",
  guidance:
    "Provide 3–5 actionable guidance points grounded in this client's specific data. Not generic advice — tied directly to their numbers and patterns. Warm, direct, empowering tone. Client should leave this section knowing their next move.",
};

type ReadOpts = {
  id: string;
  name: string;
  tagline?: string;
  price: number;
  pages: string;
  people: number;
  attachment: string;
  formula: string;
  frameworkSteps: string[];
  upsellFrom?: string;
  upsellTo: string;
  fields: NumerologyFieldRef[];
  profileTitle: string;
  /** Extra sentence appended to the Key Patterns prompt for this Read. */
  keyPatternsExtra: string;
  /** Personal Data prompt (two-person for Compatibility). */
  personalDataPrompt: string;
  /** North Star prompt (references the framework steps + upsell). */
  northStar: string;
  languageRules?: string[];
  profileWords: string;
};

function makeRead(o: ReadOpts): Product {
  const sections: ReportSection[] = [
    {
      id: "intro",
      index: "Intro",
      title: "Brand Intro — Soul Imprint™",
      type: "Fixed copy",
      wordCount: "¼ pg",
      prompt: "Fixed brand copy — rendered verbatim, identical across all 5 Reads. Not AI-generated.",
      fixedCopy: READ_INTRO,
    },
    {
      id: "personal-data",
      index: "1",
      title: "Your Personal Data",
      type: "AI",
      wordCount: "¼ pg",
      prompt: o.personalDataPrompt,
    },
    {
      id: "core-numbers",
      index: "2",
      title: "Your Core Numbers",
      type: "AI",
      wordCount: "¼ pg",
      prompt: READ_PROMPTS.coreNumbers,
    },
    {
      id: "profile",
      index: "3",
      title: o.profileTitle,
      type: "AI",
      wordCount: o.profileWords,
      prompt: READ_PROMPTS.profile,
    },
    {
      id: "key-patterns",
      index: "4",
      title: "Key Patterns",
      type: "AI",
      wordCount: "½ pg",
      prompt:
        "Identify 3–5 key patterns that emerge from the data specific to this Read's topic. Short, direct, one to two sentences each. Frame as observations not judgments. " +
        o.keyPatternsExtra,
    },
    {
      id: "guidance",
      index: "5",
      title: "Your Guidance",
      type: "AI",
      wordCount: "½ pg",
      prompt: READ_PROMPTS.guidance,
    },
    {
      id: "north-star",
      index: "6",
      title: "Your North Star",
      type: "AI",
      wordCount: "¼ pg",
      framework: o.frameworkSteps.join(" · "),
      prompt: o.northStar,
    },
    {
      id: "closing",
      index: "Closing",
      title: "Brand Closing",
      type: "Fixed copy",
      wordCount: "¼ pg",
      prompt: "Fixed brand copy — rendered verbatim, identical across all 5 Reads. Not AI-generated.",
      fixedCopy: READ_CLOSING,
    },
  ];

  return {
    id: o.id,
    name: o.name,
    category: "Reads",
    tagline: o.tagline,
    priceLaunch: o.price,
    currency: "USD",
    pages: o.pages,
    people: o.people,
    attachment: o.attachment,
    formula: o.formula,
    frameworkSteps: o.frameworkSteps,
    upsellFrom: o.upsellFrom,
    upsellTo: o.upsellTo,
    delivery: "Automated — secure download link and/or email upon report generation.",
    numerologyFields: o.fields,
    brandIntro: READ_INTRO,
    brandClosing: READ_CLOSING,
    languageRules: o.languageRules ?? [NON_DIAGNOSTIC_RULE],
    reportSpec: {
      format: "PDF report",
      pageCount: o.pages,
      sectionCount: "8 (Intro + 6 + Closing)",
      depthWords: "Focused / concise per Reads structure",
      delivery: "Automated — secure download link and/or email.",
    },
    ai: defaultAI(),
    sections,
    style: defaultStyleFor("Reads", o.name),
  };
}

const READS: Product[] = [
  makeRead({
    id: "personal-read",
    name: "Personal Read™",
    price: 29,
    pages: "2 pages",
    people: 1,
    attachment: "— (not applied)",
    formula: "Layers 1–5 applied (Layer 5: Framework Step 1 referenced). Layer 6 NOT applied.",
    frameworkSteps: ["Step 1 — Decode Your Architecture"],
    upsellTo: "Life Purpose Read™ / Roadblock Read™",
    profileTitle: "Your Personal Profile",
    profileWords: "¾ pg",
    keyPatternsExtra: "Ground every pattern in the numerology data.",
    personalDataPrompt: READ_PROMPTS.personalData,
    northStar:
      "One closing paragraph. Reference Step 1 — Decode Your Architecture of the Ekodz Framework™. Connect this client's data to that step specifically. End with a warm invitation to go deeper — a Life Purpose Read™ or Roadblock Read™.",
    fields: [
      { field: "Lifepath", why: "Core life path — the foundation of who this person is and where they're headed.", weight: "primary" },
      { field: "Expression", why: "Natural talents and how they express themselves in the world.", weight: "primary" },
      { field: "Soul Urge", why: "Inner desires and what truly motivates them at a deep level.", weight: "primary" },
      { field: "First Name Number", why: "Immediate personality — the energy they project day to day.", weight: "used" },
      { field: "Mindplane", why: "How they think and process — mental and emotional orientation.", weight: "used" },
    ],
  }),
  makeRead({
    id: "compatibility-read",
    name: "Compatibility Read™",
    price: 79,
    pages: "3 pages",
    people: 2,
    attachment: "Focused depth — tendency language only, never diagnostic.",
    formula: "Layers 1–5 applied (Layer 5: Framework Steps 1 + 3 referenced). Layer 6 ✓ Focused depth — tendency language only, never diagnostic.",
    frameworkSteps: ["Step 1 — Decode Your Architecture", "Step 3 — Realign Your Life"],
    upsellTo: "Compatibility Blueprint™",
    profileTitle: "Your Compatibility Profile",
    profileWords: "1¼ pg",
    keyPatternsExtra: "Focus on dynamic patterns between the two people.",
    personalDataPrompt: READ_PROMPTS.personalDataTwo,
    northStar:
      "One closing paragraph. Reference Step 1 — Decode Your Architecture + Step 3 — Realign Your Life of the Ekodz Framework™. Connect this client's data to that step specifically. End with a warm invitation to go deeper — the Compatibility Blueprint™ for full depth.",
    languageRules: [
      NON_DIAGNOSTIC_RULE,
      "Attachment references in this Read always use tendency language. Never diagnose attachment style.",
    ],
    fields: [
      { field: "Lifepath — both people", why: "Core path alignment — are they walking compatible life paths.", weight: "primary" },
      { field: "Expression — both people", why: "How they express and interact — communication and energy match.", weight: "primary" },
      { field: "Soul Urge — both people", why: "Desire alignment — do their inner drives support or conflict.", weight: "primary" },
      { field: "Balance — both people", why: "Emotional balance dynamic — how they manage tension together.", weight: "used" },
      { field: "Compass — combined", why: "Combined directional energy — where the relationship is naturally headed.", weight: "used" },
    ],
  }),
  makeRead({
    id: "life-purpose-read",
    name: "Life Purpose Read™",
    price: 49,
    pages: "3 pages",
    people: 1,
    attachment: "— (not applied)",
    formula: "Layers 1–5 applied (Layer 5: Framework Steps 1 + 4 referenced). Layer 6 NOT applied.",
    frameworkSteps: ["Step 1 — Decode Your Architecture", "Step 4 — Consciously Evolve"],
    upsellTo: "Roadblock Read™",
    profileTitle: "Your Life Purpose Profile",
    profileWords: "1¼ pg",
    keyPatternsExtra: "Ground every pattern in the numerology data.",
    personalDataPrompt: READ_PROMPTS.personalData,
    northStar:
      "One closing paragraph. Reference Step 1 — Decode Your Architecture + Step 4 — Consciously Evolve of the Ekodz Framework™. Connect this client's data to that step specifically. End with a warm invitation to go deeper — the Roadblock Read™ to identify what may be blocking their purpose.",
    fields: [
      { field: "Lifepath", why: "The core purpose and direction this person is designed to walk.", weight: "primary" },
      { field: "Expression", why: "Natural gifts and talents — what they're built to contribute.", weight: "primary" },
      { field: "Soul Urge", why: "Deepest calling — what the soul is truly seeking to fulfill.", weight: "primary" },
      { field: "Inner Dreams", why: "Hidden aspirations — what they dream of but may not yet be pursuing.", weight: "used" },
      { field: "1st Pinnacle", why: "Early life purpose theme — foundational growth period.", weight: "used" },
      { field: "2nd Pinnacle", why: "Current or next life chapter — where purpose is expanding now.", weight: "used" },
    ],
  }),
  makeRead({
    id: "roadblock-read",
    name: "Roadblock Read™",
    price: 49,
    pages: "3 pages",
    people: 1,
    attachment: "Focused depth — tendency language only, never diagnostic.",
    formula: "Layers 1–5 applied (Layer 5: Framework Step 2 referenced). Layer 6 ✓ Focused depth — tendency language only, never diagnostic.",
    frameworkSteps: ["Step 2 — Clear the Roadblocks"],
    upsellTo: "Personal Architecture Blueprint™",
    profileTitle: "Your Roadblock Profile",
    profileWords: "1¼ pg",
    keyPatternsExtra: "Surface hidden blocks specifically.",
    personalDataPrompt: READ_PROMPTS.personalData,
    northStar:
      "One closing paragraph. Reference Step 2 — Clear the Roadblocks of the Ekodz Framework™. Connect this client's data to that step specifically. End with a warm invitation to go deeper — the Personal Architecture Blueprint™ for a complete transformation roadmap.",
    languageRules: [
      NON_DIAGNOSTIC_RULE,
      "Attachment references in this Read always use tendency language. Never diagnose attachment style.",
    ],
    fields: [
      { field: "Balance", why: "Emotional balance — reveals how they handle stress and conflict.", weight: "primary" },
      { field: "Inner Dreams", why: "Gap between what they want and what they're doing — source of friction.", weight: "primary" },
      { field: "1st Challenge", why: "Primary life challenge — the core pattern holding them back.", weight: "primary" },
      { field: "2nd Challenge", why: "Secondary challenge — compounding block or recurring pattern.", weight: "used" },
      { field: "Mindplane", why: "Mental and emotional processing — where thinking patterns create blocks.", weight: "used" },
    ],
  }),
  makeRead({
    id: "career-business-read",
    name: "Career/Business Read™",
    price: 49,
    pages: "3 pages",
    people: 1,
    attachment: "— (not applied)",
    formula: "Layers 1–5 applied (Layer 5: Framework Step 3 referenced). Layer 6 NOT applied.",
    frameworkSteps: ["Step 3 — Realign Your Life"],
    upsellTo: "Professional Design Blueprint™",
    profileTitle: "Your Career Profile",
    profileWords: "1¼ pg",
    keyPatternsExtra: "Ground every pattern in the numerology data.",
    personalDataPrompt: READ_PROMPTS.personalData,
    northStar:
      "One closing paragraph. Reference Step 3 — Realign Your Life of the Ekodz Framework™. Connect this client's data to that step specifically. End with a warm invitation to go deeper — the Professional Design Blueprint™.",
    fields: [
      { field: "Expression", why: "Natural professional talents — what they're built to do and contribute.", weight: "primary" },
      { field: "Lifepath", why: "Career direction alignment — is their work aligned with their core path.", weight: "primary" },
      { field: "Compass", why: "Professional direction — where their energy is naturally pointed.", weight: "used" },
      { field: "Destination", why: "Long-term professional destination — where they're ultimately headed.", weight: "used" },
      { field: "1st Pinnacle", why: "Early career theme — foundational professional identity.", weight: "used" },
      { field: "2nd Pinnacle", why: "Current career chapter — where professional growth is active now.", weight: "used" },
    ],
  }),
];

/* -------------------------------------------------------------------------- */
/*  BLUEPRINTS — shared brand copy (spec §2.2)                                */
/* -------------------------------------------------------------------------- */

const BP_INTRO =
  "[First Name], what you're holding is your Soul Imprint™ Blueprint. Until now, understanding yourself fully meant years of searching — a numerology reading here, a psychology book there, a personality test, a life coach, a spiritual practice. Each one giving you a piece. Never the whole picture. This Blueprint was developed to change that. It is the first of its kind — a single, comprehensive framework that brings every dimension of who you are into one complete, cohesive picture. Your innate design. Your behavioral patterns. Your relational blueprint. Your soul's direction. All decoded. All in one place. You don't have to search anymore. This is yours.";

const BP_CLOSING =
  "You've just read your Soul Imprint™ Blueprint. This is not a snapshot — it goes far deeper than that. But it is one dimension of your complete design. One Blueprint gives you depth in one area of your life. The full picture comes from seeing all dimensions together. If you're ready to go further, each additional Blueprint adds another layer. And when you're ready for everything — your complete Soul Imprint™ across every dimension, fully integrated — the Ekodz Manual is where it all comes together. You've started something here. Keep going. — Ekodz";

const BP_LANGUAGE_RULES = [
  NON_DIAGNOSTIC_RULE,
  "Word count per section: 150–300 words (Profile ~150 · Intro ~100 · Closing ~80).",
  "Every Blueprint opens with the fixed brand Intro and Profile (Section 1) and closes with Your North Star, then the fixed brand Closing.",
  "Attachment Layer always appears before the closing North Star section.",
];

function blueprintSections(
  bodySections: Array<Omit<ReportSection, "type"> & { type?: SectionType }>,
): ReportSection[] {
  return [
    {
      id: "intro",
      index: "Intro",
      title: "Brand Intro — Soul Imprint™ Blueprint",
      type: "Fixed copy",
      wordCount: "~100",
      prompt: "Fixed brand copy — rendered verbatim, identical across all 4 Blueprints. Not AI-generated.",
      fixedCopy: BP_INTRO,
    },
    ...bodySections.map((s) => ({ type: "AI" as SectionType, ...s })),
    {
      id: "closing",
      index: "Closing",
      title: "Brand Closing",
      type: "Fixed copy",
      wordCount: "~80",
      prompt: "Fixed brand copy — rendered verbatim, identical across all 4 Blueprints. Not AI-generated.",
      fixedCopy: BP_CLOSING,
    },
  ];
}

function makeBlueprint(o: {
  id: string;
  name: string;
  tagline: string;
  perfectFor: string;
  attachment: string;
  frameworkSteps: string[];
  upsellTo: string;
  fields: NumerologyFieldRef[];
  body: Array<Omit<ReportSection, "type"> & { type?: SectionType }>;
  sectionCountLabel: string;
}): Product {
  return {
    id: o.id,
    name: o.name,
    category: "Blueprints",
    tagline: o.tagline,
    priceLaunch: 397,
    currency: "USD",
    pages: "18–24 pages",
    people: 1,
    attachment: o.attachment,
    perfectFor: o.perfectFor,
    formula:
      "All 6 layers at full depth. Layer 6 (Attachment Theory) is exclusive to this tier and the Manual — the primary READS→BLUEPRINTS differentiator. All 34 fields pre-calculated; the AI draws from all fields but weights each Blueprint's primary fields most heavily.",
    frameworkSteps: o.frameworkSteps,
    upsellTo: o.upsellTo,
    delivery: "Automated — secure download link and/or email upon report generation.",
    numerologyFields: o.fields,
    brandIntro: BP_INTRO,
    brandClosing: BP_CLOSING,
    languageRules: BP_LANGUAGE_RULES,
    reportSpec: {
      format: "PDF report",
      pageCount: "18–24 pages",
      sectionCount: o.sectionCountLabel,
      depthWords: "150–300 words per section (Profile ~150)",
      delivery: "Automated — secure download link and/or email.",
    },
    ai: defaultAI({ maxTokens: 8192 }),
    sections: blueprintSections(o.body),
    style: defaultStyleFor("Blueprints", o.name),
  };
}

const BLUEPRINTS: Product[] = [
  makeBlueprint({
    id: "personal-architecture-blueprint",
    name: "Personal Architecture Blueprint™",
    tagline: "Who are you really — and what are you built for?",
    perfectFor: "Self-discovery · Personal growth · Identity clarity · Understanding your complete wiring",
    attachment: "Present in context — referenced within relevant sections.",
    frameworkSteps: ["Step 1 — Decode Your Architecture"],
    upsellTo: "Love & Connection Blueprint, Professional Design Blueprint, or the Ekodz Manual",
    sectionCountLabel: "12 (Intro + 10 + Closing)",
    fields: [
      { field: "Lifepath", why: "Core life path and primary behavioral archetype foundation.", weight: "primary" },
      { field: "Expression", why: "Outward personality, natural talents, communication style.", weight: "primary" },
      { field: "Soul Urge", why: "Inner motivation and deepest drives.", weight: "primary" },
      { field: "First Name Number", why: "Immediate day-to-day personality.", weight: "used" },
      { field: "Balance", why: "Stress response and emotional regulation.", weight: "primary" },
      { field: "Inner Dreams", why: "Hidden desires and suppressed aspirations.", weight: "used" },
      { field: "Mindplane", why: "Cognitive and emotional processing style.", weight: "primary" },
      { field: "Compass", why: "Life and career directional pull.", weight: "used" },
      { field: "Challenge 1 + 2", why: "Primary psychological blocks and growth edges.", weight: "primary" },
      { field: "Current Pinnacle", why: "Life cycle phase — where they are right now.", weight: "used" },
      { field: "Personal Year", why: "Timing — what this specific year is calling for.", weight: "used" },
    ],
    body: [
      { id: "s1", index: "1", title: "Profile", primaryFields: "Lifepath + Expression + Soul Urge", wordCount: "~150", prompt: "Open with a 2-3 sentence overview of who this person is at their core. Draw from Lifepath + Expression + Soul Urge. Set the foundation for everything that follows. Warm, specific, immediately recognizable." },
      { id: "s2", index: "2", title: "Core Identity & Personality", primaryFields: "Expression + First Name + Mindplane + Lifepath", wordCount: "150–300", prompt: "The essential nature and personality type. Draw from Expression + First Name + Mindplane + Lifepath. Apply psychology layer — behavioral tendencies. Apply archetype layer — name dominant archetype with tendency language. 150-300 words." },
      { id: "s3", index: "3", title: "Natural Strengths", primaryFields: "Expression + Inner Dreams + Compass + Lifepath", wordCount: "150–300", prompt: "What this person is genuinely built for. Draw from Expression + Inner Dreams + Compass + Lifepath. Apply Hidden Passion Number if available. What they do naturally well without trying. Frame as genuine strengths not flattery." },
      { id: "s4", index: "4", title: "Shadow & Blind Spots", primaryFields: "Balance + Challenge 1 + Challenge 2 + Mindplane", wordCount: "150–300", prompt: "What they don't see about themselves. Draw from Balance + Challenge 1 + Challenge 2 + Mindplane. Apply psychology layer — self-sabotage mechanisms. Apply archetype shadow. Include focused attachment indicator (Part A only). Warm but honest — frame as growth opportunity not criticism." },
      { id: "s5", index: "5", title: "Decision Style & Mindplane", primaryFields: "Mindplane + Balance + Expression + Rational Thought Number", wordCount: "150–300", prompt: "How they think and decide. Draw from Mindplane + Balance + Expression + Rational Thought Number. Apply psychology layer — cognitive style. Practical and specific — how they actually make decisions under pressure vs when calm." },
      { id: "s6", index: "6", title: "Love Snapshot", primaryFields: "Soul Urge + Balance + Challenge 1", wordCount: "150–300", prompt: "How love shows up in their blueprint — a focused snapshot not a full analysis. Draw from Soul Urge + Balance + Challenge 1. Brief attachment indicator reference (tendency language). Points toward Love & Connection Blueprint for full depth." },
      { id: "s7", index: "7", title: "Professional Snapshot", primaryFields: "Expression + Compass + Destination + Pinnacle 1", wordCount: "150–300", prompt: "Natural work orientation — a focused snapshot. Draw from Expression + Compass + Destination + Pinnacle 1. Points toward Professional Design Blueprint for full depth." },
      { id: "s8", index: "8", title: "Life Theme", primaryFields: "Lifepath + Pinnacle 1 + Pinnacle 2 + Challenge 1 + Personal Year", wordCount: "150–300", prompt: "The overarching pattern of this life. Draw from Lifepath + Pinnacle 1 + Pinnacle 2 + Challenge 1 + Personal Year. Apply life cycle phase layer — where they are right now. The thread that runs through everything." },
      { id: "s9", index: "9", title: "Growth Edge", primaryFields: "Challenge 1 + Challenge 2 + Balance + Inner Dreams", wordCount: "150–300", prompt: "The one thing they are here to master. Draw from Challenge 1 + Challenge 2 + Balance + Inner Dreams. Apply karmic patterns. The most important insight in the report — the growth edge that everything else is pointing toward." },
      { id: "s10", index: "10", title: "Your North Star", primaryFields: "Lifepath + Soul Urge + Current Pinnacle", framework: "Step 1 — Decode Your Architecture", wordCount: "~150", prompt: "Close with warmth and direction. Connect their data to Step 1 (Decode Your Architecture) of the Ekodz Framework™. One powerful paragraph. Invite to next Blueprint or Manual." },
    ],
  }),
  makeBlueprint({
    id: "love-connection-blueprint",
    name: "Love & Connection Blueprint™",
    tagline: "How you love, connect, and what gets in the way.",
    perfectFor: "Relationships · Dating · Marriage · Family · Self-love · Attachment patterns · Conflict resolution",
    attachment: "★ Full depth — Part A (numerology-derived) + Part B (psychological framework) — Section 9.",
    frameworkSteps: ["Step 3 — Realign Your Life"],
    upsellTo: "Compatibility Blueprint™ for two-person depth or the Ekodz Manual",
    sectionCountLabel: "12 (Intro + 10 + Closing)",
    fields: [
      { field: "Soul Urge", why: "Core connection need and relational motivation.", weight: "primary" },
      { field: "Balance", why: "Emotional regulation and stress response in relationship.", weight: "primary" },
      { field: "Expression", why: "How they show up in relationship outwardly.", weight: "used" },
      { field: "Challenge 1 + 2", why: "Primary relational blocks and attachment wounds.", weight: "primary" },
      { field: "Mindplane", why: "How emotional bonds are processed.", weight: "primary" },
      { field: "Inner Dreams", why: "What they secretly desire in relationship.", weight: "used" },
      { field: "Lifepath", why: "The relational life path and lesson.", weight: "primary" },
      { field: "Current Pinnacle", why: "Relational life phase — what this chapter is calling for.", weight: "used" },
      { field: "Maturity Number", why: "Who they are evolving toward in relationship.", weight: "used" },
      { field: "North Node (Soul Urge + Lifepath)", why: "Where the soul is growing toward in love.", weight: "used" },
      { field: "South Node (Balance + Challenge)", why: "Past patterns in relationship — what to evolve away from.", weight: "used" },
    ],
    body: [
      { id: "s1", index: "1", title: "Profile", primaryFields: "Soul Urge + Balance + Lifepath", wordCount: "~150", prompt: "Love and connection overview. Draw from Soul Urge + Balance + Lifepath. Who this person is in relationship at their core — 2-3 sentences. Foundation for everything that follows." },
      { id: "s2", index: "2", title: "Your Attraction Pattern™", primaryFields: "Soul Urge + Challenge 1 + Balance + Mindplane", wordCount: "150–300", prompt: "Who they keep going for and why. Draw from Soul Urge + Challenge 1 + Balance + Mindplane. Apply psychology layer — unconscious attraction drivers. Apply attachment Part A indicators. Why certain types keep showing up. Warm, honest, non-judgmental." },
      { id: "s3", index: "3", title: "Your Ideal Partner Profile™", primaryFields: "Expression + Soul Urge + Lifepath + Inner Dreams", wordCount: "150–300", prompt: "Who they are actually built for. Draw from Expression + Soul Urge + Lifepath + Inner Dreams. Not who they've been choosing — who their blueprint is designed to align with. Specific and grounded in data." },
      { id: "s4", index: "4", title: "Strengths & Drivers", primaryFields: "Soul Urge + Expression + Lifepath", wordCount: "150–300", prompt: "Relational superpowers. Draw from Soul Urge + Expression + Lifepath. What they bring to relationships naturally. How they love when they feel safe. Genuine strengths framed warmly." },
      { id: "s5", index: "5", title: "Growth Edges & Friction", primaryFields: "Challenge 1 + Challenge 2 + Balance", wordCount: "150–300", prompt: "Where they struggle in connection. Draw from Challenge 1 + Challenge 2 + Balance. Apply psychology layer — emotional friction patterns. Honest but compassionate — frame as growth edges not failures." },
      { id: "s6", index: "6", title: "Roadblocks", primaryFields: "Balance + Challenge 1 + Mindplane + Current Pinnacle", wordCount: "150–300", prompt: "What is specifically blocking love and connection right now. Draw from Balance + Challenge 1 + Mindplane + Current Pinnacle. The specific patterns creating friction. Why they keep happening." },
      { id: "s7", index: "7", title: "Alignment Strategy", primaryFields: "Soul Urge + Lifepath + Inner Dreams + Compass", wordCount: "150–300", prompt: "How to attract aligned love. Draw from Soul Urge + Lifepath + Inner Dreams + Compass. Practical and specific — what to do differently. Grounded in their actual blueprint data." },
      { id: "s8", index: "8", title: "Evolution Design", primaryFields: "Pinnacle 1 + Pinnacle 2 + Lifepath + Destination + Maturity Number", wordCount: "150–300", prompt: "Relationship growth path. Draw from Pinnacle 1 + Pinnacle 2 + Lifepath + Destination + Maturity Number. Where their capacity for love is headed as they grow. The arc of their relational evolution." },
      { id: "s9", index: "9", title: "Attachment Layer ★", primaryFields: "Balance + Soul Urge + Challenge 1+2 + Mindplane", wordCount: "150–300", prompt: "FULL DEPTH — PART A + PART B. Part A: derive attachment tendencies from Balance + Soul Urge + Challenge 1+2 + Mindplane. Name the tendency pattern with tendency language. Part B: full psychological framework — behavioral profile, triggers, what activates the attachment response, what they need to feel safe, evolution pathway toward secure attachment. This is the most important section in this Blueprint. Never diagnose. Always tendency language." },
      { id: "s10", index: "10", title: "Your North Star", primaryFields: "Soul Urge + Lifepath + Current Pinnacle", framework: "Step 3 — Realign Your Life / Step 4 — Consciously Evolve", wordCount: "~150", prompt: "The highest potential of this person's love life. Connect to Step 3 (Realign Your Life) or Step 4 (Consciously Evolve) of the Ekodz Framework™. Warm and hopeful. Invite to Compatibility Blueprint or Manual." },
    ],
  }),
  makeBlueprint({
    id: "professional-design-blueprint",
    name: "Professional Design Blueprint™",
    tagline: "Your professional wiring, your career path, and what's blocking your success.",
    perfectFor: "Career clarity · Business strategy · Leadership · Entrepreneurship · Professional reinvention · Money blocks",
    attachment: "Present in context — referenced within relevant sections (Section 8).",
    frameworkSteps: ["Step 3 — Realign Your Life"],
    upsellTo: "Ekodz Manual for the complete integrated picture",
    sectionCountLabel: "12 (Intro + 10 + Closing)",
    fields: [
      { field: "Expression", why: "Natural professional talents and outward work style.", weight: "primary" },
      { field: "Lifepath", why: "Core professional direction and career mission.", weight: "primary" },
      { field: "Compass", why: "Professional directional pull.", weight: "primary" },
      { field: "Destination", why: "Long-term professional destination.", weight: "primary" },
      { field: "Pinnacle 1 + 2", why: "Early and current career chapter themes.", weight: "primary" },
      { field: "Mindplane", why: "Work orientation and cognitive style.", weight: "primary" },
      { field: "Balance", why: "Stress response and conflict handling at work.", weight: "used" },
      { field: "Challenge 1 + 2", why: "Professional blocks and recurring patterns.", weight: "primary" },
      { field: "Inner Dreams", why: "Hidden professional aspirations.", weight: "used" },
      { field: "Hidden Passion Number", why: "Overlooked professional talent.", weight: "primary" },
      { field: "Maturity Number", why: "Who they are evolving into professionally.", weight: "used" },
    ],
    body: [
      { id: "s1", index: "1", title: "Profile", primaryFields: "Expression + Lifepath + Compass", wordCount: "~150", prompt: "Professional architecture overview. Draw from Expression + Lifepath + Compass. Who this person is professionally at their core — 2-3 sentences. Sets the frame for everything that follows." },
      { id: "s2", index: "2", title: "Career Path & Direction", primaryFields: "Lifepath + Compass + Destination + Pinnacle 1", wordCount: "150–300", prompt: "What they are designed for professionally. Draw from Lifepath + Compass + Destination + Pinnacle 1. Apply life cycle phase — is their current work aligned with their natural direction. Specific and directional." },
      { id: "s3", index: "3", title: "Work Orientation", primaryFields: "Expression + Lifepath + Mindplane + Balance", wordCount: "150–300", prompt: "Entrepreneur, employee, collaborative, or leader. Draw from Expression + Lifepath + Mindplane + Balance. Apply psychology layer — how they naturally operate in a work environment. Specific patterns in how they work best." },
      { id: "s4", index: "4", title: "Professional Strengths", primaryFields: "Expression + Inner Dreams + Compass + Lifepath + Hidden Passion Number", wordCount: "150–300", prompt: "What they are built to do and contribute. Draw from Expression + Inner Dreams + Compass + Lifepath + Hidden Passion Number. Genuine professional strengths grounded in data — not flattery." },
      { id: "s5", index: "5", title: "Money & Abundance Patterns", primaryFields: "Lifepath + Expression + Challenge 1 + Balance", wordCount: "150–300", prompt: "Their wealth relationship and money blocks. Draw from Lifepath + Expression + Challenge 1 + Balance. Apply psychology layer — unconscious money patterns. Honest about blocks and empowering about potential." },
      { id: "s6", index: "6", title: "Visibility & Leadership Style", primaryFields: "Expression + Mindplane + Lifepath + First Name Number", wordCount: "150–300", prompt: "Front stage or backstage. Draw from Expression + Mindplane + Lifepath + First Name Number. How they lead. How they show up publicly vs privately. Natural visibility style." },
      { id: "s7", index: "7", title: "Your Professional Legacy™", primaryFields: "Lifepath + Destination + Inner Dreams + Pinnacle 3 + Maturity Number", wordCount: "150–300", prompt: "The impact they are designed to make. Draw from Lifepath + Destination + Inner Dreams + Pinnacle 3 + Maturity Number. The long arc — what their work is ultimately building toward." },
      { id: "s8", index: "8", title: "Professional Roadblocks + Attachment", primaryFields: "Balance + Challenge 1 + Challenge 2 + Soul Urge + Mindplane", wordCount: "150–300", prompt: "Blocks at work and how attachment shows up professionally. Draw from Balance + Challenge 1 + Challenge 2 + Soul Urge + Mindplane. Apply attachment Part A indicators in professional context — how attachment patterns show up in work relationships, leadership, and collaboration. Tendency language throughout." },
      { id: "s9", index: "9", title: "Your Professional Evolution™", primaryFields: "Pinnacle 1 + Pinnacle 2 + Compass + Destination + Personal Year", wordCount: "150–300", prompt: "Alignment strategy and where they are headed. Draw from Pinnacle 1 + Pinnacle 2 + Compass + Destination + Personal Year. The trajectory. What aligns now vs what comes next. Specific and actionable." },
      { id: "s10", index: "10", title: "Your North Star", primaryFields: "Expression + Lifepath + Current Pinnacle", framework: "Step 3 — Realign Your Life", wordCount: "~150", prompt: "Professional North Star connection. Connect to Step 3 (Realign Your Life) of the Ekodz Framework™. Warm closing. Invite to Ekodz Manual for complete picture." },
    ],
  }),
  makeBlueprint({
    id: "soul-conscious-blueprint",
    name: "Soul & Conscious Blueprint™",
    tagline: "Your soul's purpose, your conscious evolution, and what you're truly here for.",
    perfectFor: "Life purpose · Spiritual alignment · Conscious evolution · Meaning · Intuition · Soul direction",
    attachment: "★ Full depth — Part A + Part B — Section 10.",
    frameworkSteps: ["Step 4 — Consciously Evolve"],
    upsellTo: "Ekodz Manual for the complete integrated picture across all four dimensions",
    sectionCountLabel: "13 (Intro + 11 + Closing)",
    fields: [
      { field: "Soul Urge", why: "Primary soul motivation and calling.", weight: "primary" },
      { field: "Lifepath", why: "Soul mission this lifetime.", weight: "primary" },
      { field: "Inner Dreams", why: "Hidden soul calling.", weight: "primary" },
      { field: "North Node (Soul Urge + Lifepath)", why: "Where the soul is evolving toward — confirmed formula.", weight: "primary" },
      { field: "South Node (Balance + Challenge)", why: "Past patterns — what the soul is moving away from.", weight: "primary" },
      { field: "Challenge 1 + 2", why: "Karmic lessons and recurring soul themes.", weight: "primary" },
      { field: "Karmic Debt Numbers", why: "Specific karmic patterns if present (13, 14, 16, 19).", weight: "primary" },
      { field: "Current Pinnacle + Personal Year", why: "Soul journey stage — where they are right now.", weight: "primary" },
      { field: "Mindplane + Soul Urge", why: "Intuition style derivation.", weight: "used" },
      { field: "Balance", why: "Attachment foundation and soul connection capacity.", weight: "primary" },
      { field: "Essence Number", why: "Year-level sub-cycle within current Pinnacle (if calculated).", weight: "used" },
    ],
    body: [
      { id: "s1", index: "1", title: "Profile", primaryFields: "Soul Urge + Lifepath + Inner Dreams", wordCount: "~150", prompt: "Soul overview — where this person is right now. Draw from Soul Urge + Lifepath + Inner Dreams. Who they are at soul level — 2-3 sentences. Sets the spiritual frame for everything that follows." },
      { id: "s2", index: "2", title: "Soul's Purpose", primaryFields: "Soul Urge (primary) + Lifepath (mission) + Inner Dreams (hidden calling)", wordCount: "150–300", prompt: "What they came here to do. Draw from Soul Urge (primary) + Lifepath (mission) + Inner Dreams (hidden calling) combined. The soul's direction this lifetime. Specific and meaningful — not vague spirituality." },
      { id: "s3", index: "3", title: "South Node & Soul Patterns", primaryFields: "Balance + Challenge pattern (South Node equivalent)", wordCount: "150–300", prompt: "Where they're coming from — past patterns the soul is moving away from. Derived from Balance + Challenge pattern (South Node equivalent). Comfort zone. What the soul keeps defaulting back to. Compassionate framing — not a judgment, a pattern to become conscious of." },
      { id: "s4", index: "4", title: "North Node & Soul Direction", primaryFields: "Soul Urge + Lifepath (North Node equivalent — confirmed formula)", wordCount: "150–300", prompt: "Where the soul is striving toward this lifetime. Derived from Soul Urge + Lifepath (North Node equivalent — confirmed formula). The soul's evolutionary direction. What growth looks like for this specific person. The tension between South Node comfort and North Node growth." },
      { id: "s5", index: "5", title: "Soul Journey Stage", primaryFields: "Pinnacle 1-4 + Current Pinnacle + Personal Year + Essence Number", wordCount: "150–300", prompt: "Age-based soul timeline — this phase vs next. Draw from Pinnacle 1-4 + Current Pinnacle + Personal Year + Essence Number (if available). Where they are in their soul's journey right now. What this specific phase is asking of them." },
      { id: "s6", index: "6", title: "Soul Gifts", primaryFields: "Soul Urge + Expression + Inner Dreams + First Name Number + Hidden Passion Number", wordCount: "150–300", prompt: "What they brought into this life. Draw from Soul Urge + Expression + Inner Dreams + First Name Number + Hidden Passion Number. Natural spiritual and personal gifts — what the soul arrived equipped with." },
      { id: "s7", index: "7", title: "Karmic Patterns", primaryFields: "Challenge 1 + Challenge 2 + Karmic Debt Numbers", wordCount: "150–300", prompt: "Repeating themes the soul keeps encountering. Draw from Challenge 1 + Challenge 2 + Karmic Debt Numbers (if present). The recurring lessons. Why certain patterns keep appearing. Not punishment — soul curriculum." },
      { id: "s8", index: "8", title: "Spiritual Alignment", primaryFields: "Lifepath + Current Pinnacle + Personal Year + Soul Urge", wordCount: "150–300", prompt: "Are they on or off their soul path. Spiritual alignment check: Current Pinnacle aligned with Lifepath = on track · misaligned = friction signal. Draw from Lifepath + Current Pinnacle + Personal Year + Soul Urge. Honest about misalignment — empowering about correction." },
      { id: "s9", index: "9", title: "Intuition Style", primaryFields: "Mindplane (primary) + Soul Urge", wordCount: "150–300", prompt: "How their soul communicates with them. Derived from Mindplane (primary) + Soul Urge. The 4 intuition styles: direct spiritual (intuitive Mindplane + high Soul Urge) · feeling-based (emotional Mindplane) · analytical (mental Mindplane) · body-based (physical Mindplane). Specific and practical about how to work with their natural intuitive channel." },
      { id: "s10", index: "10", title: "Attachment Layer ★", primaryFields: "Balance + Soul Urge + Challenge + Mindplane", wordCount: "150–300", prompt: "FULL DEPTH — PART A + PART B — in the context of soul evolution and spiritual connection. Part A: numerology-derived attachment indicators (Balance + Soul Urge + Challenge + Mindplane) — how attachment patterns affect spiritual growth and conscious evolution. Part B: psychological framework in spiritual context — how attachment shows up in the soul journey, what it is here to teach, evolution pathway toward secure and conscious connection. Never diagnose. Always tendency language." },
      { id: "s11", index: "11", title: "Your North Star", primaryFields: "Soul Urge + Lifepath + Current Pinnacle", framework: "Step 4 — Consciously Evolve", wordCount: "~150", prompt: "Closing section — Conscious Evolution Path. Connect to Step 4 (Consciously Evolve) of the Ekodz Framework™. The warmest, most hopeful closing of all 4 Blueprints. Leave the client feeling seen at soul level and equipped for their evolution. Invite to Ekodz Manual for complete integrated picture." },
    ],
  }),
];

/* -------------------------------------------------------------------------- */
/*  COMPATIBILITY BLUEPRINT (spec §3)                                         */
/* -------------------------------------------------------------------------- */

const COMPAT_INTRO =
  "[First Name] & [Partner Name], what you're holding is your shared Soul Imprint™. Whether you've just met or have been together for years — understanding how two people are designed, what makes them tick, and how they naturally complement each other is one of the most powerful things you can do for a relationship. This Blueprint shows you exactly that. How you're each wired. Where you naturally align. And a clear picture of how to bring out the best in each other — and in this relationship. This is your roadmap to living your best relationship. Read it together.";

const COMPAT_CLOSING =
  "You now have something genuinely rare — a complete picture of how you're each designed, how your designs work together, and a clear path for making the most of this relationship. Every relationship has its own dynamic. This Blueprint helps you understand yours — and gives you the tools to live it at its best. — Ekodz";

const COMPATIBILITY_BLUEPRINT: Product = {
  id: "compatibility-blueprint",
  name: "Compatibility Blueprint™",
  category: "Compatibility Blueprints",
  tagline: "The only Ekodz product covering two people simultaneously.",
  priceLaunch: 497,
  priceFuture: 597,
  currency: "USD",
  pages: "20–28 pages",
  people: 2,
  attachment: "★ Full depth for BOTH — Part A independently per person; Part B: the attachment dance, mutual triggers, safety needs, evolution pathway.",
  perfectFor: "Couples · dating · marriage · any two-person relationship. Repeat purchase: new partner = new report.",
  formula:
    "Requires TWO sets of calculated fields — all 34 fields calculated independently for Person A and Person B; both field sets injected into the AI prompt simultaneously. Missing birth time handled independently per person. All 6 layers applied to BOTH people and their interaction.",
  frameworkSteps: ["Both people's Ekodz Framework™ steps connected in North Star Together"],
  upsellFrom: "Compatibility Read™ ($79) — same topic, vastly greater depth",
  upsellTo: "Both individual Personal Architecture Blueprints ($397 each)",
  delivery: "Automated — secure download link and/or email upon report generation.",
  numerologyFields: [
    { field: "Lifepath (both)", why: "Profile A/B · Compatibility Map™ · North Star Together — core path alignment.", weight: "primary" },
    { field: "Expression (both)", why: "Profile · Communication · Compatibility Map™ · Archetypes Together.", weight: "primary" },
    { field: "Soul Urge (both)", why: "Profile · Love Language · Compatibility Map™ · Soul Path.", weight: "primary" },
    { field: "Balance (both)", why: "Communication · Attachment · Love Language · Roadblocks.", weight: "primary" },
    { field: "Mindplane (both)", why: "Communication · Attachment · Archetypes Together · Roadblocks.", weight: "primary" },
    { field: "Challenge 1 + 2 (both)", why: "Attachment · Roadblocks · Friction Points.", weight: "primary" },
    { field: "Current Pinnacle (both)", why: "Soul Path + Timing · Compatibility Map™ · Timing compatibility.", weight: "used" },
    { field: "Soul Urge + Destination (both)", why: "Soul Path Alignment.", weight: "used" },
    { field: "North Node (SU + LP) (both)", why: "Soul Path Alignment.", weight: "used" },
    { field: "Personal Year (both)", why: "Timing compatibility.", weight: "used" },
    { field: "Archetype (LP+Exp+SU+MP) (both)", why: "Archetypes Together · power dynamics.", weight: "used" },
    { field: "All 34 fields (both)", why: "Synthesized in the Relationship Roadmap™.", weight: "context" },
  ],
  brandIntro: COMPAT_INTRO,
  brandClosing: COMPAT_CLOSING,
  languageRules: [
    NON_DIAGNOSTIC_RULE,
    'NEVER say "You are incompatible" / "This relationship won\'t work" / "You should leave this relationship."',
    'NEVER diagnose attachment styles — never say "Person A is Anxious" or "Person B is Avoidant."',
    'ALWAYS tendency language: "Based on combined blueprint data, there may be a tendency toward..."',
    "ALWAYS acknowledge both the challenge AND the path through it in every section.",
    "The Relationship Roadmap™ ALWAYS ends with actionable possibility — never a verdict on the relationship.",
    'Every insight — however difficult — framed as "here is what this means and here is how to work with it."',
  ],
  reportSpec: {
    format: "PDF report",
    pageCount: "20–28 pages",
    sectionCount: "13 (Intro + 11 + Closing)",
    depthWords: "150–350 words per section (Attachment & Roadmap 200–350)",
    delivery: "Automated — secure download link and/or email. Two full intake sets required (Person A + Person B).",
  },
  ai: defaultAI({ maxTokens: 8192 }),
  sections: [
    { id: "intro", index: "Intro", title: "Brand Intro — Shared Soul Imprint™", type: "Fixed copy", wordCount: "~100", prompt: "Fixed brand copy — rendered verbatim. Not AI-generated.", fixedCopy: COMPAT_INTRO },
    { id: "profile-a", index: "1", title: "Profile A", type: "AI", primaryFields: "A: Lifepath · Expression · Soul Urge · Attachment tendency", wordCount: "~150", prompt: "Person A's core architecture in 2-3 sentences. Draw from A's Lifepath + Expression + Soul Urge. Include a brief attachment tendency note using tendency language. Sets the foundation for understanding Person A. Warm and specific — not generic." },
    { id: "profile-b", index: "2", title: "Profile B", type: "AI", primaryFields: "B: Lifepath · Expression · Soul Urge · Attachment tendency", wordCount: "~150", prompt: "Person B's core architecture in 2-3 sentences. Same structure as Profile A using B's fields. Sets the foundation for understanding Person B." },
    { id: "compat-map", index: "3", title: "Compatibility Map™", type: "AI", primaryFields: "Both Lifepaths · Expressions · Soul Urges · current Pinnacles", wordCount: "150–300", prompt: "Big picture of this pairing. Lead with strengths — what makes this pairing naturally powerful. Where they align at the core. Draw from both Lifepaths + Expressions + Soul Urges + current Pinnacles. Frame: \"Based on their combined data, this pairing has a natural tendency toward...\" End with what makes this pairing worth understanding and investing in." },
    { id: "communication", index: "4", title: "Communication Style & Conflict Resolution", type: "AI", primaryFields: "Both Mindplanes · Expressions · Balance numbers", wordCount: "150–300", prompt: "How each person communicates — draw from both Mindplanes + Expressions + Balance numbers. Where they naturally misread each other. What each person needs to feel heard. How each handles conflict. What each needs to feel safe during disagreement. Specific and practical — actionable not abstract." },
    { id: "love-language", index: "5", title: "Love Language Compatibility™", type: "AI", primaryFields: "Both Soul Urges · Expressions · Balance numbers", wordCount: "150–300", prompt: "How Person A gives and receives love — Soul Urge + Expression + Balance. How Person B gives and receives love — same fields. Where they speak different love languages and why. How to bridge the gap. Frame: \"Based on their combined data, Person A may tend to...\" Always tendency language." },
    { id: "archetypes-together", index: "6", title: "Archetypes Together", type: "AI", primaryFields: "Both: Lifepath + Expression + Soul Urge + Mindplane", wordCount: "150–300", prompt: "Derive both archetypes from Lifepath + Expression + Soul Urge + Mindplane for each person. How these two archetypes interact — complementary or conflicting dynamics. Power dynamics. What each archetype needs from the other. Where they naturally support each other vs. where friction arises." },
    { id: "roadblocks", index: "7", title: "Roadblocks & Friction Points", type: "AI", primaryFields: "Both Challenge 1+2 · Balance numbers · Mindplane", wordCount: "150–300", prompt: "Specific patterns creating recurring conflict between these two people. Draw from both Challenge 1+2 + Balance numbers + Mindplane. Why these patterns keep happening. What triggers them. Frame: \"Their combined data suggests friction patterns consistent with...\" Acknowledge the challenge AND the path through it in every point." },
    { id: "attachment-together", index: "8", title: "Attachment Styles Together ★", type: "AI", primaryFields: "Both: Balance + Soul Urge + Challenge + Mindplane", wordCount: "200–350", prompt: "MOST IMPORTANT SECTION. PART A: Derive attachment tendencies for each person independently from Balance + Soul Urge + Challenge + Mindplane. State each person's tendency pattern using tendency language only. PART B: Map how their attachment styles interact. The attachment dance — how they trigger each other. What each person's style needs from the other. What activates the attachment response for each. EVOLUTION: How both can move toward more secure relating together — specific and actionable. NEVER diagnose. Never say \"Person A is Anxious.\" Always: \"Based on Person A's blueprint data, there may be a tendency toward patterns consistent with...\"" },
    { id: "soul-path", index: "9", title: "Soul Path Alignment + Timing", type: "AI", primaryFields: "Both Soul Urges · Destinations · Current Pinnacles", wordCount: "150–300", prompt: "Soul alignment: both Soul Urges + Destinations — are they heading in compatible soul directions? What this relationship is here to teach both people spiritually. Timing: both current Pinnacles — are they in aligned life phases right now? What timing alignment means for this relationship. What timing friction means and how to work with it." },
    { id: "relationship-roadmap", index: "10", title: "The Relationship Roadmap™", type: "AI", primaryFields: "All fields synthesized", wordCount: "200–350", prompt: "THE MOST IMPORTANT SECTION. Synthesize all data into a specific, actionable guide. What Person A specifically needs to do to show up better in this relationship — 3-5 concrete, data-grounded actions. What Person B specifically needs to do — 3-5 concrete, data-grounded actions. How they can work WITH their natural patterns instead of against each other. End with: even if this pairing has challenges — here is exactly how to navigate them and bring out the best in this relationship. Always ends with actionable possibility — never a verdict." },
    { id: "north-star-together", index: "11", title: "Your North Star Together", type: "AI", primaryFields: "Both Lifepaths · Soul Urges · Current Pinnacles", wordCount: "~150", framework: "Both people's Framework steps connected", prompt: "The highest potential of this relationship — what it could become at its best. Connect both people's Ekodz Framework™ steps. What conscious evolution looks like for this pairing. Close with the warmest, most hopeful closing of all Ekodz products. Leave both people feeling seen, understood, and equipped. Invite both to their individual Blueprints for deeper personal understanding." },
    { id: "closing", index: "Closing", title: "Brand Closing — roadmap + best relationship", type: "Fixed copy", wordCount: "~80", prompt: "Fixed brand copy — rendered verbatim. Not AI-generated.", fixedCopy: COMPAT_CLOSING },
  ],
  style: defaultStyleFor("Compatibility Blueprints", "Compatibility Blueprint™"),
};

/* -------------------------------------------------------------------------- */
/*  EKODZ MANUAL — flagship (spec §4)                                         */
/* -------------------------------------------------------------------------- */

const MANUAL_INTRO =
  "[First Name], what you're holding is your complete Soul Imprint™. Not a snapshot. Not one dimension. Everything. This is the most comprehensive personal blueprint available — built for the person who is ready to see the full picture of who they are, how they're wired, and what they're designed for. All at once. Nothing held back. Take your time with it. This was built to last.";

const MANUAL_CLOSING =
  "You've just read your complete Soul Imprint™. Everything you need to understand yourself — your design, your patterns, your purpose, your relationships, your path forward — is now in your hands. Most people spend a lifetime searching for this kind of clarity. You now have it. — Ekodz";

/** Helper for a Manual part built on a Blueprint base with manual-specific notes. */
function manualPart(prefix: string, partTitle: string, rows: Array<{ i: string; title: string; fields: string; note: string; framework?: string }>): ReportSection[] {
  return rows.map((r) => ({
    id: `${prefix}-${r.i}`,
    index: `${prefix}${r.i}`,
    title: `${partTitle} · ${r.title}`,
    type: "AI" as SectionType,
    primaryFields: r.fields,
    wordCount: "200–400",
    framework: r.framework,
    prompt: `[Manual — ${partTitle}] ${r.note} Uses the base Blueprint instructions for this section at greater depth (200–400 words), with explicit cross-references between pillars.`,
  }));
}

const MANUAL: Product = {
  id: "ekodz-manual",
  name: "Ekodz Manual™",
  category: "Manuals",
  tagline: "The flagship — the complete picture. All 4 Blueprint pillars + exclusive Integration Chapter™.",
  priceLaunch: 997,
  priceFuture: 2500,
  currency: "USD",
  pages: "55–85 pages",
  people: 1,
  attachment: "★ Full cross-pillar — complete attachment profile Part A + B at maximum depth, connected across love/professional/soul dimensions.",
  perfectFor: "The person ready to see the full picture — complete Soul Imprint™ across every dimension, fully integrated.",
  formula:
    "6-Layer application at MAXIMUM depth. All 34 fields at maximum depth, every field fully interpreted. Not 4 Blueprints stapled together — one cohesive, integrated document building sequentially across all 4 dimensions, culminating in the exclusive Integration Chapter™.",
  frameworkSteps: ["All 4 steps mapped across the complete data (Integration Chapter™ I5)"],
  upsellFrom: "Any single Blueprint ($397) or combination ($794+)",
  upsellTo: "Flagship — top of the ladder.",
  delivery: "Automated — secure download link and/or email. Single full intake.",
  numerologyFields: [
    { field: "All 34 fields", why: "Every field fully interpreted at maximum depth — fields that appear briefly in Blueprints get full treatment.", weight: "primary" },
    { field: "All 4 Pinnacles + Personal Year + Personal Month", why: "Complete life arc mapped (Life Cycle layer at maximum depth).", weight: "primary" },
    { field: "Essence Number", why: "Year-by-year sub-cycle within current Pinnacle (if calculated).", weight: "used" },
    { field: "North / South Node + Karmic Debt", why: "Full spiritual layer integrated across all 4 pillars.", weight: "primary" },
    { field: "Attachment Layer (Part A + B)", why: "Complete profile at maximum depth, connected across love/professional/soul dimensions.", weight: "primary" },
    { field: "Maturity Number", why: "Who they grow into — anchors the Integration Chapter's Next Chapter.", weight: "used" },
  ],
  brandIntro: MANUAL_INTRO,
  brandClosing: MANUAL_CLOSING,
  languageRules: [
    NON_DIAGNOSTIC_RULE,
    "Section depth: 200–400 words per section (vs 150–300 in Blueprints), with explicit cross-references between pillars.",
    "Non-diagnostic language rule applies throughout — all 6 layers, all 4 parts, and the Integration Chapter. Attachment references: always tendency language; never diagnose attachment style at any point.",
  ],
  reportSpec: {
    format: "PDF report",
    pageCount: "55–85 pages",
    sectionCount: "55 total (5 opening + 41 report + 7 Integration + brand intro/closing)",
    depthWords: "200–400 words per section with cross-pillar references",
    delivery: "Automated — secure download link and/or email.",
  },
  ai: defaultAI({ maxTokens: 16384 }),
  sections: [
    { id: "intro", index: "Intro", title: "Brand Intro — Soul Imprint™ opening", type: "Fixed copy", wordCount: "½ pg", prompt: "Fixed brand copy — rendered verbatim. Not AI-generated.", fixedCopy: MANUAL_INTRO },
    // Opening — 5 sections
    { id: "o1", index: "O1", title: "Welcome to Your Ekodz Manual™", type: "AI", wordCount: "2–3 sentences", prompt: "Personal welcome using client's first name. Acknowledge the significance of this document — the most complete picture of who they are. Warm, specific to their name and data. Set the tone for everything that follows. 2-3 sentences." },
    { id: "o2", index: "O2", title: "What This Manual Is", type: "AI", wordCount: "1–2 paragraphs", prompt: "Plain-language explanation of what the Manual contains and how to use it. How to read it — in sequence or by section. How to return to it over time as life evolves. Not dry instructions — warm and inviting." },
    { id: "o3", index: "O3", title: "Your Personal Data Overview", type: "AI", primaryFields: "All 34 calculated fields", wordCount: "1 page", prompt: "Present all 34 calculated fields in a clean, organized summary. Group by category: Identity · Name · Time · Location · Calendar · Life Cycles · Challenges · New Fields. Show field name and calculated value. This is the client's complete numerical blueprint laid out clearly before the analysis begins." },
    { id: "o4", index: "O4", title: "How the 6 Layers Work", type: "AI", wordCount: "1–2 paragraphs", prompt: "Brief plain-language explanation of the 6 analysis layers — what each one adds and why the combination is unique. Do not name the methodology formula explicitly. Convey that this is a first-of-its-kind approach that covers every dimension of who a person is." },
    { id: "o5", index: "O5", title: "How Your 4 Pillars Connect", type: "AI", wordCount: "1–2 paragraphs", prompt: "Overview of the 4 parts — Personal Architecture, Love & Connection, Professional Design, Soul & Conscious. Why they are presented in this sequence. How each pillar informs and connects to the others. Prepares the client for the depth ahead." },
    // Part 1 — Personal Architecture (10)
    ...manualPart("P1", "Part 1 · Personal Architecture™", [
      { i: "1", title: "Profile", fields: "Lifepath · Expression · Soul Urge", note: "Same as Blueprint but sets up the full Manual arc — explicitly notes how this profile connects to what will be explored in Parts 2, 3, and 4.", framework: "" },
      { i: "2", title: "Core Identity & Personality", fields: "Expression · First Name · Mindplane · Lifepath", note: "Full depth — include secondary personality tendencies, not just dominant. Note how this identity shows up differently across love, career, and soul contexts." },
      { i: "3", title: "Natural Strengths", fields: "Expression · Inner Dreams · Compass · Hidden Passion", note: "Include Hidden Passion Number at full depth — the overlooked talent that runs through everything. Connect strengths to all 4 pillars." },
      { i: "4", title: "Shadow & Blind Spots", fields: "Balance · Challenge 1+2 · Mindplane", note: "Full depth including Karmic Debt Numbers if present. Include both primary shadow AND how shadow shows up differently in relationship vs. professional contexts." },
      { i: "5", title: "Decision Style & Mindplane", fields: "Mindplane · Balance · Rational Thought", note: "Include Rational Thought Number at full depth. Cornerstone and Capstone — how they start and finish things. Full cognitive and emotional processing profile." },
      { i: "6", title: "Love Snapshot", fields: "Soul Urge · Balance · Challenge 1", note: "Snapshot — points to Part 2 for full depth. Note the attachment tendency briefly." },
      { i: "7", title: "Professional Snapshot", fields: "Expression · Compass · Destination · Pinnacle 1", note: "Snapshot — points to Part 3 for full depth." },
      { i: "8", title: "Life Theme", fields: "Lifepath · Pinnacle 1+2 · Challenge 1 · Personal Year", note: "Full life arc — all 4 Pinnacles mapped. Personal Year and Personal Month applied. Essence Number if calculated." },
      { i: "9", title: "Growth Edge", fields: "Challenge 1+2 · Balance · Inner Dreams · Karmic Debt", note: "Full depth including Karmic Debt Numbers at maximum depth. The single most important growth insight across the entire Manual." },
      { i: "10", title: "Your North Star", fields: "Lifepath · Soul Urge · Current Pinnacle", note: "Connect to Step 1 (Decode Your Architecture) of the Ekodz Framework™. Bridge to Part 2 — invite the client forward.", framework: "Step 1 — Decode Your Architecture" },
    ]),
    // Part 2 — Love & Connection (10)
    ...manualPart("P2", "Part 2 · Love & Connection™", [
      { i: "1", title: "Profile", fields: "Soul Urge · Balance · Lifepath", note: "Opens Part 2 with the love/connection lens. Brief reference to how Part 1 identity connects to this relational profile." },
      { i: "2", title: "Your Attraction Pattern™", fields: "Soul Urge · Challenge 1 · Balance · Mindplane", note: "Full depth — include why the pattern formed, not just what it is. Connect to shadow from Part 1." },
      { i: "3", title: "Your Ideal Partner Profile™", fields: "Expression · Soul Urge · Lifepath · Inner Dreams", note: "Full depth — specific and grounded in data. The person they're designed to align with at blueprint level." },
      { i: "4", title: "Strengths & Drivers", fields: "Soul Urge · Expression · Lifepath", note: "Full relational strengths. Connect to natural strengths from Part 1." },
      { i: "5", title: "Growth Edges & Friction", fields: "Challenge 1+2 · Balance", note: "Full depth. Connect to shadow and growth edge from Part 1 — show how same patterns appear in relationship." },
      { i: "6", title: "Roadblocks", fields: "Balance · Challenge 1 · Mindplane · Current Pinnacle", note: "Specific current blocks. Include timing — is the current Pinnacle creating relational friction?" },
      { i: "7", title: "Alignment Strategy", fields: "Soul Urge · Lifepath · Inner Dreams · Compass", note: "Practical and specific — what to do differently grounded in their data." },
      { i: "8", title: "Evolution Design", fields: "Pinnacle 1+2 · Lifepath · Destination · Maturity Number", note: "Full relational evolution arc including Maturity Number — who they're becoming in relationship." },
      { i: "9", title: "Attachment Layer ★", fields: "Balance · Soul Urge · Challenge · Mindplane", note: "FULL DEPTH — Part A + Part B. Maximum depth for the Manual. Evolution pathway fully mapped. Never diagnose." },
      { i: "10", title: "Your North Star", fields: "Soul Urge · Lifepath · Current Pinnacle", note: "Connect to Step 3 or Step 4 of Ekodz Framework™. Bridge to Part 3.", framework: "Step 3 / Step 4" },
    ]),
    // Part 3 — Professional Design (10)
    ...manualPart("P3", "Part 3 · Professional Design™", [
      { i: "1", title: "Profile", fields: "Expression · Lifepath · Compass", note: "Opens Part 3. Brief reference to how identity (Part 1) informs professional design." },
      { i: "2", title: "Career Path & Direction", fields: "Lifepath · Compass · Destination · Pinnacle 1", note: "Full depth. Connect to life theme from Part 1 — how career fits into the broader life arc." },
      { i: "3", title: "Work Orientation", fields: "Expression · Lifepath · Mindplane · Balance", note: "Full cognitive and work style profile. Cross-reference Mindplane from Part 1 decision style." },
      { i: "4", title: "Professional Strengths", fields: "Expression · Inner Dreams · Compass · Hidden Passion", note: "Full depth including Hidden Passion Number. Connect to natural strengths from Part 1." },
      { i: "5", title: "Money & Abundance Patterns", fields: "Lifepath · Expression · Challenge 1 · Balance", note: "Full depth including money blocks. Cross-reference shadow from Part 1." },
      { i: "6", title: "Visibility & Leadership Style", fields: "Expression · Mindplane · Lifepath · First Name", note: "Full depth. Note how attachment patterns (Part 2) show up in professional visibility." },
      { i: "7", title: "Your Professional Legacy™", fields: "Lifepath · Destination · Inner Dreams · Pinnacle 3 · Maturity", note: "Full long-arc legacy view. Connect soul purpose (previewed for Part 4) to professional legacy." },
      { i: "8", title: "Professional Roadblocks + Attachment", fields: "Balance · Challenge · Soul Urge · Mindplane", note: "Full depth. Show explicitly how attachment patterns from Part 2 manifest in professional context." },
      { i: "9", title: "Your Professional Evolution™", fields: "Pinnacle 1+2 · Compass · Destination · Personal Year", note: "Full evolution arc. Timing — what this specific year is calling for professionally." },
      { i: "10", title: "Your North Star", fields: "Expression · Lifepath · Current Pinnacle", note: "Connect to Step 3 (Realign Your Life). Bridge to Part 4.", framework: "Step 3 — Realign Your Life" },
    ]),
    // Part 4 — Soul & Conscious (11)
    ...manualPart("P4", "Part 4 · Soul & Conscious™", [
      { i: "1", title: "Profile", fields: "Soul Urge · Lifepath · Inner Dreams", note: "Opens Part 4. Brief synthesis of how all 3 previous parts have been building toward this soul-level view." },
      { i: "2", title: "Soul's Purpose", fields: "Soul Urge + Lifepath + Inner Dreams combined", note: "Full depth — the soul's mission this lifetime. Most expansive treatment of soul purpose in the entire Manual." },
      { i: "3", title: "South Node & Soul Patterns", fields: "Balance + Challenge pattern", note: "Full depth. Cross-reference shadow patterns from Part 1 — show how same patterns appear at soul level." },
      { i: "4", title: "North Node & Soul Direction", fields: "Soul Urge + Lifepath (confirmed formula)", note: "Full depth. The tension between South Node comfort and North Node growth. Most important spiritual insight." },
      { i: "5", title: "Soul Journey Stage", fields: "Current Pinnacle · Personal Year · Essence Number", note: "Full depth including Essence Number if calculated. The most granular timing view in the entire Manual." },
      { i: "6", title: "Soul Gifts", fields: "Soul Urge · Expression · Inner Dreams · Hidden Passion", note: "Full depth. Connect to natural strengths (Part 1) and professional strengths (Part 3) — show how soul gifts run through all dimensions." },
      { i: "7", title: "Karmic Patterns", fields: "Challenge 1+2 · Karmic Debt Numbers", note: "Full depth including Karmic Debt Numbers at maximum depth. Cross-reference growth edge from Part 1." },
      { i: "8", title: "Spiritual Alignment", fields: "Lifepath + Current Pinnacle alignment check · Personal Year", note: "Full depth. Honest about misalignment — empowering about correction. Cross-reference life theme from Part 1." },
      { i: "9", title: "Intuition Style", fields: "Mindplane + Soul Urge", note: "Full depth. Cross-reference decision style from Part 1 — show how intuition and logical decision-making relate." },
      { i: "10", title: "Attachment Layer ★", fields: "Balance · Soul Urge · Challenge · Mindplane", note: "FULL DEPTH — in soul evolution context. How attachment patterns affect spiritual growth. Cross-reference attachment from Part 2. Evolution pathway in spiritual context." },
      { i: "11", title: "Your North Star", fields: "Soul Urge · Lifepath · Inner Dreams · Current Pinnacle", note: "Connect to Step 4 (Consciously Evolve). Warmest, most complete North Star closing in the entire Manual. Bridge to the Integration Chapter™.", framework: "Step 4 — Consciously Evolve" },
    ]),
    // Integration Chapter — 7 exclusive sections
    { id: "i1", index: "I1", title: "Integration ★ · Your Pillar Connections", type: "AI", primaryFields: "All 4 pillars", wordCount: "200–400", prompt: "Show specifically how the 4 pillars reinforce and sometimes tension each other. How does this person's identity (Part 1) shape their love patterns (Part 2)? How does their soul purpose (Part 4) align or conflict with their professional direction (Part 3)? Specific cross-pillar connections grounded in their data." },
    { id: "i2", index: "I2", title: "Integration ★ · Your Pattern Map™", type: "AI", primaryFields: "Themes across all 4 pillars", wordCount: "200–400", prompt: "Identify 3-5 dominant patterns that appear across multiple pillars. The same pattern shows up in identity, relationships, career, and soul simultaneously — name it, show where it appears in each pillar, explain what it means that it shows up everywhere. This is the most diagnostic section in the entire Manual — the meta-pattern of this person's life." },
    { id: "i3", index: "I3", title: "Integration ★ · Your Conflict Points™", type: "AI", primaryFields: "Pillar tensions", wordCount: "200–400", prompt: "Identify where this person's pillars pull in different directions. For example: soul purpose pointing toward creativity but professional design wired for structure — that tension is a Conflict Point. Name each conflict point, explain why it exists in their data, and how to navigate it consciously. Frame as growth opportunity not as a flaw." },
    { id: "i4", index: "I4", title: "Integration ★ · Your Alignment Zones™", type: "AI", primaryFields: "Pillar harmonies", wordCount: "200–400", prompt: "Identify where this person's pillars reinforce each other. Where their identity, love patterns, professional design, and soul direction all point in the same direction — those are Alignment Zones. Name each zone, explain why it flows naturally in their data. These are where the person can invest energy with highest return." },
    { id: "i5", index: "I5", title: "Integration ★ · Your Complete Ekodz Framework™ Roadmap", type: "AI", primaryFields: "All 4 Framework steps across the complete data", wordCount: "200–400", framework: "All 4 Steps", prompt: "Map this specific person's data to all 4 steps of the Ekodz Framework™. Step 1 (Decode Your Architecture) — what decoding means for this specific person. Step 2 (Clear the Roadblocks) — their specific roadblocks identified. Step 3 (Realign Your Life) — specific realignment actions for this person. Step 4 (Consciously Evolve) — the evolution path specific to this person's design. Personalized, not generic." },
    { id: "i6", index: "I6", title: "Integration ★ · Your 90-Day Action Plan", type: "AI", primaryFields: "Current Pinnacle · Personal Year · dominant patterns · conflict points · alignment zones", wordCount: "200–400", prompt: "Based on everything in this Manual — their current Pinnacle, Personal Year, dominant patterns, conflict points, and alignment zones — identify the 3 most impactful actions this specific person can take in the next 90 days. Prioritize by impact. Each action must be specific, grounded in their data, and immediately actionable." },
    { id: "i7", index: "I7", title: "Integration ★ · Your Next Chapter", type: "AI", primaryFields: "Maturity Number · North Node · upcoming Pinnacle", wordCount: "200–400", prompt: "The closing section of the Integration Chapter. Synthesize everything — who this person is, where they're going, what they're becoming. Connect to the Maturity Number — who they grow into. The North Node direction. The Pinnacle they're moving toward. Leave the client with a complete, hopeful, empowering picture of their own evolution. The warmest, most powerful closing in the entire Ekodz product line." },
    { id: "closing", index: "Closing", title: "Brand Closing — complete Soul Imprint™", type: "Fixed copy", wordCount: "½ pg", prompt: "Fixed brand copy — rendered verbatim. Not AI-generated.", fixedCopy: MANUAL_CLOSING },
  ],
  style: defaultStyleFor("Manuals", "Ekodz Manual™"),
};

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

export const PRODUCTS: Product[] = [
  ...READS,
  ...BLUEPRINTS,
  COMPATIBILITY_BLUEPRINT,
  MANUAL,
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function productsByCategory(): { category: ProductCategory; products: Product[] }[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    products: PRODUCTS.filter((p) => p.category === category),
  }));
}

export const AI_MODELS = [
  "claude-opus-4-8",
  "claude-sonnet-5",
  "claude-fable-5",
  "claude-haiku-4-5-20251001",
];

export function formatPrice(p: Product): string {
  const base = `$${p.priceLaunch.toLocaleString()}`;
  if (p.priceFuture && p.priceFuture !== p.priceLaunch) {
    return `${base} → $${p.priceFuture.toLocaleString()}`;
  }
  return base;
}
