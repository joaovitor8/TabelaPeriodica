"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Radar, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { elements, elementByZ, type ChemicalElement } from "@/src/data/elementsData";
import { pickLocale, useLocale, useT } from "@/src/lib/i18n";
import { useElementFilter } from "@/src/hooks/useElementFilter";
import { useSelectedSync } from "@/src/hooks/useSelectedSync";
import { useIsMac } from "@/src/hooks/useIsMac";
import { elementOfDay } from "@/src/utils/elementOfDay";
import { COSMIC_TINT } from "@/src/utils/cosmicMeta";
import { categoryAccent } from "@/src/utils/tableConstants";

import { ElementCell } from "./ElementCell";
import { ElementModal } from "./ElementModal";
import { ScannerPanel } from "./ScannerPanel";
import { CosmicTimeline } from "./CosmicTimeline";
import { CommandPalette } from "./CommandPalette";
import { CompareDrawer } from "./CompareDrawer";
import { CompareModal } from "./CompareModal";
import { StardustIntro, StardustChip } from "./StardustMode";

export default function PeriodicTable() {
  const t = useT();
  const { locale } = useLocale();
  const filter = useElementFilter();
  const isMac = useIsMac();
  const shortcutLabel = isMac ? "⌘K" : "Ctrl+K";

  const [selected, setSelected] = useState<ChemicalElement | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [stardustState, setStardustState] = useState<"off" | "intro" | "active">("off");
  const [eod, setEod] = useState<ChemicalElement | null>(null);

  useSelectedSync(selected, setSelected);

  // EOD hidrata só no client pra evitar mismatch
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEod(elementOfDay()));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Atalho ⌘K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isPaletteShortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isPaletteShortcut) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeFilters = () => {
    setShowFilters(false);
    filter.clear();
  };

  const openFromTimeline = (el: ChemicalElement) => {
    setShowTimeline(false);
    setSelected(el);
  };

  const navigateElement = useCallback((delta: number) => {
    setSelected((cur) => {
      if (!cur) return cur;
      return elementByZ(cur.number + delta) ?? cur;
    });
  }, []);

  const enterStardust = () => {
    filter.clear();
    setShowFilters(false);
    setStardustState("active");
  };

  const exitStardust = () => setStardustState("off");

  const openStardustIntro = () => {
    if (stardustState === "active") {
      exitStardust();
      return;
    }
    setStardustState("intro");
  };

  const stardustActive = stardustState === "active";
  const eodSymbol = eod?.symbol;
  const eodName = eod ? pickLocale(eod.name, eod.nameEn, locale) : "";
  const eodAccent = eod ? categoryAccent[eod.category] : undefined;

  const cellStardustTint = useMemo(() => {
    if (!stardustActive) return null;
    return (el: ChemicalElement) =>
      el.cosmicOrigin ? COSMIC_TINT[el.cosmicOrigin] : "oklch(0.65 0.02 260)";
  }, [stardustActive]);

  function isStardustHidden(el: ChemicalElement): boolean {
    if (!stardustActive) return false;
    return !el.abundance?.humanBody || el.abundance.humanBody <= 0;
  }

  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-4rem)] px-2 sm:px-4 lg:px-8 py-4 relative">
      {/* Title strip + controls */}
      <div className="w-full max-w-[95vw] lg:max-w-[85vw] flex items-center justify-between mb-4 z-30 gap-3">
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[color:var(--primary)] opacity-70">
            {t("table.range")}
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.15em] uppercase">
            {t("nav.brand")}
          </h1>
          {eod && eodSymbol && (
            <button
              onClick={() => setSelected(eod)}
              className="mt-1.5 inline-flex items-center gap-2 self-start px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-[0.2em] hover:scale-[1.03] transition-transform"
              style={{
                color: eodAccent,
                borderColor: (eodAccent ?? "var(--primary)") + "55",
                background: `color-mix(in oklch, ${eodAccent ?? "var(--primary)"} 10%, transparent)`,
              }}
              title={eodName}
            >
              <Sparkles className="w-3 h-3" />
              <span className="opacity-70">{t("eod.label")}:</span>
              <span className="font-bold">{eodSymbol}</span>
            </button>
          )}
        </motion.div>

        <div className="flex items-center gap-2">
          {stardustActive && <StardustChip onExit={exitStardust} />}

          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 font-mono text-xs uppercase rounded-full border border-white/15 text-white/60 hover:border-[color:var(--primary)]/60 hover:text-[color:var(--primary)] bg-black/30 transition-all"
            title={`${t("palette.openHint")} (${shortcutLabel})`}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">{t("palette.openHint")}</span>
            <kbd className="hidden md:inline text-[9px] px-1.5 py-0.5 rounded border border-white/10 text-white/50">
              {shortcutLabel}
            </kbd>
          </button>

          <button
            onClick={openStardustIntro}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 font-mono text-xs uppercase rounded-full border transition-all ${
              stardustActive
                ? "border-[color:var(--primary)] text-[color:var(--primary)] bg-[color:var(--primary)]/10"
                : "border-white/15 text-white/60 hover:border-[color:var(--primary)]/60 hover:text-[color:var(--primary)] bg-black/30"
            }`}
            title={t("stardust.button")}
          >
            <Sparkles className={`w-4 h-4 ${stardustActive ? "animate-hud-pulse" : ""}`} />
            <span className="hidden sm:inline">{t("stardust.button")}</span>
          </button>

          <button
            onClick={() => setShowTimeline(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 font-mono text-xs uppercase rounded-full border border-white/15 text-white/60 hover:border-[color:var(--primary)]/60 hover:text-[color:var(--primary)] bg-black/30 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">{t("timeline.open")}</span>
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            disabled={stardustActive}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 font-mono text-xs uppercase rounded-full border transition-all duration-300 ${
              stardustActive
                ? "opacity-40 cursor-not-allowed border-white/10 text-white/30"
                : showFilters || filter.isActive
                ? "border-[color:var(--primary)] text-[color:var(--primary)] bg-[color:var(--primary)]/10 shadow-[0_0_18px_oklch(0.60_0.18_290_/_0.30)]"
                : "border-white/15 text-white/60 hover:border-white/40 hover:text-white bg-black/30"
            }`}
          >
            <Radar className={`w-4 h-4 ${filter.isActive ? "animate-spin-slow" : ""}`} />
            <span className="hidden sm:inline">{t("scanner.title")}</span>
          </button>
        </div>
      </div>

      <ScannerPanel showFilters={showFilters && !stardustActive} filter={filter} onClose={closeFilters} />

      {/* GRID DA TABELA */}
      <div
        className="relative shrink-0 z-10"
        style={{
          width: "min(100%, calc((100vh - 12rem) * 1.8))",
          aspectRatio: "18 / 10",
        }}
      >
        <div
          className="absolute inset-0 grid gap-0.5 sm:gap-1"
          style={{
            gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
            gridTemplateRows: "repeat(10, minmax(0, 1fr))",
          }}
        >
          {elements.map((el) => (
            <ElementCell
              key={el.number}
              element={el}
              dimmed={isStardustHidden(el) || filter.isDimmed(el)}
              onClick={setSelected}
              pulse={eod?.number === el.number}
              tintOverride={cellStardustTint ? cellStardustTint(el) : undefined}
            />
          ))}
        </div>
      </div>

      <ElementModal
        selected={selected}
        onClose={() => setSelected(null)}
        onNavigate={navigateElement}
      />
      <CosmicTimeline
        open={showTimeline}
        onClose={() => setShowTimeline(false)}
        onSelect={openFromTimeline}
      />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelect={setSelected}
      />
      <CompareDrawer onOpenCompare={() => setCompareOpen(true)} />
      <CompareModal open={compareOpen} onClose={() => setCompareOpen(false)} />
      <StardustIntro
        open={stardustState === "intro"}
        onEnter={enterStardust}
        onClose={() => setStardustState("off")}
      />
    </div>
  );
}
