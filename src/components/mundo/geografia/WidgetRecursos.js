"use client";
import React, { useState } from 'react';
import { Gem, Plus, Trash2, Edit, X } from 'lucide-react';

const COLORS = ['bg-[#BFD7ED]', 'bg-[#FFB7C5]', 'bg-[#E8F5A2]', 'bg-[#FFD1A4]', 'bg-[#D4C1EC]'];

export default function WidgetRecursos() {
  const [recursos, setRecursos] = useState([
    { id: 1, nombre: 'Hierro Boreal', cant: 85, color: 'bg-[#FFD1A4]' },
    { id: 2, nombre: 'Madera de Sándalo', cant: 20, color: 'bg-[#FFB7C5]' }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [activeRec, setActiveRec] = useState(null);

  const save = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    const newRec = {
      id: activeRec?.id || Date.now(),
      nombre: data.get('nombre'),
      cant: data.get('cant'),
      color: activeRec?.color || randomColor
    };

    if(activeRec) setRecursos(recursos.map(r => r.id === activeRec.id ? newRec : r));
    else setRecursos([...recursos, newRec]);
    
    setShowForm(false); 
    setActiveRec(null);
  };

  return (
    <div className="bg-white rounded-[40px] p-6 shadow-sm border border-slate-100 h-full relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Gem className="text-[#D4C1EC]" /> Recursos 
        </h3>
        <button onClick={() => {setActiveRec(null); setShowForm(true)}} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
          <Plus size={18} className="text-slate-600"/>
        </button>
      </div>

      <div className="space-y-5">
        {recursos.map(r => (
          <div key={r.id} className="group relative">
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
              <span>{r.nombre}</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => {setActiveRec(r); setShowForm(true)}} className="text-slate-400 hover:text-blue-500"><Edit size={12}/></button>
                <button onClick={() => setRecursos(recursos.filter(i => i.id !== r.id))} className="text-slate-400 hover:text-red-500"><Trash2 size={12}/></button>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className={`${r.color} h-full rounded-full transition-all duration-500`} style={{width: `${r.cant}%`}} />
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={save} className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 p-6 rounded-[40px] flex flex-col border border-slate-100 shadow-xl">
          <div className="flex justify-between mb-4">
            <h4 className="font-black text-sm text-slate-800">Gestionar Recurso</h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
          </div>
          <input name="nombre" defaultValue={activeRec?.nombre} placeholder="Nombre del recurso" className="bg-slate-50 p-3 rounded-2xl mb-2 text-sm outline-none font-bold text-slate-700 focus:ring-2 focus:ring-[#FFD1A4] transition-all" required />
          <input name="cant" type="number" min="0" max="100" defaultValue={activeRec?.cant} placeholder="% Abundancia" className="bg-slate-50 p-3 rounded-2xl mb-4 text-sm outline-none font-bold text-slate-700 focus:ring-2 focus:ring-[#FFD1A4] transition-all" required />
          <button className="bg-slate-800 hover:bg-slate-700 text-white font-black py-3 rounded-2xl text-sm transition-all active:scale-95">Guardar Recurso</button>
          <p className="text-[9px] text-slate-400 mt-auto text-center italic">"Ojo, si pones 100% de todo, tu economía se va a ir al caño jajaja"</p>
        </form>
      )}
    </div>
  );
}