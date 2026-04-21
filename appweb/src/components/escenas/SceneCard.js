"use client";
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, MoreVertical, Edit3 } from 'lucide-react';

const SceneCard = ({ data, selected }) => {
  return (
    <div className={`min-w-[150px] sm:min-w-[180px] max-w-[220px] bg-white rounded-[24px] sm:rounded-[32px] shadow-xl border-2 transition-all 
      ${selected ? 'border-[#FF5C5C] scale-105 shadow-[#FF5C5C]/20' : 'border-transparent hover:border-slate-100'}`}>
      
      <Handle type="target" position={Position.Top} className="!bg-slate-300 w-2 h-2 sm:w-2.5 sm:h-2.5" />
      <Handle type="source" position={Position.Bottom} className="!bg-[#FF5C5C] w-2 h-2 sm:w-2.5 sm:h-2.5" />
      
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[#BFD7ED]">
            <FileText size={12} className="sm:w-[14px]" />
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-ellipsis overflow-hidden">Escena</span>
          </div>

          <div className="relative group/menu nodrag nopan"> 
            <button className="p-2 sm:p-1.5 hover:bg-slate-50 rounded-full text-slate-300 transition-colors active:bg-slate-100">
              <MoreVertical size={14} />
            </button>
            
            <div className="absolute right-0 top-full hidden group-hover/menu:block pt-1 z-[100] animate-in fade-in zoom-in duration-150">
              <div className="bg-white shadow-2xl rounded-2xl border border-slate-50 py-2 min-w-[120px] sm:min-w-[100px]">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (typeof data.onEdit === 'function') data.onEdit(); 
                  }}
                  className="w-full px-4 py-3 sm:py-2 text-left text-[11px] sm:text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors rounded-xl"
                >
                  <Edit3 size={14} className="text-blue-500 sm:w-3 sm:h-3" /> Abrir Editor
                </button>
              </div>
            </div>
          </div>
        </div>

        <h4 className="text-xs sm:text-sm font-black text-slate-800 leading-tight mb-1 sm:mb-2 line-clamp-2">
          {data.label}
        </h4>
        <p className="text-[9px] sm:text-[10px] text-slate-400 line-clamp-2 sm:line-clamp-3 italic leading-relaxed">
          {data.summary || "Empieza a escribir el contenido de esta escena..."}
        </p>
      </div>
    </div>
  );
};

export default memo(SceneCard);