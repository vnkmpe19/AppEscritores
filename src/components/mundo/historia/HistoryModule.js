"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, User, Sparkles, BookOpen, Globe, X } from 'lucide-react';

// --- DATOS INICIALES ---
const INITIAL_EVENTS = [
  { id: 1, year: 'AÑO 0 - 1000', title: 'La Primera Era', desc: 'El nacimiento de la tierra y los primeros linajes. La forja de las montañas.' },
  { id: 2, year: 'AÑO 1001 - 1550', title: 'Grandes Guerras', desc: 'Cismas territoriales que definieron las fronteras actuales.' }
];

const INITIAL_FIGURES = [
  { id: 1, name: 'Rey Elendil I', title: 'El Unificador', desc: 'Primer monarca en unir los siete clanes.', image: 'https://picsum.photos/seed/king/100/100' },
  { id: 2, name: 'Lyra Solis', title: 'Gran Tejedora', desc: 'Científica que sistematizó los hechizos elementales.', image: 'https://picsum.photos/seed/mage/100/100' }
];

const INITIAL_ARTIFACTS = [
  { id: 1, name: 'La Quebrantadora', type: 'RELIQUIA DE GUERRA', image: 'https://picsum.photos/seed/sword/300/300' },
  { id: 2, name: 'El Ojo del Cosmos', type: 'ARCANO MAYOR', image: 'https://picsum.photos/seed/orb/300/300' }
];

