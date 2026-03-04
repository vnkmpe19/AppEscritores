"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Map as MapIcon, 
  Trash2, 
  Edit, 
  X, 
  CheckCircle2,
  Image as ImageIcon,
  Info
} from 'lucide-react';

import WidgetMapa from './WidgetMapa';
import WidgetClima from './WidgetClima';
import WidgetBiomas from './WidgetBiomas';
import WidgetRecursos from './WidgetRecursos';

export default function GeografiaModule() {
  const [puntos, setPuntos] = useState([
    { 
      id: 'p1', 
      nombre: 'Pico de Cristal', 
      desc: 'Una montaña que brilla bajo la luna, hogar de los antiguos dragones de luz.',
      foto: null 
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedPunto, setSelectedPunto] = useState(null); 
  const [editingPunto, setEditingPunto] = useState(null);
  const [form, setForm] = useState({ nombre: '', desc: '', foto: null });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, foto: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!form.nombre.trim()) return alert('El lugar necesita nombre, carnal');

    if (editingPunto) {
      setPuntos(puntos.map(p => p.id === editingPunto.id ? { ...p, ...form } : p));
    } else {
      setPuntos([...puntos, { ...form, id: generateId() }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPunto(null);
    setForm({ nombre: '', desc: '', foto: null });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20 relative min-h-screen">
      
      {/* HEADER */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFD1A4]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="p-4 bg-[#FFD1A4]/50 text-slate-800 rounded-2xl shadow-inner">
            <MapIcon size={32} />
          </div>
          <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">Geografía y Clima</h2>
            <p className="text-slate-400 text-lg mt-1">Gestiona los puntos clave de tu narrativa.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><WidgetMapa /></div>
        <div className="lg:col-span-1"><WidgetClima /></div>
        <div className="lg:col-span-2"><WidgetBiomas /></div>
        <div className="lg:col-span-1"><WidgetRecursos /></div>

        {/* SECCIÓN DE PUNTOS CON FOTO */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-[40px] p-6 shadow-sm border border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <MapPin className="text-[#FFD1A4]" /> Puntos de Interés
            </h3>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-[#BFD7ED] hover:bg-[#a6c8e6] text-slate-800 font-black py-2.5 px-6 rounded-full shadow-sm transition-all active:scale-95 text-sm"
            >
              + Nuevo Punto
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {puntos.map((punto) => (
              <div 
                key={punto.id} 
                onClick={() => setSelectedPunto(punto)}
                className="bg-white rounded-[35px] border border-slate-100 overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all"
              >
                <div className="h-40 bg-slate-100 relative">
                  {punto.foto ? (
                    <img src={punto.foto} alt={punto.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={40} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingPunto(punto); setForm(punto); setShowModal(true); }}
                      className="p-2 bg-white/90 rounded-full text-blue-500 hover:bg-white shadow-lg"
                    >
                      <Edit size={16}/>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPuntos(puntos.filter(p => p.id !== punto.id)); }}
                      className="p-2 bg-white/90 rounded-full text-red-500 hover:bg-white shadow-lg"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
                <div className="p-5 flex justify-between items-center">
                  <span className="font-black text-slate-800 text-lg uppercase tracking-tight">{punto.nombre}</span>
                  <Info size={18} className="text-[#FFD1A4]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PANEL LATERAL */}
      <AnimatePresence>
        {selectedPunto && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedPunto(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[110]" 
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[120] shadow-2xl p-8 flex flex-col"
            >
              <button onClick={() => setSelectedPunto(null)} className="absolute top-8 left-[-20px] bg-white p-3 rounded-full shadow-lg text-slate-400 hover:text-slate-800">
                <X size={24} />
              </button>
              
              <div className="rounded-[30px] overflow-hidden h-64 mb-8 shadow-inner bg-slate-50">
                {selectedPunto.foto ? (
                  <img src={selectedPunto.foto} className="w-full h-full object-cover" alt="Detalle" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={60} className="text-slate-200" /></div>
                )}
              </div>
              
              <h3 className="text-4xl font-black text-slate-900 mb-4">{selectedPunto.nombre}</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-8 flex-1">
                {selectedPunto.desc || 'Sin descripción disponible todavía. ¡Escribe algo épico!'}
              </p>
              
              <div className="p-6 bg-[#FFF9E6] rounded-[30px] border border-orange-50 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FFD1A4] rounded-2xl flex items-center justify-center text-white">
                  <MapPin size={24} />
                </div>
                <span className="font-bold text-orange-400 uppercase text-xs tracking-widest">Punto de Interés Notable</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL CREAR/EDITAR */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl relative z-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-2xl font-black text-slate-800">{editingPunto ? 'Editar Lugar' : 'Nuevo Lugar'}</h4>
                <button onClick={closeModal}><X size={24}/></button>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <div className="w-full h-48 bg-slate-50 rounded-[30px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-[#FFD1A4]">
                    {form.foto ? (
                      <img src={form.foto} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <>
                        <ImageIcon size={32} className="text-slate-300 mb-2" />
                        <span className="text-xs font-bold text-slate-400 uppercase">Sube una foto épica</span>
                      </>
                    )}
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  </div>
                </div>

                <input 
                  value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                  placeholder="Nombre del lugar..."
                  className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-slate-700 border border-transparent focus:border-[#FFD1A4]"
                />
                
                <textarea 
                  value={form.desc} onChange={e => setForm({...form, desc: e.target.value})}
                  placeholder="Describe este lugar para tu historia..."
                  className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-medium text-slate-600 text-sm min-h-[120px] resize-none"
                />

                <button onClick={handleSave} className="w-full bg-slate-900 text-white font-black py-5 rounded-[25px] shadow-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95">
                  <CheckCircle2 size={20} /> {editingPunto ? 'Guardar Cambios' : 'Crear Punto'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}