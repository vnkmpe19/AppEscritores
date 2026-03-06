"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Plus, Trash2 } from 'lucide-react'; // Importado Trash2
import { useAppStore } from '@/store/useAppStore';

export default function OcurrenciasDrawer({ isOpen, onClose, onInsert }) {
  const notes = useAppStore((state) => state.notes);
  const deleteNote = useAppStore((state) => state.deleteNote); // Selector para eliminar

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-[110] border-l border-slate-100 flex flex-col"
    >
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-[#FEF9E7]/50">
        <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Tus Ocurrencias</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X size={20} className="text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="relative bg-[#FFFDF2] p-4 rounded-3xl border border-amber-100 shadow-sm group">
              <button 
                onClick={() => deleteNote(note.id)} 
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                title="Eliminar nota"
              >
                <Trash2 size={14} />
              </button>

              <div className="flex items-center gap-2 mb-2 text-[#FFB7C5]">
                <FileText size={14} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Nota</span>
              </div>
              
              <h4 className="font-black text-xs text-slate-800 mb-1">{note.title}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-3 italic mb-3">"{note.content}"</p>
              
              <button 
                onClick={() => onInsert(note.content)}
                className="w-full py-2 bg-white border border-amber-200 rounded-xl text-[10px] font-black uppercase text-amber-600 hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Plus size={12} /> Insertar en hoja
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-300 text-xs mt-10">No hay ocurrencias guardadas.</p>
        )}
      </div>
    </motion.div>
  );
}