"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, ChevronLeft } from "lucide-react";

const ORDEN_OPTIONS = [
  { id: "narrativo", label: "Momento narrativo" },
  { id: "edad", label: "Edad del personaje" },
  { id: "alternativa", label: "Línea alternativa" },
];

export default function TimelineView({
  nodes,
  ordenPor,
  setOrdenPor,
  onVolver,
}) {
  const nodosOrdenados = useMemo(() => {
    const copia = [...nodes];
    if (ordenPor === "narrativo") {
      return copia.sort(
        (a, b) => (a.data?.momentoNarrativo ?? 0) - (b.data?.momentoNarrativo ?? 0)
      );
    }
    if (ordenPor === "edad") {
      return copia.sort(
        (a, b) => (a.data?.edadPersonaje ?? 0) - (b.data?.edadPersonaje ?? 0)
      );
    }
    return copia;
  }, [nodes, ordenPor]);

  return (
    <div className="h-full flex flex-col md:rounded-[40px] bg-white border border-slate-100 shadow-inner overflow-hidden">
      
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 border-b border-slate-100 bg-[#FEF9E7]/50 shrink-0">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <button
            onClick={onVolver}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl font-bold text-xs text-slate-600 hover:bg-white transition-all active:scale-95"
          >
            <ChevronLeft size={18} />
            <span className="hidden xs:inline">Volver</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-[#7BA3C9]" />
            <h3 className="font-black text-sm md:text-lg text-slate-800 uppercase tracking-tight">Línea temporal</h3>
          </div>
        </div>

        <select
          value={ordenPor}
          onChange={(e) => setOrdenPor(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-slate-200 bg-white font-bold text-xs text-slate-700 outline-none focus:ring-2 focus:ring-[#7BA3C9]/20"
        >
          {ORDEN_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              Ordenar por: {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto p-4 md:p-12 bg-slate-50/30 custom-scrollbar">
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start min-w-full pb-10">
          {nodosOrdenados.map((node, i) => (
            <React.Fragment key={node.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center w-full md:w-auto"
              >
                <div
                  className="w-full max-w-[280px] md:w-56 p-5 rounded-[28px] shadow-sm border border-slate-100 bg-white hover:shadow-md transition-all relative overflow-hidden"
                  style={{
                    borderLeft: `6px solid ${node.data?.emotionColor || "#BFD7ED"}`,
                  }}
                >
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    {node.data?.tipo || "Ocurrencia"}
                  </p>
                  
                  <h4 className="font-black text-slate-800 text-sm md:text-base leading-tight mb-2">
                    {node.data?.label || node.data?.title || "Sin título"}
                  </h4>
                  
                  {node.data?.momentoNarrativo != null && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7BA3C9]" />
                      <p className="text-[10px] font-bold text-slate-500">
                        Momento: {node.data.momentoNarrativo}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {i < nodosOrdenados.length - 1 && (
                <div className="flex flex-col md:flex-rowitems-center justify-center shrink-0">
                  <div className="w-0.5 h-6 md:w-10 md:h-0.5 bg-slate-200" />
                  <div className="hidden md:block w-2 h-2 rounded-full bg-[#7BA3C9] -ml-1" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}