"use client";

import { useState } from "react";
import { elements, ChemicalElement } from "@/src/data/elementsData";


const categoryColors: Record<string, string> = {
  "nonmetal": "border-green-500 hover:shadow-[inset_0_0_15px_rgba(34,197,94,0.3)]",
  "noble-gas": "border-purple-500 hover:shadow-[inset_0_0_15px_rgba(168,85,247,0.3)]",
  "alkali-metal": "border-red-500 hover:shadow-[inset_0_0_15px_rgba(239,68,68,0.3)]",
  "alkaline-earth-metal": "border-orange-500 hover:shadow-[inset_0_0_15px_rgba(249,115,22,0.3)]",
  "metalloid": "border-teal-500 hover:shadow-[inset_0_0_15px_rgba(20,184,166,0.3)]",
  "halogen": "border-yellow-400 hover:shadow-[inset_0_0_15px_rgba(250,204,21,0.3)]",
  "post-transition-metal": "border-blue-400 hover:shadow-[inset_0_0_15px_rgba(96,165,250,0.3)]",
  "transition-metal": "border-blue-600 hover:shadow-[inset_0_0_15px_rgba(37,99,235,0.3)]",
  "lanthanide": "border-cyan-400 hover:shadow-[inset_0_0_15px_rgba(34,211,238,0.3)]",
  "actinide": "border-lime-400 hover:shadow-[inset_0_0_15px_rgba(163,230,53,0.3)]",
};



export default function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);

  return (
    // Fundo geral da página
    <div className="min-h-screen bg-gray-950 text-gray-200 p-8 font-sans selection:bg-blue-500/30">

      {/* Container do Grid */}
      <main 
        className="grid gap-1.5 mx-auto max-w-325px" 
        style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
      >
        {elements.map((el) => (
          <div
            key={el.number}
            onClick={() => setSelectedElement(el)}
            style={{ gridColumn: el.column, gridRow: el.row }}
            // Classes do Tailwind misturadas com as cores dinâmicas
            className={`
              relative flex flex-col items-center justify-center p-2 
              bg-gray-900 border border-opacity-40 rounded-md cursor-pointer 
              transition-all duration-200 ease-in-out
              hover:scale-[1.15] hover:z-10 hover:border-opacity-100 hover:bg-gray-800
              ${categoryColors[el.category] || "border-gray-600"}
            `}
          >
            <span className="absolute top-1 left-1.5 text-[0.6rem] text-gray-400 font-mono">
              {el.number}
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              {el.symbol}
            </h2>
            <span className="text-[0.65rem] truncate w-full text-center text-gray-300">
              {el.name}
            </span>
          </div>
        ))}
      </main>

      {/* Painel de Leitura (Modal centralizado com Tailwind) */}
      {selectedElement && (
        <>
          {/* Fundo escurecido (Overlay) */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setSelectedElement(null)}
          ></div>
          
          {/* Caixa do Modal */}
          <aside className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-700 p-8 rounded-xl shadow-2xl z-50 w-[90%] max-w-md">
            <button 
              onClick={() => setSelectedElement(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-3xl font-bold text-white">{selectedElement.name}</h2>
              <span className="text-2xl font-mono text-gray-500">{selectedElement.symbol}</span>
            </div>
            
            <div className="space-y-3 text-sm text-gray-300">
              <p>
                <strong className="text-white">Número Atômico:</strong> {selectedElement.number}
              </p>
              <p>
                <strong className="text-white">Categoria:</strong>{" "}
                <span className="capitalize">{selectedElement.category.replace(/-/g, ' ')}</span>
              </p>
              <div className="h-px bg-gray-800 w-full my-4"></div>
              <p className="leading-relaxed text-base">
                {selectedElement.summary}
              </p>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
