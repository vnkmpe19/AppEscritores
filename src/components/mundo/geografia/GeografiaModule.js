"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Map as MapIcon, Trash2, Edit, X, 
  CheckCircle2, Image as ImageIcon, Info, Loader2 
} from 'lucide-react';

import WidgetMapa from './WidgetMapa';
import WidgetClima from './WidgetClima';
import WidgetBiomas from './WidgetBiomas';
import WidgetRecursos from './WidgetRecursos';

export default function GeografiaModule({ proyectoId }) {
  const [puntos, setPuntos] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPunto, setSelectedPunto] = useState(null); 
  const [editingPunto, setEditingPunto] = useState(null);
  
  const [form, setForm] = useState({ nombre: '', descripcion: '', foto: null });
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (proyectoId) cargarPuntos();
  }, [proyectoId]);

  const cargarPuntos = async () => {
    setCargandoDatos(true);
    const { data } = await supabase
      .from('lugares')
      .select('*')
      .eq('id_proyecto', proyectoId)
      .order('nombre', { ascending: true });
      
    if (data) setPuntos(data);
    setCargandoDatos(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendoFoto(true);

    const extension = file.name.split('.').pop();
    const nombreArchivo = `lugar-${proyectoId}-${Math.random()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('imagenes')
      .upload(nombreArchivo, file);

    if (uploadError) {
      console.error(uploadError);
      alert('Error al subir la imagen.');
      setSubiendoFoto(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('imagenes')
      .getPublicUrl(nombreArchivo);

    setForm({ ...form, foto: publicUrl });
    setSubiendoFoto(false);
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) return alert('El lugar necesita nombre.');
    setGuardando(true);

    const datosGuardar = {
      id_proyecto: proyectoId,
      nombre: form.nombre,
      descripcion: form.descripcion,
      foto: form.foto
    };

    let errorSupabase;

    if (editingPunto) {
      const { error } = await supabase.from('lugares').update(datosGuardar).eq('id', editingPunto.id);
      errorSupabase = error;
    } else {
      const { error } = await supabase.from('lugares').insert([datosGuardar]);
      errorSupabase = error;
    }

    if (errorSupabase) {
      console.error("Error al guardar lugar:", errorSupabase);
      alert(`Supabase dice: ${errorSupabase.message}`);
      setGuardando(false);
      return; 
    }

    await cargarPuntos(); 
    closeModal();
    setGuardando(false);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); 
    if (window.confirm("¿Estás seguro de borrar este lugar?")) {
      await supabase.from('lugares').delete().eq('id', id);
      cargarPuntos();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPunto(null);
    setForm({ nombre: '', descripcion: '', foto: null });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 md:space-y-12 pb-20 relative min-h-screen">
      
      <div className="bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] border border-slate-100 shadow-xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFD1A4]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-5 relative z-10">
          <div className="p-3 md:p-4 bg-[#FFD1A4]/50 text-slate-800 rounded-2xl shadow-inner">
            <MapIcon size={32} className="w-8 h-8 md:w-auto md:h-auto" />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Geografía y Clima</h2>
            <p className="text-slate-400 text-sm md:text-lg mt-1">Gestiona los puntos clave de tu narrativa.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="col-span-1 lg:col-span-2"><WidgetMapa proyectoId={proyectoId} /></div>
        <div className="col-span-1"><WidgetClima proyectoId={proyectoId} /></div>
        <div className="col-span-1 lg:col-span-2"><WidgetBiomas proyectoId={proyectoId} /></div>
        <div className="col-span-1"><WidgetRecursos proyectoId={proyectoId} /></div>

        {/* los PUNTOS DE INTERRES */}
        <div className="col-span-1 lg:col-span-3 space-y-4 mt-4">
          <div className="bg-white rounded-[30px] md:rounded-[40px] p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
              <MapPin className="text-[#FFD1A4]" /> Puntos de Interés
            </h3>
            <button 
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto text-center bg-[#BFD7ED] hover:bg-[#a6c8e6] text-slate-800 font-black py-2.5 px-6 rounded-full shadow-sm transition-all active:scale-95 text-sm"
            >
              + Nuevo Punto
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {cargandoDatos ? (
               <p className="text-slate-400 p-4 font-bold col-span-full text-center">Cargando tus lugares...</p>
            ) : puntos.length === 0 ? (
               <p className="text-slate-400 p-4 font-bold col-span-full text-center opacity-60">Aún no hay puntos de interés mapeados.</p>
            ) : (
              puntos.map((punto) => (
                <div 
                  key={punto.id} 
                  onClick={() => setSelectedPunto(punto)}
                  className="bg-white rounded-[24px] md:rounded-[35px] border border-slate-100 overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="h-32 md:h-40 bg-slate-100 relative">
                    {punto.foto ? (
                      <img src={punto.foto} alt={punto.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon size={40} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingPunto(punto); setForm(punto); setShowModal(true); }}
                        className="p-1.5 md:p-2 bg-white/90 rounded-full text-blue-500 hover:bg-white shadow-lg"
                      >
                        <Edit size={14}/>
                      </button>
                      <button 
                        onClick={(e) => handleDelete(punto.id, e)}
                        className="p-1.5 md:p-2 bg-white/90 rounded-full text-red-500 hover:bg-white shadow-lg"
                      >
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                  <div className="p-4 md:p-5 flex justify-between items-center">
                    <span className="font-black text-slate-800 text-base md:text-lg uppercase tracking-tight truncate pr-4">{punto.nombre}</span>
                    <Info size={18} className="text-[#FFD1A4] flex-shrink-0" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedPunto && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedPunto(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]" 
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[90%] sm:max-w-md bg-white z-[120] shadow-2xl p-6 md:p-8 flex flex-col overflow-y-auto"
            >
              <button onClick={() => setSelectedPunto(null)} className="absolute top-4 left-4 sm:top-8 sm:left-[-20px] bg-white p-2 sm:p-3 rounded-full shadow-lg text-slate-400 hover:text-slate-800 z-10">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
              
              <div className="rounded-[20px] md:rounded-[30px] overflow-hidden h-48 md:h-64 mb-6 shadow-inner bg-slate-50 mt-8 sm:mt-0 flex-shrink-0">
                {selectedPunto.foto ? (
                  <img src={selectedPunto.foto} className="w-full h-full object-cover" alt="Detalle" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={40} className="text-slate-200" /></div>
                )}
              </div>
              
              <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-4">{selectedPunto.nombre}</h3>
              <p className="text-slate-500 text-sm md:text-lg leading-relaxed mb-8 flex-1">
                {selectedPunto.descripcion || 'Sin descripción disponible todavía.'}
              </p>
              
              <div className="p-4 md:p-6 bg-[#FFF9E6] rounded-[20px] md:rounded-[30px] border border-orange-50 flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FFD1A4] rounded-xl md:rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <span className="font-bold text-orange-400 uppercase text-[10px] md:text-xs tracking-widest leading-tight">Punto de Interés Notable</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[30px] md:rounded-[40px] p-6 md:p-10 shadow-2xl relative z-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h4 className="text-xl md:text-2xl font-black text-slate-800">{editingPunto ? 'Editar Lugar' : 'Nuevo Lugar'}</h4>
                <button onClick={closeModal} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-800"><X size={20}/></button>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="relative group">
                  <div className="w-full h-32 md:h-48 bg-slate-50 rounded-[20px] md:rounded-[30px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-[#FFD1A4]">
                    {subiendoFoto ? (
                      <Loader2 className="animate-spin text-[#FFD1A4]" size={30} />
                    ) : form.foto ? (
                      <img src={form.foto} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <>
                        <ImageIcon size={24} className="text-slate-300 mb-2" />
                        <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Sube una foto</span>
                      </>
                    )}
                    <input type="file" onChange={handleFileChange} disabled={subiendoFoto} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  </div>
                </div>

                <input 
                  value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                  placeholder="Nombre del lugar..."
                  className="w-full bg-slate-50 p-4 md:p-5 rounded-xl md:rounded-2xl outline-none font-bold text-slate-700 border border-transparent focus:border-[#FFD1A4] text-sm md:text-base"
                />
                
                <textarea 
                  value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})}
                  placeholder="Describe este lugar para tu historia..."
                  className="w-full bg-slate-50 p-4 md:p-5 rounded-xl md:rounded-2xl outline-none font-medium text-slate-600 text-xs md:text-sm min-h-[100px] md:min-h-[120px] resize-none border border-transparent focus:border-[#FFD1A4]"
                />

                <button onClick={handleSave} disabled={guardando || subiendoFoto} className="w-full bg-slate-900 text-white font-black py-4 md:py-5 rounded-xl md:rounded-[25px] shadow-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 text-sm md:text-base">
                  <CheckCircle2 size={18} /> {guardando ? 'Guardando...' : (editingPunto ? 'Guardar Cambios' : 'Crear Punto')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}