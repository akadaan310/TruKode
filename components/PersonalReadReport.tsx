"use client";

/* ----------------------------------------------------------------------------
   PersonalReadReport — renders the generated Personal Read as a two-page
   document on the confirmation screen. Reads the 5 raw inputs captured at
   intake (sessionStorage "ekodz:intake"), runs the engine + report generator,
   and lays the result out as two "pages" a customer could read or print.

   If no intake data is present (e.g. a direct visit), it falls back to a
   sample client so the page always renders something meaningful.
--------------------------------------------------------------------------- */

import { useEffect, useMemo, useState } from "react";
import {
  generatePersonalRead,
  type PersonalReadReport as Report,
} from "@/lib/personalRead";
import type { RawInputs } from "@/lib/engine";

const SAMPLE: RawInputs = {
  firstName: "Maya",
  middleName: "Rose",
  lastName: "Hart",
  dob: "1992-03-19",
  placeOfBirth: "Lisbon",
  country: "Portugal",
  birthTime: "08:15",
};

function readIntake(): { inputs: RawInputs; isSample: boolean } {
  try {
    const raw = sessionStorage.getItem("ekodz:intake");
    if (raw) {
      const p = JSON.parse(raw);
      if (p.firstName && p.lastName && p.dob) {
        return {
          inputs: {
            firstName: p.firstName,
            middleName: p.middleName || "",
            lastName: p.lastName,
            dob: p.dob,
            placeOfBirth: p.placeOfBirth || "",
            country: p.country || "",
            birthTime: p.birthTime || "",
          },
          isSample: false,
        };
      }
    }
  } catch {
    /* ignore */
  }
  return { inputs: SAMPLE, isSample: true };
}

/* --- small presentational helpers --- */

function SectionHeading({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-[16px] flex items-baseline gap-[12px]">
      <span className="font-serif text-[15px] text-gold-strong">{num}</span>
      <h3 className="m-0 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-dark-soft">
        {title}
      </h3>
      <span className="h-px flex-1 bg-dark/10" />
    </div>
  );
}

function Page({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: string;
}) {
  return (
    <div className="tk-page relative mx-auto w-full max-w-[720px] rounded-[6px] border border-dark/12 bg-paper px-[clamp(26px,5vw,60px)] py-[clamp(34px,5vw,56px)] shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
      {children}
      <div className="mt-[34px] flex items-center justify-between border-t border-dark/10 pt-[14px] font-sans text-[10px] uppercase tracking-[0.14em] text-dark-soft/70">
        <span>The Blueprint System™ · Human Decode™</span>
        <span>{footer}</span>
      </div>
    </div>
  );
}

