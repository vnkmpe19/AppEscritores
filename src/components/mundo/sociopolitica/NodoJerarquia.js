"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Crown, Church, Users, Shield, User, Gem, Ship, Sparkles, Cog, TrendingUp } from 'lucide-react';

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

export default function NodoJerarquia({ nodo, alAgregar, alEditar, alEliminar, esRaiz = false }) {
  return (
    <div className="flex flex-col items-center relative">
      <motion.div className={`w-64 p-6 rounded-3xl border-2 flex flex-col items-center text-center relative z-10 transition-all group hover:scale-105 cursor-default ${esRaiz ? 'bg-[#D4C1EC] border-[#D4C1EC] text-slate-900 shadow-[0_10px_30px_rgba(212,193,236,0.6)]' : 'bg-white border-slate-100 text-slate-800 shadow-sm hover:shadow-md'}`}>
        
        {/* Controles Editar/Borrar */}
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => alEditar(nodo)} className={`p-1.5 rounded-full shadow-sm hover:scale-110 ${esRaiz ? 'bg-white/20 text-white' : 'bg-slate-50 text-blue-500'}`}><Edit size={12}/></button>
          {!esRaiz && <button onClick={() => alEliminar(nodo.id)} className="p-1.5 bg-slate-50 text-red-500 rounded-full shadow-sm hover:scale-110"><Trash2 size={12}/></button>}
        </div>

        <div className={`mb-3 ${esRaiz ? 'text-[#7C3AED]' : 'text-[#7C3AED]'}`}>{obtenerIcono(nodo.icono, 24)}</div>
        <h5 className="font-black text-sm uppercase tracking-tight">{nodo.rol}</h5>
        <p className={`text-[10px] mt-1 px-2 leading-relaxed ${esRaiz ? 'text-slate-800/80' : 'text-slate-500'}`}>{nodo.descripcion}</p>
        
        <button onClick={() => alAgregar(nodo.id)} className={`absolute -bottom-4 p-2 rounded-full shadow-lg border border-slate-100 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 z-20 ${esRaiz ? 'bg-white text-[#7C3AED]' : 'bg-[#D4C1EC] text-slate-900'}`}>
          <Plus size={16} />
        </button>
      </motion.div>
      
      {/* CORREGIDO: nodo en lugar de node */}
      {nodo.hijos.length > 0 && (
        <div className="relative pt-16 flex gap-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-slate-200" />
          {nodo.hijos.length > 1 && <div className="absolute top-16 left-[10%] right-[10%] h-0.5 bg-slate-200" />}
          {nodo.hijos.map((hijo) => (
            <NodoJerarquia key={hijo.id} nodo={hijo} alAgregar={alAgregar} alEditar={alEditar} alEliminar={alEliminar} />
          ))}
        </div>
      )}
    </div>
  );
}