/* ============================================================================
   Ekodz — Calculation Engine  ·  v1.0
   All 34 standalone, reusable field calculations.

   Faithful implementation of Intake_Fields_Calculation_Engine spec:
   - All 34 fields calculate for every client, regardless of product.
   - Master numbers 11, 22, 33 are never reduced.
   - Pythagorean letter system throughout.
   - Only 3 fields require birth time (#9 Time, #10 Time Sum, #11 Mindplane
     modifier). If birth time is unknown these return null / degrade gracefully.

   Each field function returns a FieldResult { value, display, steps } so the
   admin panel can show *how* the value was derived, not just the value.
   ========================================================================== */

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type RawInputs = {
  firstName: string;
  middleName?: string;
  lastName: string;
  /** ISO date string YYYY-MM-DD */
  dob: string;
  placeOfBirth?: string;
  country?: string;
  /** "HH:MM" (24h) or null / empty when unknown */
  birthTime?: string | null;
};

export type FieldValue = number | number[] | string | string[] | null;

export type FieldResult = {
  /** Machine value — number, list of numbers (ties), raw string, or null. */
  value: FieldValue;
  /** Human-readable formatted value for display. */
  display: string;
  /** Step-by-step derivation lines shown in the admin panel. */
  steps: string[];
  /** Intermediate reduction values (used by Karmic Debt scan). */
  intermediates?: number[];
  /** True when the field could not be computed (e.g. missing birth time). */
  unavailable?: boolean;
};

export type FieldMeta = {
  num: number;
  name: string;
  category: string;
  birthTime: "No" | "Yes" | "Partial";
  difficulty: string;
  plainMeaning: string;
  calculatedFrom: string;
  howTo: string;
  /** Set when the spec flags the exact formula as needing verification. */
  verify?: boolean;
};

export type ComputedField = FieldMeta & { result: FieldResult };

/* -------------------------------------------------------------------------- */
/*  Core numerology primitives                                                */
/* -------------------------------------------------------------------------- */

const MASTERS = new Set([11, 22, 33]);
const VOWELS = new Set(["A", "E", "I", "O", "U"]);

/** Pythagorean value of a single A–Z letter (1–9). */
export function letterValue(ch: string): number {
  const c = ch.toUpperCase().charCodeAt(0);
  if (c < 65 || c > 90) return 0;
  return ((c - 65) % 9) + 1;
}

/** Uppercase A–Z letters only. */
function letters(s: string | undefined): string[] {
  return (s || "").toUpperCase().replace(/[^A-Z]/g, "").split("");
}

/**
 * Reduce a number to a single digit or master number.
 * Returns the final value plus the full reduction chain (for step display
 * and Karmic Debt intermediate scanning).
 */
export function reduce(
  n: number,
  keepMasters = true,
): { value: number; chain: number[] } {
  const chain = [n];
  let v = n;
  while (v > 9 && !(keepMasters && MASTERS.has(v))) {
    v = String(v)
      .split("")
      .reduce((a, d) => a + Number(d), 0);
    chain.push(v);
  }
  return { value: v, chain };
}

/** Format a reduction chain as "13 → 4" style text (single-arrow if no reduction). */
function chainText(chain: number[]): string {
  return chain.join(" → ");
}

/** Sum the Pythagorean values of every letter in a string. */
function sumLetters(s: string | undefined): number {
  return letters(s).reduce((a, ch) => a + letterValue(ch), 0);
}

/**
 * Classify the letters of a single name-part into vowels / consonants.
 * Y-rule (practitioner rule from spec): Y is a vowel only when a name-part
 * contains no standard vowel (A,E,I,O,U); otherwise Y is a consonant.
 */
function classify(part: string): { vowels: string[]; consonants: string[] } {
  const ls = letters(part);
  const hasStdVowel = ls.some((c) => VOWELS.has(c));
  const vowels: string[] = [];
  const consonants: string[] = [];
  for (const c of ls) {
    if (VOWELS.has(c)) vowels.push(c);
    else if (c === "Y") (hasStdVowel ? consonants : vowels).push(c);
    else consonants.push(c);
  }
  return { vowels, consonants };
}

function nameParts(i: RawInputs): string[] {
  return [i.firstName, i.middleName, i.lastName].filter(
    (p) => p && p.trim(),
  ) as string[];
}

function fullNameLetters(i: RawInputs): string[] {
  return letters(nameParts(i).join(""));
}

/* -------------------------------------------------------------------------- */
/*  Date / time primitives                                                    */
/* -------------------------------------------------------------------------- */

function isLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

/** Parse "YYYY-MM-DD" into numeric parts. Returns null if invalid. */
function parseDob(
  dob: string,
): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((dob || "").trim());
  if (!m) return null;
  const y = +m[1];
  const mo = +m[2];
  const d = +m[3];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, m: mo, d };
}

/** Parse "HH:MM" into digits. Returns null if unknown / invalid. */
function parseTime(t: string | null | undefined): { h: number; min: number } | null {
  if (!t) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  if (!m) return null;
  const h = +m[1];
  const min = +m[2];
  if (h > 23 || min > 59) return null;
  return { h, min };
}

const CUM_DAYS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

function dayOfYear(y: number, m: number, d: number): number {
  let doy = CUM_DAYS[m - 1] + d;
  if (m > 2 && isLeap(y)) doy++;
  return doy;
}

