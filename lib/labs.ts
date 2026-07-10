/* ============================================================================
   Ekodz — Labs prompt workbench engine

   Two responsibilities, both useful for refining the per-section prompt logic:

   1) resolvePrompt() — assembles the EXACT prompt that would be sent to the
      model: the product's global system prompt + product/section context +
      the client's injected calculated field values + the section instruction.
      This is 100% real and is the core prompt-engineering artifact.

   2) generateSection() — a directive-aware SIMULATED draft. There is no live
      model wired yet (the app uses deterministic stand-ins), so this reads the
      section's prompt for directives ("no analysis / display", "3–5 patterns",
      "guidance", "2–3 sentences", "attachment", …) and the client's real
      numbers, then produces a plausible draft. Editing a prompt visibly
      changes the output — which is the point of the Lab.

   Swapping in a real LLM later is a drop-in: send resolvePrompt() output to the
   Messages API and replace generateSection()'s body with the response.
   ========================================================================== */

import { calculateAll, type ComputedField, type FieldValue, type RawInputs } from "./engine";
import type { Product, ReportSection } from "./products";

/* -------------------------------------------------------------------------- */
/*  Number lexicon (compact interpretive table)                               */
/* -------------------------------------------------------------------------- */

type Lex = { keyword: string; essence: string; gift: string; shadow: string; drive: string };

const NUM: Record<number, Lex> = {
  1: { keyword: "independence", essence: "independence, initiative, and leading in your own direction", gift: "self-starting drive", shadow: "going it alone when support would serve you", drive: "to lead and be recognized as your own person" },
  2: { keyword: "harmony", essence: "sensitivity, partnership, and a gift for creating harmony", gift: "intuition for people", shadow: "putting others so far ahead that your own needs go unmet", drive: "to connect deeply and create peace" },
  3: { keyword: "expression", essence: "self-expression, creativity, and an uplifting warmth", gift: "natural creativity", shadow: "scattering energy across too many things", drive: "to express, create, and be truly seen" },
  4: { keyword: "stability", essence: "structure, discipline, and turning ideas into something solid", gift: "reliability and follow-through", shadow: "rigidity when plans must change", drive: "to build something lasting and dependable" },
  5: { keyword: "freedom", essence: "freedom, versatility, and a hunger for experience", gift: "adaptability and curiosity", shadow: "restlessness and difficulty committing", drive: "to experience variety and adventure" },
  6: { keyword: "responsibility", essence: "responsibility, care, and a pull toward harmony", gift: "deep care for others", shadow: "taking on more than is yours to carry", drive: "to care, serve, and create belonging" },
  7: { keyword: "insight", essence: "depth, analysis, and a quiet search for meaning", gift: "sharp analytical insight", shadow: "withdrawing inward when overwhelmed", drive: "to understand and find truth" },
  8: { keyword: "ambition", essence: "ambition, authority, and mastery of the material world", gift: "leadership and resilience", shadow: "tying self-worth to results", drive: "to achieve and build influence" },
  9: { keyword: "compassion", essence: "compassion, idealism, and a wide-angle view of the world", gift: "generosity and empathy", shadow: "carrying more than your fair share", drive: "to contribute to something larger" },
  11: { keyword: "intuition", essence: "heightened intuition, inspiration, and sensitivity", gift: "visionary intuition", shadow: "nervous tension from high sensitivity", drive: "to inspire and illuminate" },
  22: { keyword: "mastery", essence: "the power to turn a large vision into something real", gift: "practical vision at scale", shadow: "pressure from the size of your own vision", drive: "to build something significant and lasting" },
  33: { keyword: "devotion", essence: "compassionate service and the lifting-up of others", gift: "profound compassion", shadow: "self-neglect while caring for everyone else", drive: "to nurture, teach, and uplift" },
};

function lex(n: number): Lex {
  return NUM[n] ?? NUM[1];
}

const MINDPLANE: Record<string, string> = {
  Mental: "an analytical, logic-first way of processing — thinking a situation through before feeling into it",
  Physical: "a hands-on, experiential way of processing — understanding things best by doing them",
  Emotional: "a feeling-led way of processing — reading the emotional current of a room first",
  Intuitive: "an intuitive, pattern-sensing way of processing — often knowing before you can explain why",
};

