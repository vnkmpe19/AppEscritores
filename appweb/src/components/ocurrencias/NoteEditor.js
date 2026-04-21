"use client";
import React, { useState, useRef } from 'react';
import { Plus, Image as ImageIcon, X, CheckSquare, AlignLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';

export default function NoteEditor({ onSave, onClose, data }) {
  const [title, setTitle] = useState(data?.title || '');
  const [content, setContent] = useState(data?.content || '');
  const [listItems, setListItems] = useState(data?.items || []);
  const [image, setImage] = useState(data?.imagen_url || data?.foto || data?.imagen || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;

  const addListItem = () => {
    setListItems([...listItems, { id: Date.now(), text: '', done: false }]);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const ext = file.name.split('.').pop();
    const path = `ocurrencias/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('imagenes').upload(path, file, { upsert: true });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('imagenes').getPublicUrl(path);
      setImage(publicUrl);
    }
    setUploadingImage(false);
  };

  return (
    <div className="bg-white w-[90vw] sm:w-[400px] md:w-[500px] rounded-[24px] md:rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh]">
      <div className="p-5 sm:p-6 md:p-8 space-y-4 md:space-y-6 overflow-y-auto custom-scrollbar">
      
        <input 
          type="text" placeholder="Título..." 
          className="w-full font-black text-xl md:text-2xl outline-none placeholder:text-slate-200 text-slate-800"
          value={title} onChange={(e) => setTitle(e.target.value)}
        />

        {image && (
          <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-md">
            <img src={image} className="w-full h-32 sm:h-40 md:h-44 object-cover" alt="Adjunto" />
            <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors">
              <X size={14} className="md:w-4 md:h-4" />
            </button>
          </div>
        )}

        <textarea 
          placeholder="Escribe tu idea principal aquí..."
          className="w-full min-h-[100px] sm:min-h-[120px] outline-none resize-none text-slate-600 font-medium leading-relaxed text-sm md:text-base"
          value={content}
          onChange={(e) => {
            if (e.target.value.split(/\s+/).length <= 400) setContent(e.target.value);
          }}
        />

        {listItems.length > 0 && (
          <div className="space-y-2 border-t pt-3 md:pt-4 border-slate-50">
            <p className="text-[9px] md:text-[10px] font-black text-slate-300 tracking-widest uppercase mb-2 md:mb-2">Checklist</p>
            {listItems.map((item, idx) => (
              <div key={item.id} className="flex items-start sm:items-center gap-2 sm:gap-3 group">
                <input 
                  type="checkbox" 
                  checked={item.done} 
                  onChange={() => {
                    const newItems = [...listItems];
                    newItems[idx].done = !newItems[idx].done;
                    setListItems(newItems);
                  }} 
                  className="mt-1 sm:mt-0 w-4 h-4 rounded border-slate-200 text-[#FFB7C5] focus:ring-[#FFB7C5] cursor-pointer" 
                />
                <input 
                  type="text" 
                  className={`flex-1 outline-none text-xs sm:text-sm font-medium bg-transparent ${item.done ? 'line-through text-slate-300' : 'text-slate-600'}`}
                  placeholder="Elemento de la lista..."
                  value={item.text}
                  onChange={(e) => {
                    const newItems = [...listItems];
                    newItems[idx].text = e.target.value;
                    setListItems(newItems);
                  }}
                />
                <button 
                  onClick={() => setListItems(listItems.filter(i => i.id !== item.id))}
                  className="p-1 text-slate-300 hover:text-red-400 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <X size={14} className="md:w-4 md:h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-50/80 px-4 sm:px-6 md:px-8 py-3 md:py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 border-t border-slate-100">
        <div className="flex items-center gap-4 md:gap-5 text-slate-400 w-full sm:w-auto justify-center sm:justify-start">
          <button onClick={addListItem} title="Añadir Checklist" className="hover:text-[#FFB7C5] transition-colors p-1"><CheckSquare size={18} className="md:w-5 md:h-5" /></button>
          
          <button onClick={() => !uploadingImage && fileInputRef.current.click()} title="Añadir Imagen" className="hover:text-[#FFB7C5] transition-colors p-1 relative">
            {uploadingImage ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} className="md:w-5 md:h-5" />}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </button>

          <span className={`text-[8px] md:text-[10px] font-black tracking-widest ${wordCount >= 380 ? 'text-red-500' : 'text-slate-300'}`}>
            {wordCount}/400 PALABRAS
          </span>
        </div>
        
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button onClick={onClose} className="flex-1 sm:flex-none text-[10px] md:text-xs font-black text-slate-400 px-3 md:px-4 py-2 md:py-2 hover:bg-slate-200 rounded-lg md:rounded-xl uppercase transition-colors">
            Cerrar
          </button>
          <button onClick={() => onSave({ title, content, items: listItems, imagen_url: image })} disabled={uploadingImage} className="flex-1 sm:flex-none text-[10px] md:text-xs font-black bg-[#FFB7C5] text-white px-4 md:px-6 py-2 md:py-2 rounded-lg md:rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}