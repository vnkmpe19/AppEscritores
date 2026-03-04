"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { FileText, User, Film, Zap, Flame, Heart, AlertCircle, Archive } from "lucide-react";

const ESTADOS = {
  cruda: { label: "Idea cruda", color: "bg-amber-100 text-amber-800", icon: Zap },
  evaluacion: { label: "En evaluación", color: "bg-sky-100 text-sky-800", icon: AlertCircle },
  potencial: { label: "Potencial fuerte", color: "bg-emerald-100 text-emerald-800", icon: Flame },
  experimento: { label: "En experimento", color: "bg-violet-100 text-violet-800", icon: Film },
  archivada: { label: "Archivada", color: "bg-slate-100 text-slate-500", icon: Archive },
};

const TIPO_ICON = {
  ocurrencia: FileText,
  personaje: User,
  escena: Film,
  hecho: Zap,
};

function OccurrenceNode({ data, selected }) {
  const state = ESTADOS[data?.estado || "cruda"];
  const TipoIcon = TIPO_ICON[data?.tipo || "ocurrencia"];
  const StateIcon = state?.icon || Zap;

  return (
    <div
      className={`min-w-[200px] max-w-[260px] rounded-[32px] shadow-xl border-2 transition-all duration-300 bg-white
        ${selected ? "border-[#FF5C5C] ring-4 ring-[#FF5C5C]/10 scale-105" : "border-transparent hover:border-[#BFD7ED]"}`}
      style={{ backgroundColor: data?.emotionColor || "#FFFFFF" }}
    >
      {/* Puntos de conexión (Handles) */}
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-slate-300" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-slate-300" />

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[#FFB7C5]">
            <TipoIcon size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">{data?.tipo}</span>
          </div>
          <span className={`text-[8px] font-black px-2 py-1 rounded-full ${state.color} uppercase`}>
            {state.label}
          </span>
        </div>

        <h4 className="text-sm font-black text-slate-800 leading-tight mb-2">
          {data?.title || "Sin título"}
        </h4>
        
        <p className="text-[11px] text-slate-500 line-clamp-3 italic leading-relaxed">
          &quot;{data?.content}&quot;
        </p>

        {/* Etiquetas de capas/marcadores */}
        <div className="flex flex-wrap gap-1 mt-4">
          {data?.marcadores?.map((m) => (
            <span key={m} className="bg-rosa-acento/10 text-rosa-acento text-[8px] font-black px-2 py-0.5 rounded-md uppercase">
              #{m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(OccurrenceNode);