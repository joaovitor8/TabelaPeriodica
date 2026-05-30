"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";

import { useT } from "@/src/lib/i18n";

interface StardustIntroProps {
  open: boolean;
  onEnter: () => void;
  onClose: () => void;
}

export function StardustIntro({ open, onEnter, onClose }: StardustIntroProps) {
  const t = useT();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/85 backdrop-blur-md p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="relative max-w-xl rounded-2xl border border-[color:var(--primary)]/30 bg-[color:var(--background)]/95 backdrop-blur-2xl shadow-2xl p-8 sm:p-10 text-center"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: "0 0 60px oklch(0.60 0.18 290 / 0.30)" }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors"
              aria-label={t("modal.close")}
            >
              <X className="w-4 h-4" />
            </button>

            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.12, type: "spring", stiffness: 240 }}
              className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-5 border border-[color:var(--primary)]/40"
              style={{
                background: "color-mix(in oklch, var(--primary) 12%, transparent)",
                boxShadow: "0 0 30px oklch(0.60 0.18 290 / 0.45)",
              }}
            >
              <Sparkles className="w-7 h-7 text-[color:var(--primary)]" />
            </motion.div>

            <h2 className="font-serif text-2xl sm:text-3xl tracking-widest uppercase mb-3">
              {t("stardust.title")}
            </h2>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-6">
              {t("stardust.lead")}
            </p>

            <button
              onClick={onEnter}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-mono text-xs uppercase tracking-[0.25em] hover:scale-[1.03] transition-transform"
              style={{ boxShadow: "0 0 24px oklch(0.60 0.18 290 / 0.55)" }}
            >
              <Sparkles className="w-4 h-4" />
              {t("stardust.enter")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface StardustChipProps {
  onExit: () => void;
}

export function StardustChip({ onExit }: StardustChipProps) {
  const t = useT();
  return (
    <motion.button
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onClick={onExit}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[color:var(--primary)]/60 bg-[color:var(--primary)]/15 text-[color:var(--primary)] font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-[color:var(--primary)]/25 transition-colors"
      style={{ boxShadow: "0 0 18px oklch(0.60 0.18 290 / 0.30)" }}
    >
      <Sparkles className="w-3.5 h-3.5 animate-hud-pulse" />
      <span className="hidden sm:inline">{t("stardust.active")}</span>
      <X className="w-3.5 h-3.5 opacity-70" />
    </motion.button>
  );
}
