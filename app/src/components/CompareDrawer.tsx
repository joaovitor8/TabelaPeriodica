"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GitCompare, X } from "lucide-react";

import { categoryAccent } from "@/src/utils/tableConstants";
import { usePinned } from "@/src/hooks/usePinned";
import { useT } from "@/src/lib/i18n";

interface CompareDrawerProps {
  onOpenCompare: () => void;
}

export function CompareDrawer({ onOpenCompare }: CompareDrawerProps) {
  const t = useT();
  const { pinned, unpin, clear } = usePinned();

  return (
    <AnimatePresence>
      {pinned.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3 py-2 rounded-full border border-[color:var(--primary)]/30 bg-[color:var(--background)]/92 backdrop-blur-xl shadow-2xl"
          style={{ boxShadow: "0 0 28px oklch(0.60 0.18 290 / 0.25)" }}
        >
          <span className="hidden sm:inline-block font-mono text-[10px] tracking-[0.25em] uppercase text-white/50 pl-2">
            {t("compare.dockHint")}
          </span>

          <div className="flex items-center gap-1.5">
            {pinned.map((el) => {
              const accent = categoryAccent[el.category];
              return (
                <button
                  key={el.number}
                  onClick={() => unpin(el.number)}
                  title={el.name}
                  className="group relative w-9 h-9 rounded-md border text-sm font-bold font-mono transition-all hover:scale-105"
                  style={{
                    color: accent,
                    borderColor: accent + "55",
                    background: `color-mix(in oklch, ${accent} 10%, transparent)`,
                  }}
                >
                  {el.symbol}
                  <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-full p-0.5">
                    <X className="w-2.5 h-2.5 text-white" />
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onOpenCompare}
            className="flex items-center gap-1.5 ml-1 px-3 py-1.5 rounded-full bg-[color:var(--primary)]/20 hover:bg-[color:var(--primary)]/30 border border-[color:var(--primary)]/50 text-[color:var(--primary)] text-[11px] font-mono uppercase tracking-[0.2em] transition-all"
          >
            <GitCompare className="w-3.5 h-3.5" />
            {t("compare.open")} ({pinned.length})
          </button>

          <button
            onClick={clear}
            className="text-white/40 hover:text-white transition-colors px-2"
            aria-label={t("compare.clear")}
            title={t("compare.clear")}
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