function ageAt(dob: { y: number; m: number; d: number }, now: Date): number {
  let age = now.getFullYear() - dob.y;
  const md = now.getMonth() + 1 - dob.m;
  if (md < 0 || (md === 0 && now.getDate() < dob.d)) age--;
  return Math.max(0, age);
}

const UNAVAILABLE: FieldResult = {
  value: null,
  display: "—",
  steps: ["Cannot calculate — required input missing."],
  unavailable: true,
};

function timeUnavailable(): FieldResult {
  return {
    value: null,
    display: "Not provided",
    steps: [
      "Birth time was not provided.",
      "Per spec: this field gracefully returns null — no default time is assumed.",
    ],
    unavailable: true,
  };
}

/* -------------------------------------------------------------------------- */
/*  Field metadata (spec text) + calculators                                  */
/* -------------------------------------------------------------------------- */

type Ctx = { now: Date; run: (num: number) => FieldResult };

type FieldDef = FieldMeta & {
  compute: (i: RawInputs, ctx: Ctx) => FieldResult;
};

/* Helper: full-name letter sum reduction with steps. */
function nameSumField(
  i: RawInputs,
  ls: string[],
  keepMasters = true,
): FieldResult {
  if (!ls.length) return UNAVAILABLE;
  const total = ls.reduce((a, ch) => a + letterValue(ch), 0);
  const { value, chain } = reduce(total, keepMasters);
  return {
    value,
    display: String(value),
    steps: [
      `Letters: ${ls.join("")}`,
      `Values: ${ls.map((c) => `${c}=${letterValue(c)}`).join(", ")}`,
      `Sum = ${total}`,
      `Reduce: ${chainText(chain)}`,
    ],
    intermediates: chain,
  };
}

