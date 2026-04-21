"use client";
import React from 'react';
import { X, FileText, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/app/lib/supabase';

export default function OcurrenciasDrawer({ isOpen, onClose, onInsert, projectId }) {
  const [notes, setNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && projectId) {
      fetchNotes();
    }
  }, [isOpen, projectId]);

  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ocurrencias')
      .select('*')
      .eq('id_proyecto', projectId)
      .order('fecha_creacion', { ascending: false });

    if (data) setNotes(data);
    setLoading(false);
  };

  const insertNote = (note) => {
    let textToInsert = "";
    if (note.type === 'list' && note.items) {
      textToInsert = note.items.map(i => `• ${i.text}`).join('\n');
    } else {
      textToInsert = note.content || "";
    }
    onInsert(`<p><strong>${note.title}</strong></p><p>${textToInsert.replace(/\n/g, '<br>')}</p>`);
  };

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
        {loading ? (
             <div className="text-center py-10 text-slate-400 text-xs font-bold">Cargando tus ideas...</div>
        ) : notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="relative bg-[#FFFDF2] p-5 rounded-[30px] border border-amber-100 shadow-sm group">
              <div className="flex items-center gap-2 mb-2 text-[#FFB7C5]">
                <FileText size={14} />
                <span className="text-[10px] font-black uppercase tracking-tighter">{note.type === 'list' ? 'Lista' : 'Nota'}</span>
              </div>
              
              <h4 className="font-black text-xs text-slate-800 mb-1">{note.title}</h4>
              
              {note.type === 'list' ? (
                <ul className="mb-3 space-y-1">
                  {note.items?.slice(0, 3).map((item, i) => (
                    <li key={i} className="text-[10px] text-slate-500 flex gap-2">
                       <span>•</span> <span className={item.completed ? 'line-through' : ''}>{item.text}</span>
                    </li>
                  ))}
                  {note.items?.length > 3 && <li className="text-[9px] text-slate-300 italic">+ {note.items.length - 3} más...</li>}
                </ul>
              ) : (
                <p className="text-[11px] text-slate-500 line-clamp-3 italic mb-3">"{note.content}"</p>
              )}
              
              <button 
                onClick={() => insertNote(note)}
                className="w-full py-2 bg-white border border-amber-200 rounded-xl text-[10px] font-black uppercase text-amber-600 hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus size={12} /> Insertar en escena
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 px-6">
             <FileText size={40} className="mx-auto mb-4 text-slate-100" />
             <p className="text-slate-300 text-[11px] font-bold">No hay ocurrencias para este proyecto.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}