"use client";
import React, { useState, useRef } from 'react';
import { Plus, Image as ImageIcon, X, CheckSquare, AlignLeft } from 'lucide-react';

export default function NoteEditor({ onSave, onClose, data }) {
  const [title, setTitle] = useState(data?.title || '');
  const [content, setContent] = useState(data?.content || '');
  const [listItems, setListItems] = useState(data?.items || []);
  const [image, setImage] = useState(data?.image || null);
  const fileInputRef = useRef(null);

  const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;

  const addListItem = () => {
    setListItems([...listItems, { id: Date.now(), text: '', done: false }]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
    <div className="bg-white w-[350px] md:w-[500px] rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[80vh]">
      <div className="p-8 space-y-6 overflow-y-auto">
        {/* TÍTULO */}
        <input 
          type="text" placeholder="Título..." 
          className="w-full font-black text-2xl outline-none placeholder:text-slate-200"
          value={title} onChange={(e) => setTitle(e.target.value)}
        />

        {/* IMAGEN PREVIA */}
        {image && (
          <div className="relative rounded-2xl overflow-hidden shadow-md">
            <img src={image} className="w-full h-44 object-cover" alt="Adjunto" />
            <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={16}/></button>
          </div>
        )}

        {/* TEXTO LIBRE */}
        <textarea 
          placeholder="Escribe tu idea principal aquí..."
          className="w-full min-h-[100px] outline-none resize-none text-slate-600 font-medium leading-relaxed"
          value={content}
          onChange={(e) => {
            if (e.target.value.split(/\s+/).length <= 400) setContent(e.target.value);
          }}
        />

        {/* LISTA DE TAREAS (Si existen items) */}
        {listItems.length > 0 && (
          <div className="space-y-2 border-t pt-4 border-slate-50">
            <p className="text-[10px] font-black text-slate-300 tracking-widest uppercase mb-2">Checklist</p>
            {listItems.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3">
                <input type="checkbox" checked={item.done} onChange={() => {
                  const newItems = [...listItems];
                  newItems[idx].done = !newItems[idx].done;
                  setListItems(newItems);
                }} className="rounded-md border-slate-200 text-[#FFB7C5] focus:ring-[#FFB7C5]" />
                <input 
                  type="text" className={`flex-1 outline-none text-sm font-medium ${item.done ? 'line-through text-slate-300' : 'text-slate-600'}`}
                  placeholder="Elemento de la lista..."
                  value={item.text}
                  onChange={(e) => {
                    const newItems = [...listItems];
                    newItems[idx].text = e.target.value;
                    setListItems(newItems);
                  }}
                />
                <button onClick={() => setListItems(listItems.filter(i => i.id !== item.id))}><X size={14} className="text-slate-300 hover:text-red-400"/></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BARRA DE HERRAMIENTAS */}
      <div className="bg-slate-50/80 px-8 py-4 flex justify-between items-center">
        <div className="flex gap-5 text-slate-400">
          {/* Botón para añadir Checklist sin borrar el texto */}
          <button onClick={addListItem} title="Añadir Checklist" className="hover:text-[#FF5C5C] transition-colors"><CheckSquare size={20} /></button>
          
          {/* Botón para Imagen */}
          <button onClick={() => fileInputRef.current.click()} title="Añadir Imagen" className="hover:text-[#FF5C5C] transition-colors">
            <ImageIcon size={20} />
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </button>

          <span className={`text-[10px] font-black self-center tracking-widest ${wordCount >= 380 ? 'text-red-500' : 'text-slate-300'}`}>
            {wordCount}/400 PALABRAS
          </span>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="text-xs font-black text-slate-400 px-4 py-2 hover:bg-slate-200 rounded-xl uppercase">Cerrar</button>
          <button onClick={() => onSave({ title, content, items: listItems, image })} className="text-xs font-black bg-[#FFB7C5] text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-all uppercase">Guardar</button>
        </div>
      </div>
    </div>
  );
}