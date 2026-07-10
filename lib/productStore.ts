"use client";

/* ============================================================================
   Ekodz — Product / Report configuration store

   The spec-derived catalog in lib/products.ts is the immutable DEFAULT. Admin
   edits are stored as a sparse override map in localStorage and deep-merged
   over the defaults at read time, so:
     · "Reset to spec default" is always possible (delete the override).
     · New products/sections added to the catalog appear automatically.
     · Edits survive reloads without any backend.

   Persistence key: "ekodz:product-config".
   The store notifies subscribers so multiple mounted editors stay in sync.
   ========================================================================== */

import { useSyncExternalStore, useCallback } from "react";
import { PRODUCTS, getProduct, type Product, type ReportSection } from "./products";

const KEY = "ekodz:product-config";

/** Sparse, JSON-serializable override tree keyed by product id. */
type Overrides = Record<string, DeepPartial<Product>>;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? U extends object
      ? DeepPartial<U>[] // arrays stored whole once edited
      : T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

/* -------------------------------------------------------------------------- */
/*  In-memory cache + subscriptions                                           */
/* -------------------------------------------------------------------------- */

let cache: Overrides | null = null;
const listeners = new Set<() => void>();

function read(): Overrides {
  if (cache) return cache;
  if (typeof window === "undefined") return (cache = {});
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as Overrides) : {};
  } catch {
    cache = {};
  }
  return cache!;
}

function write(next: Overrides) {
  cache = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* quota / private mode — keep in-memory only */
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* Cross-tab sync. */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      cache = null;
      listeners.forEach((l) => l());
    }
  });
}

/* -------------------------------------------------------------------------- */
/*  Merge                                                                      */
/* -------------------------------------------------------------------------- */

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep-merge overrides onto a base product. Arrays are replaced wholesale. */
function mergeProduct(base: Product, ov?: DeepPartial<Product>): Product {
  if (!ov) return base;
  const out = { ...base } as Record<string, unknown>;
  for (const [k, v] of Object.entries(ov)) {
    if (v === undefined) continue;
    const cur = out[k];
    if (isPlainObject(v) && isPlainObject(cur)) {
      out[k] = { ...cur, ...v };
    } else {
      out[k] = v;
    }
  }
  return out as Product;
}

/* -------------------------------------------------------------------------- */
/*  Public read helpers                                                        */
/* -------------------------------------------------------------------------- */

/** Effective product = spec default + admin overrides. */
export function effectiveProduct(id: string): Product | undefined {
  const base = getProduct(id);
  if (!base) return undefined;
  return mergeProduct(base, read()[id]);
}

export function effectiveProducts(): Product[] {
  const ov = read();
  return PRODUCTS.map((p) => mergeProduct(p, ov[p.id]));
}

export function isCustomized(id: string): boolean {
  const o = read()[id];
  return !!o && Object.keys(o).length > 0;
}

/* -------------------------------------------------------------------------- */
/*  Mutations                                                                  */
/* -------------------------------------------------------------------------- */

/** Patch top-level product fields (specs, prices, brand copy, ai, …). */
export function patchProduct(id: string, patch: DeepPartial<Product>) {
  const all = { ...read() };
  const prev = all[id] ?? {};
  all[id] = mergeOverride(prev, patch);
  write(all);
}

/** Merge a patch into an existing override, deep for plain objects. */
function mergeOverride(
  prev: DeepPartial<Product>,
  patch: DeepPartial<Product>,
): DeepPartial<Product> {
  const out = { ...prev } as Record<string, unknown>;
  for (const [k, v] of Object.entries(patch)) {
    const cur = out[k];
    if (isPlainObject(v) && isPlainObject(cur)) {
      out[k] = { ...cur, ...v };
    } else {
      out[k] = v;
    }
  }
  return out as DeepPartial<Product>;
}

/** Replace a single report section (by id) with a patched copy. */
export function patchSection(
  productId: string,
  sectionId: string,
  patch: Partial<ReportSection>,
) {
  const product = effectiveProduct(productId);
  if (!product) return;
  const sections = product.sections.map((s) =>
    s.id === sectionId ? { ...s, ...patch } : s,
  );
  patchProduct(productId, { sections });
}

/** Restore a product to its exact spec default. */
export function resetProduct(id: string) {
  const all = { ...read() };
  delete all[id];
  write(all);
}

/** Restore every product to spec default. */
export function resetAll() {
  write({});
}

/* -------------------------------------------------------------------------- */
/*  React hooks                                                                */
/* -------------------------------------------------------------------------- */

/** Subscribe to the whole catalog (effective values). */
export function useProducts(): Product[] {
  const snap = useSyncExternalStore(subscribe, () => read(), () => read());
  // read() returns the override map; recompute effective list off it.
  void snap;
  return effectiveProducts();
}

/** Subscribe to one product's effective config + mutation helpers. */
export function useProduct(id: string) {
  const get = useCallback(() => read(), []);
  useSyncExternalStore(subscribe, get, get);
  const product = effectiveProduct(id);
  const customized = isCustomized(id);

  const patch = useCallback((p: DeepPartial<Product>) => patchProduct(id, p), [id]);
  const setSection = useCallback(
    (sectionId: string, p: Partial<ReportSection>) =>
      patchSection(id, sectionId, p),
    [id],
  );
  const reset = useCallback(() => resetProduct(id), [id]);

  return { product, customized, patch, setSection, reset };
}
