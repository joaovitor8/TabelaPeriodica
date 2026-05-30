"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { elementByZ, type ChemicalElement } from "@/src/data/elementsData";

const STORAGE_KEY = "tabela.pinned";
export const PINNED_MAX = 4;

interface PinnedContextValue {
  pinned: ChemicalElement[];
  isPinned: (z: number) => boolean;
  isFull: boolean;
  toggle: (el: ChemicalElement) => void;
  unpin: (z: number) => void;
  clear: () => void;
}

const PinnedContext = createContext<PinnedContextValue | null>(null);

function readStorage(): number[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((v): v is number => typeof v === "number" && Number.isInteger(v))
      .slice(0, PINNED_MAX);
  } catch {
    return [];
  }
}

function writeStorage(zs: number[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(zs));
  } catch {
    /* fail-silent */
  }
}

export function PinnedProvider({ children }: { children: ReactNode }) {
  const [pinnedZ, setPinnedZ] = useState<number[]>([]);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      hasHydratedRef.current = true;
      setPinnedZ(readStorage());
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    // Não escreve até hidratar — senão o mount inicial com [] sobrescreve o que está no storage.
    if (!hasHydratedRef.current) return;
    writeStorage(pinnedZ);
  }, [pinnedZ]);

  const pinned = useMemo(
    () =>
      pinnedZ
        .map((z) => elementByZ(z))
        .filter((el): el is ChemicalElement => Boolean(el)),
    [pinnedZ],
  );

  const isPinned = useCallback((z: number) => pinnedZ.includes(z), [pinnedZ]);
  const isFull = pinnedZ.length >= PINNED_MAX;

  const toggle = useCallback((el: ChemicalElement) => {
    setPinnedZ((current) => {
      if (current.includes(el.number)) return current.filter((z) => z !== el.number);
      if (current.length >= PINNED_MAX) return current;
      return [...current, el.number];
    });
  }, []);

  const unpin = useCallback((z: number) => {
    setPinnedZ((current) => current.filter((x) => x !== z));
  }, []);

  const clear = useCallback(() => setPinnedZ([]), []);

  const value = useMemo<PinnedContextValue>(
    () => ({ pinned, isPinned, isFull, toggle, unpin, clear }),
    [pinned, isPinned, isFull, toggle, unpin, clear],
  );

  return <PinnedContext.Provider value={value}>{children}</PinnedContext.Provider>;
}

export function usePinned() {
  const ctx = useContext(PinnedContext);
  if (!ctx) throw new Error("usePinned deve ser usado dentro de <PinnedProvider>");
  return ctx;
}