const PERSONAL_YEAR: Record<number, string> = {
  1: "a fresh-start year — a natural time to plant seeds",
  2: "a year of patience, partnership, and quiet development",
  3: "a year of expression, creativity, and reconnecting socially",
  4: "a year for building foundations through steady work",
  5: "a year of change, freedom, and unexpected movement",
  6: "a year centered on home, responsibility, and the people you care for",
  7: "a year of reflection, study, and inner growth",
  8: "a year of ambition, momentum, and tangible results",
  9: "a year of completion and release",
  11: "a heightened year of intuition and inspiration",
  22: "a year that carries the potential to build something significant",
};

/* -------------------------------------------------------------------------- */
/*  Field access                                                              */
/* -------------------------------------------------------------------------- */

export type LabField = { num: number; name: string; display: string; value: FieldValue; unavailable: boolean };

export function computeSnapshot(inputs: RawInputs, now: Date): LabField[] {
  let all: ComputedField[] = [];
  try {
    all = calculateAll(inputs, now);
  } catch {
    all = [];
  }
  return all.map((f) => ({
    num: f.num,
    name: f.name,
    display: f.result.display,
    value: f.result.value,
    unavailable: !!f.result.unavailable,
  }));
}

/** Key numbers surfaced as a live "readout" in the console. */
export const READOUT_FIELDS = [1, 2, 3, 5, 11, 25];

function numFor(fields: LabField[], num: number): number {
  const v = fields.find((f) => f.num === num)?.value;
  return typeof v === "number" ? v : 0;
}
function dispFor(fields: LabField[], num: number): string {
  return fields.find((f) => f.num === num)?.display ?? "—";
}

/** Extra alias search-terms per engine field, so field text like
 *  "Challenge 1 + 2", "Current Pinnacle", "First Name", "Hidden Passion"
 *  resolves to the right engine fields. */
