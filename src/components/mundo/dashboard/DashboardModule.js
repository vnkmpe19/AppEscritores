"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; 
import { Image as ImageIcon, Plus } from 'lucide-react';

export default function DashboardModule() {
  const [mapImage, setMapImage] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]; 
    if (file) {
      setMapImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (mapImage) URL.revokeObjectURL(mapImage);
    };
  }, [mapImage]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-20">
      
      {/* MAPA DEL MUNDO */}
      <div className="xl:col-span-2 bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 flex flex-col h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-800">Mapa del Mundo</h2>
          <button className="text-[#FF5C5C] font-bold text-sm hover:underline transition-all">Ver Mapa Completo</button>
        </div>
        
        <div className="flex-1 w-full bg-slate-50 rounded-3xl relative overflow-hidden group border-2 border-dashed border-slate-200 flex items-center justify-center">
          {mapImage ? (
            <img src={mapImage} alt="Mapa del Mundo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-sm font-bold text-slate-700 z-10">
              Cargando Cartografía...
            </div>
          )}
          
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
            <label className="bg-white text-slate-800 font-black px-6 py-3 rounded-2xl cursor-pointer shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
              <ImageIcon size={20} className="text-[#FF5C5C]" /> 
              {mapImage ? 'Cambiar Mapa' : 'Subir Mapa'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>
      </div>

      {/* IDEAS & PROMPTS */}
      <div className="xl:col-span-1 bg-[#BFD7ED] rounded-[40px] p-8 shadow-xl flex flex-col gap-4 border border-[#BFD7ED]">
        <h3 className="text-xl font-black text-slate-800 mb-2">Ideas</h3>
        <div className="space-y-4 flex-1">
          <div className="bg-white/70 backdrop-blur-sm p-5 rounded-[24px] shadow-sm text-sm text-slate-700 font-medium leading-relaxed hover:bg-white transition-colors cursor-pointer">
            ¿Cómo afecta la magia a la economía local?
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-5 rounded-[24px] shadow-sm text-sm text-slate-700 font-medium leading-relaxed hover:bg-white transition-colors cursor-pointer">
            Define 3 festividades importantes en la capital.
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-5 rounded-[24px] shadow-sm text-sm text-slate-700 font-medium leading-relaxed hover:bg-white transition-colors cursor-pointer">
            ¿Qué pasa si el sol nunca se pone en el norte?
          </div>
        </div>
        <button className="w-full py-4 bg-white/60 hover:bg-white text-slate-800 font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm mt-2">
          <Plus size={18} /> Nueva Idea
        </button>
      </div>

      {/* FACCIONES & RELACIONES */}
      <div className="xl:col-span-1 bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 flex flex-col">
        <h3 className="text-xl font-black text-slate-800 mb-6">Facciones & Relaciones</h3>
        <div className="space-y-6 flex-1 flex flex-col justify-center">
          
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-[#FFB7C5]/20 border-2 border-[#FFB7C5] flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div className="flex-1">
              <p className="font-black text-slate-800 text-sm mb-2 group-hover:text-[#FF5C5C] transition-colors">Facción 1</p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ duration: 1 }} className="h-full bg-[#FF5C5C] rounded-full" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-[#BFD7ED]/20 border-2 border-[#BFD7ED] flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div className="flex-1">
              <p className="font-black text-slate-800 text-sm mb-2 group-hover:text-[#FF5C5C] transition-colors">Facción 2</p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '30%' }} transition={{ duration: 1 }} className="h-full bg-[#FF5C5C] rounded-full" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-[#E8F5A2]/40 border-2 border-[#E8F5A2] flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div className="flex-1">
              <p className="font-black text-slate-800 text-sm mb-2 group-hover:text-[#FF5C5C] transition-colors">Facción 3</p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1 }} className="h-full bg-[#FF5C5C] rounded-full" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* LÍNEA DE TIEMPO */}
      <div className="xl:col-span-2 bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 flex flex-col">
        <h3 className="text-xl font-black text-slate-800 mb-8">Línea de Tiempo</h3>
        <div className="relative flex-1 flex items-center px-4 md:px-12">
          
          <div className="absolute left-8 right-8 h-1 bg-slate-100 top-[20px]" />
          
          <div className="w-full flex justify-between relative z-10">
            <TimelineNode label="ERA DE ORO" active={true} />
            <TimelineNode label="LA GRAN GUERRA" active={false} />
            <TimelineNode label="ACTUALIDAD" active={false} />
          </div>
        </div>
      </div>

    </motion.div>
  );
}

function TimelineNode({ label, active }) {
  return (
    <div className="flex flex-col items-center gap-4 group cursor-pointer">
      <div className={`w-4 h-4 rounded-full border-4 transition-all duration-300 ${active ? 'bg-[#FF5C5C] border-white shadow-md scale-150' : 'bg-slate-200 border-white group-hover:bg-slate-300'}`} />
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${active ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {label}
      </span>
    </div>
  );
}