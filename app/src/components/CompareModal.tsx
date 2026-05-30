"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Droplet, Heart, Mountain, Sparkles, Wind, X, type LucideIcon } from "lucide-react";

import { type AbundanceProfile, type ChemicalElement } from "@/src/data/elementsData";
import { categoryAccent } from "@/src/utils/tableConstants";
import { COSMIC_ICON, COSMIC_TINT } from "@/src/utils/cosmicMeta";
import { BIOLOGY_ICON, BIOLOGY_TINT } from "@/src/utils/bioMeta";
import { pickLocale, useLocale, type DictKey } from "@/src/lib/i18n";
import { usePinned } from "@/src/hooks/usePinned";

interface CompareModalProps {
  open: boolean;
  onClose: () => void;
}

const ABUNDANCE_ROWS: { key: keyof AbundanceProfile; labelKey: DictKey; icon: LucideIcon }[] = [
  { key: "universe", labelKey: "modal.abundance.universe", icon: Sparkles },
  { key: "earthCrust", labelKey: "modal.abundance.crust", icon: Mountain },
  { key: "earthAtmosphere", labelKey: "modal.abundance.atmosphere", icon: Wind },
  { key: "earthOcean", labelKey: "modal.abundance.ocean", icon: Droplet },
  { key: "humanBody", labelKey: "modal.abundance.body", icon: Heart },
];

function logRatio(ppm: number | null | undefined): number {
  if (ppm == null || ppm <= 0) return 0;
  const r = Math.log10(ppm + 1) / 6.5;
  return Math.max(0, Math.min(1, r));
}

function formatPpm(ppm: number | null | undefined): string {
  if (ppm == null) return "—";
  if (ppm === 0) return "0";
  const pct = ppm / 10000;
  if (pct >= 1) return `${pct.toFixed(0)}%`;
  if (pct >= 0.01) return `${pct.toFixed(2)}%`;
  if (ppm >= 1) return `${ppm.toFixed(0)} ppm`;
  if (ppm >= 0.001) return `${ppm.toFixed(3)} ppm`;
  return `${ppm.toExponential(1)} ppm`;
}

export function CompareModal({ open, onClose }: CompareModalProps) {
  const { t, locale } = useLocale();
  const { pinned, unpin } = usePinned();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="relative w-full max-w-6xl my-8 rounded-2xl border border-white/10 bg-(--card)/90 backdrop-blur-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-5 sm:p-6 border-b border-white/6">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[color:var(--primary)]">
                  {t("compare.codename")}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl tracking-widest uppercase">
                  {t("compare.title")}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors p-1"
                aria-label={t("modal.close")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pinned.length === 0 ? (
              <p className="p-10 text-center text-sm text-white/50">{t("compare.empty")}</p>
            ) : (
              <div
                className="grid gap-px bg-white/5 p-px"
                style={{
                  gridTemplateColumns: `repeat(${pinned.length}, minmax(0, 1fr))`,
                }}
              >
                {pinned.map((el) => (
                  <CompareColumn key={el.number} el={el} onRemove={() => unpin(el.number)} locale={locale} t={t} />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ColumnProps {
  el: ChemicalElement;
  onRemove: () => void;
  locale: "pt" | "en";
  t: (k: DictKey) => string;
}

function CompareColumn({ el, onRemove, locale, t }: ColumnProps) {
  const accent = categoryAccent[el.category];
  const name = pickLocale(el.name, el.nameEn, locale);
  const summary = pickLocale(el.summary, el.summaryEn, locale);
  const OriginIcon = el.cosmicOrigin ? COSMIC_ICON[el.cosmicOrigin] : null;
  const originTint = el.cosmicOrigin ? COSMIC_TINT[el.cosmicOrigin] : undefined;
  const BioIcon = el.biologicalRole ? BIOLOGY_ICON[el.biologicalRole] : null;
  const bioTint = el.biologicalRole ? BIOLOGY_TINT[el.biologicalRole] : undefined;
  const bioNote = pickLocale(el.biologicalRoleNote ?? "", el.biologicalRoleNoteEn, locale);
  const originNote = pickLocale(el.cosmicOriginNote ?? "", el.cosmicOriginNoteEn, locale);

  return (
    <div
      className="bg-(--background)/60 p-4 flex flex-col gap-4"
      style={{ "--cat-accent": accent } as React.CSSProperties}
    >
      {/* Header da coluna */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-md border flex flex-col items-center justify-center shrink-0"
            style={{
              color: accent,
              borderColor: accent + "55",
              background: `color-mix(in oklch, ${accent} 10%, transparent)`,
            }}
          >
            <span className="font-mono text-[9px] opacity-70 leading-none">{el.number}</span>
            <span className="text-xl font-bold leading-none">{el.symbol}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-sm tracking-widest uppercase truncate">{name}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/45 truncate">
              {t(`category.${el.category}` as DictKey)}
            </span>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="text-white/30 hover:text-white transition-colors shrink-0"
          aria-label={t("compare.unpin")}
          title={t("compare.unpin")}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-white/60 leading-relaxed line-clamp-3">{summary}</p>

      {/* Origem cósmica */}
      {OriginIcon && originTint && el.cosmicOrigin && (
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/40">
            {t("modal.cosmicOrigin")}
          </span>
          <div className="flex items-start gap-2">
            <OriginIcon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: originTint }} />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs font-mono uppercase tracking-wide" style={{ color: originTint }}>
                {t(`origin.${el.cosmicOrigin}` as DictKey)}
              </span>
              {originNote && (
                <span className="text-[11px] text-white/55 leading-snug">{originNote}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Abundância */}
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/40">
          {t("modal.abundance")}
        </span>
        <div className="flex flex-col gap-1.5">
          {ABUNDANCE_ROWS.map(({ key, labelKey, icon: Icon }) => {
            const value = el.abundance?.[key];
            const ratio = logRatio(value);
            return (
              <div key={key} className="flex items-center gap-2">
                <Icon className="w-3 h-3 text-white/40 shrink-0" />
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/45 w-14 shrink-0 truncate">
                  {t(labelKey)}
                </span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${ratio * 100}%`,
                      background:
                        "linear-gradient(90deg, var(--cat-accent), color-mix(in oklch, var(--cat-accent) 50%, transparent))",
                    }}
                  />
                </div>
                <span className="font-mono text-[10px] tabular-nums text-white/70 w-16 text-right shrink-0">
                  {formatPpm(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Biologia */}
      {BioIcon && bioTint && el.biologicalRole && (
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/40">
            {t("modal.biology")}
          </span>
          <div className="flex items-start gap-2">
            <BioIcon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: bioTint }} />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs font-mono uppercase tracking-wide" style={{ color: bioTint }}>
                {t(`bio.${el.biologicalRole}` as DictKey)}
              </span>
              {bioNote && <span className="text-[11px] text-white/55 leading-snug">{bioNote}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
