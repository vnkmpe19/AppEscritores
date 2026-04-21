import React from "react";
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { obtenerIcono } from './SociopoliticalModule'; 

export default function NodoJerarquia({ nodo, alAgregar, alEditar, alEliminar, esRaiz = false }) {
  return (
    <div className="flex flex-col items-center relative max-w-full">

      {/* NODO */}
      <motion.div 
        className={`w-[clamp(140px,22vw,240px)] max-w-full p-3 sm:p-4 md:p-6 
        rounded-[18px] sm:rounded-[24px] border-2 flex flex-col items-center text-center 
        relative z-10 transition-all group hover:scale-105 cursor-default
        ${esRaiz 
          ? 'bg-[#D4C1EC] border-[#D4C1EC] text-slate-900 shadow-md' 
          : 'bg-white border-slate-100 text-slate-800 shadow-sm'
        }`}
      >
        
        {/* BOTONES */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3 flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => alEditar(nodo)} 
            className={`p-1.5 sm:p-2 rounded-full shadow-sm hover:scale-110 transition-transform 
            ${esRaiz ? 'bg-white/30 text-white' : 'bg-slate-50 text-blue-500'}`}
          >
            <Edit size={12} className="w-3 h-3 sm:w-3.5 sm:h-3.5"/>
          </button>

          {!esRaiz && (
            <button 
              onClick={() => alEliminar(nodo.id)} 
              className="p-1.5 sm:p-2 bg-slate-50 text-red-500 rounded-full shadow-sm hover:scale-110 transition-transform"
            >
              <Trash2 size={12} className="w-3 h-3 sm:w-3.5 sm:h-3.5"/>
            </button>
          )}
        </div>

        {/* ICONO */}
        <div className="mb-1.5 sm:mb-2 md:mb-3 text-[#7C3AED] scale-90 sm:scale-100">
          {obtenerIcono(nodo.icono, 22)}
        </div>

        {/* TEXTO */}
        <h5 className="font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-tight line-clamp-2 px-1">
          {nodo.rol}
        </h5>

        <p className={`hidden sm:block text-[9px] md:text-[10px] mt-1 px-1 leading-relaxed line-clamp-2 
          ${esRaiz ? 'text-slate-800/80' : 'text-slate-500'}`}
        >
          {nodo.descripcion}
        </p>

        {/* BOTÓN HIJO */}
        <button 
          onClick={() => alAgregar(nodo.id)} 
          className={`absolute -bottom-3 sm:-bottom-4 p-1 sm:p-2 rounded-full shadow-lg border border-slate-100 
          transition-transform opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:scale-110 z-20
          ${esRaiz ? 'bg-white text-[#7C3AED]' : 'bg-[#D4C1EC] text-slate-900'}`}
        >
          <Plus size={12} className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </motion.div>
      
      {/* HIJOS */}
      {nodo.hijos && nodo.hijos.length > 0 && (
        <div className="relative pt-6 sm:pt-10 md:pt-16 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 max-w-full">
          
          {/* Línea vertical */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 sm:h-10 md:h-16 bg-slate-200" />
          
          {/* Línea horizontal SOLO en pantallas grandes */}
          {nodo.hijos.length > 1 && (
            <div className="hidden sm:block absolute top-6 sm:top-10 md:top-16 left-[10%] right-[10%] h-0.5 bg-slate-200" />
          )}

          {nodo.hijos.map((hijo) => (
            <NodoJerarquia 
              key={hijo.id} 
              nodo={hijo} 
              alAgregar={alAgregar} 
              alEditar={alEditar} 
              alEliminar={alEliminar} 
            />
          ))}
        </div>
      )}
    </div>
  );
}