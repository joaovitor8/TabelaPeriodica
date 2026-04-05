'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, X, Sparkles, ShieldAlert } from 'lucide-react'; 
import { elements, ChemicalElement, ElementCategory } from '@/src/data/elementsData';

// O dicionário fica inalterado. O milagre acontece nas variáveis CSS!
const categoryStyles: Record<ElementCategory, string> = {
  "nonmetal": "text-emerald-300 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]",
  "noble-gas": "text-cyan-300 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]",
  "alkali-metal": "text-amber-500 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]",
  "alkaline-earth-metal": "text-yellow-400 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.3)]",
  "metalloid": "text-teal-400 hover:border-teal-400 hover:shadow-[0_0_15px_rgba(45,212,191,0.3)]",
  "halogen": "text-fuchsia-400 hover:border-fuchsia-400 hover:shadow-[0_0_15px_rgba(232,121,249,0.3)]",
  "post-transition-metal": "text-blue-400 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(96,165,250,0.3)]",
  "transition-metal": "text-slate-300 hover:border-slate-300 hover:shadow-[0_0_15px_rgba(203,213,225,0.3)]",
  "lanthanide": "text-indigo-300 hover:border-indigo-400 hover:shadow-[0_0_15px_rgba(165,180,252,0.3)]",
  "actinide": "text-toxic hazard-bg font-bold shadow-[0_0_10px_rgba(57,255,20,0.1)] hover:shadow-[0_0_20px_rgba(57,255,20,0.6)]",
};

const filterCategories: { id: ElementCategory; label: string }[] = [
  { id: "nonmetal", label: "Não Metais" },
  { id: "noble-gas", label: "Gases Nobres" },
  { id: "alkali-metal", label: "Metais Alcalinos" },
  { id: "alkaline-earth-metal", label: "Alcalino-Terrosos" },
  { id: "metalloid", label: "Metaloides" },
  { id: "halogen", label: "Halogênios" },
  { id: "post-transition-metal", label: "Pós-Transição" },
  { id: "transition-metal", label: "Metais de Transição" },
  { id: "lanthanide", label: "Lantanídeos" },
  { id: "actinide", label: "Actinídeos" }
];

