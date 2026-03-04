"use client";
import React, { useState } from 'react';
import { Plus, X, List, Image as ImageIcon } from 'lucide-react';

export default function Bombilla() {

  const [showEditor, setShowEditor] = useState(false);
  const [notes, setNotes] = useState([]);

  const handleSaveNote = (newNote) => {
    setNotes([newNote, ...notes]);
    setShowEditor(false);
    console.log("Ocurrencia guardada:", newNote);
  };

  return (
    <div className="fixed bottom-10 right-10 z-[60] flex flex-col items-end gap-4">
      {showEditor && <KeepEditor onSave={handleSaveNote} onClose={() => setShowEditor(false)} />}
      
      <button 
        onClick={() => setShowEditor(!showEditor)}
        className="bg-white p-4 rounded-full shadow-2xl border-2 border-[#E8F5A2] hover:scale-110 active:scale-95 transition-all group relative"
      >
        <img src="/bombilla.png" alt="Nueva Idea" className={`w-14 h-14 transition-transform ${showEditor ? 'rotate-12' : ''}`} />
        <div className="absolute top-0 right-0 bg-[#FF5C5C] text-white rounded-full p-1.5 shadow-md group-hover:scale-110 transition-transform translate-x-1/4 -translate-y-1/4">
          <Plus size={16} strokeWidth={3} />
        </div>
      </button>
    </div>
  );
}

// Sub-componente privado (solo se usa aquí adentro)
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
    <div className="bg-white w-[350px] md:w-[450px] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
      <div className="p-5 space-y-4">
        <input type="text" placeholder="Título" className="w-full font-bold text-xl outline-none placeholder:text-slate-300" value={title} onChange={(e) => setTitle(e.target.value)} />
        {type === 'text' ? (
          <textarea placeholder="Escribe una ocurrencia... (Máx 400 palabras)" className="w-full min-h-[120px] outline-none resize-none text-slate-600 leading-relaxed" value={content} onChange={(e) => { const words = e.target.value.trim().split(/\s+/); if (words.length <= 400) setContent(e.target.value); }} />
        ) : (
          <div className="space-y-2">
            {listItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Plus size={14} className="text-slate-300" />
                <input type="text" placeholder="Elemento de lista" className="flex-1 outline-none text-sm" value={item.text} onChange={(e) => { const newItems = [...listItems]; newItems[idx].text = e.target.value; setListItems(newItems); }} />
              </div>
            ))}
            <button onClick={() => setListItems([...listItems, { text: '', done: false }])} className="text-xs text-blue-400 font-bold flex items-center gap-1 mt-2">
              <Plus size={12} /> Añadir elemento
            </button>
          </div>
        )}
        {image && (
          <div className="relative rounded-xl overflow-hidden group">
            <img src={image} alt="Adjunto" className="w-full h-32 object-cover" />
            <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={14}/></button>
          </div>
        )}
      </div>
      <div className="bg-slate-50 px-5 py-3 flex justify-between items-center">
        <div className="flex gap-4 text-slate-400">
          <button onClick={() => setType(type === 'text' ? 'list' : 'text')} title="Cambiar a lista"><List size={18} /></button>
          <label className="cursor-pointer"><ImageIcon size={18} /><input type="file" className="hidden" onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))} /></label>
          <span className={`text-[10px] font-bold self-center ${wordCount >= 380 ? 'text-red-500' : ''}`}>{wordCount}/400 PALABRAS</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="text-xs font-bold text-slate-400 px-3 py-1.5 hover:bg-slate-200 rounded-lg">Cerrar</button>
          <button onClick={handleSave} className="text-xs font-bold bg-[#FFB7C5] text-white px-4 py-1.5 rounded-lg shadow-sm hover:brightness-95">Guardar</button>
        </div>
      </div>
    </div>
  );
}