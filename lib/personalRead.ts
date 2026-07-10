/* ============================================================================
   Personal Read™ — Report Generator

   Synthesizes the two-page Personal Read narrative from the 34 calculated
   engine fields. This is a deterministic stand-in for what an LLM will later
   generate: it takes the same 34 data points as input and fills the six
   product sections the Personal Read promises —
     01 Your Personal Data   02 Your Core Numbers   03 Your Personal Profile
     04 Key Patterns         05 Your Guidance       06 Your North Star

   NON-DIAGNOSTIC LANGUAGE RULE (locked, spec §preamble):
   Never "You are…" / "You have…". Always framed as tendencies and
   possibilities — "Based on your blueprint data, you may have a tendency to…",
   "Your numbers suggest patterns consistent with…", "Your blueprint indicates…".
   ========================================================================== */

import { calculateAll, type ComputedField, type RawInputs } from "./engine";

/* -------------------------------------------------------------------------- */
/*  Interpretation tables                                                     */
/* -------------------------------------------------------------------------- */

type Trait = {
  archetype: string;
  essence: string; // core energy — used after "a tendency toward …"
  gifts: string[];
  shadows: string[];
  drive: string; // soul-urge motivation — used after "driven …"
  underStress: string; // balance — used after "you may find yourself …"
  keyword: string;
  decision: string; // decision style — used after "moving …"
};

const TRAITS: Record<number, Trait> = {
  1: {
    archetype: "The Initiator",
    essence: "independence, originality, and leading in your own direction",
    gifts: ["self-starting initiative", "original thinking", "the courage to stand alone"],
    shadows: [
      "going it alone when support would serve you better",
      "impatience with slower processes or people",
    ],
    drive: "to lead, to pioneer, and to be recognized as your own person",
    underStress: "becoming more forceful, or withdrawing to regain a sense of control",
    keyword: "independence",
    decision: "decisively and quickly, trusting your own read of a situation",
  },
  2: {
    archetype: "The Diplomat",
    essence: "sensitivity, partnership, and a gift for creating harmony",
    gifts: ["deep intuition for people", "patience and tact", "the ability to bring others together"],
    shadows: [
      "over-sensitivity to conflict or criticism",
      "placing others' needs so far ahead of your own that yours go unmet",
    ],
    drive: "to connect deeply, to be needed, and to create peace",
    underStress: "withdrawing, or over-accommodating to keep the peace",
    keyword: "harmony",
    decision: "carefully and collaboratively, weighing how others will be affected",
  },
  3: {
    archetype: "The Communicator",
    essence: "self-expression, creativity, and an uplifting warmth",
    gifts: ["natural creativity", "an optimism that lifts a room", "a quick, playful mind"],
    shadows: [
      "scattering your energy across too many things at once",
      "using lightness to sidestep deeper feeling",
    ],
    drive: "to express, to create, and to be truly seen and heard",
    underStress: "deflecting with humor, or scattering into distraction",
    keyword: "expression",
    decision: "intuitively and expressively, following what feels most alive",
  },
  4: {
    archetype: "The Builder",
    essence: "structure, discipline, and turning ideas into something solid",
    gifts: ["reliability and follow-through", "practical problem-solving", "a genuine work ethic"],
    shadows: [
      "rigidity when plans have to change",
      "difficulty resting, or letting others carry part of the load",
    ],
    drive: "to build something lasting and to be genuinely dependable",
    underStress: "over-controlling the details, or retreating into routine",
    keyword: "stability",
    decision: "methodically and carefully, grounded in what has been proven",
  },
  5: {
    archetype: "The Free Spirit",
    essence: "freedom, versatility, and a hunger for experience",
    gifts: ["adaptability", "a magnetic curiosity", "quick learning across many areas"],
    shadows: [
      "restlessness, or difficulty committing to one path",
      "losing focus once the novelty fades",
    ],
    drive: "to experience freedom, variety, and adventure",
    underStress: "seeking escape, or reaching for sudden change",
    keyword: "freedom",
    decision: "spontaneously and flexibly, keeping your options open",
  },
  6: {
    archetype: "The Nurturer",
    essence: "responsibility, care, and a pull toward harmony at home and in community",
    gifts: ["a deep care for others", "a strong sense of responsibility", "an eye for beauty and balance"],
    shadows: [
      "taking on more for others than is yours to carry",
      "a tendency toward perfectionism or quiet worry",
    ],
    drive: "to care, to be of service, and to create belonging and beauty",
    underStress: "over-giving, or slipping into worry and control",
    keyword: "responsibility",
    decision: "with the whole picture in mind, weighing everyone's wellbeing",
  },
  7: {
    archetype: "The Seeker",
    essence: "depth, analysis, and a quiet search for meaning",
    gifts: ["sharp analytical insight", "a rich inner life", "the patience to go deep"],
    shadows: [
      "withdrawing inward when things feel like too much",
      "over-thinking, or holding back from the people around you",
    ],
    drive: "to understand, to find truth, and to know things fully",
    underStress: "retreating into yourself and going quiet",
    keyword: "insight",
    decision: "reflectively and analytically — needing to understand before you move",
  },
  8: {
    archetype: "The Achiever",
    essence: "ambition, authority, and a capacity to manage the material world",
    gifts: ["natural leadership and vision for scale", "resilience under pressure", "sound judgment about resources"],
    shadows: [
      "tying your sense of worth to results",
      "gripping tighter and becoming controlling when the stakes feel high",
    ],
    drive: "to achieve, to build influence, and to master the material world",
    underStress: "pushing harder, or holding on tighter for control",
    keyword: "ambition",
    decision: "strategically and confidently, with an eye on the outcome",
  },
  9: {
    archetype: "The Humanitarian",
    essence: "compassion, idealism, and a wide-angle view of the world",
    gifts: ["generosity and empathy", "a broad, principled perspective", "the ability to inspire"],
    shadows: [
      "carrying far more than your fair share",
      "difficulty letting go, or setting a clear limit",
    ],
    drive: "to contribute to something larger than yourself",
    underStress: "absorbing others' burdens, or becoming quietly disillusioned",
    keyword: "compassion",
    decision: "with principle and the bigger picture in mind",
  },
  11: {
    archetype: "The Illuminator",
    essence: "heightened intuition, inspiration, and sensitivity",
    gifts: ["visionary intuition", "the ability to inspire others", "a natural channel for insight"],
    shadows: [
      "nervous tension that comes with high sensitivity",
      "self-doubt about the size of your inner calling",
    ],
    drive: "to inspire and illuminate, and to live up to an inner vision",
    underStress: "feeling overwhelmed by your own sensitivity",
    keyword: "intuition",
    decision: "intuitively, guided by inner signals you can't always explain",
  },
  22: {
    archetype: "The Master Builder",
    essence: "the power to turn a large vision into something real",
    gifts: ["a vision that is both big and practical", "the capacity to build at scale", "disciplined idealism"],
    shadows: [
      "pressure from the sheer size of your own vision",
      "swinging between grand dreams and self-doubt",
    ],
    drive: "to build something significant and lasting for many people",
    underStress: "feeling paralyzed by the scale of what you sense you could do",
    keyword: "mastery",
    decision: "with vision grounded in a concrete, step-by-step plan",
  },
  33: {
    archetype: "The Master Teacher",
    essence: "compassionate service and the lifting-up of others",
    gifts: ["profound compassion", "a gift for guiding and healing", "selfless devotion"],
    shadows: [
      "taking on the weight of the whole world",
      "self-neglect while caring for everyone else",
    ],
    drive: "to nurture, to teach, and to uplift on a wide scale",
    underStress: "overextending yourself in caring for everyone but you",
    keyword: "devotion",
    decision: "from the heart, weighing what most serves others' growth",
  },
};

