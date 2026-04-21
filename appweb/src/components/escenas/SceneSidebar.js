import React from 'react';
import { Plus, GripVertical } from 'lucide-react';

const mockScenes = [
  { id: 1, title: 'Escena 1: La taberna' },
  { id: 2, title: 'Escena 2: El mapa' },
  { id: 3, title: 'Escena 3: La huida' },
];

export default function SceneSidebar({ onSelectScene, selectedScene }) {
  return (
    <div className="w-full md:w-64 bg-[#B4DDEB]/30 p-4 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-slate-200 shrink-0">
      
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-black text-lg text-slate-900">Escenas</h3>
        <button className="p-2 rounded-full bg-white text-[#FF5C5C] hover:bg-[#F1C9C6] active:scale-90 transition-all shadow-sm">
          <Plus size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-[150px] md:max-h-full pr-2 custom-scrollbar">
        {mockScenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => onSelectScene(scene)}
            className={`group flex items-center gap-2 p-3.5 md:p-3 rounded-[16px] text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
              selectedScene?.id === scene.id
                ? 'bg-white shadow-md text-[#FF5C5C] ring-1 ring-slate-100'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            <GripVertical size={16} className="text-slate-300 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0" />
            <span className="flex-1 text-left truncate">{scene.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}