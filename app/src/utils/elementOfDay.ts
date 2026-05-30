import { elements, type ChemicalElement } from "@/src/data/elementsData";

function hashYmd(ymd: string): number {
  let h = 2166136261;
  for (let i = 0; i < ymd.length; i++) {
    h ^= ymd.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h >>> 0;
}

function localYmd(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function elementOfDay(date: Date = new Date()): ChemicalElement {
  const idx = hashYmd(localYmd(date)) % elements.length;
  return elements[idx];
}
