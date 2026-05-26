import type { ElementCategory } from "@/src/data/elementsData";

/**
 * Accent color OKLCH por categoria, alinhado com a paleta do Universe.
 * Usado para texto/borda/glow nas células e badges.
 */
export const categoryAccent: Record<ElementCategory, string> = {
  "nonmetal":              "oklch(0.74 0.15 145)", /* verde-ciano sereno */
  "noble-gas":             "oklch(0.72 0.14 220)", /* azul frio */
  "alkali-metal":          "oklch(0.78 0.16 80)",  /* dourado quente */
  "alkaline-earth-metal":  "oklch(0.80 0.16 70)",  /* amarelo solar */
  "metalloid":             "oklch(0.70 0.13 200)", /* azul-petróleo */
  "halogen":               "oklch(0.70 0.17 320)", /* magenta */
  "post-transition-metal": "oklch(0.72 0.14 50)",  /* âmbar */
  "transition-metal":      "oklch(0.78 0.04 260)", /* neutro azulado */
  "lanthanide":            "oklch(0.68 0.18 290)", /* roxo primário */
  "actinide":              "oklch(0.62 0.22 305)", /* roxo singularidade */
};

/**
 * Classes Tailwind por categoria — text + hover border + hover glow.
 * Atinge a mesma família visual usando utilitários estáticos do Tailwind.
 */
export const categoryStyles: Record<ElementCategory, string> = {
  "nonmetal":              "text-emerald-200 hover:border-emerald-300/60 hover:shadow-[0_0_18px_rgba(110,231,183,0.25)]",
  "noble-gas":             "text-sky-200 hover:border-sky-300/60 hover:shadow-[0_0_18px_rgba(125,211,252,0.25)]",
  "alkali-metal":          "text-amber-200 hover:border-amber-300/60 hover:shadow-[0_0_18px_rgba(252,211,77,0.25)]",
  "alkaline-earth-metal":  "text-yellow-200 hover:border-yellow-300/60 hover:shadow-[0_0_18px_rgba(253,224,71,0.25)]",
  "metalloid":             "text-teal-200 hover:border-teal-300/60 hover:shadow-[0_0_18px_rgba(94,234,212,0.25)]",
  "halogen":               "text-fuchsia-200 hover:border-fuchsia-300/60 hover:shadow-[0_0_18px_rgba(240,171,252,0.25)]",
  "post-transition-metal": "text-orange-200 hover:border-orange-300/60 hover:shadow-[0_0_18px_rgba(253,186,116,0.25)]",
  "transition-metal":      "text-slate-200 hover:border-slate-300/60 hover:shadow-[0_0_18px_rgba(203,213,225,0.20)]",
  "lanthanide":            "text-violet-200 hover:border-violet-300/60 hover:shadow-[0_0_18px_rgba(196,181,253,0.30)]",
  "actinide":              "text-purple-200 hazard-bg hover:shadow-[0_0_24px_rgba(192,132,252,0.45)]",
};

export const filterCategories: { id: ElementCategory; label: string }[] = [
  { id: "nonmetal", label: "Não Metais" },
  { id: "noble-gas", label: "Gases Nobres" },
  { id: "alkali-metal", label: "Metais Alcalinos" },
  { id: "alkaline-earth-metal", label: "Alcalino-Terrosos" },
  { id: "metalloid", label: "Metaloides" },
  { id: "halogen", label: "Halogênios" },
  { id: "post-transition-metal", label: "Pós-Transição" },
  { id: "transition-metal", label: "Metais de Transição" },
  { id: "lanthanide", label: "Lantanídeos" },
  { id: "actinide", label: "Actinídeos" },
];
