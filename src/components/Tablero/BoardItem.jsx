"use client";
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, FileText } from 'lucide-react';

export default function BoardItem({ item, onMove, onSelectForLink, onDelete, linkMode, isSelected }) {
  const itemRef = useRef(null);

  const reportCoords = () => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const parent = itemRef.current.offsetParent?.getBoundingClientRect();
      
      if (parent) {
        const x = (rect.left - parent.left) + rect.width / 2;
        const y = (rect.top - parent.top) + rect.height / 2;
        onMove(item.id, x, y);
      }
    }
  };

  useEffect(() => {
    reportCoords();
  }, []);

  return (
    <motion.div
      ref={itemRef}
      drag={!linkMode}
      dragMomentum={false}
      onDrag={reportCoords} // Actualiza la línea mientras arrastras
      initial={{ x: item.x, y: item.y }}
      onTap={() => { if (linkMode) onSelectForLink(item.id); }}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
      className={`absolute z-20 select-none transition-shadow
        ${linkMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}
        ${isSelected ? 'scale-105 ring-4 ring-[#FF5C5C] ring-offset-4 rounded-[30px]' : ''}`}
    >
      <div className="bg-white p-4 md:p-5 rounded-[24px] md:rounded-[30px] shadow-xl border border-slate-100 min-w-[140px] md:min-w-[160px] max-w-[200px] md:max-w-[220px] relative group">
        
        {!linkMode && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            className="absolute -top-2 -right-2 bg-red-400 text-white p-2 md:p-1 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 z-30 transition-all shadow-lg active:scale-90"
          >
            <X size={14} className="md:w-[10px] md:h-[10px]" />
          </button>
        )}

        <div className="flex items-center gap-1.5 md:gap-2 mb-2 text-[#FFB7C5]">
          <FileText size={14} className="shrink-0" /> 
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest truncate">Ocurrencia</span>
        </div>

        <h4 className="text-xs md:text-sm font-black text-slate-800 leading-tight mb-1 line-clamp-2">
          {item.title}
        </h4>
        <p className="text-[9px] md:text-[10px] text-slate-400 line-clamp-2 md:line-clamp-3 italic leading-relaxed">
          {item.content}
        </p>
      </div>
    </motion.div>
  );
}