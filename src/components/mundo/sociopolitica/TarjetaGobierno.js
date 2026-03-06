"use client";
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function TarjetaGobierno({ titulo, descripcion, icono, activo, alHacerClic, alEditar, alEliminar }) {
  return (
    <div onClick={alHacerClic} className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full ${activo ? 'bg-[#BFD7ED]/10 border-[#BFD7ED] shadow-[0_0_30px_rgba(191,215,237,0.3)] scale-105' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
      
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 flex gap-1 z-10 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); alEditar(); }} className="p-1.5 bg-white text-blue-500 rounded-full shadow-sm hover:scale-110"><Edit size={14}/></button>
        <button onClick={(e) => { e.stopPropagation(); alEliminar(); }} className="p-1.5 bg-white text-red-500 rounded-full shadow-sm hover:scale-110"><Trash2 size={14}/></button>
      </div>

      <div className={`mb-4 w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${activo ? 'text-[#3B82F6] bg-[#BFD7ED]' : 'text-slate-400 bg-slate-50 group-hover:bg-slate-100'}`}>
        {icono}
      </div>
      
      {activo && <div className="absolute top-6 right-6 bg-[#BFD7ED] text-slate-800 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Activo</div>}
      
      <h4 className="text-lg font-black text-slate-800 mb-2">{titulo}</h4>
      <p className="text-slate-500 text-xs leading-relaxed flex-1">{descripcion}</p>
    </div>
  );
}