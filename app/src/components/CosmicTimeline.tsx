"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, RotateCcw, X } from "lucide-react";

import { elementsByOrigin, type ChemicalElement } from "@/src/data/elementsData";
import {
  COSMIC_ICON,
  COSMIC_ORIGIN_ORDER,
  COSMIC_ORIGIN_YEAR,
  COSMIC_TINT,
  UNIVERSE_AGE_YEARS,
  formatCosmicAge,
} from "@/src/utils/cosmicMeta";
import { pickLocale, useLocale, type DictKey } from "@/src/lib/i18n";
import { originPad, type PadHandle } from "@/src/lib/audio";
import { useSoundEnabled } from "@/src/hooks/useSoundEnabled";

interface CosmicTimelineProps {
  open: boolean;
  onClose: () => void;
  onSelect: (el: ChemicalElement) => void;
}

const STEP_MS = 1600;

export function CosmicTimeline({ open, onClose, onSelect }: CosmicTimelineProps) {
  const { t, locale } = useLocale();
  const { enabled: soundEnabled } = useSoundEnabled();

  const stops = useMemo(
    () =>
      COSMIC_ORIGIN_ORDER.map((origin) => ({
        origin,
        elements: (elementsByOrigin[origin] ?? []).slice().sort((a, b) => a.number - b.number),
        year: COSMIC_ORIGIN_YEAR[origin],
      })).filter((s) => s.elements.length > 0),
    [],
  );

  // step = -1: estado inicial "tudo apagado"; quando playing, avança até stops.length-1
  const [step, setStep] = useState(stops.length - 1);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const padRef = useRef<PadHandle | null>(null);

  // Reset ao abrir
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => {
      setStep(stops.length - 1);
      setPlaying(false);
    });
    return () => cancelAnimationFrame(raf);
  }, [open, stops.length]);

  // Loop de playback
  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= stops.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, STEP_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, stops.length]);

  // Pad ambiente — troca por origem enquanto playing, para ao pausar/fechar
  useEffect(() => {
    if (!soundEnabled || !playing || step < 0 || step >= stops.length) {
      padRef.current?.stop(500);
      padRef.current = null;
      return;
    }
    const origin = stops[step].origin;
    // cross-fade: para o anterior e inicia o próximo
    const prev = padRef.current;
    let cancelled = false;
    void originPad(origin).then((h) => {
      if (cancelled) {
        h?.stop(200);
        return;
      }
      padRef.current = h;
      prev?.stop(600);
    });
    return () => {
      cancelled = true;
    };
  }, [soundEnabled, playing, step, stops]);

  // Para o pad ao fechar
  useEffect(() => {
    if (!open) {
      padRef.current?.stop(400);
      padRef.current = null;
    }
  }, [open]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      padRef.current?.stop(200);
      padRef.current = null;
    };
  }, []);

  const onPlay = () => {
    if (step >= stops.length - 1) {
      // Reset implícito antes de tocar
      setStep(-1);
      requestAnimationFrame(() => setPlaying(true));
    } else {
      setPlaying(true);
    }
  };

  const onPause = () => setPlaying(false);
  const onReset = () => {
    setPlaying(false);
    setStep(stops.length - 1);
  };

  const onStartFromZero = () => {
    setPlaying(false);
    setStep(-1);
    requestAnimationFrame(() => setPlaying(true));
  };

  const currentYear = step < 0 ? 0 : stops[Math.min(step, stops.length - 1)].year;
  const isAtEnd = step >= stops.length - 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="relative w-full max-w-4xl my-8 rounded-2xl border border-white/10 bg-(--card)/90 backdrop-blur-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-white/6 gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-[color:var(--primary)]">
                  T = {formatCosmicAge(currentYear, locale)}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl tracking-widest uppercase">
                  {t("timeline.title")}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("timeline.subtitle")}
                </p>
                <CosmicProgressBar currentYear={currentYear} />
              </div>

              <div className="flex items-start gap-2 shrink-0">
                <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1">
                  <button
                    onClick={playing ? onPause : isAtEnd ? onStartFromZero : onPlay}
                    title={playing ? t("timeline.pause") : t("timeline.play")}
                    aria-label={playing ? t("timeline.pause") : t("timeline.play")}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[color:var(--primary)] hover:bg-[color:var(--primary)]/15 transition-colors"
                  >
                    {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={onReset}
                    title={t("timeline.reset")}
                    aria-label={t("timeline.reset")}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/50 hover:text-white transition-colors p-1"
                  aria-label={t("modal.close")}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stops */}
            <div className="relative p-6 flex flex-col gap-5">
              <span className="absolute left-[2.85rem] top-10 bottom-10 w-px bg-linear-to-b from-transparent via-white/15 to-transparent" />

              {stops.map(({ origin, elements, year }, i) => {
                const Icon = COSMIC_ICON[origin];
                const tint = COSMIC_TINT[origin];
                const isCurrent = playing && i === step;
                const isPast = i <= step;
                const hidden = i > step;

                return (
                  <motion.div
                    key={origin}
                    animate={{
                      opacity: hidden ? 0.18 : 1,
                      scale: isCurrent ? 1.01 : 1,
                    }}
                    transition={{ duration: 0.45 }}
                    className="relative flex gap-4"
                  >
                    <div
                      className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border z-10 transition-shadow ${
                        isCurrent ? "animate-hud-pulse" : ""
                      }`}
                      style={{
                        color: tint,
                        borderColor: tint + (isPast ? "88" : "30"),
                        background: `color-mix(in oklch, ${tint} ${isPast ? 18 : 6}%, var(--background))`,
                        boxShadow: isCurrent ? `0 0 28px ${tint}99` : `0 0 12px ${tint}33`,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 pb-1">
                      <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                        <span
                          className="font-mono text-xs tracking-[0.2em] uppercase"
                          style={{ color: tint }}
                        >
                          {t(`origin.${origin}` as DictKey)}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground/60">
                          {elements.length} {t("timeline.count")}
                        </span>
                        <span className="font-mono text-[10px] text-white/35 ml-auto">
                          T = {formatCosmicAge(year, locale)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {elements.map((el, j) => (
                          <motion.button
                            key={el.number}
                            initial={false}
                            animate={{
                              opacity: hidden ? 0 : 1,
                              scale: hidden ? 0.7 : 1,
                            }}
                            transition={{
                              duration: 0.35,
                              delay: isCurrent ? Math.min(j * 0.04, 1.0) : 0,
                            }}
                            onClick={() => onSelect(el)}
                            title={pickLocale(el.name, el.nameEn, locale)}
                            className="w-9 h-9 rounded-md border text-sm font-bold font-mono transition-all hover:scale-110 hover:z-10"
                            style={{
                              color: tint,
                              borderColor: tint + "33",
                              background: `color-mix(in oklch, ${tint} 7%, transparent)`,
                            }}
                          >
                            {el.symbol}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface CosmicProgressBarProps {
  currentYear: number;
}

function CosmicProgressBar({ currentYear }: CosmicProgressBarProps) {
  // Escala log: 1 year → 1.38e10 years
  const minLog = 0; // log10(1) = 0
  const maxLog = Math.log10(UNIVERSE_AGE_YEARS);
  const safeYear = Math.max(1, currentYear);
  const ratio = Math.min(1, Math.max(0, (Math.log10(safeYear) - minLog) / (maxLog - minLog)));

  return (
    <div className="mt-3 h-1.5 rounded-full overflow-hidden bg-white/8 max-w-md">
      <motion.div
        animate={{ width: `${ratio * 100}%` }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="h-full rounded-full bg-linear-to-r from-[color:var(--primary)] to-[color:var(--primary)]/40"
        style={{ boxShadow: "0 0 12px oklch(0.60 0.18 290 / 0.55)" }}
      />
    </div>
  );
}
