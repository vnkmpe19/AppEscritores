// src/components/escenas/SceneEditor.js
import React from 'react';
import { Save, GitCommitHorizontal, Link2 } from 'lucide-react';

export default function SceneEditor({ scene }) {
  if (!scene) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white rounded-r-[50px] shadow-inner text-slate-400">
        <p>Selecciona una escena o crea una nueva para empezar a escribir.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-r-[50px] shadow-inner p-10 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
      {/* Título de la escena y botones de acción */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <input 
          type="text"
          defaultValue={scene.title}
          className="text-4xl font-serif font-black text-slate-900 w-full outline-none"
          placeholder="Título de la escena..."
        />
        <button className="flex items-center gap-2 px-6 py-3 bg-[#FF5C5C] text-white rounded-full font-bold hover:bg-[#ff4242] transition-colors shrink-0">
          <Save size={20} />
          Guardar
        </button>
      </div>

      {/* Área de texto grande */}
      <textarea
        className="flex-1 w-full text-slate-700 leading-relaxed outline-none resize-none"
        placeholder="Escribe los detalles seguros de la escena aquí..."
        rows={15}
      />

      {/* Sección de Mapa Conceptual / Vínculos */}
      <div className="bg-[#FDF5F5] p-6 rounded-[24px] border border-[#F1C9C6]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-[#F1C9C6] text-[#FF5C5C]">
            <GitCommitHorizontal size={20} />
          </div>
          <h4 className="font-serif font-bold text-lg text-slate-900">Mapa Conceptual</h4>
        </div>
        
        <p className="text-sm text-slate-600 mb-4">Vincula esta escena con otras escenas seguras:</p>
        
        <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 text-sm text-[#FF5C5C] font-semibold bg-white px-4 py-2 rounded-full border border-[#F1C9C6] hover:bg-[#F1C9C6]/50">
                <Link2 size={16}/>
                Vincular Escena...
            </button>
            {/* Aquí irían los tags de escenas ya vinculadas */}
        </div>
      </div>
    </div>
  );
}