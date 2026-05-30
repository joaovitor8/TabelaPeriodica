"use client";

import { useEffect, useState } from "react";

/**
 * Retorna true em macOS/iOS, false caso contrário.
 * SSR-safe: começa em false e atualiza após hydration.
 */
export function useIsMac(): boolean {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const plat = typeof navigator !== "undefined" ? navigator.platform : "";
      const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
      setIsMac(/Mac|iPhone|iPad|iPod/i.test(plat) || /Mac/i.test(ua));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return isMac;
}