export const FIELDS: FieldDef[] = [
  /* ---------------------------- Identity 1–5 ---------------------------- */
  {
    num: 1,
    name: "Lifepath",
    category: "Identity",
    birthTime: "No",
    difficulty: "Easy",
    plainMeaning:
      "The core life mission — the foundational path this person is designed to walk. Everything else is read in relation to it.",
    calculatedFrom: "Date of Birth",
    howTo:
      "Sum all digits of the DOB (day, month, year each reduced then combined) and reduce to a single digit or master number.",
    compute: (i) => {
      const dob = parseDob(i.dob);
      if (!dob) return UNAVAILABLE;
      const rd = reduce(dob.d);
      const rm = reduce(dob.m);
      const ry = reduce(dob.y);
      const sum = rd.value + rm.value + ry.value;
      const fin = reduce(sum);
      return {
        value: fin.value,
        display: String(fin.value),
        steps: [
          `Day ${dob.d}: ${chainText(rd.chain)} = ${rd.value}`,
          `Month ${dob.m}: ${chainText(rm.chain)} = ${rm.value}`,
          `Year ${dob.y}: ${chainText(ry.chain)} = ${ry.value}`,
          `Combine: ${rm.value} + ${rd.value} + ${ry.value} = ${sum}`,
          `Reduce: ${chainText(fin.chain)}`,
        ],
        intermediates: fin.chain,
      };
    },
  },
  {
    num: 2,
    name: "Expression",
    category: "Identity",
    birthTime: "No",
    difficulty: "Easy",
    plainMeaning:
      "How this person shows up in the world — their outward personality, natural talents, and how others perceive them.",
    calculatedFrom: "Full birth name (all letters)",
    howTo:
      "Convert every letter of the full birth name to its Pythagorean value. Sum and reduce to a single digit or master number.",
    compute: (i) => nameSumField(i, fullNameLetters(i)),
  },
  {
    num: 3,
    name: "Soul Urge",
    category: "Identity",
    birthTime: "No",
    difficulty: "Easy",
    plainMeaning:
      "The inner motivation — what truly drives someone at a deep, often unconscious level.",
    calculatedFrom: "Vowels only of the full birth name (A,E,I,O,U — Y by rule)",
    howTo:
      "Extract all vowels from the full birth name, convert to Pythagorean values, sum and reduce.",
    compute: (i) => {
      const vs = nameParts(i).flatMap((p) => classify(p).vowels);
      if (!vs.length) return UNAVAILABLE;
      const total = vs.reduce((a, c) => a + letterValue(c), 0);
      const { value, chain } = reduce(total);
      return {
        value,
        display: String(value),
        steps: [
          `Vowels: ${vs.join(", ")}`,
          `Values: ${vs.map((c) => `${c}=${letterValue(c)}`).join(", ")}`,
          `Sum = ${total}`,
          `Reduce: ${chainText(chain)}`,
        ],
        intermediates: chain,
      };
    },
  },
  {
    num: 4,
    name: "Inner Dreams",
    category: "Identity",
    birthTime: "No",
    difficulty: "Easy",
    plainMeaning:
      "Hidden desires the person may not openly admit — the gap between what they show and what they long for.",
    calculatedFrom: "Consonants only of the full birth name",
    howTo:
      "Extract all consonants from the full birth name, convert to Pythagorean values, sum and reduce.",
    compute: (i) => {
      const cs = nameParts(i).flatMap((p) => classify(p).consonants);
      if (!cs.length) return UNAVAILABLE;
      const total = cs.reduce((a, c) => a + letterValue(c), 0);
      const { value, chain } = reduce(total);
      return {
        value,
        display: String(value),
        steps: [
          `Consonants: ${cs.join(", ")}`,
          `Sum = ${total}`,
          `Reduce: ${chainText(chain)}`,
        ],
        intermediates: chain,
      };
    },
  },
  {
    num: 5,
    name: "Balance",
    category: "Identity",
    birthTime: "No",
    difficulty: "Trivial",
    plainMeaning:
      "How someone regulates emotionally under stress — their go-to response when overwhelmed.",
    calculatedFrom: "Initials only (first letter of each name part)",
    howTo:
      "Take the first letter of first, middle (if present), and last name. Convert each to Pythagorean value, sum and reduce.",
    compute: (i) => {
      const inits = nameParts(i)
        .map((p) => letters(p)[0])
        .filter(Boolean);
      if (!inits.length) return UNAVAILABLE;
      const total = inits.reduce((a, c) => a + letterValue(c), 0);
      const { value, chain } = reduce(total);
      return {
        value,
        display: String(value),
        steps: [
          `Initials: ${inits.join(", ")}`,
          `Values: ${inits.map((c) => `${c}=${letterValue(c)}`).join(", ")}`,
          `Sum = ${total}`,
          `Reduce: ${chainText(chain)}`,
        ],
        intermediates: chain,
      };
    },
  },

  /* ------------------------------ Name 6–8 ------------------------------ */
  {
    num: 6,
    name: "First Name Number",
    category: "Name",
    birthTime: "No",
    difficulty: "Easy",
    plainMeaning:
      "The immediate personality someone projects day-to-day — first impression.",
    calculatedFrom: "First name only (all letters)",
    howTo: "Convert all letters of the first name to Pythagorean values, sum and reduce.",
    compute: (i) => nameSumField(i, letters(i.firstName)),
  },
  {
    num: 7,
    name: "Middle Name Number",
    category: "Name",
    birthTime: "No",
    difficulty: "Easy",
    plainMeaning: "A supporting personality layer — often a private side of the person.",
    calculatedFrom: "Middle name only (all letters, if present)",
    howTo:
      "Convert all letters of the middle name to Pythagorean values, sum and reduce. Return null if no middle name.",
    compute: (i) => {
      const ls = letters(i.middleName);
      if (!ls.length)
        return {
          value: null,
          display: "None",
          steps: ["No middle name provided — returns null per spec."],
          unavailable: true,
        };
      return nameSumField(i, ls);
    },
  },
  {
    num: 8,
    name: "Last Name Number",
    category: "Name",
    birthTime: "No",
    difficulty: "Easy",
    plainMeaning: "Tied to inherited identity, family patterns, and lineage influence.",
    calculatedFrom: "Last name only (all letters)",
    howTo: "Convert all letters of the last name to Pythagorean values, sum and reduce.",
    compute: (i) => nameSumField(i, letters(i.lastName)),
  },

  /* ------------------------------ Time 9–11 ----------------------------- */
  {
    num: 9,
    name: "Time",
    category: "Time",
    birthTime: "Yes",
    difficulty: "Trivial — store as-is",
    plainMeaning: "The birth time itself — raw input used as a precision timing reference.",
    calculatedFrom: "Time of Birth",
    howTo: "Return the raw birth time value as provided. Stored as-is; not a calculated field.",
    compute: (i) => {
      const t = parseTime(i.birthTime);
      if (!t) return timeUnavailable();
      const val = `${String(t.h).padStart(2, "0")}:${String(t.min).padStart(2, "0")}`;
      return {
        value: val,
        display: val,
        steps: [`Stored raw birth time: ${val}`],
      };
    },
  },
  {
    num: 10,
    name: "Time Sum",
    category: "Time",
    birthTime: "Yes",
    difficulty: "Easy",
    plainMeaning: "A calculated numeric value derived from the birth time digits.",
    calculatedFrom: "Time of Birth",
    howTo: "Take all digits of the birth time (hour and minute), sum and reduce.",
    compute: (i) => {
      const t = parseTime(i.birthTime);
      if (!t) return timeUnavailable();
      const digits = `${String(t.h).padStart(2, "0")}${String(t.min).padStart(2, "0")}`.split("");
      const total = digits.reduce((a, d) => a + Number(d), 0);
      const { value, chain } = reduce(total);
      return {
        value,
        display: String(value),
        steps: [
          `Digits of ${String(t.h).padStart(2, "0")}:${String(t.min).padStart(2, "0")} → ${digits.join(" + ")}`,
          `Sum = ${total}`,
          `Reduce: ${chainText(chain)}`,
        ],
        intermediates: chain,
      };
    },
  },
  {
    num: 11,
    name: "Mindplane",
    category: "Time",
    birthTime: "Partial",
    difficulty: "Moderate",
    plainMeaning:
      "How someone thinks and processes the world — mental, physical, emotional, or intuitive orientation.",
    calculatedFrom: "Name letter distribution + optionally birth time",
    howTo:
      "Map every letter of the full birth name to one of 4 planes (Mental 1,8 · Physical 4,5 · Emotional 2,3,6 · Intuitive 7,9). Count each; highest count is dominant. The time-dependent modifier is omitted when birth time is unknown.",
    compute: (i) => {
      const ls = fullNameLetters(i);
      if (!ls.length) return UNAVAILABLE;
      const planes: Record<string, number[]> = {
        Mental: [1, 8],
        Physical: [4, 5],
        Emotional: [2, 3, 6],
        Intuitive: [7, 9],
      };
      const counts: Record<string, number> = {
        Mental: 0,
        Physical: 0,
        Emotional: 0,
        Intuitive: 0,
      };
      for (const ch of ls) {
        const v = letterValue(ch);
        for (const [plane, nums] of Object.entries(planes))
          if (nums.includes(v)) counts[plane]++;
      }
      const max = Math.max(...Object.values(counts));
      const dominant = Object.keys(counts).filter((k) => counts[k] === max);
      const hasTime = !!parseTime(i.birthTime);
      const steps = [
        `Counts → Mental ${counts.Mental}, Physical ${counts.Physical}, Emotional ${counts.Emotional}, Intuitive ${counts.Intuitive}`,
        dominant.length > 1
          ? `Tie between: ${dominant.join(" & ")} (noted per spec)`
          : `Dominant plane: ${dominant[0]}`,
        hasTime
          ? "Birth-time modifier available (applied at template level)."
          : "Birth time unknown — time-dependent modifier omitted; core Mindplane still valid.",
      ];
      return {
        value: dominant.join(" & "),
        display: dominant.join(" & ") + (dominant.length > 1 ? " (tie)" : ""),
        steps,
      };
    },
  },

  /* ---------------------------- Location 12–14 -------------------------- */
  {
    num: 12,
    name: "Compass",
    category: "Location",
    birthTime: "No",
    difficulty: "Moderate",
    verify: true,
    plainMeaning:
      "The directional pull of someone's life and career — where they are naturally headed.",
    calculatedFrom: "Name + Date of Birth combination",
    howTo:
      "Combined calculation using reduced name (Expression) and DOB (Lifepath) values, reduced to a directional heading. [Combined formula — confirm exact weighting against reference.]",
    compute: (i, ctx) => {
      const expr = ctx.run(2);
      const lp = ctx.run(1);
      if (typeof expr.value !== "number" || typeof lp.value !== "number")
        return UNAVAILABLE;
      const sum = expr.value + lp.value;
      const { value, chain } = reduce(sum);
      return {
        value,
        display: String(value),
        steps: [
          `Expression (#2) = ${expr.value}`,
          `Lifepath (#1) = ${lp.value}`,
          `Combine: ${expr.value} + ${lp.value} = ${sum}`,
          `Reduce: ${chainText(chain)}`,
        ],
        intermediates: chain,
      };
    },
  },
  {
    num: 13,
    name: "Destination",
    category: "Location",
    birthTime: "No",
    difficulty: "Moderate",
    verify: true,
    plainMeaning:
      "The long-term arc — where the life is ultimately heading over time, beyond immediate compass direction.",
    calculatedFrom: "Long-term derivation from DOB",
    howTo:
      "All digits of the full date of birth summed together in one pass, then reduced (long-term destination formula). [Confirm exact formula against reference.]",
    compute: (i) => {
      const dob = parseDob(i.dob);
      if (!dob) return UNAVAILABLE;
      const digits = `${dob.d}${dob.m}${dob.y}`.split("");
      const total = digits.reduce((a, d) => a + Number(d), 0);
      const { value, chain } = reduce(total);
      return {
        value,
        display: String(value),
        steps: [
          `All DOB digits: ${digits.join(" + ")}`,
          `Sum = ${total}`,
          `Reduce: ${chainText(chain)}`,
        ],
        intermediates: chain,
      };
    },
  },
  {
    num: 14,
    name: "Point",
    category: "Location",
    birthTime: "No",
    difficulty: "Moderate",
    verify: true,
    plainMeaning:
      "A location-based reference point tied to place of birth — anchors the reading geographically.",
    calculatedFrom: "Place of Birth / Country",
    howTo:
      "Convert the letters of place + country to Pythagorean values, sum and reduce (geographic anchor). [A geographic lookup table can replace this letter-based anchor once available.]",
    compute: (i) => {
      const geo = `${i.placeOfBirth || ""} ${i.country || ""}`.trim();
      const ls = letters(geo);
      if (!ls.length) return UNAVAILABLE;
      const total = sumLetters(geo);
      const { value, chain } = reduce(total);
      return {
        value,
        display: String(value),
        steps: [
          `Location text: "${geo}"`,
          `Letter sum = ${total}`,
          `Reduce: ${chainText(chain)}`,
        ],
        intermediates: chain,
      };
    },
  },

  /* ---------------------------- Calendar 15–16 -------------------------- */
  {
    num: 15,
    name: "DOY — Day of Year",
    category: "Calendar",
    birthTime: "No",
    difficulty: "Easy",
    plainMeaning:
      "The numeric day-of-year of the birth date — feeds life-cycle and timing calculations.",
    calculatedFrom: "Date of Birth",
    howTo: "Which day of the year the birth date falls on (1–366). Account for leap years.",
    compute: (i) => {
      const dob = parseDob(i.dob);
      if (!dob) return UNAVAILABLE;
      const doy = dayOfYear(dob.y, dob.m, dob.d);
      return {
        value: doy,
        display: String(doy),
        steps: [
          `${dob.y}-${String(dob.m).padStart(2, "0")}-${String(dob.d).padStart(2, "0")}${isLeap(dob.y) ? " (leap year)" : ""}`,
          `Day of year = ${doy}`,
        ],
      };
    },
  },
  {
    num: 16,
    name: "DLIY — Days Left in Year",
    category: "Calendar",
    birthTime: "No",
    difficulty: "Trivial",
    plainMeaning: "The inverse of DOY — days remaining in the year from the birth date.",
    calculatedFrom: "Date of Birth",
    howTo: "365 (or 366 in a leap year) minus DOY.",
    compute: (i) => {
      const dob = parseDob(i.dob);
      if (!dob) return UNAVAILABLE;
      const total = isLeap(dob.y) ? 366 : 365;
      const doy = dayOfYear(dob.y, dob.m, dob.d);
      const dliy = total - doy;
      return {
        value: dliy,
        display: String(dliy),
        steps: [`${total} − DOY(${doy}) = ${dliy}`],
      };
    },
  },

  /* ------------------------ Life Cycles / Pinnacles 17–20 --------------- */
  {
    num: 17,
    name: "1st Pinnacle",
    category: "Life Cycles",
    birthTime: "No",
    difficulty: "Moderate",
    plainMeaning: "First major life phase — foundational growth. Theme of early life.",
    calculatedFrom: "Date of Birth",
    howTo:
      "Reduced month + reduced day, reduced. Age range: birth to (36 − Lifepath).",
    compute: (i, ctx) => {
      const dob = parseDob(i.dob);
      if (!dob) return UNAVAILABLE;
      const rm = reduce(dob.m).value;
      const rd = reduce(dob.d).value;
      const { value, chain } = reduce(rm + rd);
      const lp = ctx.run(1).value;
      const end = typeof lp === "number" ? 36 - lp : null;
      return {
        value,
        display: String(value),
        steps: [
          `Reduced month ${rm} + reduced day ${rd} = ${rm + rd}`,
          `Reduce: ${chainText(chain)}`,
          end !== null ? `Age range: 0 – ${end} (36 − Lifepath ${lp})` : "",
        ].filter(Boolean),
        intermediates: chain,
      };
    },
  },
  {
    num: 18,
    name: "2nd Pinnacle",
    category: "Life Cycles",
    birthTime: "No",
    difficulty: "Moderate",
    plainMeaning: "Second major life phase — expansion and development.",
    calculatedFrom: "Date of Birth",
    howTo: "Reduced day + reduced year, reduced. Age range: 9 years after 1st Pinnacle ends.",
    compute: (i, ctx) => {
      const dob = parseDob(i.dob);
      if (!dob) return UNAVAILABLE;
      const rd = reduce(dob.d).value;
      const ry = reduce(dob.y).value;
      const { value, chain } = reduce(rd + ry);
      const lp = ctx.run(1).value;
      const p1End = typeof lp === "number" ? 36 - lp : null;
      return {
        value,
        display: String(value),
        steps: [
          `Reduced day ${rd} + reduced year ${ry} = ${rd + ry}`,
          `Reduce: ${chainText(chain)}`,
          p1End !== null ? `Age range: ${p1End + 1} – ${p1End + 9}` : "",
        ].filter(Boolean),
        intermediates: chain,
      };
    },
  },
  {
    num: 19,
    name: "3rd Pinnacle",
    category: "Life Cycles",
    birthTime: "No",
    difficulty: "Moderate",
    plainMeaning: "Third major life phase — consolidation and maturity.",
    calculatedFrom: "Date of Birth",
    howTo: "1st Pinnacle + 2nd Pinnacle, reduced. Age range: 9 years after 2nd Pinnacle ends.",
    compute: (i, ctx) => {
      const p1 = ctx.run(17).value;
      const p2 = ctx.run(18).value;
      if (typeof p1 !== "number" || typeof p2 !== "number") return UNAVAILABLE;
      const { value, chain } = reduce(p1 + p2);
      const lp = ctx.run(1).value;
      const p2End = typeof lp === "number" ? 36 - lp + 9 : null;
      return {
        value,
        display: String(value),
        steps: [
          `P1 ${p1} + P2 ${p2} = ${p1 + p2}`,
          `Reduce: ${chainText(chain)}`,
          p2End !== null ? `Age range: ${p2End + 1} – ${p2End + 9}` : "",
        ].filter(Boolean),
        intermediates: chain,
      };
    },
  },
  {
    num: 20,
    name: "4th Pinnacle",
    category: "Life Cycles",
    birthTime: "No",
    difficulty: "Moderate",
    plainMeaning: "Fourth major life phase — harvest, legacy, wisdom sharing.",
    calculatedFrom: "Date of Birth",
    howTo: "Reduced month + reduced year, reduced. Age range: remainder of life after 3rd Pinnacle.",
    compute: (i, ctx) => {
      const dob = parseDob(i.dob);
      if (!dob) return UNAVAILABLE;
      const rm = reduce(dob.m).value;
      const ry = reduce(dob.y).value;
      const { value, chain } = reduce(rm + ry);
      const lp = ctx.run(1).value;
      const p3End = typeof lp === "number" ? 36 - lp + 18 : null;
      return {
        value,
        display: String(value),
        steps: [
          `Reduced month ${rm} + reduced year ${ry} = ${rm + ry}`,
          `Reduce: ${chainText(chain)}`,
          p3End !== null ? `Age range: ${p3End + 1}+` : "",
        ].filter(Boolean),
        intermediates: chain,
      };
    },
  },

  /* ---------------------------- Challenges 21–24 ------------------------ */
  {
    num: 21,
    name: "1st Challenge",
    category: "Challenges",
    birthTime: "No",
    difficulty: "Moderate",
    plainMeaning: "Primary life challenge — the core recurring pattern holding the person back.",
    calculatedFrom: "Date of Birth",
    howTo: "Absolute difference between reduced month and reduced day (challenges are not reduced further).",
    compute: (i) => {
      const dob = parseDob(i.dob);
      if (!dob) return UNAVAILABLE;
      const rm = reduce(dob.m, false).value;
      const rd = reduce(dob.d, false).value;
      const v = Math.abs(rm - rd);
      return {
        value: v,
        display: String(v),
        steps: [`|reduced month ${rm} − reduced day ${rd}| = ${v}`],
      };
    },
  },
  {
    num: 22,
    name: "2nd Challenge",
    category: "Challenges",
    birthTime: "No",
    difficulty: "Moderate",
    plainMeaning: "Secondary challenge — compounding or recurring block.",
    calculatedFrom: "Date of Birth",
    howTo: "Absolute difference between reduced day and reduced year.",
    compute: (i) => {
      const dob = parseDob(i.dob);
      if (!dob) return UNAVAILABLE;
      const rd = reduce(dob.d, false).value;
      const ry = reduce(dob.y, false).value;
      const v = Math.abs(rd - ry);
      return {
        value: v,
        display: String(v),
        steps: [`|reduced day ${rd} − reduced year ${ry}| = ${v}`],
      };
    },
  },
  {
    num: 23,
    name: "3rd Challenge",
    category: "Challenges",
    birthTime: "No",
    difficulty: "Easy",
    plainMeaning: "Combined / major challenge — the overarching life challenge.",
    calculatedFrom: "Date of Birth",
    howTo: "Absolute difference between 1st Challenge and 2nd Challenge.",
    compute: (i, ctx) => {
      const c1 = ctx.run(21).value;
      const c2 = ctx.run(22).value;
      if (typeof c1 !== "number" || typeof c2 !== "number") return UNAVAILABLE;
      const v = Math.abs(c1 - c2);
      return {
        value: v,
        display: String(v),
        steps: [`|C1 ${c1} − C2 ${c2}| = ${v}`],
      };
    },
  },
  {
    num: 24,
    name: "4th Challenge",
    category: "Challenges",
    birthTime: "No",
    difficulty: "Moderate",
    plainMeaning: "Later-life challenge — surfaces more in the second half of life.",
    calculatedFrom: "Date of Birth",
    howTo: "Absolute difference between reduced month and reduced year.",
    compute: (i) => {
      const dob = parseDob(i.dob);
      if (!dob) return UNAVAILABLE;
      const rm = reduce(dob.m, false).value;
      const ry = reduce(dob.y, false).value;
      const v = Math.abs(rm - ry);
      return {
        value: v,
        display: String(v),
        steps: [`|reduced month ${rm} − reduced year ${ry}| = ${v}`],
      };
    },
  },

  /* --------------------------- New · 25–34 ------------------------------ */
  {
    num: 25,
    name: "Personal Year",
    category: "New · Timing",
    birthTime: "No",
    difficulty: "Easy",
    plainMeaning:
      "Which year-long energetic chapter the client is currently in. Changes annually.",
    calculatedFrom: "Birth month + birth day + current calendar year",
    howTo:
      "Reduce birth month, birth day, and current calendar year each to a single digit, sum, and reduce (11 and 22 preserved).",
    compute: (i, ctx) => {
      const dob = parseDob(i.dob);
      if (!dob) return UNAVAILABLE;
      const cy = ctx.now.getFullYear();
      const rm = reduce(dob.m, false).value;
      const rd = reduce(dob.d, false).value;
      const ryC = reduce(cy, false);
      const sum = rm + rd + ryC.value;
      const { value, chain } = reduce(sum);
      return {
        value,
        display: String(value),
        steps: [
          `Birth month ${dob.m} → ${rm}`,
          `Birth day ${dob.d} → ${rd}`,
          `Current year ${cy}: ${chainText(ryC.chain)} = ${ryC.value}`,
          `Sum ${rm} + ${rd} + ${ryC.value} = ${sum}`,
          `Reduce: ${chainText(chain)}`,
        ],
        intermediates: chain,
      };
    },
  },
  {
    num: 26,
    name: "Personal Month",
    category: "New · Timing",
    birthTime: "No",
    difficulty: "Easy",
    plainMeaning: "Narrows Personal Year down to a specific month's focus.",
    calculatedFrom: "Personal Year + current calendar month",
    howTo: "Reduce current calendar month, add to Personal Year, reduce.",
    compute: (i, ctx) => {
      const py = ctx.run(25).value;
      if (typeof py !== "number") return UNAVAILABLE;
      const cm = ctx.now.getMonth() + 1;
      const rcm = reduce(cm, false).value;
      const { value, chain } = reduce(py + rcm);
      return {
        value,
        display: String(value),
        steps: [
          `Personal Year = ${py}`,
          `Current month ${cm} → ${rcm}`,
          `Sum ${py} + ${rcm} = ${py + rcm}`,
          `Reduce: ${chainText(chain)}`,
        ],
        intermediates: chain,
      };
    },
  },
  {
    num: 27,
    name: "Maturity Number",
    category: "New · Forward-looking",
    birthTime: "No",
    difficulty: "Easy",
    plainMeaning: "Who this person is growing toward in the second half of life.",
    calculatedFrom: "Lifepath (#1) + Expression (#2)",
    howTo: "Add Lifepath and Expression, reduce to a single digit or master number.",
    compute: (i, ctx) => {
      const lp = ctx.run(1).value;
      const ex = ctx.run(2).value;
      if (typeof lp !== "number" || typeof ex !== "number") return UNAVAILABLE;
      const { value, chain } = reduce(lp + ex);
      return {
        value,
        display: String(value),
        steps: [
          `Lifepath ${lp} + Expression ${ex} = ${lp + ex}`,
          `Reduce: ${chainText(chain)}`,
        ],
        intermediates: chain,
      };
    },
  },
  {
    num: 28,
    name: "Birth Day Number",
    category: "New · Talent",
    birthTime: "No",
    difficulty: "Trivial",
    plainMeaning:
      "A narrow natural-talent indicator tied to the exact day of birth. A 'bonus skill' insight.",
    calculatedFrom: "Day of birth only (1–31)",
    howTo:
      "Use the day-of-month. If 1–9 use as-is; if 10–31 sum the two digits and reduce. 11 and 22 preserved.",
    compute: (i) => {
      const dob = parseDob(i.dob);
      if (!dob) return UNAVAILABLE;
      const { value, chain } = reduce(dob.d);
      return {
        value,
        display: String(value),
        steps: [
          `Day of birth = ${dob.d}`,
          dob.d <= 9 ? "Single digit — used as-is." : `Reduce: ${chainText(chain)}`,
        ],
        intermediates: chain,
      };
    },
  },
  {
    num: 29,
    name: "Hidden Passion Number",
    category: "New · Talent",
    birthTime: "No",
    difficulty: "Easy-moderate",
    plainMeaning:
      "A natural ability the person uses constantly but likely doesn't consciously recognize.",
    calculatedFrom: "All letters of the full birth name",
    howTo:
      "Convert every letter of the full name to its Pythagorean value, count how often each value 1–9 appears, and return the most frequent (ties return both).",
    compute: (i) => {
      const ls = fullNameLetters(i);
      if (!ls.length) return UNAVAILABLE;
      const counts: Record<number, number> = {};
      for (const ch of ls) {
        const v = letterValue(ch);
        counts[v] = (counts[v] || 0) + 1;
      }
      const max = Math.max(...Object.values(counts));
      const winners = Object.keys(counts)
        .map(Number)
        .filter((k) => counts[k] === max)
        .sort((a, b) => a - b);
      return {
        value: winners.length === 1 ? winners[0] : winners,
        display: winners.join(" & ") + (winners.length > 1 ? " (tie)" : ""),
        steps: [
          `Frequency: ${Object.keys(counts)
            .map(Number)
            .sort((a, b) => a - b)
            .map((k) => `${k}×${counts[k]}`)
            .join(", ")}`,
          `Most frequent (${max}×): ${winners.join(" & ")}`,
        ],
      };
    },
  },
  {
    num: 30,
    name: "Cornerstone",
    category: "New · Style",
    birthTime: "No",
    difficulty: "Trivial",
    plainMeaning: "The person's natural instinct for how they begin things. 'How you start.'",
    calculatedFrom: "First letter of the first name only",
    howTo: "Convert the first letter of the first name to its Pythagorean value. Return unreduced.",
    compute: (i) => {
      const ch = letters(i.firstName)[0];
      if (!ch) return UNAVAILABLE;
      const v = letterValue(ch);
      return {
        value: v,
        display: `${v} (${ch})`,
        steps: [`First letter of first name: ${ch} = ${v} (unreduced)`],
      };
    },
  },
  {
    num: 31,
    name: "Capstone",
    category: "New · Style",
    birthTime: "No",
    difficulty: "Trivial",
    plainMeaning:
      "The person's natural instinct for how they finish things. 'How you finish.' Read with Cornerstone.",
    calculatedFrom: "Last letter of the first name only",
    howTo: "Convert the last letter of the first name to its Pythagorean value. Return unreduced.",
    compute: (i) => {
      const ls = letters(i.firstName);
      const ch = ls[ls.length - 1];
      if (!ch) return UNAVAILABLE;
      const v = letterValue(ch);
      return {
        value: v,
        display: `${v} (${ch})`,
        steps: [`Last letter of first name: ${ch} = ${v} (unreduced)`],
      };
    },
  },
  {
    num: 32,
    name: "Karmic Debt Numbers",
    category: "New · Patterns",
    birthTime: "No",
    difficulty: "Moderate",
    plainMeaning:
      "Flags a repeating life lesson: 13 = work ethic, 14 = freedom/excess, 16 = ego/isolation, 19 = self-reliance.",
    calculatedFrom: "Intermediate reduction values of fields 1, 2, 3, and 28",
    howTo:
      "During the reduction of Lifepath, Expression, Soul Urge, and Birth Day Number, check each pre-final-reduction value. If any equals 13, 14, 16, or 19, flag it and its source field. Scope limited to these 4 fields.",
    compute: (i, ctx) => {
      const KARMIC = [13, 14, 16, 19];
      const sources: Array<{ num: number; name: string }> = [
        { num: 1, name: "Lifepath" },
        { num: 2, name: "Expression" },
        { num: 3, name: "Soul Urge" },
        { num: 28, name: "Birth Day Number" },
      ];
      const found: string[] = [];
      for (const s of sources) {
        const inter = ctx.run(s.num).intermediates || [];
        for (const val of inter)
          if (KARMIC.includes(val)) found.push(`${val} (from ${s.name})`);
      }
      return {
        value: found.length ? found : 0,
        display: found.length ? found.join(", ") : "None",
        steps: found.length
          ? ["Karmic Debt detected:", ...found.map((f) => `• ${f}`)]
          : ["No karmic debt numbers (13/14/16/19) in fields 1, 2, 3, or 28."],
      };
    },
  },
  {
    num: 33,
    name: "Rational Thought Number",
    category: "New · Cognition",
    birthTime: "No",
    difficulty: "Moderate",
    verify: true,
    plainMeaning:
      "How clearly and analytically someone reasons through decisions.",
    calculatedFrom: "Full birth name + Date of Birth combined",
    howTo:
      "Sum of the full birth name letter values + the day of birth, then reduced. [FORMULA VERIFICATION REQUIRED — confirm against Decoz / Goodwin before production.]",
    compute: (i) => {
      const dob = parseDob(i.dob);
      const ls = fullNameLetters(i);
      if (!dob || !ls.length) return UNAVAILABLE;
      const nameSum = ls.reduce((a, c) => a + letterValue(c), 0);
      const total = nameSum + dob.d;
      const { value, chain } = reduce(total);
      return {
        value,
        display: String(value),
        steps: [
          `Full name letter sum = ${nameSum}`,
          `Day of birth = ${dob.d}`,
          `Sum ${nameSum} + ${dob.d} = ${total}`,
          `Reduce: ${chainText(chain)}`,
        ],
        intermediates: chain,
      };
    },
  },
  {
    num: 34,
    name: "Essence Number",
    category: "New · Cycles",
    birthTime: "No",
    difficulty: "Most involved",
    verify: true,
    plainMeaning:
      "Finer year-by-year sub-cycles within each multi-year Pinnacle phase.",
    calculatedFrom: "Full birth name + current age",
    howTo:
      "Advance through the name's letters cyclically — each letter is active for a number of years equal to its Pythagorean value. Match the client's current age to find the active letter's value. [FORMULA VERIFICATION REQUIRED — confirm cycling method against reference.]",
    compute: (i, ctx) => {
      const dob = parseDob(i.dob);
      const ls = fullNameLetters(i);
      if (!dob || !ls.length) return UNAVAILABLE;
      const age = ageAt(dob, ctx.now);
      const cycle = ls.reduce((a, c) => a + letterValue(c), 0);
      const posInCycle = cycle > 0 ? age % cycle : 0;
      // Walk the letters accumulating each letter's active-year span.
      let acc = 0;
      let activeLetter = ls[0];
      for (const ch of ls) {
        acc += letterValue(ch);
        if (posInCycle < acc) {
          activeLetter = ch;
          break;
        }
      }
      const v = letterValue(activeLetter);
      return {
        value: v,
        display: `${v} (${activeLetter})`,
        steps: [
          `Current age = ${age}`,
          `Full-name cycle length = ${cycle} years`,
          `Position in cycle = ${posInCycle}`,
          `Active letter: ${activeLetter} → Essence ${v}`,
        ],
      };
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

/** Static metadata for all 34 fields (no inputs required). */
export const FIELD_META: FieldMeta[] = FIELDS.map(
  ({ compute, ...meta }) => meta,
);

/**
 * Calculate all 34 fields for one client.
 * Fields that depend on other fields (Maturity, Compass, Pinnacles, Karmic
 * Debt, …) reuse the same functions via a memoized runner — no product-level
 * conditional logic, exactly as the spec requires.
 */
export function calculateAll(inputs: RawInputs, now: Date = new Date()): ComputedField[] {
  const cache = new Map<number, FieldResult>();
  const ctx: Ctx = {
    now,
    run: (num: number) => {
      if (cache.has(num)) return cache.get(num)!;
      // Placeholder guards against accidental circular recursion.
      cache.set(num, UNAVAILABLE);
      const def = FIELDS.find((f) => f.num === num)!;
      const res = def.compute(inputs, ctx);
      cache.set(num, res);
      return res;
    },
  };
  return FIELDS.map((f) => ({
    ...(({ compute, ...meta }) => meta)(f),
    result: ctx.run(f.num),
  }));
}

/** Convenience: compute a single field by number. */
export function calculateField(
  num: number,
  inputs: RawInputs,
  now: Date = new Date(),
): ComputedField | null {
  const all = calculateAll(inputs, now);
  return all.find((f) => f.num === num) ?? null;
}

export const CATEGORY_ORDER = [
  "Identity",
  "Name",
  "Time",
  "Location",
  "Calendar",
  "Life Cycles",
  "Challenges",
  "New · Timing",
  "New · Forward-looking",
  "New · Talent",
  "New · Style",
  "New · Patterns",
  "New · Cognition",
  "New · Cycles",
];
