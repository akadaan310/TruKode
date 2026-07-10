"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* ----------------------------------------------------------------------------
   Intake collects exactly the 5 raw client inputs the calculation engine needs
   (see Intake_Fields_Calculation_Engine spec §2):

     1. Full Birth Name — First, Middle, Last
     2. Date of Birth
     3. Place of Birth
     4. Country
     5. Time of Birth  (optional — only 3 of 34 fields use it)

   All 34 fields derive from these. Answers are persisted to sessionStorage
   under "ekodz:intake" so /admin (and confirmation) can compute from them.
--------------------------------------------------------------------------- */

type Screen =
  | { type: "welcome" }
  | { type: "interstitial" }
  | { type: "review" }
  | {
      type: "question";
      input: "text" | "place" | "date" | "time" | "choice";
      key: string;
      label: string;
      q: string;
      micro: string;
      placeholder?: string;
      empty?: string;
      required?: boolean;
      options?: string[];
    };

const SCREENS: Screen[] = [
  { type: "welcome" },
  {
    type: "question",
    input: "text",
    key: "firstName",
    label: "First name",
    q: "What's your first name?",
    micro: "Use the name on your birth certificate — your blueprint is built from it.",
    placeholder: "First name",
    empty: "Your legal first name anchors most of your numbers.",
  },
  {
    type: "question",
    input: "text",
    key: "middleName",
    label: "Middle name",
    q: "And your middle name?",
    micro: "If you have one, include it in full. If not, you can skip this.",
    placeholder: "Middle name",
    required: false,
  },
  {
    type: "question",
    input: "text",
    key: "lastName",
    label: "Last name",
    q: "What's your last name?",
    micro: "Your last name at birth carries your lineage layer.",
    placeholder: "Last name",
    empty: "We need your birth surname to complete the name calculations.",
  },
  {
    type: "question",
    input: "date",
    key: "birthDate",
    label: "Born on",
    q: "When were you born?",
    micro: "Your birth date anchors the core numbers of your blueprint.",
    empty: "Your birth date helps us begin — add it when you can.",
  },
  {
    type: "question",
    input: "place",
    key: "birthPlace",
    label: "Born in",
    q: "Which city were you born in?",
    micro: "Just the city is enough. Your location stays private.",
    placeholder: "City",
    empty: "A city of birth anchors your reading geographically.",
  },
  {
    type: "question",
    input: "text",
    key: "country",
    label: "Country",
    q: "And which country?",
    micro: "Your country of birth feeds the location-based fields.",
    placeholder: "Country",
    empty: "Your country of birth is used for the location calculations.",
  },
  { type: "interstitial" },
  {
    type: "question",
    input: "time",
    key: "birthTime",
    label: "Born at",
    q: "What time were you born?",
    micro: "Only three fields use this — if you're unsure, it's perfectly fine to skip.",
    required: false,
  },
  {
    type: "question",
    input: "choice",
    key: "intention",
    label: "Here for",
    q: "What's drawing you to this Read?",
    micro: "This helps us frame your guidance. There is no wrong answer.",
    required: false,
    options: [
      "Understanding myself more deeply",
      "I'm in a season of change",
      "Pure curiosity",
      "Something I can't quite name yet",
    ],
  },
  { type: "review" },
];

const QUESTION_KEYS = SCREENS.filter(
  (s): s is Extract<Screen, { type: "question" }> => s.type === "question",
);
const Q_TOTAL = QUESTION_KEYS.length;

const inputBase =
  "w-full bg-transparent border-none border-b-[1.5px] border-gold/35 px-1.5 py-[14px] text-center font-serif text-light focus:outline-none focus:border-b-gold";
const boxInput =
  "w-full bg-ink-soft border border-gold/30 rounded-xl px-[18px] py-[16px] text-center font-sans text-[18px] text-light focus:outline-none focus:border-gold [color-scheme:dark]";

const ctaBtn =
  "w-full inline-flex items-center justify-center rounded-full bg-gold px-8 py-[17px] font-sans text-[16px] font-semibold text-[#1b1710] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(216,180,120,0.32)]";

