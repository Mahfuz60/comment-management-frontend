export type SortMode = "newest" | "mostLiked" | "mostDisliked";

export function clampInt(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function parseQueryInt(v: string | null, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export function parseSort(v: string | null, fallback: SortMode): SortMode {
  if (v === "newest" || v === "mostLiked" || v === "mostDisliked") return v;
  return fallback;
}
