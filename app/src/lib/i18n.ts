"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createElement } from "react";

export type Locale = "pt" | "en";

export const LOCALES: { id: Locale; label: string; tag: string }[] = [
  { id: "pt", label: "PT", tag: "pt-BR" },
  { id: "en", label: "EN", tag: "en-US" },
];

const STORAGE_KEY = "tabela.locale";

export const dict = {
  /* Header / Nav */
  "nav.back": { pt: "Voltar ao Universe", en: "Back to Universe" },
  "nav.backShort": { pt: "Universe", en: "Universe" },
  "nav.brand": { pt: "Forja Estelar", en: "Stellar Forge" },
  "nav.brandSub": { pt: "STELLAR · FORGE", en: "STELLAR · FORGE" },
  "nav.menu": { pt: "Alternar menu", en: "Toggle menu" },

  /* Códigos HUD (codenames cosméticos, mantidos em inglês nas duas locales) */
  "table.range": { pt: "EL-001 → EL-118", en: "EL-001 → EL-118" },
  "compare.codename": { pt: "Δ CROSS-REFERENCE", en: "Δ CROSS-REFERENCE" },

  /* Footer */
  "footer.tagline": {
    pt: "Construído como extensão de Universe — a arqueologia cósmica dos elementos.",
    en: "Built as an extension of Universe — the cosmic archaeology of elements.",
  },
  "footer.sources": { pt: "Fontes de Dados", en: "Data Sources" },
  "footer.shortcuts": { pt: "Atalhos", en: "Shortcuts" },
  "footer.about": { pt: "Sobre", en: "About" },

  /* Scanner / Filtros */
  "scanner.title": { pt: "Scanner", en: "Scanner" },
  "scanner.byCategory": { pt: "Filtrar por categoria", en: "Filter by category" },
  "scanner.byOrigin": { pt: "Filtrar por origem cósmica", en: "Filter by cosmic origin" },
  "scanner.byBiology": { pt: "Filtrar por papel biológico", en: "Filter by biological role" },
  "scanner.axisCategory": { pt: "Categoria", en: "Category" },
  "scanner.axisOrigin": { pt: "Origem", en: "Origin" },
  "scanner.axisBiology": { pt: "Vida", en: "Life" },
  "scanner.clear": { pt: "Limpar filtros", en: "Clear filters" },
  "scanner.all": { pt: "Todos", en: "All" },

  /* Categorias */
  "category.nonmetal": { pt: "Não Metais", en: "Nonmetals" },
  "category.noble-gas": { pt: "Gases Nobres", en: "Noble Gases" },
  "category.alkali-metal": { pt: "Metais Alcalinos", en: "Alkali Metals" },
  "category.alkaline-earth-metal": { pt: "Alcalino-Terrosos", en: "Alkaline Earth" },
  "category.metalloid": { pt: "Metaloides", en: "Metalloids" },
  "category.halogen": { pt: "Halogênios", en: "Halogens" },
  "category.post-transition-metal": { pt: "Pós-Transição", en: "Post-Transition" },
  "category.transition-metal": { pt: "Metais de Transição", en: "Transition Metals" },
  "category.lanthanide": { pt: "Lantanídeos", en: "Lanthanides" },
  "category.actinide": { pt: "Actinídeos", en: "Actinides" },

  /* Origens cósmicas */
  "origin.big-bang": { pt: "Big Bang", en: "Big Bang" },
  "origin.cosmic-ray-spallation": { pt: "Spallation de raios cósmicos", en: "Cosmic ray spallation" },
  "origin.stellar-fusion-low": { pt: "Fusão em estrelas de baixa massa", en: "Low-mass stellar fusion" },
  "origin.stellar-fusion-high": { pt: "Fusão em estrelas massivas", en: "High-mass stellar fusion" },
  "origin.supernova": { pt: "Supernova", en: "Supernova" },
  "origin.neutron-star-merger": { pt: "Fusão de estrelas de nêutrons", en: "Neutron star merger" },
  "origin.white-dwarf-explosion": { pt: "Explosão de anã branca", en: "White dwarf explosion" },
  "origin.human-made": { pt: "Criação humana", en: "Human-made" },

  /* Biologia */
  "bio.essential": { pt: "Essencial", en: "Essential" },
  "bio.trace-essential": { pt: "Essencial em traços", en: "Trace essential" },
  "bio.beneficial": { pt: "Benéfico", en: "Beneficial" },
  "bio.toxic": { pt: "Tóxico", en: "Toxic" },
  "bio.none": { pt: "Sem papel biológico", en: "No biological role" },

  /* Modal */
  "modal.cosmicOrigin": { pt: "Origem Cósmica", en: "Cosmic Origin" },
  "modal.abundance": { pt: "Abundância", en: "Abundance" },
  "modal.abundance.universe": { pt: "Universo", en: "Universe" },
  "modal.abundance.crust": { pt: "Crosta", en: "Crust" },
  "modal.abundance.atmosphere": { pt: "Atmosfera", en: "Atmosphere" },
  "modal.abundance.ocean": { pt: "Oceano", en: "Ocean" },
  "modal.abundance.body": { pt: "Corpo Humano", en: "Human Body" },
  "modal.biology": { pt: "Biologia & Fontes", en: "Biology & Sources" },
  "modal.naturalSources": { pt: "Fontes naturais", en: "Natural sources" },
  "modal.discoveredBy": { pt: "Descoberto por", en: "Discovered by" },
  "modal.year": { pt: "Ano", en: "Year" },
  "modal.year.ancient": { pt: "Antiguidade", en: "Ancient" },
  "modal.column": { pt: "Coluna", en: "Column" },
  "modal.row": { pt: "Linha", en: "Row" },
  "modal.moreDetails": { pt: "Mais detalhes", en: "More details" },
  "modal.loading": { pt: "Buscando telemetria", en: "Fetching telemetry" },
  "modal.error": { pt: "Sinal perdido", en: "Signal lost" },
  "modal.close": { pt: "Fechar", en: "Close" },
  "modal.prev": { pt: "Elemento anterior (←)", en: "Previous element (←)" },
  "modal.next": { pt: "Próximo elemento (→)", en: "Next element (→)" },

  /* Timeline cósmica */
  "timeline.title": { pt: "Linha do Tempo Cósmica", en: "Cosmic Timeline" },
  "timeline.subtitle": {
    pt: "Do Big Bang à criação humana — a saga dos átomos.",
    en: "From the Big Bang to human creation — the saga of atoms.",
  },
  "timeline.open": { pt: "Linha do Tempo", en: "Timeline" },
  "timeline.count": { pt: "elementos", en: "elements" },

  /* Dossiê estendido (API) */
  "details.panel": { pt: "Dossiê Estendido", en: "Extended Dossier" },
  "details.via": { pt: "via Wikipédia", en: "via Wikipedia" },
  "details.readMore": { pt: "Ler na Wikipédia", en: "Read on Wikipedia" },
  "details.empty": { pt: "Sem dados enciclopédicos disponíveis.", en: "No encyclopedic data available." },

  /* Comuns */
  "common.retry": { pt: "Tentar de novo", en: "Try again" },
  "common.unknown": { pt: "—", en: "—" },

  /* Command palette */
  "palette.openHint": { pt: "Buscar", en: "Search" },
  "palette.placeholder": {
    pt: "Buscar por símbolo, nome ou número…",
    en: "Search by symbol, name or number…",
  },
  "palette.empty": { pt: "Nenhum elemento encontrado.", en: "No elements found." },
  "palette.hint": {
    pt: "↑↓ navegar · ↵ abrir · Esc fechar",
    en: "↑↓ navigate · ↵ open · Esc to close",
  },

  /* Elemento do dia */
  "eod.label": { pt: "Elemento do dia", en: "Element of the day" },

  /* Modo comparação */
  "compare.pin": { pt: "Fixar para comparar", en: "Pin to compare" },
  "compare.unpin": { pt: "Remover dos fixados", en: "Remove from pinned" },
  "compare.full": { pt: "Máximo 4 elementos", en: "Maximum 4 elements" },
  "compare.title": { pt: "Comparar Elementos", en: "Compare Elements" },
  "compare.open": { pt: "Comparar", en: "Compare" },
  "compare.clear": { pt: "Limpar", en: "Clear" },
  "compare.dockHint": { pt: "Fixados", en: "Pinned" },
  "compare.empty": {
    pt: "Fixe elementos pelo modal pra comparar lado a lado.",
    en: "Pin elements from the modal to compare side by side.",
  },

  /* Stardust mode */
  "stardust.button": { pt: "Poeira de Estrelas", en: "Stardust" },
  "stardust.title": { pt: "Você é poeira de estrelas", en: "You are stardust" },
  "stardust.lead": {
    pt: "Quase tudo no seu corpo nasceu dentro de estrelas que morreram antes do Sol existir. Estes são os elementos que te compõem — tingidos pela origem cósmica de cada um.",
    en: "Almost everything in your body was forged inside stars that died before the Sun existed. These are the elements that make you up — tinted by their cosmic origin.",
  },
  "stardust.enter": { pt: "Ver o cosmos em mim", en: "See the cosmos in me" },
  "stardust.exit": { pt: "Sair do modo", en: "Exit mode" },
  "stardust.active": { pt: "Modo Poeira de Estrelas ativo", en: "Stardust mode active" },

  /* Espectro / Chama */
  "spectrum.panel": { pt: "Assinatura Espectral", en: "Spectral Signature" },
  "spectrum.flameLabel": { pt: "Cor de chama", en: "Flame color" },
  "spectrum.flameHint": {
    pt: "Cor emitida quando o elemento é aquecido em uma chama — usado em testes analíticos clássicos.",
    en: "Color emitted when the element is heated in a flame — used in classical analytical tests.",
  },
  "spectrum.linesLabel": { pt: "Linhas de emissão (nm)", en: "Emission lines (nm)" },

  /* Timeline player */
  "timeline.play": { pt: "Reproduzir nucleossíntese", en: "Play nucleosynthesis" },
  "timeline.pause": { pt: "Pausar", en: "Pause" },
  "timeline.reset": { pt: "Mostrar tudo", en: "Reveal all" },

  /* Áudio */
  "audio.enable": { pt: "Ativar som", en: "Enable sound" },
  "audio.disable": { pt: "Silenciar", en: "Mute" },
  "audio.play": { pt: "Ouvir", en: "Listen" },
  "audio.enableToPlay": { pt: "Ative o som para ouvir o elemento", en: "Enable sound to hear the element" },
  "audio.playSpectrum": {
    pt: "Ouvir o espectro do elemento — cada linha de emissão vira uma frequência audível.",
    en: "Listen to the element's spectrum — each emission line becomes an audible frequency.",
  },
  "audio.playZ": {
    pt: "Tom único baseado no número atômico.",
    en: "Single tone based on the atomic number.",
  },
} as const satisfies Record<string, { pt: string; en: string }>;

export type DictKey = keyof typeof dict;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: DictKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  useEffect(() => {
    const apply = () => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
        if (stored === "pt" || stored === "en") setLocaleState(stored);
      } catch {
        /* localStorage indisponível — segue com default */
      }
    };
    const raf = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const tag = LOCALES.find((l) => l.id === locale)?.tag ?? "pt-BR";
    document.documentElement.setAttribute("lang", tag);
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* fail-silent */
    }
  }, []);

  const t = useCallback((key: DictKey) => dict[key][locale], [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return createElement(LocaleContext.Provider, { value }, children);
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale deve ser usado dentro de <LocaleProvider>");
  return ctx;
}

export function useT() {
  return useLocale().t;
}

export const pickLocale = (pt: string, en: string | undefined, locale: Locale) =>
  locale === "en" && en ? en : pt;
