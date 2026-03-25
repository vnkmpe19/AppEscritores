"use client";
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function TarjetaGobierno({ titulo, descripcion, icono, activo, alHacerClic, alEditar, alEliminar }) {
  return (
    <div 
      onClick={alHacerClic} 
      className={`p-4 sm:p-5 md:p-6 rounded-[24px] sm:rounded-[32px] border-2 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full ${
        activo 
          ? 'bg-[#BFD7ED]/10 border-[#BFD7ED] shadow-[0_0_20px_rgba(191,215,237,0.3)] sm:shadow-[0_0_30px_rgba(191,215,237,0.3)] scale-[1.02] sm:scale-105' 
          : 'bg-white border-slate-100 hover:border-slate-200'
      }`}
    >
      
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 flex gap-1 sm:gap-1.5 z-20 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); alEditar(); }} className="p-1.5 bg-white text-blue-500 rounded-full shadow-sm hover:scale-110">
          <Edit size={14} className="sm:w-4 sm:h-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); alEliminar(); }} className="p-1.5 bg-white text-red-500 rounded-full shadow-sm hover:scale-110">
          <Trash2 size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div> 

      <div className={`mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl transition-colors shrink-0 ${
        activo ? 'text-[#3B82F6] bg-[#BFD7ED]' : 'text-slate-400 bg-slate-50 group-hover:bg-slate-100'
      }`}>
        {icono}
      </div>
      
      {activo && (
        <div className="absolute top-14 right-3 sm:top-6 sm:right-24 bg-[#BFD7ED] text-slate-800 text-[8px] sm:text-[9px] font-black px-2 sm:px-3 py-1 rounded-full uppercase tracking-widest shadow-sm z-10">
          Activo
        </div>
      )}
      
      <h4 className="text-base sm:text-lg font-black text-slate-800 mb-1.5 sm:mb-2 pr-12 sm:pr-0">{titulo}</h4>
      <p className="text-slate-500 text-[10px] sm:text-xs leading-relaxed flex-1 line-clamp-3 sm:line-clamp-none">{descripcion}</p>
    </div>
  );
}