function trait(n: number): Trait {
  return TRAITS[n] ?? TRAITS[1];
}

const MINDPLANE: Record<string, string> = {
  Mental:
    "an analytical, logic-first way of processing — you may tend to think a situation all the way through before you feel your way into it",
  Physical:
    "a hands-on, experiential way of processing — you may tend to understand things best by doing them",
  Emotional:
    "a feeling-led way of processing — you may tend to read the emotional current of a room before anything else",
  Intuitive:
    "an intuitive, pattern-sensing way of processing — you may tend to simply 'know' something before you can fully explain why",
};

const PERSONAL_YEAR: Record<number, string> = {
  1: "a fresh-start year — a natural time for planting seeds and stepping into something new",
  2: "a year of patience, partnership, and quiet development",
  3: "a year of expression, creativity, and reconnecting socially",
  4: "a year for building foundations through steady, disciplined work",
  5: "a year of change, freedom, and unexpected movement",
  6: "a year centered on home, responsibility, and the people you care for",
  7: "a year of reflection, study, and inner growth",
  8: "a year of ambition, momentum, and tangible results",
  9: "a year of completion and release — making room for what comes next",
  11: "a heightened year of intuition and inspiration",
  22: "a year that carries the potential to build something significant",
};

const KARMIC: Record<number, string> = {
  13: "a lesson around self-discipline and work ethic — rewards tend to follow patient, focused effort rather than shortcuts",
  14: "a lesson around freedom and moderation — steadiness and commitment tend to serve you more than constant change",
  16: "a lesson around ego and connection — meaning tends to arrive through humility and genuine closeness with others",
  19: "a lesson around self-reliance and receiving — real strength tends to include letting others in, not only standing alone",
};

