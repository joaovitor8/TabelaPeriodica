"use client";

import Link from "next/link";
import { Atom, ArrowLeft, Volume2, VolumeX } from "lucide-react";

import { LocaleToggle } from "./LocaleToggle";
import { useT } from "@/src/lib/i18n";
import { useSoundEnabled } from "@/src/hooks/useSoundEnabled";

export function Header() {
  const t = useT();
  const { enabled: soundEnabled, toggle: toggleSound } = useSoundEnabled();
  const universeUrl = process.env.NEXT_PUBLIC_UNIVERSE_URL ?? "/";

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-white/[0.06] bg-[color:var(--background)]/70 backdrop-blur-2xl">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group relative">
          <div className="relative">
            <Atom className="w-6 h-6 text-[color:var(--primary)] transition-transform duration-700 group-hover:rotate-180" />
            <span className="absolute inset-0 blur-md bg-[color:var(--primary)]/40 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.2em] uppercase">
              {t("nav.brand")}
            </span>
            <span className="text-[8px] font-mono tracking-[0.4em] text-[color:var(--muted-foreground)]/70 mt-0.5 hidden sm:block">
              {t("nav.brandSub")}
            </span>
          </div>
        </Link>

        {/* Right cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSound}
            title={soundEnabled ? t("audio.disable") : t("audio.enable")}
            aria-label={soundEnabled ? t("audio.disable") : t("audio.enable")}
            className={`p-2 rounded-full border transition-all ${
              soundEnabled
                ? "border-[color:var(--primary)]/50 text-[color:var(--primary)] bg-[color:var(--primary)]/10"
                : "border-white/15 text-white/50 hover:text-white hover:border-white/30"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <LocaleToggle />

          <a
            href={universeUrl}
            className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.25em] px-3 sm:px-4 py-2 rounded-full border border-[color:var(--primary)]/30 text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 hover:border-[color:var(--primary)]/60 transition-all hover:scale-[1.03] active:scale-95"
            style={{ boxShadow: "0 0 18px oklch(0.60 0.18 290 / 0.15)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("nav.back")}</span>
            <span className="sm:hidden">{t("nav.backShort")}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
