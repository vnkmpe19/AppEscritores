"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Gem, Plus, Trash2, Edit, X } from 'lucide-react';

const COLORS = ['bg-[#BFD7ED]', 'bg-[#FFB7C5]', 'bg-[#E8F5A2]', 'bg-[#FFD1A4]', 'bg-[#D4C1EC]'];

export default function WidgetRecursos({ proyectoId }) {
  const [recursos, setRecursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [activeRec, setActiveRec] = useState(null);

  useEffect(() => {
    if (proyectoId) cargarRecursos();
  }, [proyectoId]);

  const cargarRecursos = async () => {
    setCargando(true);
    const { data } = await supabase
      .from('recursos')
      .select('*')
      .eq('id_proyecto', proyectoId)
      .order('nombre', { ascending: true });
      
    if (data) setRecursos(data);
    setCargando(false);
  };

  const save = async (e) => {
    e.preventDefault();
    setGuardando(true);
    const data = new FormData(e.target);
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    const datosGuardar = {
      id_proyecto: proyectoId,
      nombre: data.get('nombre'),
      abundancia: parseInt(data.get('cant')),
      color: activeRec?.color || randomColor
    };

    if (activeRec) {
      await supabase.from('recursos').update(datosGuardar).eq('id', activeRec.id);
    } else {
      await supabase.from('recursos').insert([datosGuardar]);
    }
    
    await cargarRecursos();
    setShowForm(false); 
    setActiveRec(null);
    setGuardando(false);
  };

  const eliminarRecurso = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este recurso?")) {
      await supabase.from('recursos').delete().eq('id', id);
      cargarRecursos();
    }
  };

  return (
    <div className="bg-white rounded-[30px] md:rounded-[40px] p-5 md:p-6 shadow-sm border border-slate-100 h-full relative flex flex-col min-h-[250px]">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
          <Gem className="text-[#D4C1EC] w-5 h-5 md:w-6 md:h-6" /> Recursos 
        </h3>
        <button onClick={() => {setActiveRec(null); setShowForm(true)}} className="p-1.5 md:p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
          <Plus className="text-slate-600 w-4 h-4 md:w-5 md:h-5"/>
        </button>
      </div>

      <div className="space-y-4 md:space-y-5 flex-1 overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
        {cargando ? (
           <p className="text-slate-400 text-[10px] md:text-xs font-bold text-center mt-4 opacity-60">Cargando...</p>
        ) : recursos.length === 0 ? (
           <p className="text-slate-400 text-[10px] md:text-xs font-bold text-center mt-4 opacity-60">Aún no hay recursos definidos.</p>
        ) : (
          recursos.map(r => (
            <div key={r.id} className="group relative">
              <div className="flex justify-between items-center text-[10px] md:text-xs font-bold text-slate-700 mb-1.5 md:mb-2">
                <span className="truncate pr-2">{r.nombre}</span>
                <div className="flex gap-1.5 md:gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => {setActiveRec(r); setShowForm(true)}} className="text-slate-400 hover:text-blue-500 bg-white md:bg-transparent rounded-full md:rounded-none shadow-sm md:shadow-none p-1 md:p-0"><Edit size={12}/></button>
                  <button onClick={() => eliminarRecurso(r.id)} className="text-slate-400 hover:text-red-500 bg-white md:bg-transparent rounded-full md:rounded-none shadow-sm md:shadow-none p-1 md:p-0"><Trash2 size={12}/></button>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 md:h-2 rounded-full overflow-hidden">
                <div className={`${r.color} h-full rounded-full transition-all duration-500`} style={{width: `${r.abundancia}%`}} />
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <form onSubmit={save} className="absolute inset-x-2 inset-y-4 md:inset-0 bg-white/95 backdrop-blur-sm z-50 p-5 md:p-6 rounded-[30px] md:rounded-[40px] flex flex-col border border-slate-100 shadow-xl overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-black text-xs md:text-sm text-slate-800">Gestionar Recurso</h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-full"><X size={14} className="md:w-4 md:h-4"/></button>
          </div>
          
          <input 
            name="nombre" 
            defaultValue={activeRec?.nombre} 
            placeholder="Nombre del recurso" 
            className="bg-slate-50 p-3 md:p-3 rounded-xl md:rounded-2xl mb-2 text-xs md:text-sm outline-none font-bold text-slate-700 focus:ring-2 focus:ring-[#FFD1A4] transition-all" 
            required 
          />
          
          <input 
            name="cant" 
            type="number" 
            min="0" 
            max="100" 
            defaultValue={activeRec?.abundancia} 
            placeholder="% Abundancia" 
            className="bg-slate-50 p-3 md:p-3 rounded-xl md:rounded-2xl mb-4 text-xs md:text-sm outline-none font-bold text-slate-700 focus:ring-2 focus:ring-[#FFD1A4] transition-all" 
            required 
          />
          
          <button disabled={guardando} className="bg-slate-800 hover:bg-slate-700 text-white font-black py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm transition-all active:scale-95 disabled:opacity-50 mt-auto">
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
          
          <p className="text-[8px] md:text-[9px] text-slate-400 mt-3 md:mt-4 text-center italic">"Ojo, si pones 100% de todo, tu economía se va a ir al caño jajaja"</p>
        </form>
      )}
    </div>
  );
}