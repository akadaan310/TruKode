"use client";

/* ----------------------------------------------------------------------------
   /admin/orders — Orders dashboard

   There is no order/payment backend yet, so this reads the most recent local
   intake (sessionStorage "ekodz:intake") and surfaces it as a draft order.
   Once checkout + persistence are wired, this table is where real orders land.
--------------------------------------------------------------------------- */

import { useEffect, useMemo, useState } from "react";

type DraftOrder = {
  id: string;
  client: string;
  read: string;
  status: "Draft" | "Awaiting payment" | "In progress" | "Delivered";
  date: string;
  amount: string;
};

function readIntake(): DraftOrder | null {
  try {
    const raw = sessionStorage.getItem("ekodz:intake");
    if (!raw) return null;
    const p = JSON.parse(raw);
    const name = [p.firstName, p.lastName].filter(Boolean).join(" ").trim();
    if (!name) return null;
    return {
      id: "DRAFT-0001",
      client: name,
      read: p.product || "Personal Read™",
      status: "Draft",
      date: "—",
      amount: "—",
    };
  } catch {
    return null;
  }
}

const statusTone: Record<DraftOrder["status"], string> = {
  Draft: "border-light-soft/25 text-light-soft",
  "Awaiting payment": "border-gold/35 text-gold/80",
  "In progress": "border-gold/50 text-gold",
  Delivered: "border-gold/60 text-gold",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<DraftOrder[]>([]);

  useEffect(() => {
    const o = readIntake();
    setOrders(o ? [o] : []);
  }, []);

  const stats = useMemo(
    () => [
      { label: "Total orders", value: orders.length },
      {
        label: "In progress",
        value: orders.filter((o) => o.status === "In progress").length,
      },
      {
        label: "Delivered",
        value: orders.filter((o) => o.status === "Delivered").length,
      },
    ],
    [orders],
  );

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-gold/15 bg-ink-deep/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-[clamp(18px,4vw,36px)] py-4">
          <div>
            <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
              Orders · Admin
            </div>
            <h1 className="mt-1 font-serif text-[26px] font-medium text-light">
              Orders <span className="text-gold">·</span> Reads in the pipeline
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

        {/* ORDERS TABLE */}
        <section className="overflow-hidden rounded-2xl border border-gold/20 bg-ink-soft/40">
          <div className="grid grid-cols-[110px_1fr_1.2fr_150px_90px_90px] gap-4 border-b border-gold/15 px-5 py-3 font-sans text-[11px] uppercase tracking-[0.12em] text-light-soft">
            <span>Order</span>
            <span>Client</span>
            <span>Read</span>
            <span>Status</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
          </div>

          {orders.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="font-serif text-[20px] text-light-soft">
                No orders yet.
              </p>
              <p className="mx-auto mt-2 max-w-[420px] font-sans text-[13px] leading-relaxed text-light-soft/70">
                Orders will appear here once checkout and persistence are
                connected. Any in-progress intake started on this device will
                show as a draft.
              </p>
            </div>
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                className="grid grid-cols-[110px_1fr_1.2fr_150px_90px_90px] items-center gap-4 border-b border-gold/[0.08] px-5 py-4 last:border-b-0"
              >
                <span className="font-mono text-[12.5px] text-light-soft">
                  {o.id}
                </span>
                <span className="font-sans text-[14px] text-light">
                  {o.client}
                </span>
                <span className="font-sans text-[14px] text-light-soft">
                  {o.read}
                </span>
                <span>
                  <span
                    className={`inline-block rounded-full border px-[10px] py-[3px] font-sans text-[10.5px] uppercase tracking-[0.06em] ${statusTone[o.status]}`}
                  >
                    {o.status}
                  </span>
                </span>
                <span className="font-sans text-[13px] text-light-soft">
                  {o.date}
                </span>
                <span className="text-right font-sans text-[14px] text-light">
                  {o.amount}
                </span>
              </div>
            ))
          )}
        </section>

        <p className="mt-6 font-sans text-[12.5px] leading-relaxed text-light-soft/70">
          <strong className="text-light-soft">Note.</strong> This view is a
          scaffold — it currently reflects local intake state only. Wire it to
          the orders store to show real purchases, statuses, and fulfillment.
        </p>
      </main>
    </div>
  );
}
