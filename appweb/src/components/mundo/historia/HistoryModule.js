"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Plus, Edit, Trash2, User, Sparkles, BookOpen, X, Loader2, ArrowUp, ArrowDown } from 'lucide-react';

export default function HistoryModule({ proyectoId }) {

  const [events, setEvents] = useState([]);
  const [figures, setFigures] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: '', title: '' });
  const [editingItem, setEditingItem] = useState(null);

  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState(''); 
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');


  useEffect(() => {
    if (proyectoId) cargarTodo();
  }, [proyectoId]);

  const cargarTodo = async () => {
    setCargando(true);
    
    const [resHistoria, resFiguras, resArtefactos] = await Promise.all([
      supabase.from('historia').select('*').eq('id_proyecto', proyectoId).order('orden', { ascending: true }),
      supabase.from('figuras_historicas').select('*').eq('id_proyecto', proyectoId).order('nombre', { ascending: true }),
      supabase.from('artefactos').select('*').eq('id_proyecto', proyectoId).order('nombre', { ascending: true })
    ]);

    if (resHistoria.data) {
      setEvents(resHistoria.data.map(e => ({ id: e.id, year: e.epoca, title: e.titulo, desc: e.descripcion, orden: e.orden })));
    }
    if (resFiguras.data) {
      setFigures(resFiguras.data.map(f => ({ id: f.id, name: f.nombre, title: f.titulo, desc: f.descripcion, image: f.foto })));
    }
    if (resArtefactos.data) {
      setArtifacts(resArtefactos.data.map(a => ({ id: a.id, name: a.nombre, type: a.tipo, image: a.foto })));
    }
    
    setCargando(false);
  };


  const moverSuceso = async (index, direccion) => {
    const nuevosEventos = [...events];
    const indexDestino = direccion === 'arriba' ? index - 1 : index + 1;

    if (indexDestino < 0 || indexDestino >= nuevosEventos.length) return;

    const sucesoActual = nuevosEventos[index];
    const sucesoDestino = nuevosEventos[indexDestino];


    const ordenActual = sucesoActual.orden || index + 1;
    const ordenDestino = sucesoDestino.orden || indexDestino + 1;


    sucesoActual.orden = ordenDestino;
    sucesoDestino.orden = ordenActual;
    nuevosEventos[index] = sucesoDestino;
    nuevosEventos[indexDestino] = sucesoActual;
    setEvents(nuevosEventos); 

    await supabase.from('historia').update({ orden: ordenDestino }).eq('id', sucesoActual.id);
    await supabase.from('historia').update({ orden: ordenActual }).eq('id', sucesoDestino.id);
  };

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

  const handleSave = async () => {
    if (!formName) return alert("El título o nombre es obligatorio.");
    setGuardando(true);

    let errorSupabase;

    if (modalConfig.type === 'event') {
      const maxOrden = events.length > 0 ? Math.max(...events.map(e => e.orden || 0)) : 0;
      const datos = {
        id_proyecto: proyectoId,
        titulo: formName,
        epoca: formSubtitle || 'Época desconocida',
        descripcion: formDesc,
        orden: editingItem?.orden || maxOrden + 1 // Lo manda al final si es nuevo
      };
      
      if (editingItem) {
        const { error } = await supabase.from('historia').update(datos).eq('id', editingItem.id);
        errorSupabase = error;
      } else {
        const { error } = await supabase.from('historia').insert([datos]);
        errorSupabase = error;
      }
    } 
    else if (modalConfig.type === 'figure') {
      const datos = {
        id_proyecto: proyectoId,
        nombre: formName,
        titulo: formSubtitle,
        descripcion: formDesc,
        foto: formImage
      };

      if (editingItem) {
        const { error } = await supabase.from('figuras_historicas').update(datos).eq('id', editingItem.id);
        errorSupabase = error;
      } else {
        const { error } = await supabase.from('figuras_historicas').insert([datos]);
        errorSupabase = error;
      }
    }
    else if (modalConfig.type === 'artifact') {
      const datos = {
        id_proyecto: proyectoId,
        nombre: formName,
        tipo: formSubtitle,
        foto: formImage
      };

      if (editingItem) {
        const { error } = await supabase.from('artefactos').update(datos).eq('id', editingItem.id);
        errorSupabase = error;
      } else {
        const { error } = await supabase.from('artefactos').insert([datos]);
        errorSupabase = error;
      }
    }

    if (errorSupabase) {
      console.error("Error al guardar:", errorSupabase);
      alert(`Error al guardar: ${errorSupabase.message}`);
      setGuardando(false);
      return;
    }

    await cargarTodo();
    setShowModal(false);
    setGuardando(false);
  };

  const handleDelete = async (type, id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro histórico? Se perderá para siempre.")) {
      if (type === 'event') await supabase.from('historia').delete().eq('id', id);
      if (type === 'figure') await supabase.from('figuras_historicas').delete().eq('id', id);
      if (type === 'artifact') await supabase.from('artefactos').delete().eq('id', id);
      
      cargarTodo();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 md:space-y-12 pb-20">
      <div className="bg-white p-5 md:p-7 rounded-[30px] md:rounded-[40px] shadow-xl border border-slate-100 relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E8F5A2]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 relative z-10">
          <div className="p-2 md:p-3 bg-[#E8F5A2]/50 text-slate-800 rounded-xl shadow-inner">
            <BookOpen size={24} className="w-6 h-6 md:w-auto md:h-auto" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Cronología del Mundo</h2>
            <p className="text-slate-400 text-xs md:text-sm mt-0.5 max-w-3xl leading-relaxed">
              Explora los hilos del tiempo y las grandes figuras de la historia.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-12">
        
        {/* LINEA DE TIEMPO */}
        <div className="xl:col-span-5 space-y-6 md:space-y-8 relative">
          <div className="absolute left-[19px] top-12 bottom-4 w-1 bg-slate-100 rounded-full hidden sm:block" />
          
          <div className="flex justify-between items-center pr-4">
            <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
              <div className="w-3 h-3 bg-[#FF5C5C] rounded-full shadow-sm" /> Sucesos
            </h3>
            <button onClick={() => openModal('event', 'Nuevo Suceso Histórico')} className="p-2 md:p-2.5 bg-[#FFB7C5] text-white rounded-full hover:scale-110 transition-transform shadow-md">
              <Plus size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          </div>

          <div className="space-y-6 md:space-y-10 pt-4">
            {cargando ? (
              <p className="text-center text-slate-400 font-bold text-sm">Cargando timeline...</p>
            ) : events.length === 0 ? (
              <p className="text-center text-slate-400 font-bold text-sm opacity-60 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm ml-0 sm:ml-12">No hay sucesos registrados.</p>
            ) : (
              <AnimatePresence>
                {events.map((event, index) => (
                  <motion.div key={event.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="relative pl-0 sm:pl-12 group">
                    <div className="absolute left-0 top-4 w-10 h-10 rounded-full bg-white border-4 border-[#FFB7C5] shadow-md z-10 hidden sm:flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-[#FFB7C5] rounded-full" />
                    </div>
                    <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-all relative">
                      
                      <div className="absolute top-2 right-2 md:top-4 md:right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all flex flex-wrap justify-end gap-1 bg-white/95 p-1 rounded-xl shadow-sm z-20 max-w-[120px] md:max-w-none">
                        {index > 0 && (
                          <button onClick={() => moverSuceso(index, 'arriba')} className="p-1.5 text-slate-400 hover:text-green-500 bg-slate-50 hover:bg-green-50 rounded-lg transition-colors" title="Mover hacia arriba">
                            <ArrowUp size={14}/>
                          </button>
                        )}
                        {index < events.length - 1 && (
                          <button onClick={() => moverSuceso(index, 'abajo')} className="p-1.5 text-slate-400 hover:text-green-500 bg-slate-50 hover:bg-green-50 rounded-lg transition-colors" title="Mover hacia abajo">
                            <ArrowDown size={14}/>
                          </button>
                        )}
                        <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block"></div>
                        <button onClick={() => openModal('event', 'Editar Suceso', event)} className="p-1.5 text-slate-400 hover:text-blue-500 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={14}/></button>
                        <button onClick={() => handleDelete('event', event.id)} className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14}/></button>
                      </div>

                      <span className="text-[10px] font-black text-[#FFB7C5] uppercase tracking-[0.2em] block mb-1 pr-24 md:pr-0">{event.year}</span>
                      <h4 className="text-lg md:text-xl font-black text-slate-800 mb-2 pr-12 md:pr-0">{event.title}</h4>
                      <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{event.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        <div className="xl:col-span-7 space-y-8 md:space-y-12">
          
          {/* LO DE LAS FIGURAS HISTORICAS*/}
          <section>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#BFD7ED]/30 text-[#BFD7ED] rounded-xl"><User size={20} className="md:w-6 md:h-6" /></div>
                <h3 className="text-xl md:text-2xl font-black text-slate-800">Figuras Históricas</h3>
              </div>
              <button onClick={() => openModal('figure', 'Nueva Figura Histórica')} className="text-[#BFD7ED] font-black text-xs uppercase tracking-widest hover:bg-[#BFD7ED]/10 px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2 bg-slate-50 sm:bg-transparent">
                <Plus size={14} className="md:w-4 md:h-4"/> Agregar
              </button>
            </div>
            
            {cargando ? (
              <p className="text-center text-slate-400 font-bold text-sm">Cargando figuras...</p>
            ) : figures.length === 0 ? (
              <div className="bg-white p-10 rounded-[32px] border border-slate-100 text-center opacity-60 shadow-sm">
                <User size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-400 font-bold text-sm">Aún no hay figuras históricas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <AnimatePresence>
                  {figures.map(figure => (
                    <motion.div key={figure.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100 flex gap-4 md:gap-5 group hover:shadow-md transition-all relative">
                      <div className="absolute top-2 right-2 md:top-4 md:right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all flex gap-1 bg-white/90 p-1 rounded-xl shadow-sm z-10">
                        <button onClick={() => openModal('figure', 'Editar Figura', figure)} className="p-1.5 text-slate-400 hover:text-blue-500"><Edit size={14}/></button>
                        <button onClick={() => handleDelete('figure', figure.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                      </div>
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 border-2 border-white shadow-inner">
                        {figure.image ? (
                          <img src={figure.image} alt={figure.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><User className="text-slate-300 w-8 h-8" /></div>
                        )}
                      </div>
                      <div className="flex-1 pr-4 md:pr-6 min-w-0">
                        <h4 className="font-black text-lg md:text-xl text-slate-800 leading-tight truncate">{figure.name}</h4>
                        <p className="text-[9px] md:text-[10px] font-black text-[#BFD7ED] uppercase tracking-widest mb-1 md:mb-2 mt-1 truncate">{figure.title}</p>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 md:line-clamp-3">{figure.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          {/* ARTEFACTOS*/}
          <section>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FFD1A4]/30 text-[#FFD1A4] rounded-xl"><Sparkles size={20} className="md:w-6 md:h-6" /></div>
                <h3 className="text-xl md:text-2xl font-black text-slate-800">Artefactos Legendarios</h3>
              </div>
              <button onClick={() => openModal('artifact', 'Nuevo Artefacto')} className="text-[#FFD1A4] font-black text-xs uppercase tracking-widest hover:bg-[#FFD1A4]/10 px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2 bg-slate-50 sm:bg-transparent">
                <Plus size={14} className="md:w-4 md:h-4"/> Agregar
              </button>
            </div>

            {cargando ? (
              <p className="text-center text-slate-400 font-bold text-sm">Cargando artefactos...</p>
            ) : artifacts.length === 0 ? (
              <div className="bg-white p-10 rounded-[32px] border border-slate-100 text-center opacity-60 shadow-sm">
                <Sparkles size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-400 font-bold text-sm">Aún no hay artefactos registrados.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <AnimatePresence>
                  {artifacts.map(art => (
                    <motion.div key={art.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white p-3 md:p-5 rounded-[20px] md:rounded-[32px] shadow-sm border border-slate-100 group hover:shadow-lg transition-all text-center relative">
                      <div className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all flex flex-col md:flex-row gap-1 z-10">
                        <button onClick={() => openModal('artifact', 'Editar Artefacto', art)} className="p-1 md:p-1.5 bg-white/90 rounded-full text-blue-500 shadow-sm hover:scale-110"><Edit size={12} className="md:w-3.5 md:h-3.5"/></button>
                        <button onClick={() => handleDelete('artifact', art.id)} className="p-1 md:p-1.5 bg-white/90 rounded-full text-red-500 shadow-sm hover:scale-110"><Trash2 size={12} className="md:w-3.5 md:h-3.5"/></button>
                      </div>
                      <div className="aspect-square rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4 bg-slate-50 relative border-[3px] md:border-4 border-slate-50">
                        {art.image ? (
                          <img src={art.image} alt={art.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Sparkles className="text-slate-300 w-8 h-8" /></div>
                        )}
                      </div>
                      <h4 className="font-black text-slate-800 text-xs md:text-sm truncate px-1">{art.name}</h4>
                      <p className="text-[8px] md:text-[9px] font-black text-[#FFD1A4] uppercase tracking-widest mt-1 truncate px-1">{art.type}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-lg rounded-[30px] md:rounded-[32px] shadow-2xl relative z-10 max-h-[90vh] flex flex-col border border-slate-100 overflow-hidden">
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 md:space-y-8 custom-scrollbar">
                
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2 md:gap-3">
                    <BookOpen className="text-[#FFB7C5] w-5 h-5 md:w-6 md:h-6" /> <span className="truncate">{modalConfig.title}</span>
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-800 bg-slate-50 p-1.5 md:p-2 rounded-full flex-shrink-0"><X size={18} className="md:w-5 md:h-5" /></button>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 md:mb-2">
                      {modalConfig.type === 'event' ? 'Título del Evento' : 'Nombre'}
                    </label>
                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Escribe aquí..." className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl p-3 md:p-4 outline-none focus:ring-2 focus:ring-[#FFB7C5] transition-all font-bold shadow-inner text-sm" />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 md:mb-2">
                      {modalConfig.type === 'event' && 'Época / Año'}
                      {modalConfig.type === 'figure' && 'Título / Apodo'}
                      {modalConfig.type === 'artifact' && 'Tipo de Reliquia'}
                    </label>
                    <input type="text" value={formSubtitle} onChange={(e) => setFormSubtitle(e.target.value)} placeholder="Ej. Año 200, El Sabio, Espada Sagrada..." className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl p-3 md:p-4 outline-none focus:ring-2 focus:ring-[#FFB7C5] transition-all text-sm shadow-inner font-medium" />
                  </div>

                  {modalConfig.type !== 'artifact' && (
                    <div>
                      <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 md:mb-2">Descripción Histórica</label>
                      <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Describe los detalles de este registro..." className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl p-3 md:p-4 outline-none focus:ring-2 focus:ring-[#FFB7C5] transition-all min-h-[100px] md:min-h-[120px] resize-none shadow-inner text-xs md:text-sm leading-relaxed" />
                    </div>
                  )}

                  {modalConfig.type !== 'event' && (
                    <div>
                      <label className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 md:mb-2">URL de Imagen</label>
                      <input type="text" value={formImage} onChange={(e) => setFormImage(e.target.value)} placeholder="https://..." className="w-full bg-slate-50 border-none rounded-xl md:rounded-2xl p-3 md:p-4 outline-none focus:ring-2 focus:ring-[#FFB7C5] transition-all text-xs md:text-sm shadow-inner font-medium" />
                    </div>
                  )}
                </div>

                <button onClick={handleSave} disabled={guardando} className="w-full bg-slate-900 text-white font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl mt-4 shadow-xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm md:text-base">
                  {guardando ? 'Guardando...' : 'Guardar Registro'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}