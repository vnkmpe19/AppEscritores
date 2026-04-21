"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Map, Image as ImageIcon, X, Maximize2, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WidgetMapa({ proyectoId }) {
  const [geografiaId, setGeografiaId] = useState(null);
  const [mapaImg, setMapaImg] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [subiendoMapa, setSubiendoMapa] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (proyectoId) cargarMapa();
  }, [proyectoId]);

  const cargarMapa = async () => {
    setCargando(true);
    const { data } = await supabase
      .from('geografia')
      .select('id, mapa_url')
      .eq('id_proyecto', proyectoId)
      .single();
    
    if (data) {
      setGeografiaId(data.id);
      if (data.mapa_url) {
        setMapaImg(data.mapa_url);
        setInputUrl(data.mapa_url);
      }
    }
    setCargando(false);
  };

  const guardarMapaBD = async (url) => {
    setSubiendoMapa(true);
    if (geografiaId) {
      await supabase.from('geografia').update({ mapa_url: url }).eq('id', geografiaId);
    } else {
      const { data } = await supabase.from('geografia').insert([{ id_proyecto: proyectoId, mapa_url: url }]).select().single();
      if (data) setGeografiaId(data.id);
    }
    setMapaImg(url);
    setInputUrl(url || '');
    setSubiendoMapa(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendoMapa(true);
    const extension = file.name.split('.').pop();
    const nombreArchivo = `mapa-relieve-${proyectoId}-${Math.random()}.${extension}`;

    const { error } = await supabase.storage.from('imagenes').upload(nombreArchivo, file);
    
    if (error) {
      console.error(error);
      alert('Error al subir el mapa al servidor.');
      setSubiendoMapa(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('imagenes').getPublicUrl(nombreArchivo);
    await guardarMapaBD(publicUrl);
  };

  const handleBorrarMapa = async () => {
    if (window.confirm("¿Quieres quitar este mapa?")) {
      await guardarMapaBD(null);
    }
  };

  const handleGuardarUrl = () => {
    if (inputUrl && inputUrl !== mapaImg) {
      guardarMapaBD(inputUrl);
    }
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-[30px] md:rounded-[40px] p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col h-full items-center justify-center min-h-[250px] md:min-h-[300px]">
        <p className="text-slate-400 font-bold animate-pulse text-sm md:text-base">Cargando cartografía...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-[30px] md:rounded-[40px] p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col h-full relative z-0 min-h-[250px] md:min-h-[300px]">
        <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2 mb-4 md:mb-6">
          <Map className="text-[#9BC5E6]" size={24} /> <span className="truncate">Mapa de Relieve</span>
        </h2>

        {!mapaImg ? (
          <div className="flex-1 bg-[#BFD7ED]/20 rounded-[20px] md:rounded-[24px] border-2 border-dashed border-[#BFD7ED] flex flex-col items-center justify-center p-4 md:p-8 text-center min-h-[200px] md:min-h-[250px] relative">
            {subiendoMapa ? (
              <div className="flex flex-col items-center gap-3 md:gap-4">
                <Loader2 className="animate-spin text-[#9BC5E6]" size={36} />
                <p className="text-slate-500 font-bold text-sm">Procesando...</p>
              </div>
            ) : (
              <>
                <Map size={36} className="text-[#9BC5E6] mb-3 md:mb-4 md:w-12 md:h-12" />
                <p className="text-slate-600 font-bold mb-3 md:mb-4 text-xs md:text-base">Sube el mapa de tu región</p>
                <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                  <input 
                    type="text" 
                    placeholder="Pega URL..." 
                    value={inputUrl} 
                    onChange={(e) => setInputUrl(e.target.value)} 
                    className="flex-1 bg-white border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#9BC5E6] shadow-sm text-xs md:text-sm" 
                  />
                  {inputUrl ? (
                    <button onClick={handleGuardarUrl} className="bg-[#9BC5E6] hover:bg-[#7eb0d6] text-slate-800 font-bold px-4 py-3 rounded-xl transition-colors flex items-center justify-center shadow-sm w-full sm:w-auto">
                      <Check size={16} />
                    </button>
                  ) : (
                    <label className="bg-[#9BC5E6] hover:bg-[#7eb0d6] text-slate-800 font-bold px-4 py-3 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto text-sm">
                      <ImageIcon size={16} /> Subir
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="relative flex-1 rounded-[20px] md:rounded-[24px] overflow-hidden group min-h-[200px] md:min-h-[250px] shadow-inner bg-slate-100">
            {subiendoMapa && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-[#9BC5E6]" size={30} />
              </div>
            )}
            
            <img src={mapaImg} alt="Mapa del Mundo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            
            <button 
              onClick={handleBorrarMapa} 
              className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 p-1.5 md:p-2 rounded-full text-slate-600 hover:text-red-500 hover:bg-white shadow-sm transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-20"
            >
              <X size={16} />
            </button>
            
            <button 
              onClick={() => setIsExpanded(true)} 
              className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-slate-800 text-white p-2 md:p-3 rounded-full shadow-lg hover:scale-105 transition-transform z-20"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && mapaImg && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setIsExpanded(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-[95%] max-w-5xl h-[70vh] md:h-[85vh] flex flex-col items-center justify-center"
            >
              <button onClick={() => setIsExpanded(false)} className="absolute -top-10 md:-top-12 right-0 bg-white/20 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-all">
                <X size={20} className="md:w-6 md:h-6" />
              </button>
              <img src={mapaImg} alt="Mapa Expandido" className="w-full h-full object-contain rounded-[20px] md:rounded-[24px] shadow-2xl" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}