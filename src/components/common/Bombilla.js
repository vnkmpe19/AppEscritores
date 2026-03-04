"use client";
import React, { useState } from 'react';
import { Plus, X, List, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Bombilla() {
  const [showEditor, setShowEditor] = useState(false);
  const [notes, setNotes] = useState([]);

  const handleSaveNote = (newNote) => {
    setNotes([newNote, ...notes]);
    setShowEditor(false);
    console.log("Ocurrencia guardada:", newNote);
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
          >
            <KeepEditor onSave={handleSaveNote} onClose={() => setShowEditor(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <button 
        onClick={() => setShowEditor(!showEditor)}
        className="bg-white p-4 rounded-full shadow-2xl border-2 border-[#E8F5A2] hover:scale-110 active:scale-95 transition-all group relative"
      >
        <img src="/bombilla.png" alt="Nueva Idea" className={`w-14 h-14 transition-transform duration-300 ${showEditor ? 'rotate-12' : ''}`} />
        <div className="absolute top-0 right-0 bg-[#FF5C5C] text-white rounded-full p-1.5 shadow-md group-hover:scale-110 transition-transform translate-x-1/4 -translate-y-1/4">
          <Plus size={16} strokeWidth={3} />
        </div>
      </button>
    </div>
  );
}

function KeepEditor({ onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('text'); 
  const [listItems, setListItems] = useState([{ text: '', done: false }]);
  const [image, setImage] = useState(null);
  const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
  
  const handleSave = () => {
    onSave({ id: Date.now(), title: title || 'Sin título', content, type, items: listItems, image, color: 'bg-white' });
  };
  
  return (
    <div className="bg-white w-[350px] md:w-[450px] rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
      <div className="p-6 space-y-4">
        <input type="text" placeholder="Título..." className="w-full font-black text-2xl outline-none placeholder:text-slate-200" value={title} onChange={(e) => setTitle(e.target.value)} />
        {type === 'text' ? (
          <textarea placeholder="Escribe una ocurrencia..." className="w-full min-h-[120px] outline-none resize-none text-slate-600 font-medium" value={content} onChange={(e) => { if (e.target.value.split(/\s+/).length <= 400) setContent(e.target.value); }} />
        ) : (
          <div className="space-y-2">
            {listItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Plus size={14} className="text-slate-300" />
                <input type="text" placeholder="Elemento..." className="flex-1 outline-none text-sm font-medium border-b border-slate-50" value={item.text} onChange={(e) => { const newItems = [...listItems]; newItems[idx].text = e.target.value; setListItems(newItems); }} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-slate-50 px-6 py-4 flex justify-between items-center">
        <div className="flex gap-4 text-slate-400">
           <span className="text-[10px] font-black uppercase tracking-widest">{wordCount}/400 PALABRAS</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="text-xs font-black text-slate-400 px-3 py-1.5 hover:bg-slate-200 rounded-lg transition-all">Cerrar</button>
          <button onClick={handleSave} className="text-xs font-black bg-[#FFB7C5] text-white px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition-all">Guardar</button>
        </div>
      </div>
    </div>
  );
}