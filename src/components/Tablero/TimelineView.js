"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, ChevronLeft } from "lucide-react";

const ORDEN_OPTIONS = [
  { id: "narrativo", label: "Momento narrativo" },
  { id: "edad", label: "Edad del personaje" },
  { id: "alternativa", label: "Línea alternativa" },
];

export default function TimelineView({
  nodes,
  edges,
  ordenPor,
  setOrdenPor,
  onVolver,
}) {
  const nodosOrdenados = React.useMemo(() => {
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
    <div className="h-full flex flex-col rounded-[40px] bg-white border border-slate-100 shadow-inner overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#FEF9E7]/50">
        <button
          onClick={onVolver}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft size={18} />
          Volver al tablero
        </button>
        <div className="flex items-center gap-3">
          <Clock size={22} className="text-[#7BA3C9]" />
          <h3 className="font-black text-lg text-slate-800">Línea temporal</h3>
        </div>
        <select
          value={ordenPor}
          onChange={(e) => setOrdenPor(e.target.value)}
          className="px-4 py-2 rounded-2xl border border-slate-200 bg-white font-bold text-sm text-slate-700"
        >
          {ORDEN_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto p-8">
        <div className="flex gap-6 items-start min-w-max pb-8">
          {nodosOrdenados.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center"
            >
              <div
                className="w-48 p-4 rounded-[24px] shadow-md border-2 border-slate-100 bg-white"
                style={{
                  borderLeftColor: node.data?.emotionColor || "#BFD7ED",
                  borderLeftWidth: 4,
                }}
              >
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  {node.data?.tipo || "Ocurrencia"}
                </p>
                <h4 className="font-black text-slate-800 text-sm leading-tight">
                  {node.data?.label || node.data?.title || "Sin título"}
                </h4>
                {node.data?.momentoNarrativo != null && (
                  <p className="text-[10px] text-slate-500 mt-2">
                    Momento: {node.data.momentoNarrativo}
                  </p>
                )}
              </div>
              {i < nodosOrdenados.length - 1 && (
                <div className="w-8 h-0.5 bg-[#7BA3C9] my-2 flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
