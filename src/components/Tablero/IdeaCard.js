"use client";

import React from "react";
import { FileText, User, Film, Zap } from "lucide-react";

const TIPO_ICON = {
  ocurrencia: FileText,
  personaje: User,
  escena: Film,
  hecho: Zap,
};

export default function IdeaCard({ title, content, tipo = "ocurrencia", onClick }) {
  const Icon = TIPO_ICON[tipo] || FileText;

  return (
    <div
      onClick={() => onClick({ title, content, tipo })}
      className="bg-white p-4 rounded-[28px] shadow-sm hover:scale-[1.02] hover:shadow-lg transition-all cursor-pointer border border-amber-50 group"
    >
      <div className="flex items-center gap-2 mb-2 text-[#FFB7C5]">
        <Icon size={14} />
        <span className="text-[10px] font-black uppercase">{tipo}</span>
      </div>
      <h4 className="font-black text-xs text-orange-600 mb-1">{title}</h4>
      <p className="text-[10px] text-slate-400 line-clamp-2 italic leading-relaxed">
        &ldquo;{content}&rdquo;
      </p>
    </div>
  );
}
