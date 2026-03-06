import React from 'react';
import { Plus, GripVertical } from 'lucide-react';

// Datos de ejemplo - esto vendrá en la base de datos luego
const mockScenes = [
  { id: 1, title: 'Escena 1: La taberna' },
  { id: 2, title: 'Escena 2: El mapa' },
  { id: 3, title: 'Escena 3: La huida' },
];

export default function SceneSidebar({ onSelectScene, selectedScene }) {
  return (
    <div className="w-64 bg-[#B4DDEB]/30 p-4 flex flex-col gap-4 border-r border-slate-200">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-black text-lg text-slate-900">Escenas</h3>
        <button className="p-2 rounded-full bg-white text-[#FF5C5C] hover:bg-[#F1C9C6] transition-colors">
          <Plus size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto pr-2">
        {mockScenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => onSelectScene(scene)}
            className={`group flex items-center gap-2 p-3 rounded-[16px] text-sm font-medium transition-all duration-200 ${
              selectedScene?.id === scene.id
                ? 'bg-white shadow-md text-[#FF5C5C]'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            <GripVertical size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="flex-1 text-left truncate">{scene.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}