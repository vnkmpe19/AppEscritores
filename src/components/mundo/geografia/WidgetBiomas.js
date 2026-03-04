"use client";
import React, { useState } from 'react';
import { TreePine, Trash2, Edit, Plus, X } from 'lucide-react';

export default function WidgetBiomas() {
  const [biomas, setBiomas] = useState([
    { id: '1', nombre: 'Tundra Boreal', desc: 'Suelo permafrost y frío extremo.', color: 'bg-[#9BC5E6]', imagen: null },
    { id: '2', nombre: 'Bosque de Coníferas', desc: 'Vastas extensiones de pinos.', color: 'bg-[#E8F5A2]', imagen: null }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingBioma, setEditingBioma] = useState(null);
  const [form, setForm] = useState({ nombre: '', desc: '', color: 'bg-[#BFD7ED]', imagen: null });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSave = () => {
    if (!form.nombre) return alert('Ponle un nombre, no seas así jaja');
    if (editingBioma) setBiomas(biomas.map(b => b.id === editingBioma.id ? { ...form, id: b.id } : b));
    else setBiomas([...biomas, { ...form, id: generateId() }]);
    closeModal();
  };

  const openModal = (bioma = null) => {
    if (bioma) { setEditingBioma(bioma); setForm(bioma); } 
    else { setEditingBioma(null); setForm({ nombre: '', desc: '', color: 'bg-[#BFD7ED]', imagen: null }); }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingBioma(null); };

  return (
    <div className="bg-white rounded-[40px] p-6 shadow-sm border border-slate-100 h-full relative">
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <TreePine className="text-[#E8F5A2]" size={24} /> Biomas Regionales
        </h3>
        <button onClick={() => openModal()} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full border border-slate-100 hover:bg-slate-100 transition-colors">
          <Plus size={20} className="text-slate-400" />
        </button>
      </div>

      <div className="space-y-4">
        {biomas.map(b => (
          <div key={b.id} className="group flex items-center justify-between p-5 bg-[#F8FAFC] rounded-[30px] border border-slate-50">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${b.color} flex items-center justify-center overflow-hidden`}>
                {b.imagen ? <img src={b.imagen} className="w-full h-full object-cover" alt="Icono" /> : <TreePine size={24} className="text-white opacity-80" />}
              </div>
              <div>
                <h4 className="font-black text-slate-800">{b.nombre}</h4>
                <p className="text-xs text-slate-500">{b.desc}</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openModal(b)} className="p-2 text-slate-400 hover:text-blue-500"><Edit size={16} /></button>
              <button onClick={() => setBiomas(biomas.filter(x => x.id !== b.id))} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm rounded-[40px] p-8 flex flex-col shadow-2xl border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-xl text-slate-800">Gestión de Bioma</h4>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-800"><X size={20}/></button>
          </div>
          <div className="flex flex-col gap-4">
            <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Nombre..." className="bg-slate-50 p-4 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-[#E8F5A2]" />
            <textarea value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} placeholder="Descripción..." className="bg-slate-50 p-4 rounded-2xl outline-none text-sm min-h-[100px] resize-none focus:ring-2 focus:ring-[#E8F5A2]" />
            <button onClick={handleSave} className="bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 active:scale-95 transition-all">Guardar</button>
          </div>
        </div>
      )}
    </div>
  );
}