const ALIASES: Record<number, string[]> = {
  6: ["first name"],
  11: ["mindplane", "mind plane"],
  17: ["pinnacle 1", "1st pinnacle", "current pinnacle", "pinnacle"],
  18: ["pinnacle 2", "2nd pinnacle"],
  19: ["pinnacle 3", "3rd pinnacle"],
  20: ["pinnacle 4", "4th pinnacle"],
  21: ["challenge 1", "1st challenge", "challenge 1 + 2", "challenge 1+2"],
  22: ["challenge 2", "2nd challenge", "challenge 1 + 2", "challenge 1+2"],
  25: ["personal year"],
  27: ["maturity"],
  29: ["hidden passion"],
  32: ["karmic"],
  33: ["rational thought"],
};

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Whole-token match (so "Point" doesn't match inside "points"). */
function tokenMatch(hay: string, term: string): boolean {
  return new RegExp(`(^|[^a-z])${escapeRe(term)}([^a-z]|$)`, "i").test(hay);
}

function matchInText(text: string, fields: LabField[]): LabField[] {
  const hay = ` ${text.toLowerCase()} `;
  return fields.filter((f) => {
    if (f.unavailable) return false;
    const terms = [f.name.toLowerCase(), ...(ALIASES[f.num] ?? [])];
    return terms.some((t) => tokenMatch(hay, t));
  });
}

/** The product's selected numerology fields mapped to engine fields — used as
 *  the fallback for Reads sections, whose prompts don't name fields inline. */
function productEngineFields(product: Product, fields: LabField[]): LabField[] {
  const out: LabField[] = [];
  const seen = new Set<number>();
  for (const nf of product.numerologyFields) {
    for (const f of matchInText(nf.field, fields)) {
      if (!seen.has(f.num)) {
        seen.add(f.num);
        out.push(f);
      }
    }
  }
  return out;
}

/** Which engine fields a section injects: whatever its primary-fields text
 *  names, else the product's configured field selection. */
export function referencedFields(product: Product, section: ReportSection, fields: LabField[]): LabField[] {
  const byPrimary = matchInText(section.primaryFields ?? "", fields);
  if (byPrimary.length) return byPrimary;
  return productEngineFields(product, fields);
}

/* -------------------------------------------------------------------------- */
/*  Prompt resolution (real)                                                  */
/* -------------------------------------------------------------------------- */

function fieldBlock(label: string, inputs: RawInputs, fields: LabField[], refs: LabField[]): string {
  const name = [inputs.firstName, inputs.middleName, inputs.lastName].filter(Boolean).join(" ") || "—";
  const lines = [
    `${label} — client data:`,
    `  Name: ${name}`,
    `  DOB: ${inputs.dob || "—"}  ·  Place: ${[inputs.placeOfBirth, inputs.country].filter(Boolean).join(", ") || "—"}  ·  Birth time: ${inputs.birthTime || "not provided"}`,
    `${label} — injected numerology (${refs.length ? "fields this section draws from" : "core fields"}):`,
  ];
  const use = refs.length ? refs : fields.filter((f) => [1, 2, 3, 5, 11].includes(f.num));
  for (const f of use) lines.push(`  ${f.name} = ${f.display}`);
  return lines.join("\n");
}

export function resolvePrompt(
  product: Product,
  section: ReportSection,
  a: { inputs: RawInputs; fields: LabField[] },
  b?: { inputs: RawInputs; fields: LabField[] },
): string {
  if (section.type === "Fixed copy") {
    return [
      `# FIXED COPY SECTION — no model call`,
      `This section (“${section.title}”) is rendered verbatim from the product's brand copy.`,
      ``,
      section.fixedCopy ?? "",
    ].join("\n");
  }

  const refsA = referencedFields(product, section, a.fields);
  const refsB = b ? referencedFields(product, section, b.fields) : [];

  const parts: string[] = [];
  parts.push(`# SYSTEM`);
  parts.push(product.ai.systemPrompt);
  parts.push("");
  parts.push(`# PRODUCT CONTEXT`);
  parts.push(`Product: ${product.name} (${product.category}) · ${product.pages}`);
  parts.push(`Formula: ${product.formula}`);
  if (section.framework) parts.push(`Ekodz Framework™ step(s) for this section: ${section.framework}`);
  parts.push(`Target length: ${section.wordCount ?? "unspecified"}`);
  parts.push("");
  parts.push(`# CALCULATED DATA (engine output — do not recompute)`);
  parts.push(fieldBlock(b ? "Person A" : "Client", a.inputs, a.fields, refsA));
  if (b) {
    parts.push("");
    parts.push(fieldBlock("Person B", b.inputs, b.fields, refsB));
  }
  parts.push("");
  parts.push(`# SECTION TASK — “${section.title}”`);
  parts.push(section.prompt);
  parts.push("");
  parts.push(`# GENERATION PARAMETERS`);
  parts.push(`model=${product.ai.model} · temperature=${product.ai.temperature} · max_tokens=${product.ai.maxTokens} · top_p=${product.ai.topP}`);
  return parts.join("\n");
}

/* -------------------------------------------------------------------------- */
/*  Directive detection                                                       */
/* -------------------------------------------------------------------------- */

export type Directive = "data" | "attachment" | "patterns" | "guidance" | "short" | "profile";

export function detectDirective(section: ReportSection): Directive {
  const p = section.prompt.toLowerCase();
  if (/attachment/.test(p)) return "attachment";
  if (/no analysis|do not analyze|simply present|present the numbers clearly|display the client|display both|display the specific numerology|confirm data is correct/.test(p)) return "data";
  if (/guidance/.test(p)) return "guidance";
  if (/key patterns|patterns that emerge|identify 3|3[–\-—]5 (key )?patterns|surface hidden blocks/.test(p)) return "patterns";
  if (/2-?3 sentences|2 to 3 sentences|one closing paragraph|one powerful paragraph|overview/.test(p)) return "short";
  return "profile";
}

/* -------------------------------------------------------------------------- */
/*  Simulated generation                                                      */
/* -------------------------------------------------------------------------- */

export type SectionRun = {
  sectionId: string;
  index: string;
  title: string;
  type: ReportSection["type"];
  directive: Directive | "fixed";
  wordTarget: number | null;
  resolvedPrompt: string;
  output: string;
  wordCount: number;
  estTokens: number;
  fieldsUsed: { name: string; display: string }[];
};

function firstName(inputs: RawInputs): string {
  const n = inputs.firstName.trim();
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : "friend";
}

function mindKey(fields: LabField[]): string {
  const raw = String(fields.find((f) => f.num === 11)?.value ?? "");
  return raw.split(" & ")[0].replace(/\s*\(tie\)/, "").trim() || "Mental";
}

function parseWordTarget(wc?: string): number | null {
  if (!wc) return null;
  const range = wc.match(/(\d+)\s*[–\-—]\s*(\d+)/);
  if (range) return Math.round((+range[1] + +range[2]) / 2);
  const single = wc.match(/(\d+)/);
  if (single && /word/i.test(wc)) return +single[1];
  if (/¼|1\/4/.test(wc)) return 90;
  if (/½|1\/2/.test(wc)) return 160;
  if (/¾|3\/4/.test(wc)) return 240;
  if (/1¼/.test(wc)) return 320;
  if (single) return +single[1] * 40; // "2-3 sentences" etc → rough
  return null;
}

function refClause(name: string, value: FieldValue): string {
  const n = typeof value === "number" ? value : Number(String(value).match(/\d+/)?.[0]);
  if (n && NUM[n]) {
    const short = name.toLowerCase();
    if (short.includes("mindplane")) return `your Mindplane suggests ${MINDPLANE[String(value).split(" & ")[0]] ?? MINDPLANE.Mental}`;
    if (short.includes("personal year")) return `your Personal Year of ${value} points to ${PERSONAL_YEAR[n] ?? PERSONAL_YEAR[1]}`;
    return `your ${name} of ${value} points to ${lex(n).essence}`;
  }
  if (name.toLowerCase().includes("mindplane")) return `your Mindplane indicates ${MINDPLANE[String(value).split(" & ")[0]] ?? MINDPLANE.Mental}`;
  return `your ${name} (${value}) colors this in a way specific to you`;
}

function bodyFor(
  directive: Directive,
  product: Product,
  section: ReportSection,
  a: { inputs: RawInputs; fields: LabField[] },
  refs: LabField[],
  b?: { inputs: RawInputs; fields: LabField[] },
): string {
  const name = firstName(a.inputs);
  const lp = lex(numFor(a.fields, 1));
  const su = lex(numFor(a.fields, 3));
  const bal = lex(numFor(a.fields, 5));
  const mind = MINDPLANE[mindKey(a.fields)] ?? MINDPLANE.Mental;
  const topic = section.title.replace(/^Your\s+/i, "").replace(/™|★/g, "").trim();
  const pick = (refs.length ? refs : a.fields.filter((f) => [1, 2, 3].includes(f.num))).slice(0, 4);

  // Two-person comparative opener.
  if (b) {
    const nameB = firstName(b.inputs);
    const lpB = lex(numFor(b.fields, 1));
    if (directive === "data") {
      const rowsA = pick.map((f) => `• ${f.name}: ${f.display}`).join("\n");
      const rowsB = referencedFields(product, section, b.fields).slice(0, 4).map((f) => `• ${f.name}: ${f.display}`).join("\n");
      return `Person A — ${a.inputs.firstName} ${a.inputs.lastName}\n${rowsA}\n\nPerson B — ${b.inputs.firstName} ${b.inputs.lastName}\n${rowsB}`;
    }
    return [
      `Based on their combined blueprint data, ${name} and ${nameB} bring a natural tendency toward ${lp.essence} meeting ${lpB.essence}. Where ${name} leads with ${lp.keyword}, ${nameB} tends toward ${lpB.keyword} — a pairing that can complement beautifully once each learns to read the other.`,
      `Through the lens of ${topic}, their numbers suggest patterns consistent with mutual growth: ${pick.map((f) => refClause(f.name, f.value)).slice(0, 2).join(", and ")}. The work — and the opportunity — is to honor both designs at once. Here is what this means, and here is how to work with it together.`,
    ].join("\n\n");
  }

  switch (directive) {
    case "data": {
      if (/personal data/i.test(section.title)) {
        const full = [a.inputs.firstName, a.inputs.middleName, a.inputs.lastName].filter(Boolean).join(" ");
        return `${name}, let's confirm your details before we begin.\n\n• Full name: ${full || "—"}\n• Date of birth: ${a.inputs.dob || "—"}\n• Place of birth: ${[a.inputs.placeOfBirth, a.inputs.country].filter(Boolean).join(", ") || "—"}\n• Time of birth: ${a.inputs.birthTime || "Not provided"}\n\nIf everything above is correct, read on.`;
      }
      const rows = pick.map((f) => `• ${f.name}: ${f.display} — a core marker in your ${topic.toLowerCase()}.`).join("\n");
      return `Here are your numbers for this reading, ${name}. No analysis yet — just the figures themselves:\n\n${rows}`;
    }
    case "attachment": {
      return [
        `A note on how you tend to connect, ${name} — always as a tendency, never a diagnosis. Based on your blueprint data (Balance ${dispFor(a.fields, 5)}, Soul Urge ${dispFor(a.fields, 3)}, Challenge patterns, and Mindplane), you may have a tendency toward patterns consistent with ${bal.keyword === "harmony" ? "seeking reassurance and closeness" : "valuing self-sufficiency"} under stress.`,
        `What tends to activate this: moments where connection feels uncertain. What tends to help you feel safe: ${su.drive}. None of this is fixed. The evolution pathway here is toward more secure connection — noticing the pattern early, naming it, and letting ${su.keyword} guide you back to steady ground.`,
      ].join("\n\n");
    }
    case "patterns": {
      const items = [
        `Your ${pick[0]?.name ?? "Lifepath"} and the way it threads through everything — a recurring pull toward ${lp.keyword}.`,
        `${bal.shadow[0].toUpperCase()}${bal.shadow.slice(1)} — a pattern that tends to surface under pressure.`,
        `A quiet drive ${su.drive}, often running underneath your day-to-day choices.`,
        `${mind[0].toUpperCase()}${mind.slice(1)}.`,
      ].slice(0, 4);
      return `A few patterns stand out in your ${topic.toLowerCase()}, ${name}:\n\n` + items.map((t) => `• ${t}`).join("\n");
    }
    case "guidance": {
      const items = [
        `Lead with your ${lp.keyword} where it counts — it's your most reliable strength.`,
        `When you feel yourself ${bal.shadow}, treat it as a familiar signal, not a failing, and return to steady ground.`,
        `Make room for what quietly drives you: ${su.drive}.`,
        `Work with your natural way of processing — ${mind}.`,
      ].slice(0, 4);
      return `Here's where to place your energy next, ${name}:\n\n` + items.map((t) => `• ${t}`).join("\n");
    }
    case "short": {
      const fw = section.framework ? ` This connects to ${section.framework} of the Ekodz Framework™.` : "";
      return `${name}, at the heart of your ${topic.toLowerCase()} is a tendency toward ${lp.essence}. Your numbers suggest a person quietly driven ${su.drive}, processing the world through ${mind}.${fw}`;
    }
    default: {
      const clauses = pick.map((f) => refClause(f.name, f.value));
      const fw = section.framework ? `\n\nThis is where ${section.framework} of the Ekodz Framework™ comes in — connecting your specific data to a concrete next step.` : "";
      return [
        `Based on your blueprint data, ${name}, your ${topic.toLowerCase()} centers on a tendency toward ${lp.essence}. Drawing on ${clauses.slice(0, 2).join(", and ")}, others may experience you as someone shaped by ${lp.keyword} and a deeper pull ${su.drive}.`,
        `Your blueprint indicates ${mind}. Under pressure, your numbers suggest patterns consistent with ${bal.shadow} — recognizing this early tends to be the fastest way back to yourself. Every insight here is a tendency, never a fixed verdict.${fw}`,
      ].join("\n\n");
    }
  }
}

export function generateSection(
  product: Product,
  section: ReportSection,
  a: { inputs: RawInputs; fields: LabField[] },
  b?: { inputs: RawInputs; fields: LabField[] },
): SectionRun {
  const resolvedPrompt = resolvePrompt(product, section, a, b);
  const refs = referencedFields(product, section, a.fields);
  const wordTarget = parseWordTarget(section.wordCount);

  let output: string;
  let directive: Directive | "fixed";

  if (section.type === "Fixed copy") {
    directive = "fixed";
    const partner = b ? firstName(b.inputs) : "Partner";
    output = (section.fixedCopy ?? "")
      .replace(/\[First Name\]/g, firstName(a.inputs))
      .replace(/\[Partner Name\]/g, partner);
  } else {
    directive = detectDirective(section);
    output = bodyFor(directive, product, section, a, refs, b);
  }

  const wordCount = output.trim().split(/\s+/).filter(Boolean).length;
  return {
    sectionId: section.id,
    index: section.index,
    title: section.title,
    type: section.type,
    directive,
    wordTarget,
    resolvedPrompt,
    output,
    wordCount,
    estTokens: Math.round(wordCount * 1.35),
    fieldsUsed: refs.map((f) => ({ name: f.name, display: f.display })),
  };
}
