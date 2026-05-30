"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Droplet, ExternalLink, Heart, Mountain, Pin, PinOff, Sparkles, Wind, X, type LucideIcon } from "lucide-react";

import { type AbundanceProfile, type ChemicalElement, elementByZ } from "@/src/data/elementsData";

import { categoryAccent } from "@/src/utils/tableConstants";
import { COSMIC_ICON } from "@/src/utils/cosmicMeta";
import { BIOLOGY_ICON, BIOLOGY_TINT } from "@/src/utils/bioMeta";
import { pickLocale, useLocale, type DictKey } from "@/src/lib/i18n";
import { useElementDetails } from "@/src/hooks/useElementDetails";
import { usePinned } from "@/src/hooks/usePinned";

import { HudPanel } from "./hub/HudPanel";
import { TelemetrySpinner } from "./hub/TelemetrySpinner";
import { CommsFailure } from "./hub/CommsFailure";
import { FlamePreview } from "./FlamePreview";
import { SpectrumBar } from "./SpectrumBar";
import { ElementSoundButton } from "./ElementSoundButton";

interface ElementModalProps {
  selected: ChemicalElement | null;
  onClose: () => void;
  onNavigate?: (delta: number) => void;
}

/** Normaliza ppm para 0..1 numa escala logarítmica. Total = 10^6 ppm = 100%. */
function logRatio(ppm: number | null | undefined): number {
  if (ppm == null || ppm <= 0) return 0;
  const r = Math.log10(ppm + 1) / 6.5;
  return Math.max(0, Math.min(1, r));
}

/** Formata ppm para texto curto e legível. */
function formatPpm(ppm: number | null | undefined): string {
  if (ppm == null) return "—";
  if (ppm === 0) return "0";
  const pct = ppm / 10000; // ppm → %
  if (pct >= 1) return `${pct.toFixed(0)}%`;
  if (pct >= 0.01) return `${pct.toFixed(2)}%`;
  if (ppm >= 1) return `${ppm.toFixed(0)} ppm`;
  if (ppm >= 0.001) return `${ppm.toFixed(3)} ppm`;
  return `${ppm.toExponential(1)} ppm`;
}