export function PersonalReadReport() {
  const [state, setState] = useState<{ inputs: RawInputs; isSample: boolean } | null>(
    null,
  );

  useEffect(() => {
    setState(readIntake());
  }, []);

  const report = useMemo<Report | null>(
    () => (state ? generatePersonalRead(state.inputs, new Date()) : null),
    [state],
  );

  if (!report) {
    return (
      <div className="mx-auto max-w-[720px] py-16 text-center font-serif text-[20px] text-light-soft">
        Preparing your Read…
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-[28px]">
      {state?.isSample && (
        <div className="rounded-full border border-gold/40 bg-gold/[0.08] px-[18px] py-[8px] font-sans text-[12px] text-light">
          Sample preview — complete the{" "}
          <a href="/intake" className="text-gold underline underline-offset-2">
            intake
          </a>{" "}
          to generate your own.
        </div>
      )}

      {/* ============================ PAGE ONE ============================ */}
      <Page footer="Page 1 of 2">
        {/* Masthead */}
        <div className="mb-[30px] flex items-end justify-between gap-4 border-b border-dark/10 pb-[20px]">
          <div>
            <div className="font-sans text-[9.5px] font-semibold uppercase tracking-[0.24em] text-gold-strong">
              Personal Read™
            </div>
            <h2 className="mt-[8px] font-serif text-[clamp(26px,4.4vw,38px)] font-medium leading-[1.05] text-dark">
              {report.fullName}
            </h2>
          </div>
          <div className="text-right font-sans text-[11px] text-dark-soft">
            {report.dateLabel}
          </div>
        </div>

        {/* 01 Personal Data */}
        <SectionHeading num="01" title="Your Personal Data" />
        <div className="mb-[34px] grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[14px]">
          {report.personalData.map((d) => (
            <div key={d.label}>
              <div className="mb-[3px] font-sans text-[9.5px] uppercase tracking-[0.12em] text-dark-soft/80">
                {d.label}
              </div>
              <div className="font-serif text-[17px] leading-tight text-dark">
                {d.value}
              </div>
            </div>
          ))}
        </div>

        {/* 02 Core Numbers */}
        <SectionHeading num="02" title="Your Core Numbers" />
        <div className="mb-[34px] grid grid-cols-[repeat(auto-fit,minmax(155px,1fr))] gap-[10px]">
          {report.coreNumbers.map((c) => (
            <div
              key={c.num}
              className="flex items-center gap-[12px] rounded-[8px] border border-dark/10 bg-cream px-[13px] py-[11px]"
            >
              <span className="flex h-[38px] min-w-[38px] items-center justify-center rounded-full border border-gold-strong/40 font-serif text-[18px] font-semibold text-gold-strong">
                {c.value}
              </span>
              <div className="min-w-0">
                <div className="font-serif text-[15px] font-semibold leading-tight text-dark">
                  {c.name}
                </div>
                <div className="text-[11.5px] leading-tight text-dark-soft">
                  {c.blurb}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 03 Personal Profile */}
        <SectionHeading num="03" title="Your Personal Profile" />
        <div className="space-y-[14px]">
          {report.profile.map((p, i) => (
            <p key={i} className="m-0 text-[14.5px] leading-[1.7] text-dark">
              {p}
            </p>
          ))}
        </div>
      </Page>

      {/* ============================ PAGE TWO ============================ */}
      <Page footer="Page 2 of 2">
        {/* Strengths & blind spots */}
        <div className="mb-[32px] grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[22px]">
          <div>
            <SectionHeading num="04" title="Your Natural Strengths" />
            <ul className="m-0 list-none space-y-[9px] p-0">
              {report.strengths.map((s) => (
                <li key={s} className="flex gap-[10px] text-[14px] leading-[1.5] text-dark">
                  <span className="mt-[7px] h-[7px] w-[7px] flex-none rounded-full bg-gold" />
                  {cap(s)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading num="—" title="Your Blind Spots" />
            <ul className="m-0 list-none space-y-[9px] p-0">
              {report.blindSpots.map((s) => (
                <li key={s} className="flex gap-[10px] text-[14px] leading-[1.5] text-dark-soft">
                  <span className="mt-[7px] h-[7px] w-[7px] flex-none rounded-full border border-gold-strong/60" />
                  {cap(s)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 05 Key Patterns */}
        <SectionHeading num="05" title="Key Patterns" />
        <div className="mb-[32px] space-y-[16px]">
          {report.patterns.map((p) => (
            <div key={p.title}>
              <h4 className="m-0 font-serif text-[18px] font-semibold text-dark">
                {p.title}
              </h4>
              <p className="mt-[5px] text-[14px] leading-[1.65] text-dark-soft">
                {p.body}
              </p>
            </div>
          ))}
        </div>

        {/* 06 Guidance */}
        <SectionHeading num="06" title="Your Guidance" />
        <div className="mb-[32px] space-y-[12px]">
          {report.guidance.map((g, i) => (
            <p key={i} className="m-0 text-[14.5px] leading-[1.7] text-dark">
              {g}
            </p>
          ))}
        </div>

        {/* North Star */}
        <div className="rounded-[10px] border border-gold-strong/30 bg-cream px-[24px] py-[26px] text-center">
          <div className="mb-[12px] font-sans text-[10.5px] font-semibold uppercase tracking-[0.24em] text-gold-strong">
            Your North Star
          </div>
          <p className="m-0 font-serif text-[clamp(18px,3vw,23px)] italic leading-[1.4] text-dark">
            {report.northStar}
          </p>
        </div>

        <p className="mt-[24px] text-center text-[11.5px] leading-[1.6] text-dark-soft/80">
          A gentle reminder: this Read is a personal foundation built from your
          own data — a mirror for reflection, not therapy, diagnosis, or a quick
          fix. Take what resonates, and let it grow with you.
        </p>
      </Page>

      {/* Actions */}
      <div className="flex flex-col items-center gap-[12px] print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-[11px] rounded-full bg-gold px-[34px] py-[16px] font-sans text-[15px] font-semibold text-[#1b1710] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(216,180,120,0.36)]"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path d="M12 3v12" stroke="#1b1710" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 11l5 5 5-5" stroke="#1b1710" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 20h14" stroke="#1b1710" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Download your Personal Read
        </button>
        <span className="inline-flex items-center gap-[8px] text-[13px] text-light-soft">
          <span className="h-[6px] w-[6px] rounded-full bg-gold" />
          Ready now · 2-page PDF · no waiting
        </span>
      </div>
    </div>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
