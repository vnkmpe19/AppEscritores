"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { Image as ImageIcon, Plus, Edit, Trash2, X, Link as LinkIcon, Maximize2, Loader2, Database } from 'lucide-react';

export default function DashboardModule({ proyectoId }) {
  const [mapImage, setMapImage] = useState('');
  const [geografiaId, setGeografiaId] = useState(null);
  const [subiendoMapa, setSubiendoMapa] = useState(false);
  const [mapaPantallaCompleta, setMapaPantallaCompleta] = useState(false); 

  const [ideas, setIdeas] = useState([]);
  const [faccionesResumen, setFaccionesResumen] = useState([]);
  const [historiaResumen, setHistoriaResumen] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  
  const [usuarioId, setUsuarioId] = useState(null);
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ideaEditando, setIdeaEditando] = useState(null);
  const [formTitulo, setFormTitulo] = useState('');
  const [formTexto, setFormTexto] = useState(''); 
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (proyectoId) {
      cargarUsuarioYDatos();
    }
  }, [proyectoId]);

  const cargarUsuarioYDatos = async () => {
    setCargandoDatos(true);
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) setUsuarioId(authData.user.id);
    
    await Promise.all([
      cargarMapa(),
      cargarIdeas(),
      cargarResumenFacciones(),
      cargarResumenHistoria()
    ]);
    
    setCargandoDatos(false);
  };

  const cargarMapa = async () => {
    const { data } = await supabase
      .from('geografia')
      .select('id, mapa_url')
      .eq('id_proyecto', proyectoId)
      .single();
    
    if (data) {
      setGeografiaId(data.id);
      if (data.mapa_url) setMapImage(data.mapa_url);
    }
  };

  const handleGuardarMapaUrl = async (url) => {
    if (geografiaId) {
      await supabase.from('geografia').update({ mapa_url: url }).eq('id', geografiaId);
    } else {
      const { data } = await supabase.from('geografia').insert([{ id_proyecto: proyectoId, mapa_url: url }]).select().single();
      if (data) setGeografiaId(data.id);
    }
    setMapImage(url);
  };

  const handleSubirArchivo = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setSubiendoMapa(true);

    const extension = archivo.name.split('.').pop();
    const nombreArchivo = `${proyectoId}-${Math.random()}.${extension}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('imagenes')
      .upload(nombreArchivo, archivo);

    if (uploadError) {
      console.error(uploadError);
      alert('Hubo un error al subir la imagen. ¿Creaste el bucket "imagenes" en Supabase?');
      setSubiendoMapa(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('imagenes')
      .getPublicUrl(nombreArchivo);

    await handleGuardarMapaUrl(publicUrl);
    setSubiendoMapa(false);
  };

  const cargarIdeas = async () => {
    const { data } = await supabase
      .from('ideas')
      .select('*')
      .eq('id_proyecto', proyectoId)
      .order('fecha_creacion', { ascending: false });
    
    if (data) setIdeas(data);
  };

  const cargarResumenFacciones = async () => {
    const { data } = await supabase
      .from('facciones')
      .select('id, nombre, color, poder')
      .eq('id_proyecto', proyectoId)
      .limit(3);
      
    if (data) setFaccionesResumen(data);
  };

  const cargarResumenHistoria = async () => {
    const { data } = await supabase
      .from('historia')
      .select('id, titulo, epoca, orden')
      .eq('id_proyecto', proyectoId)
      .order('orden', { ascending: true })
      .limit(4); 
      
    if (data) setHistoriaResumen(data);
  };

  const abrirModalCrear = () => {
    setIdeaEditando(null);
    setFormTitulo('');
    setFormTexto('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (idea) => {
    setIdeaEditando(idea);
    setFormTitulo(idea.titulo);
    setFormTexto(idea.texto || '');
    setModalAbierto(true);
  };

  const guardarIdea = async (e) => {
    e.preventDefault();
    if (!usuarioId || !formTitulo) return;
    setGuardando(true);

    if (ideaEditando) {
      await supabase.from('ideas').update({ titulo: formTitulo, texto: formTexto }).eq('id', ideaEditando.id);
    } else {
      await supabase.from('ideas').insert([{ id_proyecto: proyectoId, id_usuario: usuarioId, titulo: formTitulo, texto: formTexto, tipo: 'Idea Rápida' }]);
    }

    setModalAbierto(false);
    setGuardando(false);
    cargarIdeas();
  };

  const eliminarIdea = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('¿Borrar esta idea para siempre?')) {
      await supabase.from('ideas').delete().eq('id', id);
      cargarIdeas();
    }
  };

  const calcularPoder = (poderTexto) => {
    const p = (poderTexto || '').toLowerCase();
    if (p.includes('supremo') || p.includes('alto') || p.includes('fuerte') || p.includes('mucho')) return '85%';
    if (p.includes('medio') || p.includes('estable') || p.includes('creciente')) return '50%';
    return '25%'; 
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-20 relative">
      
      {/* mapa */}
      <div className="xl:col-span-2 bg-white rounded-[40px] p-6 md:p-8 shadow-xl border border-slate-100 flex flex-col h-[350px] md:h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-black text-slate-800">Mapa del Mundo</h2>
          {mapImage && (
            <button 
              onClick={() => setMapaPantallaCompleta(true)} 
              className="text-[#FF5C5C] font-bold text-xs md:text-sm hover:underline transition-all flex items-center gap-1"
            >
              <Maximize2 size={16} /> <span className="hidden sm:inline">Ver Mapa Completo</span>
            </button>
          )}
        </div>
        
        <div className="flex-1 w-full bg-slate-50 rounded-2xl md:rounded-3xl relative overflow-hidden group border-2 border-dashed border-slate-200 flex items-center justify-center">
          {mapImage ? (
            <img src={mapImage} alt="Mapa del Mundo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-sm font-bold text-slate-700 z-10 text-sm md:text-base">
              Sube tu mapa
            </div>
          )}
          
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 md:gap-4 z-20">
            {subiendoMapa ? (
                <div className="w-10 h-10 border-4 border-t-[#FF5C5C] border-slate-200 rounded-full animate-spin"></div>
            ) : (
              <>
                <label className="bg-white text-slate-800 font-black px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl cursor-pointer shadow-xl hover:scale-105 transition-transform flex items-center gap-2 text-xs md:text-sm">
                  <ImageIcon size={18} className="text-[#FF5C5C]" /> 
                  Subir archivo
                  <input type="file" accept="image/*" className="hidden" onChange={handleSubirArchivo} />
                </label>
                <button 
                  onClick={() => {
                    const url = prompt("Pega el link de la imagen:");
                    if (url) handleGuardarMapaUrl(url);
                  }}
                  className="bg-slate-800 text-white font-black px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-2 text-xs md:text-sm"
                >
                  <LinkIcon size={16} /> Pegar URL
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="xl:col-span-1 bg-[#BFD7ED] rounded-[40px] p-6 md:p-8 shadow-xl flex flex-col gap-4 border border-[#BFD7ED] h-[350px] md:h-[400px]">
        <h3 className="text-xl font-black text-slate-800 mb-2">Ideas</h3>
        
        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {ideas.length === 0 ? (
            <p className="text-center text-slate-500/70 font-bold text-xs md:text-sm mt-10">No hay ideas. ¡Anota algo!</p>
          ) : (
            <AnimatePresence>
              {ideas.map((idea) => (
                <motion.div 
                  key={idea.id} 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => abrirModalEditar(idea)}
                  className="bg-white/70 backdrop-blur-sm p-3 md:p-4 rounded-[20px] md:rounded-[24px] shadow-sm text-sm text-slate-700 font-medium leading-relaxed hover:bg-white transition-colors cursor-pointer group relative"
                >
                  <p className="font-bold pr-6 text-xs md:text-sm">{idea.titulo}</p>
                  {idea.texto && <p className="text-[10px] md:text-xs text-slate-500 mt-1 line-clamp-2 pr-6">{idea.texto}</p>}
                  
                  <button 
                    onClick={(e) => eliminarIdea(idea.id, e)} 
                    className="absolute top-1/2 -translate-y-1/2 right-2 md:right-3 text-red-400 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:text-red-600 transition-opacity bg-white p-1.5 rounded-full shadow-sm"
                  >
                    <Trash2 size={12} className="md:w-3.5 md:h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <button onClick={abrirModalCrear} className="w-full py-3 md:py-4 bg-white/60 hover:bg-white text-slate-800 font-black rounded-xl md:rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm mt-2 flex-shrink-0 text-xs md:text-sm">
          <Plus size={16} /> Nueva Idea
        </button>
      </div>

      <div className="xl:col-span-1 bg-white rounded-[40px] p-6 md:p-8 shadow-xl border border-slate-100 flex flex-col h-[280px] md:h-auto">
        <h3 className="text-lg md:text-xl font-black text-slate-800 mb-6">Facciones y Poder</h3>
        <div className="space-y-4 md:space-y-6 flex-1 flex flex-col justify-center">
          
          {cargandoDatos ? (
             <p className="text-slate-400 text-xs text-center animate-pulse">Cargando datos...</p>
          ) : faccionesResumen.length === 0 ? (
             <div className="text-center opacity-50 flex flex-col items-center gap-2">
               <Database size={24} className="text-slate-400" />
               <p className="text-slate-400 font-bold text-xs">Crea facciones en el módulo de Relaciones para verlas aquí.</p>
             </div>
          ) : (
            faccionesResumen.map(fac => {
              const colorBase = fac.color || '#FFB7C5';
              const widthPoder = calcularPoder(fac.poder);
              
              return (
                <div key={fac.id} className="flex items-center gap-3 md:gap-4 group">
                  <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex-shrink-0 transition-transform shadow-inner" 
                    style={{ backgroundColor: `${colorBase}30`, borderColor: colorBase }} // 30 = 20% opacity hex
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-800 text-xs md:text-sm mb-1.5 md:mb-2 truncate transition-colors" style={{ '--hover-color': colorBase }}>
                      {fac.nombre}
                    </p>
                    <div className="w-full h-1 md:h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: widthPoder }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ backgroundColor: colorBase }} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
        </div>
      </div>

      <div className="xl:col-span-2 bg-white rounded-[40px] p-6 md:p-8 shadow-xl border border-slate-100 flex flex-col h-[200px] md:h-auto">
        <h3 className="text-lg md:text-xl font-black text-slate-800 mb-6 md:mb-8">Eventos Históricos Recientes</h3>
        <div className="relative flex-1 flex items-center px-2 sm:px-4 md:px-12 overflow-x-auto custom-scrollbar pb-4 md:pb-0">
          
          {cargandoDatos ? (
            <p className="text-slate-400 text-xs text-center w-full animate-pulse">Cargando línea temporal...</p>
          ) : historiaResumen.length === 0 ? (
            <div className="text-center opacity-50 flex flex-col items-center justify-center w-full gap-2">
              <Database size={24} className="text-slate-400" />
              <p className="text-slate-400 font-bold text-xs">Crea eventos en el módulo de Historia para verlos aquí.</p>
            </div>
          ) : (
            <>
              <div className="absolute left-4 right-4 md:left-8 md:right-8 h-1 bg-slate-100 top-[15px] md:top-[20px]" />
              
              <div className="w-full flex justify-between relative z-10 min-w-[300px]">
                {historiaResumen.map((evento, index) => (
                  <TimelineNode 
                    key={evento.id} 
                    label={evento.epoca || evento.titulo} 
                    sublabel={evento.titulo}
                    active={index === historiaResumen.length - 1} // El último evento se marca como "activo/actual"
                  />
                ))}
              </div>
            </>
          )}

        </div>
      </div>

      <AnimatePresence>
        {modalAbierto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalAbierto(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-[#BFD7ED] w-full max-w-sm md:max-w-md rounded-[28px] md:rounded-[32px] shadow-2xl relative z-10 p-6 md:p-8">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg md:text-xl font-black text-slate-800">{ideaEditando ? 'Editar Idea' : 'Anotar Idea'}</h3>
                <button onClick={() => setModalAbierto(false)} className="text-slate-500 hover:bg-white/50 p-1.5 md:p-2 rounded-full"><X size={20} className="md:w-5 md:h-5" /></button>
              </div>

              <form onSubmit={guardarIdea} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  required 
                  value={formTitulo} 
                  onChange={(e) => setFormTitulo(e.target.value)} 
                  placeholder="Título de tu idea..." 
                  className="w-full bg-white/70 border-none rounded-xl md:rounded-2xl p-3 md:p-4 outline-none focus:ring-2 focus:ring-white transition-all font-bold text-slate-700 text-sm md:text-base" 
                />
                <textarea 
                  value={formTexto} 
                  onChange={(e) => setFormTexto(e.target.value)} 
                  placeholder="Detalles (opcional)..." 
                  className="w-full bg-white/70 border-none rounded-xl md:rounded-2xl p-3 md:p-4 outline-none focus:ring-2 focus:ring-white transition-all font-medium text-slate-700 min-h-[100px] md:min-h-[120px] resize-none text-sm md:text-base" 
                />

                <button type="submit" disabled={guardando} className="w-full bg-white text-slate-800 font-black py-3 md:py-4 rounded-xl mt-2 shadow-sm hover:scale-[1.02] transition-transform disabled:opacity-50 text-sm md:text-base">
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mapaPantallaCompleta && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMapaPantallaCompleta(false)} className="absolute inset-0 bg-slate-900/90 backdrop-blur-md cursor-pointer" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-[95vw] md:max-w-[90vw] h-[85vh] md:h-[90vh] flex items-center justify-center">
              <button 
                onClick={() => setMapaPantallaCompleta(false)} 
                className="absolute -top-12 md:-top-10 right-0 md:-right-10 text-white hover:text-[#FF5C5C] bg-white/10 p-2 md:p-3 rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
              
              <img 
                src={mapImage} 
                alt="Mapa Completo" 
                className="max-w-full max-h-full object-contain rounded-xl md:rounded-2xl shadow-2xl pointer-events-none" 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

function TimelineNode({ label, sublabel, active }) {
  return (
    <div className="flex flex-col items-center gap-2 md:gap-4 group cursor-pointer max-w-[100px] md:max-w-[120px]">
      <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 md:border-4 transition-all duration-300 ${active ? 'bg-[#FF5C5C] border-white shadow-md scale-125 md:scale-150' : 'bg-slate-200 border-white group-hover:bg-slate-300'}`} />
      <div className="text-center">
        <span className={`block text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-colors truncate w-full ${active ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'}`}>
          {label}
        </span>
        {sublabel && (
          <span className="block text-[7px] md:text-[8px] font-bold text-slate-400 truncate w-full mt-0.5 md:mt-1">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}