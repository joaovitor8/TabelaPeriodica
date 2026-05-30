"use client";

import { useEffect, useRef } from "react";

import { elements, elementByZ, type ChemicalElement } from "@/src/data/elementsData";

const PARAM = "el";

function resolve(raw: string | null): ChemicalElement | null {
  if (!raw) return null;
  const token = raw.trim().toLowerCase();
  if (!token) return null;

  const asNumber = Number(token);
  if (Number.isInteger(asNumber) && asNumber > 0) {
    return elementByZ(asNumber) ?? null;
  }

  return (
    elements.find((el) => el.symbol.toLowerCase() === token) ??
    elements.find((el) => el.name.toLowerCase() === token) ??
    elements.find((el) => el.nameEn?.toLowerCase() === token) ??
    null
  );
}

function writeUrl(el: ChemicalElement | null): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (el) url.searchParams.set(PARAM, el.symbol);
  else url.searchParams.delete(PARAM);
  window.history.replaceState(null, "", url.toString());
}

export function useSelectedSync(
  selected: ChemicalElement | null,
  setSelected: (el: ChemicalElement | null) => void,
): void {
  const hydratedRef = useRef(false);
  const lastWrittenRef = useRef<string | null>(null);

  // Hidrata uma vez do ?el= ao montar
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = resolve(params.get(PARAM));
    if (fromUrl) setSelected(fromUrl);
  }, [setSelected]);

  // Espelha mudanças de selected na URL
  useEffect(() => {
    if (!hydratedRef.current) return;
    const next = selected?.symbol ?? null;
    if (next === lastWrittenRef.current) return;
    lastWrittenRef.current = next;
    writeUrl(selected);
  }, [selected]);

  // Suporta navegação por back/forward
  useEffect(() => {
    function onPop() {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = resolve(params.get(PARAM));
      lastWrittenRef.current = fromUrl?.symbol ?? null;
      setSelected(fromUrl);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [setSelected]);
}
