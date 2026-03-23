"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Crown, Church, Users, Shield, User, Gem, Ship, Sparkles, Cog, TrendingUp, X, Loader2, AlertCircle } from 'lucide-react';

const ICONOS_DISPONIBLES = ['Crown', 'Church', 'Users', 'Shield', 'User', 'Gem', 'Ship', 'Sparkles', 'Cog', 'TrendingUp'];

const obtenerIcono = (nombreIcono, tamaño = 20) => {
  switch (nombreIcono) {
    case 'Crown': return <Crown size={tamaño} />;
    case 'Church': return <Church size={tamaño} />;
    case 'Users': return <Users size={tamaño} />;
    case 'Shield': return <Shield size={tamaño} />;
    case 'User': return <User size={tamaño} />;
    case 'Gem': return <Gem size={tamaño} />;
    case 'Ship': return <Ship size={tamaño} />;
    case 'Sparkles': return <Sparkles size={tamaño} />;
    case 'Cog': return <Cog size={tamaño} />;
    default: return <TrendingUp size={tamaño} />;
  }
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
    if (!proyectoId) {
      setCargando(false);
      return;
    }
    
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
      console.error("Error cargando jerarquía:", err);
      setErrorBD(err.message);
    } finally {
      setCargando(false);
    }
  }, [proyectoId]);

  useEffect(() => {
    cargarNodos();
  }, [cargarNodos]);

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
    if (!formData.rol.trim()) return alert("El rol/título es obligatorio.");
    setGuardando(true);

    const payload = {
      id_proyecto: proyectoId,
      padre_id: padreIdSeleccionado,
      rol: formData.rol,
      descripcion: formData.descripcion,
      icono: formData.icono
    };

    let err;
    if (editingNodo) {
      const { error } = await supabase.from('jerarquia').update(payload).eq('id', editingNodo.id);
      err = error;
    } else {
      const { error } = await supabase.from('jerarquia').insert([payload]);
      err = error;
    }

    if (err) {
      alert(`Error al guardar: ${err.message}`);
    } else {
      await cargarNodos();
      setShowModal(false);
    }
    setGuardando(false);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este rol? Se eliminarán también todos los que estén debajo de él.")) {
      await supabase.from('jerarquia').delete().eq('id', id);
      cargarNodos();
    }
  };

  if (!proyectoId && !cargando) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-red-400 gap-4 bg-red-50 rounded-[40px] border border-red-100">
        <AlertCircle size={40} />
        <p className="font-bold text-center">Falta el <code className="bg-red-100 px-2 py-1 rounded text-red-600">proyectoId</code>.<br/>Asegúrate de pasarlo al componente SociopoliticaModule.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 md:space-y-10 pb-20 px-2 sm:px-0">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 sm:p-8 md:p-10 rounded-[30px] md:rounded-[40px] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4C1EC]/20 blur-3xl rounded-full pointer-events-none" />
        <div className="flex items-center gap-4 sm:gap-5 relative z-10 w-full">
          <div className="p-3 sm:p-4 bg-[#D4C1EC]/50 text-slate-800 rounded-xl sm:rounded-2xl shadow-inner flex-shrink-0">
            <Crown className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight truncate">Estructura Social</h2>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg mt-1 truncate">Jerarquías, clases y ramas de poder.</p>
          </div>
        </div>
      </div>

      {errorBD && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold flex items-center gap-2">
          <AlertCircle size={18} /> {errorBD}
        </div>
      )}

      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[30px] md:rounded-[40px] p-4 md:p-10 relative overflow-hidden flex flex-col min-h-[400px] md:min-h-[500px]">
        {cargando ? (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-400 gap-4">
            <Loader2 className="animate-spin" size={40} />
            <p className="font-bold">Construyendo la pirámide social...</p>
          </div>
        ) : (
          <div className="flex-1 w-full overflow-x-auto custom-scrollbar cursor-grab active:cursor-grabbing pb-10">
            <div className="min-w-max flex justify-center pt-8 px-4 md:px-8">
              {arbolJerarquia.length === 0 ? (
                <div className="flex flex-col items-center gap-4 mt-10 md:mt-20">
                  <Crown size={48} className="text-slate-300" />
                  <p className="text-slate-400 font-bold text-center">Nadie gobierna aún este mundo.</p>
                  <button onClick={() => abrirModalAgregar(null)} className="px-6 py-3 bg-[#D4C1EC] text-slate-900 rounded-full font-black text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
                    <Plus size={16} /> Coronar Líder / Raíz
                  </button>
                </div>
              ) : (
                <div className="flex gap-8 sm:gap-12 md:gap-24">
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

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] shadow-2xl relative z-10 flex flex-col max-h-[90vh]">
              <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1.5 rounded-full bg-slate-200" /></div>
              
              <div className="p-6 sm:p-8 overflow-y-auto space-y-5 custom-scrollbar">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-3">
                    {editingNodo ? <><Edit className="text-[#D4C1EC]" size={20} /> Editar Rol</> : <><Plus className="text-[#4ADE80]" size={20} /> Nuevo Rol</>}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:bg-slate-50 p-2 rounded-full"><X size={18} /></button>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nombre del Rol / Título</label>
                    <input type="text" value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })} placeholder="Ej. Rey, Campesinado..." className="w-full bg-slate-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 outline-none focus:ring-2 focus:ring-[#D4C1EC] font-bold text-sm" />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Descripción</label>
                    <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} placeholder="Responsabilidades o estatus..." className="w-full bg-slate-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 outline-none focus:ring-2 focus:ring-[#D4C1EC] min-h-[80px] sm:min-h-[100px] resize-none text-xs sm:text-sm font-medium" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ícono Representativo</label>
                    <div className="flex flex-wrap gap-2 bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                      {ICONOS_DISPONIBLES.map(iconName => (
                        <button 
                          key={iconName} 
                          onClick={() => setFormData({...formData, icono: iconName})}
                          className={`p-2 sm:p-2.5 rounded-xl transition-all ${formData.icono === iconName ? 'bg-white shadow-md text-[#7C3AED] scale-110' : 'text-slate-400 hover:bg-white hover:shadow-sm'}`}
                        >
                          {obtenerIcono(iconName, 18)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button onClick={handleSave} disabled={guardando} className="w-full bg-slate-900 text-white font-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl mt-2 shadow-xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base">
                  {guardando ? <Loader2 size={18} className="animate-spin" /> : null}
                  {guardando ? 'Guardando...' : 'Confirmar'}
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
      <motion.div className={`w-36 sm:w-48 md:w-64 p-3 sm:p-5 md:p-6 rounded-[20px] md:rounded-[24px] border-2 flex flex-col items-center text-center relative z-10 transition-all group hover:scale-105 cursor-default ${esRaiz ? 'bg-[#D4C1EC] border-[#D4C1EC] text-slate-900 shadow-[0_10px_30px_rgba(212,193,236,0.5)]' : 'bg-white border-slate-100 text-slate-800 shadow-sm hover:shadow-md'}`}>
        
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button onClick={() => alEditar(nodo)} className={`p-1.5 sm:p-2 rounded-full shadow-sm hover:scale-110 ${esRaiz ? 'bg-white/30 text-white' : 'bg-slate-50 text-blue-500'}`}><Edit size={12} className="sm:w-3.5 sm:h-3.5"/></button>
          {!esRaiz && <button onClick={() => alEliminar(nodo.id)} className="p-1.5 sm:p-2 bg-slate-50 text-red-500 rounded-full shadow-sm hover:scale-110"><Trash2 size={12} className="sm:w-3.5 sm:h-3.5"/></button>}
        </div>

        <div className={`mb-1.5 sm:mb-3 ${esRaiz ? 'text-[#7C3AED]' : 'text-[#7C3AED]'} transform scale-75 sm:scale-100`}>
          {obtenerIcono(nodo.icono, 24)}
        </div>
        <h5 className="font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-tight line-clamp-2 leading-tight px-1">{nodo.rol}</h5>
        <p className={`text-[8px] sm:text-[9px] md:text-[10px] mt-1 sm:mt-1.5 px-1 sm:px-2 leading-relaxed line-clamp-2 md:line-clamp-3 ${esRaiz ? 'text-slate-800/80' : 'text-slate-500'}`}>{nodo.descripcion}</p>
        
        <button onClick={() => alAgregar(nodo.id)} className={`absolute -bottom-3 sm:-bottom-4 p-1 sm:p-2 rounded-full shadow-lg border border-slate-100 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 z-20 ${esRaiz ? 'bg-white text-[#7C3AED]' : 'bg-[#D4C1EC] text-slate-900'}`}>
          <Plus size={12} className="sm:w-4 sm:h-4" />
        </button>
      </motion.div>
      
      {nodo.hijos.length > 0 && (
        <div className="relative pt-6 sm:pt-12 md:pt-16 flex gap-4 sm:gap-8 md:gap-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 sm:h-12 md:h-16 bg-slate-200" />
          {nodo.hijos.length > 1 && <div className="absolute top-6 sm:top-12 md:top-16 left-[10%] right-[10%] h-0.5 bg-slate-200" />}
          
          {nodo.hijos.map((hijo) => (
            <NodoJerarquia key={hijo.id} nodo={hijo} alAgregar={alAgregar} alEditar={alEditar} alEliminar={alEliminar} />
          ))}
        </div>
      )}
    </div>
  );
}