export default function PeriodicTable() {
  const [selected, setSelected] = useState<ChemicalElement | null>(null);
  const [activeFilter, setActiveFilter] = useState<ElementCategory | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // --- LÓGICA DO EASTER EGG ---
  const [clickCount, setClickCount] = useState(0);
  const [isCosmic, setIsCosmic] = useState(false);

  // Zera o contador de cliques se demorar mais de 1 segundo
  useEffect(() => {
    if (clickCount > 0 && clickCount < 3) {
      const timer = setTimeout(() => setClickCount(0), 1000);
      return () => clearTimeout(timer);
    }
    // Ao bater 3 cliques rápidos, ativa/desativa o modo cósmico e zera
    if (clickCount >= 3) {
      setIsCosmic(!isCosmic);
      setClickCount(0);
    }
  }, [clickCount, isCosmic]);

  // Aplica a classe ao body no DOM
  useEffect(() => {
    if (isCosmic) {
      document.body.classList.add('theme-cosmic');
    } else {
      document.body.classList.remove('theme-cosmic');
    }
  }, [isCosmic]);

  const toggleFilter = (categoryId: ElementCategory) => setActiveFilter(prev => prev === categoryId ? null : categoryId);
  const closeFilters = () => { setShowFilters(false); setActiveFilter(null); };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen p-2 sm:p-4 lg:p-8 relative">
      
      {/* Header com Trigger do Easter Egg */}
      <div className="w-full max-w-[95vw] lg:max-w-[85vw] flex justify-between items-center mb-4 sm:mb-6 z-30">
        
        {/* TÍTULO CLICÁVEL (Trigger) */}
        <button 
          onClick={() => setClickCount(prev => prev + 1)}
          className="flex items-center gap-2 text-xl sm:text-2xl font-mono text-toxic tracking-[0.2em] uppercase transition-all duration-700 select-none cursor-pointer"
        >
          {isCosmic ? (
            <>
              <Sparkles className="w-6 h-6 animate-pulse text-fuchsia-400" />
              Forja_Estelar
            </>
          ) : (
            <>
              <ShieldAlert className="w-6 h-6" />
              Tabela_Periódica
            </>
          )}
        </button>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`
            flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase border transition-all duration-300
            ${showFilters || activeFilter 
              ? 'border-toxic text-toxic shadow-[0_0_10px_currentColor] bg-toxic/10' 
              : 'border-white/20 text-white/50 hover:border-white/50 hover:text-white bg-black/40'}
          `}
        >
          <Radar className={`w-4 h-4 ${activeFilter ? 'animate-spin-slow' : ''}`} />
          {activeFilter ? 'Scanner Em Uso' : 'Modo Scanner'}
        </button>
      </div>

      {/* Painel de Filtros Oculto */}
      <div className="absolute top-[80px] sm:top-[100px] w-full max-w-[95vw] lg:max-w-[85vw] z-20 flex justify-end pointer-events-none">
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
              className="bg-core/90 backdrop-blur-md border border-toxic/30 p-4 shadow-2xl pointer-events-auto max-w-2xl"
            >
              <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                <span className="font-mono text-xs tracking-widest text-white/50">
                  {isCosmic ? "FILTRAR ORIGEM CÓSMICA:" : "SELECIONE A FREQUÊNCIA:"}
                </span>
                <button onClick={closeFilters} className="text-white/40 hover:text-toxic">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {filterCategories.map(cat => {
                  const isActive = activeFilter === cat.id;
                  const baseColorClass = categoryStyles[cat.id].split(' ')[0]; 

                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleFilter(cat.id)}
                      className={`
                        px-3 py-1.5 text-[0.65rem] sm:text-xs font-mono uppercase border 
                        transition-all duration-300
                        ${isActive 
                          ? `${baseColorClass} border-current bg-white/10 shadow-[0_0_10px_currentColor_inset]` 
                          : 'border-white/10 text-slate-400 hover:border-white/30 hover:text-white bg-black/40'}
                      `}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Container Responsivo Matemático */}
      <div 
        className="relative flex-shrink-0 transition-opacity duration-500 z-10"
        style={{ width: 'min(100%, calc((100vh - 7rem) * 1.8))', aspectRatio: '18 / 10' }}
      >
        <div 
          className="absolute inset-0 grid gap-[2px] sm:gap-1"
          style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', gridTemplateRows: 'repeat(10, minmax(0, 1fr))' }}
        >
          {elements.map((el) => {
            const gridRow = el.row >= 8 ? el.row + 1 : el.row;
            const isScannedOut = activeFilter !== null && activeFilter !== el.category;

            return (
              <motion.button
                key={el.number}
                onClick={() => setSelected(el)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: isScannedOut ? 1 : 1.1, zIndex: isScannedOut ? 1 : 50 }}
                style={{ gridColumn: el.column, gridRow: gridRow }}
                className={`
                  @container relative w-full h-full flex flex-col items-center justify-center 
                  glass-cell transition-all duration-500 cursor-crosshair group
                  ${isScannedOut 
                    ? 'opacity-10 grayscale brightness-50 pointer-events-none' 
                    : categoryStyles[el.category]
                  }
                `}
              >
                <span className="absolute top-[5%] left-[8%] text-[15cqw] font-mono opacity-60 group-hover:opacity-100 transition-opacity">
                  {el.number}
                </span>
                <strong className="text-[40cqw] font-bold leading-none tracking-tighter mt-[10%] drop-shadow-md">
                  {el.symbol}
                </strong>
                <span className="text-[12cqw] uppercase font-medium tracking-widest opacity-70 group-hover:opacity-100 truncate w-[90%] text-center mt-[2%]">
                  {el.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Modal - HUD de Inspeção */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-core/80 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className={`
                relative w-full max-w-2xl bg-[#0a0f0a] border border-white/10 p-8 shadow-2xl transition-all duration-500
                ${selected.category === 'actinide' ? 'border-toxic shadow-[0_0_30px_currentColor]' : ''}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white font-mono text-xs uppercase transition-colors"
              >
                [ Esc ]
              </button>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* NOVO CÓDIGO: MODELO ATÔMICO 3D */}
                <div className={`
                  relative w-32 h-32 sm:w-40 sm:h-40 flex flex-col items-center justify-center flex-shrink-0 
                  transition-all duration-500 atom-container
                  ${selected.category === 'actinide' ? 'text-toxic' : 'text-white/80'}
                `}>
                  
                  {/* Órbitas com cálculo dinâmico de velocidade (Elementos pesados giram mais rápido) */}
                  <div 
                    className="orbit orbit-1 opacity-50" 
                    style={{ animationDuration: `${Math.max(1.5, 8 - selected.number * 0.05)}s` }} 
                  />
                  <div 
                    className="orbit orbit-2 opacity-50" 
                    style={{ animationDuration: `${Math.max(2, 10 - selected.number * 0.05)}s` }} 
                  />
                  <div 
                    className="orbit orbit-3 opacity-50" 
                    style={{ animationDuration: `${Math.max(2.5, 12 - selected.number * 0.05)}s` }} 
                  />

                  {/* Núcleo (Símbolo do Elemento) com Glassmorphism centralizado */}
                  <div className={`
                    relative z-10 flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full 
                    backdrop-blur-md border border-current/20 shadow-[0_0_20px_currentColor_inset]
                    ${selected.category === 'actinide' ? 'bg-[#0a150a]/80 hazard-bg bg-opacity-20' : 'bg-black/40'}
                  `}>
                    <span className="font-mono text-[0.6rem] sm:text-sm opacity-70 -mb-1">
                      {selected.number}
                    </span>
                    <span className="text-4xl sm:text-5xl font-bold drop-shadow-[0_0_10px_currentColor]">
                      {selected.symbol}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-4xl font-bold uppercase tracking-widest text-white mb-1 drop-shadow-sm">
                      {selected.name}
                    </h2>
                    <span className="font-mono text-xs text-toxic border border-toxic/30 px-2 py-1 bg-toxic/5 transition-colors">
                      CLASSE: {selected.category.replace(/-/g, '_').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed font-light">
                    {selected.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-4 font-mono text-xs text-slate-500">
                    <div>
                      SETOR (COL) <span className="text-white ml-2 text-sm">{selected.column}</span>
                    </div>
                    <div>
                      NÍVEL (LIN) <span className="text-white ml-2 text-sm">{selected.row}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}