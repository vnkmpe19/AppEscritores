"use client";
import React, { useState } from 'react';
import { Map, Image as ImageIcon, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WidgetMapa() {
  const [mapaImg, setMapaImg] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setMapaImg(URL.createObjectURL(file));
  };

  return (
    <>
      <div className="bg-white rounded-[40px] p-6 shadow-sm border border-slate-100 flex flex-col h-full relative z-0">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2 mb-6">
          <Map className="text-[#9BC5E6]" /> Mapa de Relieve
        </h2>

        {!mapaImg ? (
          <div className="flex-1 bg-[#BFD7ED]/20 rounded-[24px] border-2 border-dashed border-[#BFD7ED] flex flex-col items-center justify-center p-8 text-center min-h-[250px]">
            <Map size={48} className="text-[#9BC5E6] mb-4" />
            <p className="text-slate-600 font-bold mb-4">Sube el mapa de tu región</p>
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
              <input 
                type="text" 
                placeholder="Pega la URL del mapa..." 
                value={mapaImg} 
                onChange={(e) => setMapaImg(e.target.value)} 
                className="flex-1 bg-white border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#9BC5E6] shadow-sm text-sm" 
              />
              <label className="bg-[#9BC5E6] hover:bg-[#7eb0d6] text-slate-800 font-bold px-4 py-3 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-sm">
                <ImageIcon size={18} /> Subir
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>
        ) : (
          <div className="relative flex-1 rounded-[24px] overflow-hidden group min-h-[250px] shadow-inner">
            <img src={mapaImg} alt="Mapa del Mundo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            
            <button onClick={() => setMapaImg('')} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-slate-600 hover:text-red-500 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100">
              <X size={18} />
            </button>
            
            <button 
              onClick={() => setIsExpanded(true)} 
              className="absolute bottom-4 right-4 bg-slate-800 text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && mapaImg && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsExpanded(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-5xl h-[85vh] flex flex-col items-center justify-center"
            >
              <button onClick={() => setIsExpanded(false)} className="absolute -top-12 right-0 bg-white/20 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-all">
                <X size={24} />
              </button>
              <img src={mapaImg} alt="Mapa Expandido" className="w-full h-full object-contain rounded-[24px] shadow-2xl" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}