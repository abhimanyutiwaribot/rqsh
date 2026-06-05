import type { KVPair } from "../types/request.js";

export function buildUrl(base: string, params: KVPair[]): string {
  const active = params.filter(p => p.key.trim());
  if (!active.length) return base;
  const qs = active.map(p =>
    `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`
  ).join("&");
  return base.includes("?") ? `${base}&${qs}` : `${base}?${qs}`;
}