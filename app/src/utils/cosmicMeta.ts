import {
  Atom,
  Disc,
  Flame,
  FlaskConical,
  Sparkles,
  Star,
  Sun,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { CosmicOrigin } from "@/src/data/elementsData";

/** Ordem cronológica cósmica: do Big Bang à criação humana. */
export const COSMIC_ORIGIN_ORDER: CosmicOrigin[] = [
  "big-bang",
  "cosmic-ray-spallation",
  "stellar-fusion-low",
  "stellar-fusion-high",
  "supernova",
  "neutron-star-merger",
  "white-dwarf-explosion",
  "human-made",
];

export const COSMIC_ICON: Record<CosmicOrigin, LucideIcon> = {
  "big-bang": Sparkles,
  "cosmic-ray-spallation": Zap,
  "stellar-fusion-low": Sun,
  "stellar-fusion-high": Flame,
  "supernova": Star,
  "neutron-star-merger": Atom,
  "white-dwarf-explosion": Disc,
  "human-made": FlaskConical,
};

export const COSMIC_TINT: Record<CosmicOrigin, string> = {
  "big-bang": "oklch(0.85 0.14 90)",
  "cosmic-ray-spallation": "oklch(0.72 0.16 200)",
  "stellar-fusion-low": "oklch(0.78 0.16 80)",
  "stellar-fusion-high": "oklch(0.70 0.19 40)",
  "supernova": "oklch(0.65 0.22 25)",
  "neutron-star-merger": "oklch(0.62 0.22 305)",
  "white-dwarf-explosion": "oklch(0.72 0.14 220)",
  "human-made": "oklch(0.74 0.15 145)",
};

/**
 * Idade aproximada do universo (em anos) quando cada origem começa a produzir elementos
 * de forma significativa. Big Bang ≈ 0 (3 minutos após); hoje ≈ 1.38e10.
 */
export const COSMIC_ORIGIN_YEAR: Record<CosmicOrigin, number> = {
  "big-bang": 5.7e-6,           // ~3 minutos
  "cosmic-ray-spallation": 2e8, // após primeiras estrelas iluminarem o cosmos
  "stellar-fusion-low": 2e8,    // primeiras estrelas baixa massa
  "stellar-fusion-high": 2e8,   // primeiras estrelas massivas
  "supernova": 2.1e8,           // primeiras massivas morrem (~1-10 Myr)
  "neutron-star-merger": 5e8,   // precisa de remanescentes binários
  "white-dwarf-explosion": 1e9, // anãs brancas levam mais tempo a explodir
  "human-made": 1.38e10,        // ~1942 (Projeto Manhattan)
};

export const UNIVERSE_AGE_YEARS = 1.38e10;

/** Formata uma idade cósmica (anos desde o Big Bang) em texto legível PT/EN. */
export function formatCosmicAge(years: number, locale: "pt" | "en" = "pt"): string {
  const ptUnits = {
    minutes: "minutos",
    millions: "milhões de anos",
    billions: "bilhões de anos",
  };
  const enUnits = {
    minutes: "minutes",
    millions: "million years",
    billions: "billion years",
  };
  const u = locale === "en" ? enUnits : ptUnits;

  if (years < 1) {
    const m = Math.round(years * 525600);
    return `${m} ${u.minutes}`;
  }
  if (years < 1e9) {
    return `${(years / 1e6).toFixed(0)} ${u.millions}`;
  }
  return `${(years / 1e9).toFixed(2)} ${u.billions}`;
}
