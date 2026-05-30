"use client";

import { useState } from "react";
import { Volume2, VolumeX, Waves } from "lucide-react";

import type { ChemicalElement } from "@/src/data/elementsData";
import { playSpectralLines, playZTone } from "@/src/lib/audio";
import { useSoundEnabled } from "@/src/hooks/useSoundEnabled";
import { useT } from "@/src/lib/i18n";

interface ElementSoundButtonProps {
  element: ChemicalElement;
  accent: string;
}

export function ElementSoundButton({ element, accent }: ElementSoundButtonProps) {
  const t = useT();
  const { enabled, setEnabled } = useSoundEnabled();
  const [pulsing, setPulsing] = useState(false);

  const hasLines = Boolean(element.spectralLines && element.spectralLines.length > 0);
  const mode = hasLines ? "spectrum" : "ztone";
  const label = enabled
    ? hasLines
      ? t("audio.playSpectrum")
      : t("audio.playZ")
    : t("audio.enableToPlay");

  function onClick() {
    if (!enabled) {
      // Primeiro clique: liga o som global E toca já (o gesto do user destrava o context)
      setEnabled(true);
    }
    setPulsing(true);
    window.setTimeout(() => setPulsing(false), 1800);
    if (mode === "spectrum" && element.spectralLines) {
      void playSpectralLines(element.spectralLines);
    } else {
      void playZTone(element.number);
    }
  }

  const Icon = enabled ? (mode === "spectrum" ? Waves : Volume2) : VolumeX;

  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-[0.25em] transition-all hover:scale-[1.03] active:scale-95 ${
        enabled ? "" : "opacity-80"
      }`}
      style={{
        color: accent,
        borderColor: accent + (enabled ? "70" : "30"),
        background: `color-mix(in oklch, ${accent} ${enabled ? 12 : 6}%, transparent)`,
        boxShadow: pulsing ? `0 0 22px ${accent}88` : undefined,
      }}
    >
      <Icon className={`w-3.5 h-3.5 ${pulsing ? "animate-hud-pulse" : ""}`} />
      <span>{enabled ? t("audio.play") : t("audio.enable")}</span>
    </button>
  );
}