export default function HistoryModule() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [figures, setFigures] = useState(INITIAL_FIGURES);
  const [artifacts, setArtifacts] = useState(INITIAL_ARTIFACTS);

  // Estados del Modal
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: '', title: '' });
  const [editingItem, setEditingItem] = useState(null);

  // Estados del Formulario
  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState(''); // Usa para Año o Título/Tipo
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');

  // --- FUNCIONES CRUD ---
  const openModal = (type, title, item = null) => {
    setModalConfig({ type, title });
    setEditingItem(item);
    
    if (item) {
      setFormName(item.title || item.name || '');
      setFormSubtitle(item.year || item.title || item.type || '');
      setFormDesc(item.desc || '');
      setFormImage(item.image || '');
    } else {
      setFormName(''); setFormSubtitle(''); setFormDesc(''); setFormImage('');
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formName) return alert("El título/nombre es obligatorio");

    const newItem = {
      id: editingItem ? editingItem.id : crypto.randomUUID(),
      desc: formDesc,
      image: formImage || `https://picsum.photos/seed/${Math.random()}/300/300`
    };

    if (modalConfig.type === 'event') {
      newItem.title = formName;
      newItem.year = formSubtitle || 'FECHA DESCONOCIDA';
      if (editingItem) setEvents(events.map(e => e.id === editingItem.id ? newItem : e));
      else setEvents([...events, newItem]);
    } 
    else if (modalConfig.type === 'figure') {
      newItem.name = formName;
      newItem.title = formSubtitle || 'Sin título';
      if (editingItem) setFigures(figures.map(f => f.id === editingItem.id ? newItem : f));
      else setFigures([...figures, newItem]);
    }
    else if (modalConfig.type === 'artifact') {
      newItem.name = formName;
      newItem.type = formSubtitle || 'OBJETO MISTERIOSO';
      if (editingItem) setArtifacts(artifacts.map(a => a.id === editingItem.id ? newItem : a));
      else setArtifacts([...artifacts, newItem]);
    }

    setShowModal(false);
  };

  const handleDelete = (type, id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro histórico?")) {
      if (type === 'event') setEvents(events.filter(e => e.id !== id));
      if (type === 'figure') setFigures(figures.filter(f => f.id !== id));
      if (type === 'artifact') setArtifacts(artifacts.filter(a => a.id !== id));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-20">
      
      {/* ENCABEZADO */}
      <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E8F5A2]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="p-4 bg-[#E8F5A2]/50 text-slate-800 rounded-2xl shadow-inner">
            <BookOpen size={32} />
          </div>
          <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">Cronología del Mundo</h2>
            <p className="text-slate-400 text-lg mt-1 max-w-3xl leading-relaxed">
              Explora los hilos del tiempo, las grandes figuras que forjaron la historia y los artefactos que dejaron atrás.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* COLUMNA IZQUIERDA: LÍNEA DE TIEMPO */}
        <div className="lg:col-span-4 space-y-8 relative">
          {/* Línea vertical decorativa */}
          <div className="absolute left-[19px] top-12 bottom-4 w-1 bg-slate-100 rounded-full" />
          
          <div className="flex justify-between items-center pr-4">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
              <div className="w-3 h-3 bg-[#FF5C5C] rounded-full shadow-sm" /> Sucesos
            </h3>
            <button onClick={() => openModal('event', 'Nuevo Suceso Histórico')} className="p-2.5 bg-[#FFB7C5] text-white rounded-full hover:scale-110 transition-transform shadow-md">
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-10 pt-4">
            <AnimatePresence>
              {events.map((event) => (
                <motion.div key={event.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative pl-12 group">
                  <div className="absolute left-0 top-4 w-10 h-10 rounded-full bg-white border-4 border-[#FFB7C5] shadow-md z-10 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-[#FFB7C5] rounded-full" />
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-all relative">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex gap-1 bg-white/90 p-1 rounded-xl shadow-sm">
                      <button onClick={() => openModal('event', 'Editar Suceso', event)} className="p-1.5 text-slate-400 hover:text-blue-500"><Edit size={14}/></button>
                      <button onClick={() => handleDelete('event', event.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                    </div>
                    <span className="text-[10px] font-black text-[#FFB7C5] uppercase tracking-[0.2em]">{event.year}</span>
                    <h4 className="text-xl font-black text-slate-800 mt-1 mb-2">{event.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{event.desc}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* COLUMNA DERECHA: FIGURAS Y ARTEFACTOS */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* FIGURAS HISTÓRICAS */}
          <section>
            <div className="flex justify-between items-center mb-6 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#BFD7ED]/30 text-[#BFD7ED] rounded-xl"><User size={24} /></div>
                <h3 className="text-2xl font-black text-slate-800">Figuras Históricas</h3>
              </div>
              <button onClick={() => openModal('figure', 'Nueva Figura Histórica')} className="text-[#BFD7ED] font-black text-xs uppercase tracking-widest hover:bg-[#BFD7ED]/10 px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
                <Plus size={16}/> Agregar
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {figures.map(figure => (
                  <motion.div key={figure.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex gap-5 group hover:shadow-md transition-all relative">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex gap-1 bg-white/90 p-1 rounded-xl shadow-sm z-10">
                      <button onClick={() => openModal('figure', 'Editar Figura', figure)} className="p-1.5 text-slate-400 hover:text-blue-500"><Edit size={14}/></button>
                      <button onClick={() => handleDelete('figure', figure.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                    </div>
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 border-2 border-white shadow-inner">
                      <img src={figure.image} alt={figure.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 pr-6">
                      <h4 className="font-black text-xl text-slate-800 leading-tight">{figure.name}</h4>
                      <p className="text-[10px] font-black text-[#BFD7ED] uppercase tracking-widest mb-2 mt-1">{figure.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{figure.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* ARTEFACTOS LEGENDARIOS */}
          <section>
            <div className="flex justify-between items-center mb-6 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FFD1A4]/30 text-[#FFD1A4] rounded-xl"><Sparkles size={24} /></div>
                <h3 className="text-2xl font-black text-slate-800">Artefactos Legendarios</h3>
              </div>
              <button onClick={() => openModal('artifact', 'Nuevo Artefacto')} className="text-[#FFD1A4] font-black text-xs uppercase tracking-widest hover:bg-[#FFD1A4]/10 px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
                <Plus size={16}/> Agregar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <AnimatePresence>
                {artifacts.map(art => (
                  <motion.div key={art.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-100 group hover:shadow-lg transition-all text-center relative">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex gap-1 z-10">
                      <button onClick={() => openModal('artifact', 'Editar Artefacto', art)} className="p-1.5 bg-white rounded-full text-blue-500 shadow-md hover:scale-110"><Edit size={14}/></button>
                      <button onClick={() => handleDelete('artifact', art.id)} className="p-1.5 bg-white rounded-full text-red-500 shadow-md hover:scale-110"><Trash2 size={14}/></button>
                    </div>
                    <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-50 relative border-4 border-slate-50">
                      <img src={art.image} alt={art.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <h4 className="font-black text-slate-800 text-sm">{art.name}</h4>
                    <p className="text-[9px] font-black text-[#FFD1A4] uppercase tracking-widest mt-1">{art.type}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>

      {/* --- MODAL INTELIGENTE --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col border border-slate-100">
              <div className="p-8 overflow-y-auto space-y-8">
                
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                    <BookOpen className="text-[#FFB7C5]" /> {modalConfig.title}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={20} /></button>
                </div>
                
                <div className="space-y-6">
                  {/* Nombre / Título */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      {modalConfig.type === 'event' ? 'Título del Evento' : 'Nombre'}
                    </label>
                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Escribe aquí..." className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FFB7C5] transition-all font-bold shadow-inner text-sm" />
                  </div>
                  
                  {/* Subtítulo dinámico (Año, Título de Figura, Tipo de Artefacto) */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      {modalConfig.type === 'event' && 'Época / Año'}
                      {modalConfig.type === 'figure' && 'Título / Apodo'}
                      {modalConfig.type === 'artifact' && 'Tipo de Reliquia'}
                    </label>
                    <input type="text" value={formSubtitle} onChange={(e) => setFormSubtitle(e.target.value)} placeholder="Ej. Año 200, El Sabio, Espada Sagrada..." className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FFB7C5] transition-all text-sm shadow-inner font-medium" />
                  </div>

                  {/* Descripción (No aplica para artefactos en este diseño visual) */}
                  {modalConfig.type !== 'artifact' && (
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Descripción Histórica</label>
                      <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Describe los detalles de este registro..." className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FFB7C5] transition-all min-h-[120px] resize-none shadow-inner text-sm leading-relaxed" />
                    </div>
                  )}

                  {/* Imagen (Para figuras y artefactos) */}
                  {modalConfig.type !== 'event' && (
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">URL de Imagen</label>
                      <input type="text" value={formImage} onChange={(e) => setFormImage(e.target.value)} placeholder="https://..." className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#FFB7C5] transition-all text-sm shadow-inner font-medium" />
                    </div>
                  )}
                </div>

                <button onClick={handleSave} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl mt-4 shadow-xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  <Sparkles size={20} /> Guardar Registro
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}