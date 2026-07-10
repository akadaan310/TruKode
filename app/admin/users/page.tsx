"use client";

/* ----------------------------------------------------------------------------
   /admin/users — Users dashboard

   No user backend yet. Reads the most recent local intake
   (sessionStorage "ekodz:intake") and surfaces that client as a user record.
   Once accounts/persistence are wired, this table is where real clients land.
--------------------------------------------------------------------------- */

import { useEffect, useMemo, useState } from "react";

type UserRow = {
  id: string;
  name: string;
  dob: string;
  location: string;
  reads: number;
};

function readIntake(): UserRow | null {
  try {
    const raw = sessionStorage.getItem("ekodz:intake");
    if (!raw) return null;
    const p = JSON.parse(raw);
    const name = [p.firstName, p.middleName, p.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (!name) return null;
    const location = [p.placeOfBirth, p.country].filter(Boolean).join(", ");
    return {
      id: "USR-0001",
      name,
      dob: p.dob || "—",
      location: location || "—",
      reads: 0,
    };
  } catch {
    return null;
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    const u = readIntake();
    setUsers(u ? [u] : []);
  }, []);

  const stats = useMemo(
    () => [
      { label: "Total users", value: users.length },
      {
        label: "With reads",
        value: users.filter((u) => u.reads > 0).length,
      },
      { label: "New this week", value: users.length },
    ],
    [users],
  );

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-gold/15 bg-ink-deep/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-[clamp(18px,4vw,36px)] py-4">
          <div>
            <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
              Users · Admin
            </div>
            <h1 className="mt-1 font-serif text-[26px] font-medium text-light">
              Users <span className="text-gold">·</span> Clients &amp; intakes
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-[clamp(18px,4vw,36px)] py-8">
        {/* STAT CARDS */}
        <section className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gold/20 bg-ink-soft/50 p-[clamp(16px,2.5vw,22px)]"
            >
              <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-light-soft">
                {s.label}
              </div>
              <div className="mt-2 font-serif text-[38px] leading-none text-gold">
                {s.value}
              </div>
            </div>
          ))}
        </section>

        {/* USERS TABLE */}
        <section className="overflow-hidden rounded-2xl border border-gold/20 bg-ink-soft/40">
          <div className="grid grid-cols-[110px_1.4fr_130px_1.2fr_90px] gap-4 border-b border-gold/15 px-5 py-3 font-sans text-[11px] uppercase tracking-[0.12em] text-light-soft">
            <span>ID</span>
            <span>Name</span>
            <span>Date of birth</span>
            <span>Birthplace</span>
            <span className="text-right">Reads</span>
          </div>

          {users.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="font-serif text-[20px] text-light-soft">
                No users yet.
              </p>
              <p className="mx-auto mt-2 max-w-[420px] font-sans text-[13px] leading-relaxed text-light-soft/70">
                Clients will appear here once accounts and persistence are
                connected. Any intake started on this device will show as a
                record.
              </p>
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-[110px_1.4fr_130px_1.2fr_90px] items-center gap-4 border-b border-gold/[0.08] px-5 py-4 last:border-b-0"
              >
                <span className="font-mono text-[12.5px] text-light-soft">
                  {u.id}
                </span>
                <span className="font-sans text-[14px] text-light">
                  {u.name}
                </span>
                <span className="font-sans text-[13px] text-light-soft">
                  {u.dob}
                </span>
                <span className="font-sans text-[14px] text-light-soft">
                  {u.location}
                </span>
                <span className="text-right font-sans text-[14px] text-light">
                  {u.reads}
                </span>
              </div>
            ))
          )}
        </section>

        <p className="mt-6 font-sans text-[12.5px] leading-relaxed text-light-soft/70">
          <strong className="text-light-soft">Note.</strong> This view is a
          scaffold — it currently reflects local intake state only. Wire it to
          the user store to show real accounts, their reads, and history.
        </p>
      </main>
    </div>
  );
}
