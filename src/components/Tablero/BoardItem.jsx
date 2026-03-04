"use client";
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, FileText } from 'lucide-react';

export default function BoardItem({ item, onMove, onSelectForLink, onDelete, linkMode, isSelected }) {
  const itemRef = useRef(null);

  // Función para calcular el centro y enviarlo al padre
  const reportCoords = () => {
    if (itemRef.current) {
      const x = itemRef.current.offsetLeft + itemRef.current.offsetWidth / 2;
      const y = itemRef.current.offsetTop + itemRef.current.offsetHeight / 2;
      onMove(item.id, x, y);
    }
  };

  // Reportar posición al cargar y al arrastrar
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
      className={`absolute z-20 select-none transition-shadow
        ${linkMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}
        ${isSelected ? 'scale-105 ring-4 ring-[#FF5C5C] ring-offset-4 rounded-[30px]' : ''}`}
    >
      <div className="bg-white p-5 rounded-[30px] shadow-xl border border-slate-100 min-w-[160px] max-w-[220px] relative group">
        {!linkMode && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            className="absolute -top-2 -right-2 bg-red-400 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 z-30 transition-opacity"
          >
            <X size={10} />
          </button>
        )}

        <div className="flex items-center gap-2 mb-2 text-[#FFB7C5]">
          <FileText size={14}/> 
          <span className="text-[9px] font-black uppercase tracking-widest">Ocurrencia</span>
        </div>
        <h4 className="text-sm font-black text-slate-800 leading-tight mb-1">{item.title}</h4>
        <p className="text-[10px] text-slate-400 line-clamp-2 italic leading-relaxed">
          {item.content}
        </p>
      </div>
    </motion.div>
  );
}