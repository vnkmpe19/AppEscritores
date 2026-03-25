"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { TreePine, Trash2, Edit, Plus, X } from 'lucide-react';

export default function WidgetBiomas({ proyectoId }) {
  const [biomas, setBiomas] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingBioma, setEditingBioma] = useState(null);
  const [form, setForm] = useState({ nombre: '', desc: '', color: 'bg-[#BFD7ED]', icono: null });
  const [guardando, setGuardando] = useState(false);

  const COLORES_DISPONIBLES = ['bg-[#BFD7ED]', 'bg-[#9BC5E6]', 'bg-[#E8F5A2]', 'bg-[#FFD1A4]', 'bg-[#FFB7C5]', 'bg-[#D4C1EC]'];

  useEffect(() => {
    if (proyectoId) cargarBiomas();
  }, [proyectoId]);

  const cargarBiomas = async () => {
    setCargando(true);
    const { data } = await supabase
      .from('biomas')
      .select('*')
      .eq('id_proyecto', proyectoId)
      .order('nombre', { ascending: true });
      
    if (data) setBiomas(data);
    setCargando(false);
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) return alert('Ponle un nombre al bioma.');
    setGuardando(true);

    const datosGuardar = {
      id_proyecto: proyectoId,
      nombre: form.nombre,
      descripcion: form.desc,
      color: form.color,
      icono: form.icono 
    };

    let errorSupabase;

    if (editingBioma) {
      const { error } = await supabase.from('biomas').update(datosGuardar).eq('id', editingBioma.id);
      errorSupabase = error;
    } else {
      const { error } = await supabase.from('biomas').insert([datosGuardar]);
      errorSupabase = error;
    }

    if (errorSupabase) {
      console.error("Error al guardar bioma:", errorSupabase);
      alert(`Error: ${errorSupabase.message}\n\nSi el error es por la columna 'color', asegúrate de correr esto en tu SQL Editor: ALTER TABLE public.biomas ADD COLUMN color text;`);
      setGuardando(false);
      return; 
    }

    await cargarBiomas();
    closeModal();
    setGuardando(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de borrar este bioma?")) {
      await supabase.from('biomas').delete().eq('id', id);
      cargarBiomas();
    }
  };

  const openModal = (bioma = null) => {
    if (bioma) { 
      setEditingBioma(bioma); 
      setForm({ nombre: bioma.nombre, desc: bioma.descripcion || '', color: bioma.color || 'bg-[#BFD7ED]', icono: bioma.icono }); 
    } else { 
      setEditingBioma(null); 
      setForm({ nombre: '', desc: '', color: 'bg-[#BFD7ED]', icono: null }); 
    }
    setShowModal(true);
  };

  const closeModal = () => { 
    setShowModal(false); 
    setEditingBioma(null); 
  };

  return (
    <div className="bg-white rounded-[30px] md:rounded-[40px] p-5 md:p-6 shadow-sm border border-slate-100 h-full relative flex flex-col min-h-[300px]">
      
      <div className="flex justify-between items-center mb-4 md:mb-6 px-1 md:px-2">
        <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
          <TreePine className="text-[#E8F5A2] w-5 h-5 md:w-6 md:h-6" /> <span className="truncate">Biomas Regionales</span>
        </h3>
        <button onClick={() => openModal()} className="w-8 h-8 md:w-10 md:h-10 flex flex-shrink-0 items-center justify-center bg-slate-50 rounded-full border border-slate-100 hover:bg-slate-100 transition-colors">
          <Plus className="text-slate-400 w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      <div className="space-y-3 md:space-y-4 flex-1 overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
        {cargando ? (
          <p className="text-slate-400 font-bold text-center mt-4 opacity-60 text-sm">Cargando biomas...</p>
        ) : biomas.length === 0 ? (
          <p className="text-slate-400 font-bold text-center mt-4 opacity-60 text-sm">Aún no has registrado biomas.</p>
        ) : (
          biomas.map(b => (
            <div key={b.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 bg-[#F8FAFC] rounded-[20px] md:rounded-[30px] border border-slate-50 hover:shadow-sm transition-all gap-3 sm:gap-0">
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${b.color || 'bg-[#BFD7ED]'} flex items-center justify-center overflow-hidden flex-shrink-0`}>
                  {b.icono ? <img src={b.icono} className="w-full h-full object-cover" alt="Icono" /> : <TreePine className="text-white opacity-80 w-5 h-5 md:w-6 md:h-6" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-slate-800 text-sm md:text-base truncate">{b.nombre}</h4>
                  <p className="text-[10px] md:text-xs text-slate-500 line-clamp-2">{b.descripcion}</p>
                </div>
              </div>
              <div className="flex sm:flex-col lg:flex-row gap-1 md:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-end sm:self-auto">
                <button onClick={() => openModal(b)} className="p-1.5 md:p-2 text-slate-400 hover:text-blue-500 bg-white rounded-full shadow-sm"><Edit size={14} /></button>
                <button onClick={() => handleDelete(b.id)} className="p-1.5 md:p-2 text-slate-400 hover:text-red-500 bg-white rounded-full shadow-sm"><Trash2 size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="absolute inset-x-2 inset-y-4 md:inset-0 z-50 bg-white/95 backdrop-blur-sm rounded-[30px] md:rounded-[40px] p-6 md:p-8 flex flex-col shadow-2xl border border-slate-200">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h4 className="font-black text-lg md:text-xl text-slate-800">{editingBioma ? 'Editar Bioma' : 'Nuevo Bioma'}</h4>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-800 bg-slate-50 p-1.5 md:p-2 rounded-full"><X size={18}/></button>
          </div>
          
          <div className="flex flex-col gap-3 md:gap-4 flex-1 overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
            <input 
              value={form.nombre} 
              onChange={e => setForm({...form, nombre: e.target.value})} 
              placeholder="Nombre del bioma..." 
              className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-[#E8F5A2] text-sm" 
            />
            
            <textarea 
              value={form.desc} 
              onChange={e => setForm({...form, desc: e.target.value})} 
              placeholder="Descripción (ej. Suelo permafrost y frío extremo)..." 
              className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl outline-none text-xs md:text-sm text-slate-600 min-h-[80px] md:min-h-[100px] resize-none focus:ring-2 focus:ring-[#E8F5A2]" 
            />

            <div>
              <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Color del Bioma</label>
              <div className="flex gap-2 flex-wrap">
                {COLORES_DISPONIBLES.map(color => (
                  <button 
                    key={color} 
                    onClick={() => setForm({...form, color})}
                    className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${color} border-2 transition-all ${form.color === color ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`} 
                  />
                ))}
              </div>
            </div>

            <input 
              value={form.icono || ''} 
              onChange={e => setForm({...form, icono: e.target.value})} 
              placeholder="URL de imagen (Opcional)..." 
              className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl outline-none text-xs md:text-sm text-slate-600 focus:ring-2 focus:ring-[#E8F5A2] mt-1 md:mt-2" 
            />

            <button 
              onClick={handleSave} 
              disabled={guardando}
              className="bg-slate-900 text-white font-black py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-slate-800 active:scale-95 transition-all mt-auto disabled:opacity-50 text-sm md:text-base"
            >
              {guardando ? 'Guardando...' : 'Guardar Bioma'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}