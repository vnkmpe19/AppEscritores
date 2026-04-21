import React from 'react';
import { Save, GitCommitHorizontal, Link2 } from 'lucide-react';

export default function SceneEditor({ scene }) {
  if (!scene) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white md:rounded-r-[50px] shadow-inner text-slate-400 p-6 text-center">
        <p className="text-sm md:text-base font-medium">Selecciona una escena o crea una nueva para empezar a escribir.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white md:rounded-r-[50px] shadow-inner p-6 md:p-10 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <input 
          type="text"
          defaultValue={scene.title}
          className="text-2xl md:text-4xl font-serif font-black text-slate-900 w-full outline-none bg-transparent"
          placeholder="Título de la escena..."
        />
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5C5C] text-white rounded-full font-bold hover:bg-[#ff4242] transition-all shrink-0 active:scale-95 shadow-lg shadow-[#FF5C5C]/20">
          <Save size={20} />
          <span className="text-sm md:text-base">Guardar</span>
        </button>
      </div>

      <textarea
        className="flex-1 w-full text-slate-700 text-sm md:text-base leading-relaxed outline-none resize-none bg-transparent min-h-[300px]"
        placeholder="Escribe los detalles de la escena aquí..."
        rows={15}
      />

      <div className="bg-[#FDF5F5] p-5 md:p-6 rounded-[24px] md:rounded-[32px] border border-[#F1C9C6] mb-4">
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <div className="p-2 rounded-full bg-[#F1C9C6] text-[#FF5C5C] shrink-0">
            <GitCommitHorizontal size={18} />
          </div>
          <h4 className="font-serif font-bold text-base md:text-lg text-slate-900">Mapa Conceptual</h4>
        </div>
        
        <p className="text-xs md:text-sm text-slate-600 mb-4">Vincula esta escena con otras escenas:</p>
        
        <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 text-xs md:text-sm text-[#FF5C5C] font-semibold bg-white px-4 py-2.5 rounded-full border border-[#F1C9C6] hover:bg-[#F1C9C6]/50 transition-colors active:scale-95">
                <Link2 size={16}/>
                Vincular Escena...
            </button>
        </div>
      </div>
    </div>
  );
}