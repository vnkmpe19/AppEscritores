"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Church, LayoutGrid, Scale, Edit3, 
  TrendingUp, Gem, Ship, Sparkles, Plus, Trash2, X, Edit, Cog, Crown, Users, Shield, User, Loader2, AlertCircle
} from 'lucide-react';

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

export default function SociopoliticalModule({ proyectoId }) {
  const [tiposGobierno, setTiposGobierno] = useState([]);
  const [gobiernoActivo, setGobiernoActivo] = useState(null);
  const [nodosJerarquia, setNodosJerarquia] = useState([]);
  const [nombreCodigoLegal, setNombreCodigoLegal] = useState('Código');
  const [leyes, setLeyes] = useState([]);
  const [economia, setEconomia] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorBD, setErrorBD] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [configModal, setConfigModal] = useState({ tipo: '', titulo: '' });
  const [elementoEditado, setElementoEditado] = useState(null); 
  const [idPadreJerarquia, setIdPadreJerarquia] = useState(null);

  const [textoFormulario, setTextoFormulario] = useState('');
  const [descripcionFormulario, setDescripcionFormulario] = useState('');
  const [valorFormulario, setValorFormulario] = useState(50);
  const [iconoFormulario, setIconoFormulario] = useState('Crown');

  const cargarTodo = useCallback(async () => {
    if (!proyectoId) { setCargando(false); return; }
    setCargando(true);
    setErrorBD(null);

    try {
      let [resGov, resJer, resLeyCfg, resLey, resEco] = await Promise.all([
        supabase.from('gobiernos').select('*').eq('id_proyecto', proyectoId),
        supabase.from('jerarquia').select('*').eq('id_proyecto', proyectoId),
        supabase.from('leyes_config').select('*').eq('id_proyecto', proyectoId).maybeSingle(),
        supabase.from('leyes').select('*').eq('id_proyecto', proyectoId),
        supabase.from('economia').select('*').eq('id_proyecto', proyectoId)
      ]);

      if (resGov.data && resGov.data.length === 0) {
        const govs = [
          { id_proyecto: proyectoId, titulo: 'Monarquía', descripcion: 'Poder absoluto heredado por linaje de sangre.', icono: 'Crown', activo: true },
          { id_proyecto: proyectoId, titulo: 'Teocracia', descripcion: 'Liderado por deidades o autoridades religiosas.', icono: 'Church', activo: false },
          { id_proyecto: proyectoId, titulo: 'Democracia', descripcion: 'Participación ciudadana en decisiones clave.', icono: 'Users', activo: false },
          { id_proyecto: proyectoId, titulo: 'Oligarquía', descripcion: 'Poder en manos de unos pocos privilegiados.', icono: 'Shield', activo: false }
        ];
        await supabase.from('gobiernos').insert(govs);
        resGov = await supabase.from('gobiernos').select('*').eq('id_proyecto', proyectoId);
      }

      if (resEco.data && resEco.data.length === 0) {
        const ecos = [
          { id_proyecto: proyectoId, etiqueta: 'Comercio Marítimo', valor: 85, icono: 'Ship' },
          { id_proyecto: proyectoId, etiqueta: 'Minería', valor: 62, icono: 'Gem' },
          { id_proyecto: proyectoId, etiqueta: 'Magia/Cristales', valor: 45, icono: 'Sparkles' }
        ];
        await supabase.from('economia').insert(ecos);
        resEco = await supabase.from('economia').select('*').eq('id_proyecto', proyectoId);
      }

      if (resJer.data && resJer.data.length === 0) {
         const {data: rootData} = await supabase.from('jerarquia').insert([{ id_proyecto: proyectoId, rol: 'REY / SOBERANO', descripcion: 'La autoridad suprema', icono: 'Crown' }]).select().single();
         if (rootData) {
            await supabase.from('jerarquia').insert([
               { id_proyecto: proyectoId, padre_id: rootData.id, rol: 'Señores & Nobles', descripcion: 'Dueños de tierras y vasallos', icono: 'Shield' },
               { id_proyecto: proyectoId, padre_id: rootData.id, rol: 'Alto Clero', descripcion: 'Guías espirituales y políticos', icono: 'Church' }
            ]);
         }
         resJer = await supabase.from('jerarquia').select('*').eq('id_proyecto', proyectoId);
      }

      if (resLey.data && resLey.data.length === 0) {
         const leyesEjemplo = [
           { id_proyecto: proyectoId, texto: 'Nadie puede portar armas mágicas dentro de los muros de la capital sin autorización real.' },
           { id_proyecto: proyectoId, texto: 'El 10% de todas las ganancias comerciales pertenecen a la corona.' },
           { id_proyecto: proyectoId, texto: 'Queda estrictamente prohibido comerciar con reliquias de la antigua guerra.' }
         ];
         await supabase.from('leyes').insert(leyesEjemplo);
         resLey = await supabase.from('leyes').select('*').eq('id_proyecto', proyectoId);
      }

      if (resGov.data) {
        setTiposGobierno(resGov.data);
        const activo = resGov.data.find(g => g.activo);
        if (activo) setGobiernoActivo(activo.id);
      }
      if (resJer.data) setNodosJerarquia(resJer.data);
      if (resLeyCfg.data) setNombreCodigoLegal(resLeyCfg.data.nombre_codigo);
      if (resLey.data) setLeyes(resLey.data);
      if (resEco.data) setEconomia(resEco.data);

    } catch (err) {
      setErrorBD(err.message);
    } finally {
      setCargando(false);
    }
  }, [proyectoId]);

  useEffect(() => { cargarTodo(); }, [cargarTodo]);

  const construirArbol = (items, padreId = null) => {
    return items.filter(item => item.padre_id === padreId).map(item => ({ ...item, hijos: construirArbol(items, item.id) }));
  };
  const arbolJerarquia = construirArbol(nodosJerarquia, null);

  const seleccionarGobierno = async (idGobierno) => {
    setGobiernoActivo(idGobierno);
    await supabase.from('gobiernos').update({ activo: false }).eq('id_proyecto', proyectoId);
    await supabase.from('gobiernos').update({ activo: true }).eq('id', idGobierno);
  };

  const abrirModal = (tipo, titulo, elemento = null, extraId = null) => {
    setConfigModal({ tipo, titulo }); 
    setElementoEditado(elemento);
    setIdPadreJerarquia(extraId); 
    
    setTextoFormulario(''); setDescripcionFormulario(''); setValorFormulario(50); setIconoFormulario('Crown');
    
    if (tipo === 'nombreLegal') { setTextoFormulario(nombreCodigoLegal); }
    else if (tipo === 'gobierno' && elemento) { setTextoFormulario(elemento.titulo); setDescripcionFormulario(elemento.descripcion); setIconoFormulario(elemento.icono || 'Crown'); }
    else if (tipo === 'editarNodo' && elemento) { setTextoFormulario(elemento.rol); setDescripcionFormulario(elemento.descripcion); setIconoFormulario(elemento.icono || 'User'); }
    else if (tipo === 'agregarNodo') { setIconoFormulario('User'); }
    else if (elemento && (tipo === 'ley' || tipo === 'economia')) { 
      setTextoFormulario(elemento.texto || elemento.etiqueta || ''); 
      setValorFormulario(elemento.valor || 50); 
      setIconoFormulario(elemento.icono || 'Gem'); 
    }
    setMostrarModal(true);
  };

  const guardarCambios = async () => {
    if (!textoFormulario.trim()) return alert("El campo principal es obligatorio");
    setGuardando(true);
    let err;

    try {
      if (configModal.tipo === 'nombreLegal') {
        const { error } = await supabase.from('leyes_config').upsert({ id_proyecto: proyectoId, nombre_codigo: textoFormulario });
        err = error;
      } 
      else if (configModal.tipo === 'gobierno') {
        const payload = { id_proyecto: proyectoId, titulo: textoFormulario, descripcion: descripcionFormulario, icono: iconoFormulario };
        if (elementoEditado) err = (await supabase.from('gobiernos').update(payload).eq('id', elementoEditado.id)).error;
        else err = (await supabase.from('gobiernos').insert([payload])).error;
      }
      else if (configModal.tipo === 'agregarNodo') {
        const payload = { id_proyecto: proyectoId, padre_id: idPadreJerarquia, rol: textoFormulario, descripcion: descripcionFormulario, icono: iconoFormulario };
        err = (await supabase.from('jerarquia').insert([payload])).error;
      }
      else if (configModal.tipo === 'editarNodo') {
        const payload = { rol: textoFormulario, descripcion: descripcionFormulario, icono: iconoFormulario };
        err = (await supabase.from('jerarquia').update(payload).eq('id', elementoEditado.id)).error;
      }
      else if (configModal.tipo === 'ley') {
        const payload = { id_proyecto: proyectoId, texto: textoFormulario };
        if (elementoEditado) err = (await supabase.from('leyes').update(payload).eq('id', elementoEditado.id)).error;
        else err = (await supabase.from('leyes').insert([payload])).error;
      }
      else if (configModal.tipo === 'economia') {
        const payload = { id_proyecto: proyectoId, etiqueta: textoFormulario, valor: valorFormulario, icono: iconoFormulario };
        if (elementoEditado) err = (await supabase.from('economia').update(payload).eq('id', elementoEditado.id)).error;
        else err = (await supabase.from('economia').insert([payload])).error;
      }

      if (err) throw err;
      await cargarTodo();
      setMostrarModal(false);
    } catch (e) {
      alert(`Error al guardar: ${e.message}`);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarElemento = async (tipo, id) => {
    if (window.confirm("¿Estás seguro de eliminar este elemento?")) {
      if (tipo === 'gobierno') await supabase.from('gobiernos').delete().eq('id', id);
      if (tipo === 'ley') await supabase.from('leyes').delete().eq('id', id);
      if (tipo === 'economia') await supabase.from('economia').delete().eq('id', id);
      if (tipo === 'jerarquia') await supabase.from('jerarquia').delete().eq('id', id);
      cargarTodo();
    }
  };

  if (!proyectoId && !cargando) {
    return (
      <div className="flex flex-col items-center justify-center p-10 sm:p-20 text-red-400 gap-4 bg-red-50 rounded-[40px] border border-red-100">
        <AlertCircle size={40} />
        <p className="font-bold text-center">Falta el ID del proyecto.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 sm:space-y-12 pb-20 px-2 sm:px-0">
      
      <div className="bg-white p-6 md:p-10 rounded-[30px] md:rounded-[40px] border border-slate-100 shadow-xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF5C5C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-5 relative z-10">
          <div className="p-3 md:p-4 bg-[#FFB7C5]/50 text-slate-800 rounded-2xl shadow-inner">
            <Users size={32} className="w-8 h-8 md:w-auto md:h-auto" />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Estructura Sociopolítica</h2>
            <p className="text-slate-400 text-sm md:text-lg mt-1 max-w-2xl leading-relaxed">Define el marco legal, social y económico que rige a tu civilización. Elige cómo se distribuye el poder y quiénes sostienen la corona.</p>
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 gap-4">
          <Loader2 size={40} className="animate-spin" />
          <p className="font-bold">Cargando estructura...</p>
        </div>
      ) : (
        <>
          {/* TIPOS DE GOBIERNO */}
          <section>
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-black text-slate-800">Tipos de Gobierno</h3>
              <button onClick={() => abrirModal('gobierno', 'Nuevo Tipo de Gobierno')} className="px-4 py-2 sm:px-5 sm:py-2.5 bg-[#BFD7ED] text-slate-800 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-transform flex items-center gap-2">
                <Plus size={14} className="sm:w-4 sm:h-4"/> Añadir <span className="hidden sm:inline">Tipo</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <AnimatePresence>
                {tiposGobierno.map(gob => (
                  <motion.div key={gob.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <TarjetaGobierno 
                      titulo={gob.titulo} 
                      descripcion={gob.descripcion} 
                      icono={obtenerIcono(gob.icono, 24)} 
                      activo={gobiernoActivo === gob.id} 
                      alHacerClic={() => seleccionarGobierno(gob.id)} 
                      alEditar={() => abrirModal('gobierno', 'Editar Gobierno', gob)} 
                      alEliminar={() => eliminarElemento('gobierno', gob.id)} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* JERARQUÍA SOCIAL */}
          <section>
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-black text-slate-800">Jerarquía Social</h3>
            </div>
            <div className="bg-slate-50 rounded-[30px] sm:rounded-[40px] p-4 sm:p-12 border border-slate-100 overflow-x-auto min-h-[400px] sm:min-h-[500px] flex justify-center shadow-inner custom-scrollbar relative">
              <div className="min-w-max flex flex-col items-center gap-12 sm:gap-16 py-4">
                {arbolJerarquia.length === 0 ? (
                  <div className="flex flex-col items-center gap-4 mt-10">
                    <Crown size={40} className="text-slate-300" />
                    <p className="text-slate-400 font-bold text-sm">El trono está vacío.</p>
                    <button onClick={() => abrirModal('agregarNodo', 'Coronar Raíz', null, null)} className="px-5 py-2.5 bg-[#D4C1EC] text-slate-900 rounded-full font-black text-xs flex items-center gap-2 shadow-lg">
                      <Plus size={14} /> Añadir Raíz
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-8 sm:gap-16 md:gap-24">
                    {arbolJerarquia.map((nodoRaiz) => (
                      <NodoJerarquia 
                        key={nodoRaiz.id} 
                        nodo={nodoRaiz} 
                        alAgregar={(idPadre) => abrirModal('agregarNodo', 'Agregar Rango', null, idPadre)} 
                        alEditar={(nodo) => abrirModal('editarNodo', 'Editar Rango', nodo)} 
                        alEliminar={(id) => eliminarElemento('jerarquia', id)} 
                        esRaiz={true} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            
            {/* LEyes y justicia */}
            <section>
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <Scale className="text-[#FF5C5C] w-6 h-6 sm:w-7 sm:h-7" />
                <h3 className="text-xl sm:text-2xl font-black text-slate-800">Leyes y Justicia</h3>
              </div>
              <div className="bg-white p-5 sm:p-8 rounded-[28px] sm:rounded-[32px] border border-slate-100 shadow-xl">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <Edit3 className="text-[#3A82F6] flex-shrink-0" size={20} />
                    <h4 className="text-lg sm:text-xl font-black text-slate-800 truncate">{nombreCodigoLegal}</h4>
                  </div>
                  <button onClick={() => abrirModal('nombreLegal', 'Editar Nombre del Código')} className="p-1.5 sm:p-2 text-slate-400 hover:text-[#9BC5E6] bg-slate-50 rounded-full transition-colors flex-shrink-0"><Edit size={14}/></button>
                </div>
                
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {leyes.length === 0 && <p className="text-xs text-slate-400 italic text-center py-4">No hay leyes escritas.</p>}
                  <AnimatePresence>
                    {leyes.map((ley, indice) => (
                      <motion.div key={ley.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex gap-3 sm:gap-4 group p-2 sm:p-3 hover:bg-slate-50 rounded-2xl transition-colors relative">
                        <span className="text-[#9BC5E6] font-black text-sm sm:text-lg min-w-[20px] sm:min-w-[24px]">{(indice + 1).toString().padStart(2, '0')}.</span>
                        <p className="text-slate-600 leading-relaxed pr-10 sm:pr-16 text-xs sm:text-sm">{ley.texto}</p>
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 flex flex-col sm:flex-row gap-1 transition-opacity">
                          <button onClick={() => abrirModal('ley', 'Editar Ley', ley)} className="p-1.5 text-blue-400 bg-white shadow-sm rounded-lg hover:scale-110"><Edit size={12}/></button>
                          <button onClick={() => eliminarElemento('ley', ley.id)} className="p-1.5 text-red-400 bg-white shadow-sm rounded-lg hover:scale-110"><Trash2 size={12}/></button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <button onClick={() => abrirModal('ley', 'Añadir Nueva Ley')} className="w-full py-3 sm:py-4 border-2 border-dashed border-[#3B82F6]/30 text-[#3B82F6] font-black rounded-xl sm:rounded-2xl hover:bg-[#3B82F6]/5 transition-all uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-2">
                  <Plus size={14} /> Añadir Ley
                </button>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <TrendingUp className="text-[#F97316] w-6 h-6 sm:w-7 sm:h-7" />
                <h3 className="text-xl sm:text-2xl font-black text-slate-800">Motores Económicos</h3>
              </div>
              <div className="space-y-4">
                {economia.length === 0 && <p className="text-center text-slate-400 font-bold bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-sm">La economía aún no fluye.</p>}
                <AnimatePresence>
                  {economia.map(eco => (
                    <motion.div key={eco.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white p-5 sm:p-6 rounded-[24px] sm:rounded-3xl border border-slate-100 shadow-sm group relative">
                      <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 flex gap-1 transition-opacity z-10">
                        <button onClick={() => abrirModal('economia', 'Editar Sector', eco)} className="p-1.5 sm:p-2 text-blue-500 bg-white border border-slate-100 shadow-md rounded-full hover:scale-110 transition-transform"><Edit size={12} className="sm:w-3.5 sm:h-3.5"/></button>
                        <button onClick={() => eliminarElemento('economia', eco.id)} className="p-1.5 sm:p-2 text-red-500 bg-white border border-slate-100 shadow-md rounded-full hover:scale-110 transition-transform"><Trash2 size={12} className="sm:w-3.5 sm:h-3.5"/></button>
                      </div>
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="p-2 sm:p-3 bg-[#FFD1A4]/50 rounded-lg sm:rounded-xl text-[#F97316] flex-shrink-0">{obtenerIcono(eco.icono, 18)}</div>
                          <span className="font-black text-slate-800 text-sm sm:text-lg truncate">{eco.etiqueta}</span>
                        </div>
                        <span className="text-[#F97316] font-black text-lg sm:text-xl pl-2">{eco.valor}%</span>
                      </div>
                      <div className="w-full h-2 sm:h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${eco.valor}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-[#FFD1A4] shadow-[0_0_15px_rgba(255,209,164,0.6)]" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <button onClick={() => abrirModal('economia', 'Nuevo Sector')} className="w-full py-4 sm:py-6 border-2 border-dashed border-slate-200 text-slate-400 font-black rounded-[24px] sm:rounded-3xl hover:border-[#FFD1A4] hover:text-[#F97316] transition-all flex flex-col items-center justify-center gap-2 uppercase tracking-widest text-[10px] sm:text-xs group">
                  <div className="p-1.5 sm:p-2 bg-slate-100 rounded-full group-hover:bg-[#FFD1A4]/50 transition-colors"><Plus size={16} className="sm:w-5 sm:h-5"/></div> Añadir Sector
                </button>
              </div>
            </section>
          </div>
        </>
      )}

      <AnimatePresence>
        {mostrarModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMostrarModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] shadow-2xl relative z-10 flex flex-col max-h-[90vh]">
              <div className="flex justify-center pt-3 pb-1 sm:hidden"><div className="w-10 h-1.5 rounded-full bg-slate-200" /></div>
              
              <div className="p-6 sm:p-8 overflow-y-auto space-y-5 custom-scrollbar">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 sm:pb-4">
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2 sm:gap-3">
                    <Edit3 className={`w-5 h-5 sm:w-6 sm:h-6 text-${configModal.tipo === 'gobierno' ? '[#3B82F6]' : configModal.tipo === 'economia' ? '[#F97316]' : configModal.tipo === 'ley' ? '[#FF5C5C]' : '[#7C3AED]' }`} /> 
                    <span className="truncate">{configModal.titulo}</span>
                  </h3>
                  <button onClick={() => setMostrarModal(false)} className="text-slate-400 hover:bg-slate-50 p-1.5 sm:p-2 rounded-full flex-shrink-0"><X size={18} /></button>
                </div>
                
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 sm:mb-2">
                      {configModal.tipo === 'nombreLegal' ? 'Nombre del Documento' : configModal.tipo === 'ley' ? 'Descripción de la Ley' : configModal.tipo === 'editarNodo' || configModal.tipo === 'agregarNodo' ? 'Nombre del Rango' : 'Título'}
                    </label>
                    {configModal.tipo === 'ley' ? (
                      <textarea value={textoFormulario} onChange={(e) => setTextoFormulario(e.target.value)} placeholder="Escribe el mandato..." className="w-full bg-slate-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 outline-none focus:ring-2 focus:ring-[#BFD7ED] min-h-[100px] resize-none font-medium text-slate-700 text-xs sm:text-sm" />
                    ) : (
                      <input type="text" value={textoFormulario} onChange={(e) => setTextoFormulario(e.target.value)} placeholder="Escribe aquí..." className="w-full bg-slate-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 outline-none focus:ring-2 focus:ring-[#BFD7ED] font-bold text-slate-800 text-xs sm:text-sm" />
                    )}
                  </div>

                  {(configModal.tipo === 'gobierno' || configModal.tipo === 'agregarNodo' || configModal.tipo === 'editarNodo') && (
                    <div>
                      <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 sm:mb-2">Descripción Breve</label>
                      <textarea value={descripcionFormulario} onChange={(e) => setDescripcionFormulario(e.target.value)} placeholder="Detalles o responsabilidades..." className="w-full bg-slate-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 outline-none focus:ring-2 focus:ring-[#BFD7ED] min-h-[80px] resize-none font-medium text-slate-700 text-xs sm:text-sm" />
                    </div>
                  )}

                  {configModal.tipo === 'economia' && (
                    <div>
                      <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 sm:mb-2">Importancia / Valor (%)</label>
                      <div className="flex gap-3 sm:gap-4 items-center bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                        <input type="range" min="1" max="100" value={valorFormulario} onChange={(e) => setValorFormulario(Number(e.target.value))} className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#F97316]" />
                        <span className="font-black text-[#F97316] w-10 text-right text-sm">{valorFormulario}%</span>
                      </div>
                    </div>
                  )}

                  {(configModal.tipo === 'gobierno' || configModal.tipo === 'economia' || configModal.tipo === 'agregarNodo' || configModal.tipo === 'editarNodo') && (
                    <div>
                      <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 sm:mb-2">Icono Representativo</label>
                      <div className="flex flex-wrap gap-2 sm:gap-3 bg-slate-50 p-2 sm:p-4 rounded-xl sm:rounded-2xl">
                        {ICONOS_DISPONIBLES.map(icono => (
                          <button key={icono} onClick={() => setIconoFormulario(icono)} className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all border-2 ${iconoFormulario === icono ? `border-[#9BC5E6] bg-white shadow-sm scale-110 text-[#9BC5E6]` : 'border-transparent bg-slate-50 text-slate-400 hover:bg-white hover:shadow-sm'}`}>
                            {obtenerIcono(icono, 16)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={guardarCambios} disabled={guardando} className={`w-full bg-[#9BC5E6] text-white font-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl mt-4 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-sm sm:text-base`}>
                  {guardando ? <Loader2 size={16} className="animate-spin" /> : null}
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

function TarjetaGobierno({ titulo, descripcion, icono, activo, alHacerClic, alEditar, alEliminar }) {
  return (
    <div 
      onClick={alHacerClic} 
      className={`p-4 sm:p-5 md:p-6 rounded-[24px] sm:rounded-[32px] border-2 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full ${
        activo 
          ? 'bg-[#BFD7ED]/10 border-[#BFD7ED] shadow-[0_0_20px_rgba(191,215,237,0.3)] sm:shadow-[0_0_30px_rgba(191,215,237,0.3)] scale-[1.02] sm:scale-105' 
          : 'bg-white border-slate-100 hover:border-slate-200'
      }`}
    >
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 flex gap-1 sm:gap-1.5 z-20 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); alEditar(); }} className="p-1.5 bg-white text-blue-500 rounded-full shadow-sm hover:scale-110">
          <Edit size={14} className="sm:w-4 sm:h-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); alEliminar(); }} className="p-1.5 bg-white text-red-500 rounded-full shadow-sm hover:scale-110">
          <Trash2 size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div> 

      <div className={`mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl transition-colors shrink-0 relative ${
        activo ? 'text-[#3B82F6] bg-[#BFD7ED]' : 'text-slate-400 bg-slate-50 group-hover:bg-slate-100'
      }`}>
        {icono}
        {activo && (
          <div className="absolute -top-3 -right-2 bg-[#BFD7ED] text-slate-800 text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
            Activo
          </div>
        )}
      </div>
      
      <h4 className="text-base sm:text-lg font-black text-slate-800 mb-1.5 sm:mb-2 pr-12 sm:pr-0">{titulo}</h4>
      <p className="text-slate-500 text-[10px] sm:text-xs leading-relaxed flex-1 line-clamp-3 sm:line-clamp-none">{descripcion}</p>
    </div>
  );
}

function NodoJerarquia({ nodo, alAgregar, alEditar, alEliminar, esRaiz = false }) {
  return (
    <div className="flex flex-col items-center relative">
      <motion.div className={`w-32 sm:w-44 md:w-56 p-3 sm:p-5 md:p-6 rounded-[20px] md:rounded-[24px] border-2 flex flex-col items-center text-center relative z-10 transition-all group hover:scale-105 cursor-default ${esRaiz ? 'bg-[#D4C1EC] border-[#D4C1EC] text-slate-900 shadow-[0_10px_30px_rgba(212,193,236,0.5)]' : 'bg-white border-slate-100 text-slate-800 shadow-sm hover:shadow-md'}`}>

        
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