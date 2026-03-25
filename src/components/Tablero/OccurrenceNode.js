"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { FileText, User, Film, Zap, Flame, AlertCircle, Archive } from "lucide-react";

const ESTADOS = {
  cruda: { label: "Idea cruda", color: "bg-amber-100 text-amber-800", icon: Zap },
  evaluacion: { label: "En evaluación", color: "bg-sky-100 text-sky-800", icon: AlertCircle },
  potencial: { label: "Potencial fuerte", color: "bg-emerald-100 text-emerald-800", icon: Flame },
  experimento: { label: "En experimento", color: "bg-violet-100 text-violet-800", icon: Film },
  archivada: { label: "Archivada", color: "bg-slate-100 text-slate-500", icon: Archive },
  Todos: { label: "Idea cruda", color: "bg-amber-100 text-amber-800", icon: Zap },
};

const TIPO_ICON = {
  ocurrencia: FileText,
  personaje: User,
  escena: Film,
  hecho: Zap,
  Idea: FileText,
};

function OccurrenceNode({ data, selected }) {
  const state = ESTADOS[data?.estado] || ESTADOS["cruda"];
  const TipoIcon = TIPO_ICON[data?.tipo] || TIPO_ICON["ocurrencia"] || FileText;

  return (
    <div
      className={`min-w-[160px] sm:min-w-[200px] max-w-[260px] rounded-[24px] sm:rounded-[32px] shadow-xl border-2 transition-all duration-300 bg-white
        ${selected ? "border-[#FF5C5C] ring-4 ring-[#FF5C5C]/10 scale-105" : "border-transparent hover:border-[#BFD7ED]"}`}
      style={{ backgroundColor: data?.emotionColor || "#FFFFFF" }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!w-4 !h-4 sm:!w-3 sm:!h-3 !bg-slate-300 border-2 border-white shadow-sm" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-4 !h-4 sm:!w-3 sm:!h-3 !bg-[#FF5C5C] border-2 border-white shadow-sm" 
      />

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[#FFB7C5]">
            <TipoIcon size={14} className="sm:w-[14px]" />
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest truncate max-w-[60px]">
              {data?.tipo}
            </span>
          </div>
          <span className={`text-[7px] sm:text-[8px] font-black px-2 py-0.5 sm:py-1 rounded-full ${state.color} uppercase whitespace-nowrap`}>
            {state.label}
          </span>
        </div>

        <h4 className="text-xs sm:text-sm font-black text-slate-800 leading-tight mb-2 line-clamp-2">
          {data?.title || "Sin título"}
        </h4>
        
        <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2 sm:line-clamp-3 italic leading-relaxed">
          &quot;{data?.content}&quot;
        </p>

        {data?.marcadores?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 sm:mt-4">
            {data.marcadores.map((m) => (
              <span key={m} className="bg-[#FF5C5C]/10 text-[#FF5C5C] text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">
                #{m}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(OccurrenceNode);