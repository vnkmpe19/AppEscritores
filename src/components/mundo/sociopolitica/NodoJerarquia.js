"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Crown, Church, Users, Shield, User, Gem, Ship, Sparkles, Cog, TrendingUp, X, Loader2, AlertCircle } from 'lucide-react';

const ICONOS_DISPONIBLES = ['Crown', 'Church', 'Users', 'Shield', 'User', 'Gem', 'Ship', 'Sparkles', 'Cog', 'TrendingUp'];

const obtenerIcono = (nombreIcono, tamaño = 20) => {
  const icons = {
    Crown: <Crown size={tamaño} />,
    Church: <Church size={tamaño} />,
    Users: <Users size={tamaño} />,
    Shield: <Shield size={tamaño} />,
    User: <User size={tamaño} />,
    Gem: <Gem size={tamaño} />,
    Ship: <Ship size={tamaño} />,
    Sparkles: <Sparkles size={tamaño} />,
    Cog: <Cog size={tamaño} />,
    TrendingUp: <TrendingUp size={tamaño} />
  };
  return icons[nombreIcono] || <TrendingUp size={tamaño} />;
};

export default function SociopoliticaModule({ proyectoId }) {
  const [nodosBD, setNodosBD] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorBD, setErrorBD] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNodo, setEditingItem] = useState(null);
  const [padreIdSeleccionado, setPadreIdSeleccionado] = useState(null);
  const [formData, setFormData] = useState({ rol: '', descripcion: '', icono: 'Crown' });

  const cargarNodos = useCallback(async () => {
    if (!proyectoId) { setCargando(false); return; }
    setCargando(true);
    setErrorBD(null);
    try {
      const { data, error } = await supabase
        .from('jerarquia')
        .select('*')
        .eq('id_proyecto', proyectoId);
      if (error) throw error;
      setNodosBD(data || []);
    } catch (err) {
      setErrorBD(err.message);
    } finally {
      setCargando(false);
    }
  }, [proyectoId]);

  useEffect(() => { cargarNodos(); }, [cargarNodos]);

  const construirArbol = (items, padreId = null) => {
    return items
      .filter(item => item.padre_id === padreId)
      .map(item => ({ ...item, hijos: construirArbol(items, item.id) }));
  };

  const arbolJerarquia = construirArbol(nodosBD, null);

  const abrirModalAgregar = (padreId = null) => {
    setEditingItem(null);
    setPadreIdSeleccionado(padreId);
    setFormData({ rol: '', descripcion: '', icono: 'User' });
    setShowModal(true);
  };

  const abrirModalEditar = (nodo) => {
    setEditingItem(nodo);
    setPadreIdSeleccionado(nodo.padre_id);
    setFormData({ rol: nodo.rol, descripcion: nodo.descripcion, icono: nodo.icono });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.rol.trim()) return alert("El rol es obligatorio.");
    setGuardando(true);
    const payload = { id_proyecto: proyectoId, padre_id: padreIdSeleccionado, rol: formData.rol, descripcion: formData.descripcion, icono: formData.icono };
    
    const { error } = editingNodo 
      ? await supabase.from('jerarquia').update(payload).eq('id', editingNodo.id)
      : await supabase.from('jerarquia').insert([payload]);

    if (error) alert(`Error: ${error.message}`);
    else { await cargarNodos(); setShowModal(false); }
    setGuardando(false);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Eliminar este rol? Esto borrará también a sus subordinados.")) {
      await supabase.from('jerarquia').delete().eq('id', id);
      cargarNodos();
    }
  };

  if (!proyectoId && !cargando) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-red-400 gap-4 bg-red-50 rounded-[30px] border border-red-100">
        <AlertCircle size={40} />
        <p className="font-bold text-center">Falta el <code className="bg-red-100 px-2 py-1 rounded">proyectoId</code></p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 md:space-y-10 pb-20">
      
      {/* Header Adaptable */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4C1EC]/20 blur-3xl rounded-full pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-[#D4C1EC] text-slate-800 rounded-2xl shadow-inner">
            <Crown className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Estructura Social</h2>
            <p className="text-slate-400 text-xs md:text-sm">Jerarquías y ramas de poder.</p>
          </div>
        </div>
      </div>

      {/* Contenedor del Árbol con scroll mejorado */}
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[30px] md:rounded-[40px] p-2 md:p-10 relative overflow-hidden flex flex-col min-h-[450px]">
        {cargando ? (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-400 gap-3">
            <Loader2 className="animate-spin" size={32} />
            <p className="font-bold text-sm">Construyendo pirámide...</p>
          </div>
        ) : (
          <div className="flex-1 w-full overflow-x-auto overflow-y-hidden custom-scrollbar pb-10">
            <div className="min-w-max flex justify-center pt-8 px-6">
              {arbolJerarquia.length === 0 ? (
                <div className="flex flex-col items-center gap-4 mt-10">
                  <Crown size={40} className="text-slate-300" />
                  <p className="text-slate-400 font-bold text-sm">Nadie gobierna este mundo aún.</p>
                  <button onClick={() => abrirModalAgregar(null)} className="px-6 py-3 bg-[#D4C1EC] text-slate-900 rounded-full font-black text-xs flex items-center gap-2 shadow-md">
                    <Plus size={14} /> Crear Raíz
                  </button>
                </div>
              ) : (
                <div className="flex gap-10 md:gap-20">
                  {arbolJerarquia.map((nodoRaiz) => (
                    <NodoJerarquia 
                      key={nodoRaiz.id} 
                      nodo={nodoRaiz} 
                      alAgregar={abrirModalAgregar} 
                      alEditar={abrirModalEditar} 
                      alEliminar={handleEliminar} 
                      esRaiz={true} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Optimizado para Móvil (Slide up) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] shadow-2xl relative z-10 flex flex-col max-h-[95vh]">
              <div className="flex justify-center pt-4 sm:hidden"><div className="w-12 h-1.5 rounded-full bg-slate-200" /></div>
              <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-black text-slate-800">
                    {editingNodo ? 'Editar Rol' : 'Nuevo Rol'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="p-2 bg-slate-50 rounded-full text-slate-400"><X size={20} /></button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nombre del Rol</label>
                    <input type="text" value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#D4C1EC] font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Descripción</label>
                    <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#D4C1EC] min-h-[100px] resize-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Icono</label>
                    <div className="grid grid-cols-5 gap-2 bg-slate-50 p-4 rounded-2xl">
                      {ICONOS_DISPONIBLES.map(iconName => (
                        <button key={iconName} onClick={() => setFormData({...formData, icono: iconName})} className={`p-3 flex justify-center rounded-xl transition-all ${formData.icono === iconName ? 'bg-white shadow-md text-[#7C3AED] scale-110' : 'text-slate-400'}`}>
                          {obtenerIcono(iconName, 20)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button onClick={handleSave} disabled={guardando} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                  {guardando ? <Loader2 size={20} className="animate-spin" /> : 'Confirmar Cambios'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function NodoJerarquia({ nodo, alAgregar, alEditar, alEliminar, esRaiz = false }) {
  return (
    <div className="flex flex-col items-center relative">
      {/* Nodo adaptable */}
      <motion.div className={`w-40 sm:w-52 md:w-64 p-4 md:p-6 rounded-[22px] md:rounded-[28px] border-2 flex flex-col items-center text-center relative z-10 group transition-all ${esRaiz ? 'bg-[#D4C1EC] border-[#D4C1EC] text-slate-900 shadow-lg' : 'bg-white border-slate-100 text-slate-800 shadow-sm hover:shadow-md'}`}>
        
        {/* Acciones visibles en móvil y hover en escritorio */}
        <div className="absolute -top-3 right-0 flex gap-1 z-30">
          <button onClick={() => alEditar(nodo)} className="p-2 bg-white text-blue-500 rounded-full shadow-md border border-slate-100"><Edit size={14}/></button>
          {!esRaiz && <button onClick={() => alEliminar(nodo.id)} className="p-2 bg-white text-red-500 rounded-full shadow-md border border-slate-100"><Trash2 size={14}/></button>}
        </div>

        <div className="mb-2 text-[#7C3AED]">
          {obtenerIcono(nodo.icono, esRaiz ? 28 : 24)}
        </div>
        
        <h5 className="font-black text-[11px] md:text-sm uppercase tracking-tight leading-tight line-clamp-1">{nodo.rol}</h5>
        <p className={`text-[10px] md:text-xs mt-1 leading-relaxed line-clamp-2 ${esRaiz ? 'text-slate-800/70' : 'text-slate-400'}`}>
          {nodo.descripcion || 'Sin descripción...'}
        </p>
        
        <button onClick={() => alAgregar(nodo.id)} className={`absolute -bottom-3 p-2 rounded-full shadow-lg border border-white transition-all z-20 hover:scale-110 active:scale-90 ${esRaiz ? 'bg-white text-[#7C3AED]' : 'bg-[#D4C1EC] text-slate-900'}`}>
          <Plus size={16} />
        </button>
      </motion.div>
      
      {/* Conectores adaptables */}
      {nodo.hijos && nodo.hijos.length > 0 && (
        <div className="relative pt-8 md:pt-16 flex gap-6 md:gap-12">
          {/* Línea Vertical */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 md:h-16 bg-slate-200" />
          
          {/* Línea Horizontal (solo si hay más de un hijo) */}
          {nodo.hijos.length > 1 && (
            <div className="absolute top-8 md:top-16 left-[15%] right-[15%] h-0.5 bg-slate-200" />
          )}
          
          {nodo.hijos.map((hijo) => (
            <NodoJerarquia key={hijo.id} nodo={hijo} alAgregar={alAgregar} alEditar={alEditar} alEliminar={alEliminar} />
          ))}
        </div>
      )}
    </div>
  );
}