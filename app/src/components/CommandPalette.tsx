"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";

import { type ChemicalElement } from "@/src/data/elementsData";
import { pickLocale, useLocale, type DictKey } from "@/src/lib/i18n";
import { categoryAccent } from "@/src/utils/tableConstants";
import { searchElements } from "@/src/utils/searchElements";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSelect: (el: ChemicalElement) => void;
}

export function CommandPalette({ open, onClose, onSelect }: CommandPaletteProps) {
  const { t, locale } = useLocale();
  const [query, setQueryRaw] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchElements(query, { locale, t }), [query, locale, t]);

  const setQuery = (q: string) => {
    setQueryRaw(q);
    setActive(0);
  };

  useEffect(() => {
    if (!open) {
      const raf = requestAnimationFrame(() => {
        setQueryRaw("");
        setActive(0);
      });
      return () => cancelAnimationFrame(raf);
    }
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open]);

  function pick(el: ChemicalElement) {
    onSelect(el);
    onClose();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const el = results[active];
      if (el) pick(el);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 backdrop-blur-md p-4 pt-[18vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: -8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: -8 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="relative w-full max-w-xl rounded-2xl border border-[color:var(--primary)]/25 bg-[color:var(--background)]/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[color:var(--primary)]/60" />
            <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[color:var(--primary)]/60" />
            <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[color:var(--primary)]/60" />
            <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[color:var(--primary)]/60" />

            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search className="w-4 h-4 text-[color:var(--primary)] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={t("palette.placeholder")}
                className="flex-1 bg-transparent outline-hidden text-sm font-mono text-(--foreground) placeholder:text-white/30"
              />
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors"
                aria-label={t("modal.close")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto">
              {results.length === 0 ? (
                <p className="px-4 py-6 text-center text-xs font-mono uppercase tracking-[0.25em] text-white/40">
                  {query ? t("palette.empty") : t("palette.placeholder")}
                </p>
              ) : (
                <ul className="py-1">
                  {results.map((el, i) => {
                    const accent = categoryAccent[el.category];
                    const isActive = i === active;
                    return (
                      <li key={el.number}>
                        <button
                          onMouseEnter={() => setActive(i)}
                          onClick={() => pick(el)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                            isActive ? "bg-white/8" : "hover:bg-white/4"
                          }`}
                        >
                          <span
                            className="w-1 h-8 rounded-full shrink-0"
                            style={{ background: accent }}
                          />
                          <span
                            className="w-10 text-center font-bold text-lg shrink-0"
                            style={{ color: accent }}
                          >
                            {el.symbol}
                          </span>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm text-(--foreground)/90 truncate">
                              {pickLocale(el.name, el.nameEn, locale)}
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 truncate">
                              {t(`category.${el.category}` as DictKey)}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-white/50 tabular-nums shrink-0">
                            {el.number.toString().padStart(3, "0")}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="px-4 py-2 border-t border-white/10 text-[10px] font-mono uppercase tracking-[0.25em] text-white/35 text-right">
              {t("palette.hint")}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