export function ElementModal({ selected, onClose, onNavigate }: ElementModalProps) {
  const { t, locale } = useLocale();
  const { isPinned, isFull, toggle } = usePinned();

  useEffect(() => {
    if (!selected || !onNavigate) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onNavigate?.(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onNavigate?.(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, onNavigate]);

  if (!selected) return null;

  const accent = categoryAccent[selected.category];
  const codename = `EL-${selected.number.toString().padStart(3, "0")}`;
  const name = pickLocale(selected.name, selected.nameEn, locale);
  const summary = pickLocale(selected.summary, selected.summaryEn, locale);
  const pinned = isPinned(selected.number);
  const pinDisabled = !pinned && isFull;
  const pinLabel = pinned ? t("compare.unpin") : pinDisabled ? t("compare.full") : t("compare.pin");
  const PinIcon = pinned ? PinOff : Pin;
  const hasPrev = Boolean(elementByZ(selected.number - 1));
  const hasNext = Boolean(elementByZ(selected.number + 1));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
        onClick={onClose}
        style={{ "--cat-accent": accent } as React.CSSProperties}
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="relative w-full max-w-5xl my-8 rounded-2xl border border-white/10 bg-(--card)/90 backdrop-blur-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {onNavigate && hasPrev && (
            <button
              onClick={() => onNavigate(-1)}
              title={t("modal.prev")}
              aria-label={t("modal.prev")}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-3 pl-1 h-16 items-center text-white/40 hover:text-(--cat-accent) transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {onNavigate && hasNext && (
            <button
              onClick={() => onNavigate(1)}
              title={t("modal.next")}
              aria-label={t("modal.next")}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-3 pr-1 h-16 items-center text-white/40 hover:text-(--cat-accent) transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
          {/* Header strip */}
          <div className="flex items-start justify-between p-5 sm:p-6 border-b border-white/6">
            <div className="flex flex-col gap-1">
              <span
                className="font-mono text-[10px] tracking-[0.35em] uppercase"
                style={{ color: accent }}
              >
                {codename}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl tracking-widest uppercase">
                {name}
              </h2>
              <span
                className="font-mono text-[10px] tracking-[0.2em] uppercase mt-1 inline-block px-2 py-0.5 rounded-sm border w-fit"
                style={{
                  color: accent,
                  borderColor: accent + "55",
                  background: `color-mix(in oklch, ${accent} 10%, transparent)`,
                }}
              >
                {t(`category.${selected.category}` as DictKey)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ElementSoundButton element={selected} accent={accent} />
              <button
                onClick={() => toggle(selected)}
                disabled={pinDisabled}
                title={pinLabel}
                aria-label={pinLabel}
                className={`p-2 rounded-full transition-all ${
                  pinDisabled
                    ? "text-white/20 cursor-not-allowed"
                    : pinned
                    ? "text-(--cat-accent) bg-(--cat-accent)/15"
                    : "text-white/50 hover:text-white hover:bg-white/8"
                }`}
                style={pinned ? { color: accent, background: `color-mix(in oklch, ${accent} 15%, transparent)` } : undefined}
              >
                <PinIcon className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors p-1"
                aria-label={t("modal.close")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 p-5 sm:p-6">
            {/* Left: 3D atom + summary */}
            <div className="flex flex-col items-center md:items-start gap-4 md:w-64">
              <div
                className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center atom-container shrink-0"
                style={{ color: accent }}
              >
                <div
                  className="orbit orbit-1 opacity-60"
                  style={{ animationDuration: `${Math.max(1.5, 8 - selected.number * 0.05)}s` }}
                />
                <div
                  className="orbit orbit-2 opacity-60"
                  style={{ animationDuration: `${Math.max(2, 10 - selected.number * 0.05)}s` }}
                />
                <div
                  className="orbit orbit-3 opacity-60"
                  style={{ animationDuration: `${Math.max(2.5, 12 - selected.number * 0.05)}s` }}
                />

                <div
                  className="relative z-10 flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black/50 backdrop-blur-md border"
                  style={{
                    borderColor: accent + "40",
                    boxShadow: `0 0 30px ${accent}33 inset`,
                  }}
                >
                  <span className="font-mono text-xs opacity-70 -mb-1">{selected.number}</span>
                  <span
                    className="text-4xl sm:text-5xl font-bold"
                    style={{ filter: `drop-shadow(0 0 12px ${accent})` }}
                  >
                    {selected.symbol}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {summary}
              </p>
            </div>

            {/* Right: HUD panels */}
            <div className="flex flex-col gap-4">
              <CosmicOriginPanel element={selected} />
              <AbundancePanel abundance={selected.abundance} t={t} />
              <SpectralSignaturePanel element={selected} locale={locale} t={t} />
              <BiologyPanel element={selected} locale={locale} t={t} />
            </div>
          </div>

          {/* Footer telemetry */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px border-t border-white/6 bg-white/2">
            <TelemetryCell label={t("modal.discoveredBy")} value={selected.discoveredBy ?? "—"} />
            <TelemetryCell
              label={t("modal.year")}
              value={
                selected.discoveryYear === "ancient"
                  ? t("modal.year.ancient")
                  : selected.discoveryYear?.toString() ?? "—"
              }
            />
            <TelemetryCell label={t("modal.column")} value={selected.column.toString()} />
            <TelemetryCell label={t("modal.row")} value={selected.row.toString()} />
          </div>

          {/* Dossiê estendido (Wikipédia, on-demand) */}
          <ExtendedDetails key={selected.number} element={selected} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Dossiê estendido via API ────────────────────────────────── */

function ExtendedDetails({ element }: { element: ChemicalElement }) {
  const { t } = useLocale();
  const [show, setShow] = useState(false);
  const { data, isLoading, isError, refetch } = useElementDetails(element, show);

  if (!show) {
    return (
      <div className="flex justify-end p-4">
        <button
          onClick={() => setShow(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-(--cat-accent)/40 text-(--cat-accent) hover:bg-(--cat-accent)/10 text-[10px] font-mono uppercase tracking-[0.25em] transition-all hover:scale-[1.03]"
        >
          <ExternalLink className="w-3.5 h-3.5" /> {t("modal.moreDetails")}
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 pt-0">
      <HudPanel label={t("details.panel")}>
        {isLoading && (
          <TelemetrySpinner label={t("details.via").toUpperCase()} phases={[t("modal.loading")]} />
        )}
        {isError && (
          <CommsFailure
            message={t("modal.error")}
            onRetry={() => refetch()}
            retryLabel={t("common.retry")}
          />
        )}
        {data && (
          <div className="flex flex-col sm:flex-row gap-4">
            {data.thumbnail && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={data.thumbnail}
                alt={data.title}
                className="w-24 h-24 object-cover rounded-lg border border-white/10 shrink-0 self-start"
              />
            )}
            <div className="flex flex-col gap-2">
              <p className="text-sm text-(--foreground)/85 leading-relaxed">
                {data.extract || t("details.empty")}
              </p>
              <div className="flex items-center gap-3">
                {data.pageUrl && (
                  <a
                    href={data.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-(--cat-accent) hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> {t("details.readMore")}
                  </a>
                )}
                <span className="text-[10px] font-mono text-(--muted-foreground)/60">
                  {t("details.via")}
                </span>
              </div>
            </div>
          </div>
        )}
      </HudPanel>
    </div>
  );
}

/* ─── Sub-panels ──────────────────────────────────────────────── */

function CosmicOriginPanel({ element }: { element: ChemicalElement }) {
  const { t, locale } = useLocale();
  const accent = categoryAccent[element.category];

  if (!element.cosmicOrigin) {
    return (
      <HudPanel label={t("modal.cosmicOrigin")}>
        <p className="text-sm text-muted-foreground italic">{t("common.unknown")}</p>
      </HudPanel>
    );
  }

  const Icon = COSMIC_ICON[element.cosmicOrigin];
  const originLabel = t(`origin.${element.cosmicOrigin}` as DictKey);
  const note = pickLocale(element.cosmicOriginNote ?? "", element.cosmicOriginNoteEn, locale);

  return (
    <HudPanel label={t("modal.cosmicOrigin")}>
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border"
          style={{
            color: accent,
            borderColor: accent + "40",
            background: `color-mix(in oklch, ${accent} 8%, transparent)`,
            boxShadow: `0 0 18px ${accent}33`,
          }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase" style={{ color: accent }}>
            {originLabel}
          </span>
          {note && (
            <p className="text-sm text-(--foreground)/85 leading-relaxed">{note}</p>
          )}
        </div>
      </div>
    </HudPanel>
  );
}

interface AbundancePanelProps {
  abundance: AbundanceProfile | undefined;
  t: (k: DictKey) => string;
}

function AbundancePanel({ abundance, t }: AbundancePanelProps) {
  const rows: { key: keyof AbundanceProfile; label: string; icon: LucideIcon }[] = [
    { key: "universe", label: t("modal.abundance.universe"), icon: Sparkles },
    { key: "earthCrust", label: t("modal.abundance.crust"), icon: Mountain },
    { key: "earthAtmosphere", label: t("modal.abundance.atmosphere"), icon: Wind },
    { key: "earthOcean", label: t("modal.abundance.ocean"), icon: Droplet },
    { key: "humanBody", label: t("modal.abundance.body"), icon: Heart },
  ];

  if (!abundance) {
    return (
      <HudPanel label={t("modal.abundance")}>
        <p className="text-sm text-muted-foreground italic">{t("common.unknown")}</p>
      </HudPanel>
    );
  }

  return (
    <HudPanel label={t("modal.abundance")}>
      <div className="flex flex-col gap-2">
        {rows.map(({ key, label, icon: Icon }) => {
          const value = abundance[key];
          const ratio = logRatio(value);
          return (
            <div key={key} className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 w-28 shrink-0">
                <Icon className="w-3 h-3 text-(--muted-foreground)/60" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] ext-muted-foreground">
                  {label}
                </span>
              </div>
              <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ratio * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--cat-accent) 0%, color-mix(in oklch, var(--cat-accent) 60%, transparent) 100%)",
                    boxShadow: ratio > 0 ? "0 0 8px var(--cat-accent)" : undefined,
                  }}
                />
              </div>
              <span className="font-mono text-[11px] tabular-nums text-(--foreground)/80 w-20 text-right shrink-0">
                {formatPpm(value)}
              </span>
            </div>
          );
        })}
      </div>
    </HudPanel>
  );
}

interface BiologyPanelProps {
  element: ChemicalElement;
  locale: "pt" | "en";
  t: (k: DictKey) => string;
}

interface SpectralPanelProps {
  element: ChemicalElement;
  locale: "pt" | "en";
  t: (k: DictKey) => string;
}

function SpectralSignaturePanel({ element, locale, t }: SpectralPanelProps) {
  const hasFlame = Boolean(element.flameColor);
  const hasLines = Boolean(element.spectralLines && element.spectralLines.length > 0);
  if (!hasFlame && !hasLines) return null;

  const flameName = pickLocale(
    element.flameColorName ?? "",
    element.flameColorNameEn,
    locale,
  );

  return (
    <HudPanel label={t("spectrum.panel")}>
      <div className="flex flex-col gap-4">
        {hasFlame && element.flameColor && (
          <div className="flex items-start gap-4">
            <FlamePreview color={element.flameColor} size={88} />
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <span
                className="font-mono text-[10px] tracking-[0.25em] uppercase"
                style={{ color: element.flameColor }}
              >
                {t("spectrum.flameLabel")}
              </span>
              {flameName && (
                <p className="text-sm text-(--foreground)/85 leading-relaxed">{flameName}</p>
              )}
              <p className="text-[11px] text-(--muted-foreground)/70 leading-relaxed">
                {t("spectrum.flameHint")}
              </p>
            </div>
          </div>
        )}

        {hasLines && element.spectralLines && (
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-(--muted-foreground)/70">
              {t("spectrum.linesLabel")}
            </span>
            <SpectrumBar lines={element.spectralLines} />
          </div>
        )}
      </div>
    </HudPanel>
  );
}

function BiologyPanel({ element, locale, t }: BiologyPanelProps) {
  if (!element.biologicalRole && !element.naturalSources?.length) return null;

  const role = element.biologicalRole;
  const RoleIcon = role ? BIOLOGY_ICON[role] : null;
  const tint = role ? BIOLOGY_TINT[role] : "oklch(0.65 0.02 260)";
  const note = pickLocale(element.biologicalRoleNote ?? "", element.biologicalRoleNoteEn, locale);
  const sources = pickLocale(
    (element.naturalSources ?? []).join("|"),
    (element.naturalSourcesEn ?? []).join("|") || undefined,
    locale,
  )
    .split("|")
    .filter(Boolean);

  return (
    <HudPanel label={t("modal.biology")}>
      <div className="flex flex-col gap-4">
        {role && RoleIcon && (
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border"
              style={{
                color: tint,
                borderColor: tint + "40",
                background: `color-mix(in oklch, ${tint} 8%, transparent)`,
              }}
            >
              <RoleIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span
                className="font-mono text-[10px] tracking-[0.25em] uppercase block mb-1"
                style={{ color: tint }}
              >
                {t(`bio.${role}` as DictKey)}
              </span>
              {note && (
                <p className="text-sm text-(--foreground)/80 leading-relaxed">{note}</p>
              )}
            </div>
          </div>
        )}

        {sources.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-(--muted-foreground)/60">
              {t("modal.naturalSources")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sources.map((src) => (
                <span
                  key={src}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/3 text-(--foreground)/75"
                >
                  {src}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </HudPanel>
  );
}

function TelemetryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 g-(--background)/40 flex flex-col gap-0.5">
      <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-(--muted-foreground)/70">
        {label}
      </span>
      <span className="text-sm font-mono text-(--foreground)/90 tabular-nums truncate">
        {value}
      </span>
    </div>
  );
}