/** Persist the 5 raw inputs in the shape the engine (lib/engine.ts) expects. */
function persist(answers: Record<string, string>) {
  const birthTime = /^\d{1,2}:\d{2}$/.test(answers.birthTime || "")
    ? answers.birthTime
    : null;
  const payload = {
    firstName: (answers.firstName || "").trim(),
    middleName: (answers.middleName || "").trim(),
    lastName: (answers.lastName || "").trim(),
    dob: (answers.birthDate || "").trim(),
    placeOfBirth: (answers.birthPlace || "").trim(),
    country: (answers.country || "").trim(),
    birthTime,
    intention: (answers.intention || "").trim(),
  };
  try {
    sessionStorage.setItem("ekodz:intake", JSON.stringify(payload));
  } catch {
    /* storage may be unavailable — non-fatal */
  }
}

export default function IntakePage() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [dir, setDir] = useState(1);
  const [anim, setAnim] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const chooseTimer = useRef<number | undefined>(undefined);

  const cur = SCREENS[i] ?? ({ type: "welcome" } as Screen);
  const isEmpty = () => !String(draft || "").trim();

  const go = useCallback(
    (d: number, ansOverride?: Record<string, string>) => {
      setI((prev) => {
        const ni = Math.max(0, Math.min(SCREENS.length - 1, prev + d));
        const A = ansOverride ?? answers;
        const nx = SCREENS[ni];
        const nextDraft = nx && nx.type === "question" ? A[nx.key] || "" : "";
        setDraft(nextDraft);
        return ni;
      });
      setError("");
      setDir(d);
      setAnim((a) => a + 1);
      if (ansOverride) setAnswers(ansOverride);
    },
    [answers],
  );

  const next = useCallback(() => {
    const c = SCREENS[i];
    if (c.type === "question") {
      if (isEmpty() && c.required !== false) {
        setError(
          c.empty || "This one helps us decode you — whenever you're ready.",
        );
        return;
      }
      setAnswers((s) => ({ ...s, [c.key]: draft }));
    }
    go(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, draft, go]);

  const back = useCallback(() => go(-1), [go]);

  const choose = (opt: string) => {
    const c = SCREENS[i];
    if (c.type !== "question") return;
    const ans = { ...answers, [c.key]: opt };
    setDraft(opt);
    setError("");
    window.clearTimeout(chooseTimer.current);
    chooseTimer.current = window.setTimeout(() => go(1, ans), 190);
  };

  const skipTime = () => {
    const c = SCREENS[i];
    if (c.type !== "question") return;
    go(1, { ...answers, [c.key]: "" });
  };

  const submit = useCallback(() => {
    persist(answers);
    setSubmitted(true);
    setDir(1);
    setAnim((a) => a + 1);
    window.setTimeout(() => router.push("/confirmation"), 2000);
  }, [router, answers]);

  const editTo = (idx: number) => {
    const nx = SCREENS[idx];
    setI(idx);
    setDraft(nx.type === "question" ? answers[nx.key] || "" : "");
    setDir(-1);
    setAnim((a) => a + 1);
    setError("");
  };

  const qNum = () => {
    let n = 0;
    for (let k = 0; k <= i; k++) {
      if (SCREENS[k] && SCREENS[k].type === "question") n++;
    }
    return n;
  };

  // Enter key advances / submits
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (submitted) return;
      const c = SCREENS[i];
      if (c.type === "review") {
        submit();
        return;
      }
      if (c.type === "question" && c.input === "choice") return;
      next();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [i, submitted, next, submit]);

  // Focus first input on step change
  useEffect(() => {
    const t = window.setTimeout(() => {
      const el = document.querySelector<HTMLInputElement>("main input");
      if (el) el.focus();
    }, 60);
    return () => window.clearTimeout(t);
  }, [i]);

  useEffect(() => () => window.clearTimeout(chooseTimer.current), []);

  const isWelcome = !submitted && cur.type === "welcome";
  const isQuestion = !submitted && cur.type === "question";
  const isInterstitial = !submitted && cur.type === "interstitial";
  const isReview = !submitted && cur.type === "review";
  const qn = qNum();
  const showProgress = isQuestion;
  const showContinue =
    !submitted &&
    (cur.type === "welcome" ||
      cur.type === "interstitial" ||
      (cur.type === "question" && cur.input !== "choice"));
  const showBack = !submitted && i > 0 && cur.type !== "review";
  const stageAnim = `${dir < 0 ? "tkBack" : "tkFwd"} 0.5s cubic-bezier(.2,.7,.2,1)`;
  const optional = cur.type === "question" && cur.required === false;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-[-26%] h-[min(780px,150vw)] w-[min(780px,150vw)] -translate-x-1/2 animate-[tkGlow_9s_ease-in-out_infinite] bg-[radial-gradient(circle,rgba(216,180,120,0.13),rgba(216,180,120,0.03)_44%,transparent_64%)]" />

      {/* TOP BAR */}
      <div className="relative z-[2] flex-none">
        <div className="mx-auto flex max-w-[680px] items-center justify-between gap-4 px-[clamp(22px,6vw,40px)] pt-5">
          <span className="font-serif text-[22px] font-semibold text-light">
            TruKode<span className="text-gold">.</span>
          </span>
          {showProgress && (
            <span className="font-sans text-[13px] tracking-[0.04em] text-light-soft">
              Question {qn} of {Q_TOTAL}
            </span>
          )}
        </div>
        {showProgress && (
          <div className="mx-auto mt-[14px] max-w-[680px] px-[clamp(22px,6vw,40px)]">
            <div className="h-[3px] overflow-hidden rounded-full bg-gold/[0.16]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--gold-strong),var(--gold))] transition-[width] duration-[600ms] ease-[cubic-bezier(.2,.7,.2,1)]"
                style={{ width: `${Math.round((qn / Q_TOTAL) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* STAGE */}
      <main className="relative z-[2] flex flex-1 items-center justify-center px-[clamp(22px,6vw,40px)] py-[clamp(36px,8vh,80px)]">
        <div
          key={anim}
          className="w-full max-w-[560px] text-center"
          style={{ animation: stageAnim }}
        >
          {isWelcome && (
            <div className="flex flex-col items-center">
              <div className="mb-[30px] font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                Human Decode™
              </div>
              <h1 className="m-0 text-balance font-serif text-[clamp(34px,7.5vw,56px)] font-medium leading-[1.08] tracking-[-0.012em] text-light">
                Let&apos;s begin decoding your blueprint — one question at a
                time.
              </h1>
              <p className="mt-6 max-w-[420px] text-[clamp(16px,2.4vw,19px)] leading-[1.6] text-light-soft">
                This takes just a few minutes. There are no wrong answers — only
                your own.
              </p>
            </div>
          )}

          {isQuestion && cur.type === "question" && (
            <div className="flex flex-col items-center">
              <h2 className="m-0 text-balance font-serif text-[clamp(30px,6.2vw,48px)] font-medium leading-[1.1] tracking-[-0.012em] text-light">
                {cur.q}
              </h2>
              <p className="mt-[18px] max-w-[400px] text-[15px] leading-[1.55] text-light-soft">
                {cur.micro}
              </p>

              <div className="mt-[38px] w-full">
                {cur.input === "text" && (
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => {
                      setDraft(e.target.value);
                      setError("");
                    }}
                    placeholder={cur.placeholder}
                    className={`${inputBase} text-[clamp(24px,5vw,34px)]`}
                  />
                )}
                {cur.input === "place" && (
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => {
                      setDraft(e.target.value);
                      setError("");
                    }}
                    placeholder={cur.placeholder}
                    className={`${inputBase} text-[clamp(22px,4.4vw,30px)]`}
                  />
                )}
                {cur.input === "date" && (
                  <input
                    type="date"
                    value={draft}
                    onChange={(e) => {
                      setDraft(e.target.value);
                      setError("");
                    }}
                    className={`${boxInput} max-w-[320px]`}
                  />
                )}
                {cur.input === "time" && (
                  <div className="flex flex-col items-center gap-[18px]">
                    <input
                      type="time"
                      value={draft}
                      onChange={(e) => {
                        setDraft(e.target.value);
                        setError("");
                      }}
                      className={`${boxInput} max-w-[260px]`}
                    />
                    <button
                      type="button"
                      onClick={skipTime}
                      className="cursor-pointer border-none bg-none font-sans text-[14px] text-light-soft underline underline-offset-[3px] hover:text-gold"
                    >
                      I don&apos;t know my birth time — skip this
                    </button>
                  </div>
                )}
                {cur.input === "choice" && cur.options && (
                  <div className="flex flex-col gap-[11px]">
                    {cur.options.map((opt) => {
                      const selected = opt === draft;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => choose(opt)}
                          className={`w-full cursor-pointer rounded-xl border px-[22px] py-[18px] text-left font-sans text-[16.5px] font-medium text-light transition-[border-color,background] duration-[250ms] hover:border-gold ${
                            selected
                              ? "border-gold bg-gold/[0.14]"
                              : "border-gold/[0.22] bg-gold/[0.04]"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {optional && cur.input !== "time" && (
                <button
                  type="button"
                  onClick={next}
                  className="mt-[22px] cursor-pointer border-none bg-none font-sans text-[13.5px] text-light-soft underline underline-offset-[3px] hover:text-gold"
                >
                  Skip — I&apos;ll leave this blank
                </button>
              )}

              {error && (
                <p className="mt-[18px] text-[14px] text-gold">{error}</p>
              )}
            </div>
          )}

          {isInterstitial && (
            <div className="flex flex-col items-center">
              <div className="mb-[28px] flex h-[46px] w-[46px] items-center justify-center rounded-full border-[1.5px] border-gold">
                <span className="h-[10px] w-[10px] rounded-full bg-gold" />
              </div>
              <h2 className="m-0 text-balance font-serif text-[clamp(28px,5.6vw,44px)] font-medium leading-[1.12] tracking-[-0.01em] text-light">
                You&apos;re sharing this in a safe place.
              </h2>
              <p className="mt-[22px] max-w-[440px] text-[clamp(15px,2.2vw,17px)] leading-[1.65] text-light-soft">
                Your details are private and used only to decode your blueprint.
                Every report is personally reviewed before it reaches you. Take a
                breath — you&apos;re almost there.
              </p>
            </div>
          )}

          {isReview && (
            <div className="flex flex-col items-center">
              <div className="mb-[22px] font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-gold">
                One last look
              </div>
              <h2 className="m-0 font-serif text-[clamp(30px,6vw,46px)] font-medium leading-[1.1] tracking-[-0.012em] text-light">
                Does this look right?
              </h2>
              <div className="mt-[34px] flex w-full flex-col">
                {SCREENS.map((sc, idx) =>
                  sc.type === "question" ? (
                    <div
                      key={sc.key}
                      className="flex items-center justify-between gap-4 border-t border-gold/[0.14] px-1 py-[18px] text-left"
                    >
                      <div className="min-w-0">
                        <div className="mb-1 font-sans text-[10px] uppercase tracking-[0.12em] text-light-soft">
                          {sc.label}
                        </div>
                        <div className="overflow-hidden text-ellipsis font-serif text-[21px] text-light">
                          {answers[sc.key] || "—"}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => editTo(idx)}
                        className="flex-none cursor-pointer border-none bg-none font-sans text-[13px] font-semibold text-gold hover:opacity-75"
                      >
                        Edit
                      </button>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          )}

          {submitted && (
            <div className="flex flex-col items-center">
              <div className="relative mb-[34px] h-[72px] w-[72px]">
                <div className="absolute inset-0 animate-[tkSpin_1.1s_linear_infinite] rounded-full border-2 border-gold/20 border-t-gold" />
                <div className="absolute inset-[24px] animate-[tkPulse_1.8s_ease-in-out_infinite] rounded-full bg-gold" />
              </div>
              <h2 className="m-0 font-serif text-[clamp(30px,6vw,46px)] font-medium leading-[1.1] text-light">
                Decoding your blueprint…
              </h2>
              <p className="mt-5 max-w-[380px] text-[16px] leading-[1.6] text-light-soft">
                This will only take a moment. We&apos;ll let you know the instant
                your Read is ready.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* CONTROLS */}
      <div className="relative z-[2] flex-none px-[clamp(22px,6vw,40px)] pb-[clamp(30px,6vh,52px)]">
        <div className="mx-auto flex max-w-[560px] flex-col items-center gap-4">
          {showContinue && (
            <button type="button" onClick={next} className={ctaBtn}>
              {cur.type === "welcome" ? "Begin" : "Continue"}
            </button>
          )}
          {isReview && (
            <button type="button" onClick={submit} className={ctaBtn}>
              Decode my blueprint
            </button>
          )}
          {showBack && (
            <button
              type="button"
              onClick={back}
              className="cursor-pointer border-none bg-none font-sans text-[14px] text-light-soft transition-colors duration-[250ms] hover:text-light"
            >
              ← Back
            </button>
          )}
          {isWelcome && (
            <span className="inline-flex items-center gap-2 text-[12.5px] text-light-soft">
              <span className="h-[5px] w-[5px] rounded-full bg-gold" />
              Private &amp; secure · reviewed before delivery
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