/* -------------------------------------------------------------------------- */
/*  Report shape                                                              */
/* -------------------------------------------------------------------------- */

export type CoreNumber = {
  num: number;
  name: string;
  value: string;
  blurb: string;
};

export type Pattern = { title: string; body: string };

export type PersonalReadReport = {
  name: string;
  fullName: string;
  dateLabel: string;
  personalData: { label: string; value: string }[];
  coreNumbers: CoreNumber[];
  profile: string[];
  strengths: string[];
  blindSpots: string[];
  patterns: Pattern[];
  guidance: string[];
  northStar: string;
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDob(dob: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((dob || "").trim());
  if (!m) return dob || "—";
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

function uniq<T>(list: T[]): T[] {
  return Array.from(new Set(list));
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* -------------------------------------------------------------------------- */
/*  Generator                                                                 */
/* -------------------------------------------------------------------------- */

export function generatePersonalRead(
  inputs: RawInputs,
  now: Date = new Date(),
): PersonalReadReport {
  const fields = calculateAll(inputs, now);
  const byNum = new Map<number, ComputedField>(fields.map((f) => [f.num, f]));
  const val = (n: number) => byNum.get(n)?.result.value;
  const num = (n: number): number => {
    const v = val(n);
    return typeof v === "number" ? v : 0;
  };

  const lifepath = num(1);
  const expression = num(2);
  const soulUrge = num(3);
  const balance = num(5);
  const maturity = num(27);
  const birthDay = num(28);
  const personalYear = num(25);

  const lp = trait(lifepath);
  const ex = trait(expression);
  const su = trait(soulUrge);
  const bal = trait(balance);
  const mat = trait(maturity);

  // Mindplane dominant plane (first, if tied).
  const mindRaw = String(val(11) ?? "");
  const mindKey = mindRaw.split(" & ")[0].replace(/\s*\(tie\)/, "").trim();
  const mindPhrase = MINDPLANE[mindKey] ?? MINDPLANE.Mental;

  const name = inputs.firstName.trim() || "friend";
  const fullName = [inputs.firstName, inputs.middleName, inputs.lastName]
    .filter((p) => p && p.trim())
    .join(" ");

  /* ---- 01 Personal Data ---- */
  const place = [inputs.placeOfBirth, inputs.country]
    .filter((p) => p && p.trim())
    .join(", ");
  const personalData = [
    { label: "Full birth name", value: fullName || "—" },
    { label: "Date of birth", value: formatDob(inputs.dob) },
    { label: "Place of birth", value: place || "—" },
    {
      label: "Time of birth",
      value: inputs.birthTime ? inputs.birthTime : "Not provided",
    },
  ];

  /* ---- 02 Core Numbers ---- */
  const coreNumbers: CoreNumber[] = [
    { num: 1, name: "Lifepath", value: byNum.get(1)!.result.display, blurb: `${lp.archetype} — your core path` },
    { num: 2, name: "Expression", value: byNum.get(2)!.result.display, blurb: `how you tend to show up in the world` },
    { num: 3, name: "Soul Urge", value: byNum.get(3)!.result.display, blurb: `what quietly motivates you underneath` },
    { num: 5, name: "Balance", value: byNum.get(5)!.result.display, blurb: `your go-to response under pressure` },
    { num: 11, name: "Mindplane", value: byNum.get(11)!.result.display, blurb: `how you tend to process the world` },
    { num: 28, name: "Birth Day", value: byNum.get(28)!.result.display, blurb: `a bonus natural talent` },
    { num: 27, name: "Maturity", value: byNum.get(27)!.result.display, blurb: `who you're growing toward` },
    { num: 25, name: "Personal Year", value: byNum.get(25)!.result.display, blurb: `the chapter you're in right now` },
  ];

  /* ---- 03 Personal Profile (3 paragraphs) ---- */
  const profile = [
    `Based on your blueprint data, ${name}, with a Lifepath ${byNum.get(1)!.result.display} — ${lp.archetype} — you may have a tendency toward ${lp.essence}. Paired with an Expression of ${byNum.get(2)!.result.display}, others may experience you through ${ex.gifts[0]} and ${ex.gifts[1]}. This is the through-line of how you tend to think, feel, and show up.`,
    `Beneath the surface, your Soul Urge of ${byNum.get(3)!.result.display} suggests you may be quietly driven ${su.drive}. Your blueprint indicates ${mindPhrase}. When it comes to decisions, you may find yourself moving ${lp.decision} — a decision-making style worth trusting, and worth slowing down when the choice is a large one.`,
    `Under pressure, your numbers suggest patterns consistent with ${bal.underStress}. Recognizing this early — naming it as a familiar pattern rather than a failing — tends to be the fastest way back to steady ground.`,
  ];

  /* ---- Strengths & blind spots ---- */
  const strengths = uniq([...lp.gifts, ...ex.gifts, ...su.gifts]).slice(0, 4);
  const challengeVal = num(21);
  const blindSpots = uniq([
    ...lp.shadows,
    ...ex.shadows,
    challengeVal === 0
      ? "a recurring pull between two strong sides of yourself that can be hard to reconcile"
      : `a core challenge around the number ${challengeVal} that can quietly resurface across seasons of life`,
  ]).slice(0, 4);

  /* ---- 04 Key Patterns ---- */
  const patterns: Pattern[] = [];

  // Hidden Passion
  const hp = val(29);
  const hpNums = Array.isArray(hp) ? (hp as number[]) : typeof hp === "number" ? [hp] : [];
  if (hpNums.length) {
    const hpTraits = hpNums.map((n) => trait(n).keyword);
    patterns.push({
      title: "A talent you may not notice you rely on",
      body: `Your Hidden Passion points to ${hpTraits.join(" and ")}. Based on your blueprint data, this may be a capacity you use so constantly that you no longer register it as a strength — yet it is likely one of the most reliable things others come to you for.`,
    });
  }

  // Cornerstone → Capstone (how you start / finish)
  const corner = val(30);
  const cap31 = val(31);
  const cornerN = typeof corner === "number" ? corner : Number(String(corner).match(/\d+/)?.[0]);
  const capN = typeof cap31 === "number" ? cap31 : Number(String(cap31).match(/\d+/)?.[0]);
  if (cornerN && capN) {
    patterns.push({
      title: "How you begin and how you follow through",
      body: `Your Cornerstone suggests you tend to begin things through ${trait(cornerN).keyword}, while your Capstone suggests you tend to complete them through ${trait(capN).keyword}. You may find yourself ${cornerN === capN ? "starting and finishing from the same instinct — consistent, though it can benefit from a second perspective" : "opening and closing in noticeably different modes, which is a quiet strength once you learn to trust both"}.`,
    });
  }

  // Karmic debt or dominant challenge as recurring lesson
  const karmic = val(32);
  const karmicList = Array.isArray(karmic) ? (karmic as string[]) : [];
  if (karmicList.length) {
    const codes = uniq(
      karmicList.map((s) => Number(s.match(/^\d+/)?.[0])).filter(Boolean) as number[],
    );
    const lesson = codes.map((c) => KARMIC[c]).filter(Boolean)[0];
    if (lesson) {
      patterns.push({
        title: "A repeating life lesson",
        body: `Your blueprint indicates ${lesson}. This tends to explain why certain patterns keep circling back — not as a flaw, but as the specific work your path keeps inviting you toward.`,
      });
    }
  } else {
    patterns.push({
      title: "A recurring theme",
      body: `Across your numbers, a recurring theme of ${lp.keyword} emerges — it tends to show up in how you work, how you relate, and where you place your energy. Noticing it is the first step to using it on purpose.`,
    });
  }

  /* ---- 05 Guidance ---- */
  const pyPhrase = PERSONAL_YEAR[personalYear] ?? PERSONAL_YEAR[1];
  const guidance = [
    `As you move forward, your blueprint points toward ${mat.archetype.toLowerCase().replace(/^the /, "")} energy — a growing pull toward ${mat.essence}. You may find that the second half of your story asks you to lean into ${mat.keyword} more openly than the first half did.`,
    `Right now, your Personal Year suggests you may be in ${pyPhrase}. Working with that current — rather than against it — tends to make this season feel less like effort and more like alignment. Where you can, let ${lp.keyword} lead, and let ${bal.keyword} be the thing you return to when the ground feels unsteady.`,
  ];

  /* ---- 06 North Star ---- */
  const growth =
    mat.keyword === lp.keyword
      ? `keep deepening your ${mat.keyword}`
      : `keep growing toward ${mat.keyword}`;
  const northStar = `Lead with your ${lp.keyword}, honor your need for ${su.keyword}, and ${growth}. When the path feels unclear, this is the direction to come home to.`;

  const dateLabel = `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  return {
    name: cap(name),
    fullName: fullName || cap(name),
    dateLabel,
    personalData,
    coreNumbers,
    profile,
    strengths,
    blindSpots,
    patterns,
    guidance,
    northStar,
  };
}
